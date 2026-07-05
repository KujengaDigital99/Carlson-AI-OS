require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const path = require('path');

const root = path.resolve(__dirname, '..');

module.exports = {
  root,
  systemsRoot: path.join(root, 'Systems'),

  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY,
    model:  process.env.DEFAULT_MODEL || 'claude-haiku-4-5-20251001',
  },

  // Per-guardian model and token config.
  // Haiku for structured analysis; Sonnet for judgment and research.
  guardians: {
    OBATALA: {
      model:     process.env.OBATALA_MODEL || 'claude-haiku-4-5-20251001',
      maxTokens: 512,
    },
    SANGO: {
      model:     process.env.SANGO_MODEL || 'claude-haiku-4-5-20251001',
      maxTokens: 512,
    },
    ORUNMILA: {
      model:     process.env.ORUNMILA_MODEL || 'claude-haiku-4-5-20251001',
      maxTokens: 384,
    },
    IFA: {
      // MAP mode uses this model; RESEARCH mode upgrades to IFA_RESEARCH_MODEL
      model:     process.env.IFA_MODEL || 'claude-haiku-4-5-20251001',
      maxTokens: 1024,
    },
    ELEGBA: {
      model:     process.env.ELEGBA_MODEL || 'claude-haiku-4-5-20251001',
      maxTokens: 768,
    },
    OSHOSI: {
      model:     process.env.OSHOSI_MODEL || 'claude-haiku-4-5-20251001',
      maxTokens: 768,
    },
  },

  watcher: {
    batchQuietMs: parseInt(process.env.WATCHER_BATCH_QUIET_MS, 10) || 30_000,
  },
};
