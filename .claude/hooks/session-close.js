#!/usr/bin/env node
/**
 * SessionEnd hook — fires once when the session ends.
 * Instructs GRIOT to commit all work and update the dashboard before closing.
 */
process.stdout.write(JSON.stringify({
  systemMessage:
    'SESSION CLOSE — complete all of the following before this session ends:\n\n' +
    '1. UPDATE Systems/TRACKING/griot-dashboard.md:\n' +
    '   - Add any articles drafted or published this session\n' +
    '   - Add any webinar sessions completed\n' +
    '   - Update stakeholder touchpoints made\n' +
    '   - Update investment platform gate status if anything changed\n' +
    '   - Add a row to the Session Log at the bottom\n\n' +
    '2. UPDATE memory/griot-patterns.md:\n' +
    '   - If a new writing approach, voice note, or stakeholder method was discovered, append it\n' +
    '   - Add a dated entry to "Session notes"\n\n' +
    '3. COMMIT and PUSH all changes:\n' +
    '   git add -A\n' +
    '   git commit -m "Session YYYY-MM-DD: [one-line summary of what was built]"\n' +
    '   git push\n\n' +
    '4. MINERVA check: if investment platform status changed, update:\n' +
    '   Systems/MINERVA/Data/References/investment-platform-fais-popia.md\n\n' +
    '5. STALE CHECK: scan Systems/TRACKING/griot-dashboard.md Stakeholders section.\n' +
    '   Flag any contact with no touchpoint recorded in 30+ days.\n\n' +
    'The session is not closed until the git push succeeds.\n' +
    'A local commit without a push is not safe.',
}));
