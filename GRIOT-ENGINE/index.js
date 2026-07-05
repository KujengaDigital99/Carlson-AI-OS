require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const path   = require('path');
const config = require('./config');

// ── PID lockfile — prevents two instances ────────────────────────────────────
const fs       = require('fs-extra');
const LOCK     = path.join(__dirname, '.griot.lock');

function acquireLock() {
  if (fs.existsSync(LOCK)) {
    const pid = parseInt(fs.readFileSync(LOCK, 'utf8').trim(), 10);
    let alive = false;
    try { process.kill(pid, 0); alive = true; } catch {}
    if (alive) {
      console.error(`[GRIOT] FATAL: Already running (PID ${pid}). Stop it first: pm2 stop griot`);
      process.exit(1);
    }
    console.warn(`[GRIOT] Stale lock (PID ${pid} gone). Claiming.`);
  }
  fs.writeFileSync(LOCK, String(process.pid), 'utf8');
}

function releaseLock() {
  try { fs.unlinkSync(LOCK); } catch {}
}

acquireLock();

if (!config.anthropic.apiKey) {
  releaseLock();
  console.error('[GRIOT] FATAL: ANTHROPIC_API_KEY not set. Copy .env.example to .env and add your key.');
  process.exit(1);
}

// ── Startup banner ────────────────────────────────────────────────────────────
const LINE = '='.repeat(52);
console.log(LINE);
console.log('  Carlson AI OS  —  GRIOT Engine v1.0.0');
console.log('  Guardians: VOICE · READINESS · KEEPER');
console.log(LINE);
console.log(`  Systems root : ${config.systemsRoot}`);
console.log(`  PID          : ${process.pid}`);
console.log('');

// ── Start file watcher ────────────────────────────────────────────────────────
const watcher = require('./watcher');
watcher.start();

console.log('[GRIOT] All systems active. Press Ctrl+C to stop.\n');

// ── Graceful shutdown ──────────────────────────────────────────────────────────
function shutdown(signal) {
  console.log(`\n[GRIOT] ${signal} — shutting down.`);
  releaseLock();
  process.exit(0);
}

process.on('SIGINT',  () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('exit',    releaseLock);
process.on('uncaughtException',  err => { console.error('[GRIOT] Uncaught:', err.message); releaseLock(); process.exit(1); });
process.on('unhandledRejection', err => console.error('[GRIOT] Unhandled:', err));
