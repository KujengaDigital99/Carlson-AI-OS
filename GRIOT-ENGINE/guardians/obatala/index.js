'use strict';
const fs          = require('fs-extra');
const path        = require('path');
const GuardianBase = require('../base');

/**
 * VOICE — Article voice alignment guardian.
 * Triggered when a file changes in Systems/CONTENT/Articles/.
 * Checks: Carlson's voice spec, specificity rules, structure, audience clarity.
 */
class Voice extends GuardianBase {
  constructor() { super('OBATALA'); }

  async onComplete(filePath, content, result) {
    // If VOICE flags a hard fail, append a warning banner to the article file
    if (/FAIL|BLOCK/i.test(result) && fs.existsSync(filePath)) {
      const existing = fs.readFileSync(filePath, 'utf8');
      if (!existing.includes('<!-- OBATALA WARNING -->')) {
        fs.writeFileSync(
          filePath,
          `<!-- OBATALA WARNING: Draft flagged by VOICE guardian — review before approving -->\n\n${existing}`,
          'utf8'
        );
        console.log(`[OBATALA] Warning banner added to ${path.basename(filePath)}`);
      }
    }
  }
}

module.exports = new Voice();
