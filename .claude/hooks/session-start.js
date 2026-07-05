#!/usr/bin/env node
/**
 * SessionStart hook — GRIOT context initialiser.
 * Builds Carlson's working brief so every session opens with full awareness:
 *   1. MEMORY.md — narrative from last session
 *   2. griot-state.md — active projects, tasks, blockers
 *   3. Git status — uncommitted files signal an interrupted session
 *
 * Cooldown: 1 hour — does not re-run on every message in a long session.
 */
'use strict';

const fs   = require('fs');
const os   = require('os');
const path = require('path');
const { execSync } = require('child_process');

const ROOT         = path.resolve(__dirname, '..', '..');
const MEMORY_FILE  = path.join(ROOT, 'Systems', 'STATE', 'MEMORY.md');
const STATE_FILE   = path.join(ROOT, 'Systems', 'STATE', 'griot-state.md');

// ── Cooldown guard (1 hour) ───────────────────────────────────────────────────
const hour  = new Date().toISOString().slice(0, 13); // YYYY-MM-DDTHH
const GUARD = path.join(os.tmpdir(), `griot-session-brief-${hour}`);
if (fs.existsSync(GUARD)) process.exit(0);
try { fs.writeFileSync(GUARD, '1', 'utf8'); } catch {}

// ── Git status ────────────────────────────────────────────────────────────────
let gitStatus = '';
try {
  gitStatus = execSync('git status --short', { cwd: ROOT, encoding: 'utf8' }).trim();
} catch {}

// ── MEMORY.md ─────────────────────────────────────────────────────────────────
let memory = '';
try {
  if (fs.existsSync(MEMORY_FILE)) memory = fs.readFileSync(MEMORY_FILE, 'utf8').trim();
} catch {}

// ── griot-state.md — extract active/overdue tasks block only ─────────────────
let stateBlock = '';
try {
  if (fs.existsSync(STATE_FILE)) {
    const full = fs.readFileSync(STATE_FILE, 'utf8');
    const match = full.match(/## Active Projects[\s\S]*?(?=\n## |\n---|\s*$)/);
    if (match) stateBlock = match[0].trim();
  }
} catch {}

// ── Assemble brief ────────────────────────────────────────────────────────────
const sections = [];

if (memory) sections.push('## Session Memory (MEMORY.md)\n' + memory);
if (stateBlock) sections.push('## Active Projects (griot-state.md)\n' + stateBlock);

if (gitStatus) {
  sections.push(
    '## Uncommitted Changes\n```\n' + gitStatus + '\n```\n' +
    'Uncommitted files detected — this may be an interrupted session. Review before starting.'
  );
}

if (sections.length === 0) {
  sections.push('## GRIOT Ready\nNo prior session memory. This is a fresh start.');
}

process.stdout.write(JSON.stringify({
  hookSpecificOutput: {
    hookEventName: 'SessionStart',
    additionalContext: '## GRIOT — Session Brief\n\n' + sections.join('\n\n---\n\n'),
  },
}));
