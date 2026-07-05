'use strict';
const GuardianBase = require('../base');

/**
 * ELEGBA — Content and channel execution guardian.
 * Named for the Yoruba divine messenger who stands at every crossroads —
 * the one who decides what passes and what does not.
 *
 * Watches all content before it leaves the system: LinkedIn posts, articles,
 * webinar scripts, stakeholder emails. Checks voice, channel fit, and DBIA
 * positioning before anything reaches an ambassador, investor, or public feed.
 *
 * Modes:
 *   REVIEW — Post/article review: voice, structure, channel fit, CTA
 *   AUDIT  — Full content audit: cadence, LACFC coverage, channel strategy
 */
class Elegba extends GuardianBase {
  constructor() { super('ELEGBA'); }

  detectMode(routingDecision) {
    const s = routingDecision?.signals || [];
    if (s.includes('content_audit') || s.includes('overview_file')) return 'AUDIT';
    return 'REVIEW';
  }
}

module.exports = new Elegba();
