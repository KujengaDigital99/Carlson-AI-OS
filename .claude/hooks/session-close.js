#!/usr/bin/env node
/**
 * SessionEnd hook — fires when the session ends.
 * Instructs GRIOT to complete all close steps before the window closes.
 */
process.stdout.write(JSON.stringify({
  systemMessage:
    'SESSION CLOSE — complete all of the following before this session ends:\n\n' +
    '1. UPDATE Systems/STATE/griot-state.md\n' +
    '   - Mark any completed tasks/projects done\n' +
    '   - Add any new tasks or blockers discovered this session\n' +
    '   - Update "Last updated" timestamp\n\n' +
    '2. UPDATE Systems/STATE/MEMORY.md\n' +
    '   - What was produced this session (one paragraph — specific, not vague)\n' +
    '   - Where we left off (last concrete action and its outcome)\n' +
    '   - The specific next step to pick up next session\n' +
    '   - Any blockers, risks, or decisions made (append to Decisions section with date)\n\n' +
    '3. WRITE session log to Systems/STATE/sessions/session-log-YYYY-MM-DD.md\n' +
    '   Use the template: What Was Built | Key Decisions | Next Session Starting Point\n\n' +
    '4. COMMIT and PUSH all changes\n' +
    '   Commit message: "close: YYYY-MM-DD — [one-line summary of what was built]"\n\n' +
    '5. CONFIRM all artifacts are under Systems/ — nothing in Downloads/ or repo root\n\n' +
    'MEMORY.md is read at every SessionStart. If it is not updated, the next session starts blind.',
}));
