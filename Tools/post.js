'use strict';
/**
 * Carlson AI OS — Buffer Post CLI
 *
 * Schedule LinkedIn posts via Buffer. Requires BUFFER_ACCESS_TOKEN in
 * GRIOT-ENGINE/.env
 *
 * Commands:
 *   node Tools/post.js profiles                         — list connected accounts
 *   node Tools/post.js queue                            — show scheduled queue
 *   node Tools/post.js send --text "..." --profile linkedin
 *   node Tools/post.js send --text "..." --image-url "https://..." --schedule "2026-07-17T16:00:00Z"
 *
 * --text         Post body (required for send)
 * --profile      Filter: linkedin | twitter | all  (default: linkedin)
 * --image-url    Public URL of an image to attach (optional)
 * --schedule     ISO 8601 UTC datetime to schedule (omit to add to queue)
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', 'GRIOT-ENGINE', '.env') });

const buffer = require('../GRIOT-ENGINE/connectors/buffer');

// ── Arg parser ────────────────────────────────────────────────────────────────
function parseArgs() {
  const args   = process.argv.slice(2);
  const cmd    = args[0];
  const opts   = {};
  for (let i = 1; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      opts[args[i].slice(2)] = args[i + 1] || '';
      i++;
    }
  }
  return { cmd, opts };
}

// ── Commands ──────────────────────────────────────────────────────────────────
async function listProfiles() {
  const profiles = await buffer.getProfiles();
  if (!profiles.length) { console.log('No profiles connected to Buffer.'); return; }
  console.log('\nConnected Buffer profiles:\n');
  profiles.forEach(p => {
    console.log(`  [${p.service.padEnd(10)}]  ${p.name.padEnd(30)}  id: ${p.id}`);
  });
  console.log('');
}

async function showQueue(opts) {
  const profiles = await buffer.getProfiles();
  const filter   = (opts.profile || 'linkedin').toLowerCase();
  const targets  = filter === 'all' ? profiles : profiles.filter(p => p.service === filter);

  for (const p of targets) {
    const q = await buffer.getQueue(p.id);
    const updates = q.updates || [];
    console.log(`\n${p.service} — ${p.name} (${updates.length} queued):`);
    updates.slice(0, 5).forEach(u => {
      const time = u.scheduled_at ? new Date(u.scheduled_at * 1000).toISOString() : 'queued';
      console.log(`  [${time}] ${(u.text || '').slice(0, 80)}...`);
    });
  }
  console.log('');
}

async function sendPost(opts) {
  if (!opts.text) { console.error('--text is required'); process.exit(1); }

  const profiles = await buffer.getProfiles();
  const filter   = (opts.profile || 'linkedin').toLowerCase();
  const targets  = filter === 'all' ? profiles : profiles.filter(p => p.service === filter);

  if (!targets.length) {
    console.error(`No ${filter} profile found in Buffer. Run: node Tools/post.js profiles`);
    process.exit(1);
  }

  const profileIds = targets.map(p => p.id);

  // Build post body — Buffer v1 supports media[photo] as a URL
  const postBody = { text: opts.text };
  if (opts['image-url']) {
    postBody['media[photo]'] = opts['image-url'];
    postBody['media[thumbnail]'] = opts['image-url'];
  }

  // Override schedulePost to pass extra body fields
  const scheduledAt = opts.schedule || null;
  const result = await buffer.schedulePost(opts.text, profileIds, scheduledAt, opts['image-url']);

  if (result.success || result.updates) {
    console.log(`\n✓ Post scheduled to ${targets.map(p => `${p.service}/${p.name}`).join(', ')}`);
    if (scheduledAt) console.log(`  Scheduled for: ${scheduledAt} UTC`);
    else console.log('  Added to queue.');
  } else {
    console.error('\n✗ Buffer error:', JSON.stringify(result, null, 2));
  }
  console.log('');
}

// ── Entry ─────────────────────────────────────────────────────────────────────
(async () => {
  const { cmd, opts } = parseArgs();

  if (!process.env.BUFFER_ACCESS_TOKEN) {
    console.error('[POST] BUFFER_ACCESS_TOKEN not set. Add it to GRIOT-ENGINE/.env');
    process.exit(1);
  }

  switch (cmd) {
    case 'profiles': await listProfiles(); break;
    case 'queue':    await showQueue(opts); break;
    case 'send':     await sendPost(opts);  break;
    default:
      console.log(`
Carlson AI OS — Buffer Post Tool

  node Tools/post.js profiles
      List all connected social accounts

  node Tools/post.js queue [--profile linkedin]
      Show scheduled post queue

  node Tools/post.js send --text "Your post copy here"
      Add to LinkedIn queue (default)

  node Tools/post.js send --text "..." --profile all
      Queue to all connected profiles

  node Tools/post.js send --text "..." --image-url "https://cdn.example.com/post.jpg"
      Attach an image (must be a public URL)

  node Tools/post.js send --text "..." --schedule "2026-07-17T16:00:00Z"
      Schedule for a specific UTC time

Note: BUFFER_ACCESS_TOKEN must be set in GRIOT-ENGINE/.env
      `);
  }
})().catch(err => { console.error('[POST] Error:', err.message); process.exit(1); });
