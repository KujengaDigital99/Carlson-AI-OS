'use strict';
const fs     = require('fs-extra');
const path   = require('path');
const config = require('../config');
const { invoke }    = require('./invoke');
const { writeLog }  = require('../outputs/write-log');
const { extract }   = require('../learning/extractor');
const { proposeIfDue } = require('../learning/proposer');

class GuardianBase {
  constructor(name) {
    this.name = name.toUpperCase();
  }

  get cfg() {
    return config.guardians[this.name] || { model: config.anthropic.model, maxTokens: 512 };
  }

  // Load all instruction .md files from this guardian's prompts/ directory.
  loadPrompt(mode = 'default') {
    const dir  = path.join(__dirname, this.name.toLowerCase(), 'prompts');
    const file = path.join(dir, `${mode}.md`);
    if (fs.existsSync(file)) return fs.readFileSync(file, 'utf8');
    const def  = path.join(dir, 'default.md');
    if (fs.existsSync(def)) return fs.readFileSync(def, 'utf8');
    return `You are ${this.name}, a guardian of Carlson Ifughe's AI OS. Respond concisely.`;
  }

  // Subclasses override to add post-run logic (e.g. updating griot-state.md).
  async onComplete(filePath, content, result) {}

  async run(filePath, content) {
    const rel = filePath.replace(/\\/g, '/').split('/Systems/').pop() || filePath;

    const systemPrompt = this.loadPrompt();
    const userMessage  =
      `File: ${rel}\nTimestamp: ${new Date().toISOString()}\n\n${content.slice(0, 20000)}`;

    let result = '';
    try {
      result = await invoke(systemPrompt, userMessage, this.cfg.model, this.cfg.maxTokens);
    } catch (err) {
      console.error(`[${this.name}] API error: ${err.message}`);
      result = `ERROR: ${err.message}`;
    }

    const logContent =
      `# ${this.name} Log\n` +
      `**File:** ${rel}\n` +
      `**Time:** ${new Date().toISOString()}\n\n` +
      result;

    const logPath = writeLog(this.name, logContent);
    const logRel  = path.relative(path.join(config.root), logPath).replace(/\\/g, '/');
    console.log(`[${this.name}] → ${logRel}`);

    await this.onComplete(filePath, content, result);

    // Fire learning pipeline asynchronously — does not block the guardian response
    setImmediate(async () => {
      try {
        await extract(this.name, result);
        await proposeIfDue();
      } catch (err) {
        console.error(`[LEARN] Pipeline error: ${err.message}`);
      }
    });

    return { guardian: this.name, logPath, result };
  }
}

module.exports = GuardianBase;
