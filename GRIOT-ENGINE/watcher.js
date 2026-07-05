'use strict';
const chokidar = require('chokidar');
const path     = require('path');
const fs       = require('fs-extra');
const config   = require('./config');

// Guardian registry — imported lazily to avoid circular deps at startup
function guardians() {
  return {
    VOICE:     require('./guardians/voice'),
    READINESS: require('./guardians/readiness'),
    KEEPER:    require('./guardians/keeper'),
  };
}

// ── Simple path-based router ─────────────────────────────────────────────────
// Returns the list of guardian names to run for a given file path.
// No GHN — routing is determined by which Systems/ sub-tree the file lives in.
function route(filePath) {
  const rel = filePath.replace(/\\/g, '/');
  if (/\/Systems\/CONTENT\/Articles\//.test(rel)) return ['VOICE', 'KEEPER'];
  if (/\/Systems\/WEBINARS\//.test(rel))           return ['READINESS', 'KEEPER'];
  if (/\/Systems\/STAKEHOLDERS\//.test(rel))        return ['KEEPER'];
  // STATE files are output — never route them back through guardians
  if (/\/Systems\/STATE\//.test(rel))               return [];
  // Anything else in Systems/ → KEEPER only
  if (/\/Systems\//.test(rel))                       return ['KEEPER'];
  return [];
}

// ── Batch accumulator — same pattern as Kujenga11 file-watcher.js ────────────
const batchAccum = new Map();
let batchTimer   = null;

async function flushBatch() {
  batchTimer = null;
  if (!batchAccum.size) return;
  const entries = [...batchAccum.entries()];
  batchAccum.clear();
  console.log(`[WATCHER] Batch flush — ${entries.length} file(s)`);
  for (const [fp, guardianNames] of entries) {
    try { await dispatch(fp, guardianNames); }
    catch (err) { console.error(`[WATCHER] ${fp}: ${err.message}`); }
  }
}

function scheduleFlush(fp, guardianNames) {
  batchAccum.set(fp, guardianNames);
  if (batchTimer) clearTimeout(batchTimer);
  batchTimer = setTimeout(flushBatch, config.watcher.batchQuietMs);
}

async function dispatch(filePath, guardianNames) {
  if (!guardianNames.length) return;
  let content = '';
  try { content = fs.readFileSync(filePath, 'utf8'); } catch { return; }
  if (!content.trim()) return;

  const rel = filePath.replace(/\\/g, '/').split('/Systems/').pop() || filePath;
  const g   = guardians();

  for (const name of guardianNames) {
    if (!g[name]) continue;
    console.log(`[WATCHER] → ${name}: ${rel}`);
    try { await g[name].run(filePath, content); }
    catch (err) { console.error(`[${name}] run error: ${err.message}`); }
  }
}

// ── File watcher ─────────────────────────────────────────────────────────────
function start() {
  const watchPath = path.join(config.systemsRoot);

  // Ignore paths that would create feedback loops or are never input
  const IGNORE = [
    /[/\\]STATE[/\\]sessions[/\\]guardian-logs[/\\]/, // guardian log output
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
    const guardianNames = route(filePath);
    if (!guardianNames.length) return;
    const rel = filePath.replace(/\\/g, '/').split('/Systems/').pop() || filePath;
    console.log(`\n[WATCHER] ${event.toUpperCase()}: ${rel}`);
    scheduleFlush(filePath, guardianNames);
  };

  watcher.on('add',    handle('add'));
  watcher.on('change', handle('change'));

  watcher.on('error', (err) => console.error('[WATCHER] Error:', err.message));
  watcher.on('ready', () => console.log(`[WATCHER] Watching ${watchPath}\n`));

  return watcher;
}

module.exports = { start };
