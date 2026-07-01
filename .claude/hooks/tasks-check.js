#!/usr/bin/env node
/**
 * PostToolUse(Write|Edit) hook.
 * If an article or webinar runsheet was just written, remind GRIOT
 * to update the dashboard before the session closes.
 */
const fs = require('fs');

let raw = '';
try { raw = fs.readFileSync(0, 'utf8'); } catch {}
let input = {};
try { input = JSON.parse(raw || '{}'); } catch {}

const f = (input.tool_input && input.tool_input.file_path) || '';
const isArticle = /Systems\/CONTENT\/Data\/Articles\//i.test(f);
const isRunsheet = /Systems\/WEBINARS\/Data\/Sessions\//i.test(f);
const isContact = /Systems\/STAKEHOLDERS\/Data\/Contacts\//i.test(f);

if (!isArticle && !isRunsheet && !isContact) process.exit(0);

const type = isArticle ? 'article' : isRunsheet ? 'webinar runsheet' : 'stakeholder contact file';

process.stdout.write(JSON.stringify({
  hookSpecificOutput: {
    hookEventName: 'PostToolUse',
    additionalContext:
      `GRIOT note: A ${type} was just written.\n` +
      'Before this session closes, update Systems/TRACKING/griot-dashboard.md to record this output.\n' +
      'Run /session-close when done.',
  },
}));
