'use strict';
const GuardianBase = require('../base');

/**
 * IFA — Research and constraint mapping guardian.
 * Named for the Yoruba oracle system — the most comprehensive body of
 * organised knowledge in West African tradition.
 *
 * Modes:
 *   RESEARCH — Country briefs, regulatory analysis, investment pathway research.
 *              Upgrades to Sonnet for depth of reasoning required.
 *   MAP      — Constraint scan on proposals and webinar content.
 *              Flags unverified claims before they reach diaspora investors.
 *
 * Carlson's primary use cases:
 *   - Monthly webinar country briefs (Rwanda, Ghana, Malawi, Botswana, Ethiopia, SA)
 *   - DBIA Investment Platform FAIS / POPIA legal analysis
 *   - Ambassador and country partner due diligence
 *   - Investment opportunity verification
 */
class Ifa extends GuardianBase {
  constructor() { super('IFA'); }

  detectMode(routingDecision) {
    const s = routingDecision?.signals || [];
    if (s.includes('research_request') || s.includes('knowledge_file')) return 'RESEARCH';
    if (s.includes('proposal_file') || s.includes('webinar_file'))      return 'MAP';
    return 'MAP';
  }

  resolveModel(mode) {
    if (mode === 'RESEARCH') return process.env.IFA_RESEARCH_MODEL || 'claude-sonnet-4-6';
    return require('../../config').guardians.IFA?.model || 'claude-haiku-4-5-20251001';
  }
}

module.exports = new Ifa();
