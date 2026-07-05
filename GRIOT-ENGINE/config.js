require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const path = require('path');

const root = path.resolve(__dirname, '..');

module.exports = {
  root,
  systemsRoot: path.join(root, 'Systems'),

  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY,
  },

  // Per-guardian model and token config.
  // Haiku for all three — outputs are structured 10-20 line analyses.
  guardians: {
    VOICE: {
      model: process.env.VOICE_MODEL || 'claude-haiku-4-5-20251001',
      maxTokens: 512,
    },
    READINESS: {
      model: process.env.READINESS_MODEL || 'claude-haiku-4-5-20251001',
      maxTokens: 512,
    },
    KEEPER: {
      model: process.env.KEEPER_MODEL || 'claude-haiku-4-5-20251001',
      maxTokens: 384,
    },
  },

  watcher: {
    batchQuietMs: parseInt(process.env.WATCHER_BATCH_QUIET_MS, 10) || 30_000,
  },
};
