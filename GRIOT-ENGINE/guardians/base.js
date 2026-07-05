'use strict';
const fs     = require('fs-extra');
const path   = require('path');
const config = require('../config');
const { invoke }       = require('./invoke');
const { writeLog }     = require('../outputs/write-log');
const { extract }      = require('../learning/extractor');
const { proposeIfDue } = require('../learning/proposer');

class GuardianBase {
  constructor(name) {
    this.name = name.toUpperCase();
  }

  get cfg() {
    return config.guardians[this.name] || { model: config.anthropic.model, maxTokens: 512 };
  }

  // Subclasses override to select an engine mode from routing signals.
  detectMode(routingDecision) { return 'default'; }

  // Subclasses override to swap in a higher-capability model for complex modes.
  resolveModel(mode) {
    return this.cfg.model || config.anthropic.model;
  }

  // Build system prompt: prepend base.md (principles) + mode-specific file.
  // Falls back to default.md, then an inline fallback.
  loadPrompt(mode = 'default') {
    const dir  = path.join(__dirname, this.name.toLowerCase(), 'prompts');
    const base = path.join(dir, 'base.md');
    const modeFile = path.join(dir, `${mode}.md`);
    const defFile  = path.join(dir, 'default.md');

    const baseText = fs.existsSync(base) ? fs.readFileSync(base, 'utf8') : '';
    let   modeText = '';
    if (fs.existsSync(modeFile)) {
      modeText = fs.readFileSync(modeFile, 'utf8');
    } else if (fs.existsSync(defFile)) {
      modeText = fs.readFileSync(defFile, 'utf8');
    } else {
      modeText = `You are ${this.name}, a guardian of Carlson Ifughe's AI OS. Respond concisely.`;
    }

    // Strip {{instructions}} placeholder (not used in this simplified engine)
    const combined = (baseText + '\n\n' + modeText)
      .replace(/\{\{instructions\}\}/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    return combined;
  }

  // Subclasses override to add post-run logic.
  async onComplete(filePath, content, result, mode) {}

  async run(filePath, content, routingDecision = {}) {
    const rel  = filePath.replace(/\\/g, '/').split('/Systems/').pop() || filePath;
    const mode = this.detectMode(routingDecision);
    const model = this.resolveModel(mode);

    const systemPrompt = this.loadPrompt(mode);
    const userMessage  =
      `File: ${rel}\nTimestamp: ${new Date().toISOString()}\nMode: ${mode}\n\n` +
      content.slice(0, 20000);

    let result = '';
    try {
      result = await invoke(systemPrompt, userMessage, model, this.cfg.maxTokens);
    } catch (err) {
      console.error(`[${this.name}] API error: ${err.message}`);
      result = `ERROR: ${err.message}`;
    }

    const logContent =
      `# ${this.name} Log\n` +
      `**File:** ${rel}\n` +
      `**Mode:** ${mode}\n` +
      `**Time:** ${new Date().toISOString()}\n\n` +
      result;

    const logPath = writeLog(this.name, logContent);
    const logRel  = path.relative(config.root, logPath).replace(/\\/g, '/');
    console.log(`[${this.name}:${mode}] → ${logRel}`);

    await this.onComplete(filePath, content, result, mode);

    setImmediate(async () => {
      try {
        await extract(this.name, result);
        await proposeIfDue();
      } catch (err) {
        console.error(`[LEARN] Pipeline error: ${err.message}`);
      }
    });

    return { guardian: this.name, mode, logPath, result };
  }
}

module.exports = GuardianBase;
