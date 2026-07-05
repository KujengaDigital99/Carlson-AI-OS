'use strict';
const fs   = require('fs-extra');
const path = require('path');

const PATTERNS_FILE = path.join(__dirname, '..', 'patterns.json');

function load() {
  try {
    if (fs.existsSync(PATTERNS_FILE)) {
      return JSON.parse(fs.readFileSync(PATTERNS_FILE, 'utf8'));
    }
  } catch {}
  return { patterns: [], last_updated: null };
}

function save(store) {
  store.last_updated = new Date().toISOString();
  fs.writeFileSync(PATTERNS_FILE, JSON.stringify(store, null, 2), 'utf8');
}

/**
 * Record a new observation or increment an existing pattern's count.
 * Matches on guardian + trigger label (5-word slug from extractor).
 * Returns the updated pattern entry.
 */
function record(guardianName, trigger, description) {
  const store   = load();
  const existing = store.patterns.find(
    p => p.guardian === guardianName && p.trigger === trigger
  );

  if (existing) {
    existing.count++;
    existing.last_seen = new Date().toISOString();
    existing.description = description; // refresh with latest phrasing
  } else {
    store.patterns.push({
      id:                 `${guardianName.toLowerCase()}_${Date.now()}`,
      guardian:           guardianName,
      trigger,
      description,
      count:              1,
      first_seen:         new Date().toISOString(),
      last_seen:          new Date().toISOString(),
      proposed_amendment: null,
      status:             'observed',   // observed → proposed → approved → applied
    });
  }

  save(store);
  return existing || store.patterns[store.patterns.length - 1];
}

/**
 * Mark a pattern as having a pending amendment file.
 */
function markProposed(patternId, amendmentFile) {
  const store = load();
  const p = store.patterns.find(x => x.id === patternId);
  if (p) { p.proposed_amendment = amendmentFile; p.status = 'proposed'; }
  save(store);
}

/**
 * Mark a pattern as applied (prompt has been patched).
 */
function markApplied(patternId) {
  const store = load();
  const p = store.patterns.find(x => x.id === patternId);
  if (p) { p.status = 'applied'; }
  save(store);
}

/**
 * Return all patterns that have hit the threshold and have no amendment yet.
 */
function pendingProposals(threshold = 3) {
  return load().patterns.filter(
    p => p.count >= threshold && p.status === 'observed'
  );
}

/**
 * Return all patterns whose amendment file is now marked approved.
 */
function approvedAmendments() {
  const store = load();
  return store.patterns.filter(p => p.status === 'proposed' && p.proposed_amendment);
}

module.exports = { load, record, markProposed, markApplied, pendingProposals, approvedAmendments };
