'use strict';
const chokidar = require('chokidar');
const path     = require('path');
const fs       = require('fs-extra');
const config   = require('./config');

// Guardian registry — imported lazily to avoid circular deps at startup
function guardians() {
  return {
    OBATALA: require('./guardians/obatala'),
    SANGO:   require('./guardians/sango'),
    ORUNMILA:require('./guardians/orunmila'),
    IFA:     require('./guardians/ifa'),
    ELEGBA:  require('./guardians/elegba'),
    OSHOSI:  require('./guardians/oshosi'),
  };
}

// ── Path-based router ─────────────────────────────────────────────────────────
// Returns [guardianNames, signals] for a given file path.
// No GHN — routing is determined by Systems/ sub-tree.
function route(filePath) {
  const rel = filePath.replace(/\\/g, '/');

  // STATE files are output — never route back through guardians
  if (/\/Systems\/STATE\//.test(rel))                  return { names: [], signals: [] };

  // Articles — voice check + knowledge extraction
  if (/\/Systems\/CONTENT\/Articles\//.test(rel))
    return { names: ['OBATALA', 'ORUNMILA', 'ELEGBA'], signals: ['content_file'] };

  // Social posts and drafts — voice + channel review
  if (/\/Systems\/CONTENT\//.test(rel))
    return { names: ['OBATALA', 'ELEGBA'], signals: ['content_file'] };

  // Webinar scripts and plans — readiness + campaign check
  if (/\/Systems\/WEBINARS\//.test(rel)) {
    const signals = ['webinar_file'];
    if (/debrief|post-event|after/i.test(rel)) signals.push('post_event', 'debrief_file');
    return { names: ['SANGO', 'OSHOSI', 'IFA'], signals };
  }

  // Campaign plans and country files — campaign tracker
  if (/\/Systems\/CAMPAIGNS\//.test(rel))
    return { names: ['OSHOSI', 'ELEGBA'], signals: ['content_file'] };

  // Knowledge, research, briefs — IFA in research mode
  if (/\/Systems\/KNOWLEDGE\//.test(rel))
    return { names: ['IFA', 'ORUNMILA'], signals: ['knowledge_file'] };

  // Investor/ambassador pipeline — OSHOSI pipeline scan
  if (/\/Systems\/PIPELINE\//.test(rel))
    return { names: ['OSHOSI'], signals: ['pipeline_file', 'investor_file'] };

  // Stakeholders — knowledge extraction only
  if (/\/Systems\/STAKEHOLDERS\//.test(rel))
    return { names: ['ORUNMILA'], signals: [] };

  // Anything else in Systems/ — ORUNMILA captures action items
  if (/\/Systems\//.test(rel))
    return { names: ['ORUNMILA'], signals: [] };

  return { names: [], signals: [] };
}

// ── Batch accumulator — same pattern as Kujenga11 file-watcher.js ─────────────
const batchAccum = new Map();
let batchTimer   = null;

async function flushBatch() {
  batchTimer = null;
  if (!batchAccum.size) return;
  const entries = [...batchAccum.entries()];
  batchAccum.clear();
  console.log(`[WATCHER] Batch flush — ${entries.length} file(s)`);
  for (const [fp, routing] of entries) {
    try { await dispatch(fp, routing); }
    catch (err) { console.error(`[WATCHER] ${fp}: ${err.message}`); }
  }
}

function scheduleFlush(fp, routing) {
  batchAccum.set(fp, routing);
  if (batchTimer) clearTimeout(batchTimer);
  batchTimer = setTimeout(flushBatch, config.watcher.batchQuietMs);
}

async function dispatch(filePath, { names, signals }) {
  if (!names.length) return;
  let content = '';
  try { content = fs.readFileSync(filePath, 'utf8'); } catch { return; }
  if (!content.trim()) return;

  const rel = filePath.replace(/\\/g, '/').split('/Systems/').pop() || filePath;
  const g   = guardians();
  const routingDecision = { signals };

  for (const name of names) {
    if (!g[name]) continue;
    console.log(`[WATCHER] → ${name}: ${rel}`);
    try { await g[name].run(filePath, content, routingDecision); }
    catch (err) { console.error(`[${name}] run error: ${err.message}`); }
  }
}

// ── File watcher ─────────────────────────────────────────────────────────────
function start() {
  const watchPath = config.systemsRoot;

  const IGNORE = [
    /[/\\]STATE[/\\]sessions[/\\]guardian-logs[/\\]/,
    /[/\\]\.git[/\\]/,
    /[/\\]node_modules[/\\]/,
    /~$/,
    /\.tmp$/,
  ];

  const watcher = chokidar.watch(watchPath, {
    ignored:        (p) => IGNORE.some(r => r.test(p)),
    persistent:     true,
    ignoreInitial:  true,
    awaitWriteFinish: { stabilityThreshold: 500, pollInterval: 100 },
  });

  const handle = (event) => (filePath) => {
    if (!filePath.endsWith('.md') && !filePath.endsWith('.html')) return;
    const routing = route(filePath);
    if (!routing.names.length) return;
    const rel = filePath.replace(/\\/g, '/').split('/Systems/').pop() || filePath;
    console.log(`\n[WATCHER] ${event.toUpperCase()}: ${rel}`);
    scheduleFlush(filePath, routing);
  };

  watcher.on('add',    handle('add'));
  watcher.on('change', handle('change'));

  watcher.on('error', (err) => console.error('[WATCHER] Error:', err.message));
  watcher.on('ready', () => console.log(`[WATCHER] Watching ${watchPath}\n`));

  return watcher;
}

module.exports = { start };
