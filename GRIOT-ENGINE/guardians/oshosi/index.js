'use strict';
const GuardianBase = require('../base');

/**
 * OSHOSI — Campaign and event execution guardian.
 * Named for the Yoruba deity of the hunt — precise, strategic, never wastes
 * a shot. OSHOSI watches webinar campaigns, event execution, and pipeline
 * tracking to ensure every DBIA activation lands.
 *
 * Modes:
 *   CAMPAIGN — Pre-webinar campaign review: checklist, timeline, missing pieces
 *   DEBRIEF  — Post-event capture: what happened, who attended, what follows
 *   PIPELINE — Investor and ambassador pipeline scan: stalls, next actions
 */
class Oshosi extends GuardianBase {
  constructor() { super('OSHOSI'); }

  detectMode(routingDecision) {
    const s = routingDecision?.signals || [];
    if (s.includes('post_event') || s.includes('debrief_file')) return 'DEBRIEF';
    if (s.includes('pipeline_file') || s.includes('investor_file')) return 'PIPELINE';
    return 'CAMPAIGN';
  }
}

module.exports = new Oshosi();
