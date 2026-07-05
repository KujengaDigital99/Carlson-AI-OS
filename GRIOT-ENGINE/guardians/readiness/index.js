'use strict';
const GuardianBase = require('../base');

/**
 * READINESS — Webinar preparation guardian.
 * Triggered when a file changes in Systems/WEBINARS/.
 * Flags missing elements before the webinar date — no country rep, no runsheet, no Q&A.
 */
class Readiness extends GuardianBase {
  constructor() { super('READINESS'); }
}

module.exports = new Readiness();
