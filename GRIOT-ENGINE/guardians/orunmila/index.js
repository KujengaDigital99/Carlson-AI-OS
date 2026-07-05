'use strict';
const fs           = require('fs-extra');
const path         = require('path');
const GuardianBase = require('../base');

/**
 * KEEPER — Knowledge preservation guardian.
 * Triggered on any Systems/ file change (except CONTENT/Articles and WEBINARS,
 * which have dedicated guardians).
 * Checks: does this file contain new stakeholder intelligence, new decisions,
 * or new action items that should be reflected in griot-state.md?
 */
class Keeper extends GuardianBase {
  constructor() { super('ORUNMILA'); }

  async onComplete(filePath, content, result) {
    // If KEEPER flags action items, append a note to griot-state.md
    if (!/ACTION ITEMS DETECTED/i.test(result)) return;

    const stateFile = path.join(__dirname, '..', '..', '..', 'Systems', 'STATE', 'griot-state.md');
    if (!fs.existsSync(stateFile)) return;

    try {
      const note =
        `\n\n---\n<!-- KEEPER flag ${new Date().toISOString().slice(0, 10)} -->\n` +
        `KEEPER detected action items in ${path.basename(filePath)} — review griot-state.md and update manually.\n`;
      fs.appendFileSync(stateFile, note, 'utf8');
      console.log('[ORUNMILA] Action item flag appended to griot-state.md');
    } catch (err) {
      console.error(`[ORUNMILA] onComplete error: ${err.message}`);
    }
  }
}

module.exports = new Keeper();
