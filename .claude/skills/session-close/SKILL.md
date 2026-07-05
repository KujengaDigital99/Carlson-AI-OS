---
name: session-close
skill_id: SKILL-002
type: system
trigger: /session-close
description: Run at the end of every working session. Updates griot-state.md, writes MEMORY.md, logs the session, and commits + pushes all changes.
---

# Session Close — GRIOT

**Goal:** Leave no session unrecorded. Every build, every decision, every next step — placed, committed, and logged before closing.

Run this before ending any session, no matter how short. If Carlson switches task domains mid-session, treat it as a boundary and run close before the pivot.

---

## Step 1 — Artifact audit

Run `git status --short` in the Carlson AI OS repo.

For every new or modified file:
- Confirm it is in the correct `Systems/` path (CONTENT, WEBINARS, STAKEHOLDERS, STATE)
- Flag any file in the repo root or outside `Systems/` — move it to the correct path before continuing

---

## Step 2 — Update griot-state.md

File: `Systems/STATE/griot-state.md`

For every project or task touched this session:
- Update status: `Active` / `Complete` / `Blocked` / `Not Started`
- Update "Next gate" and "Owner" columns
- Add a note with today's date recording what happened
- Update "Last updated" at the top of the file

If nothing changed: still update the timestamp and add one line: "No state changes this session."

---

## Step 3 — Update MEMORY.md

File: `Systems/STATE/MEMORY.md`

Write or update these sections:
- **What was built this session** — one paragraph, specific file paths and outcomes
- **Where we left off** — last concrete action and its result
- **Next step** — the specific first thing to do next session (file, person, action)
- **Decisions made** — append any new permanent decisions with date

This is the file the SessionStart hook reads. If it is not updated, the next session starts blind.

---

## Step 4 — Write the session log

File: `Systems/STATE/sessions/session-log-YYYY-MM-DD.md`

```markdown
# Session Log — YYYY-MM-DD

**SAST range:** [approximate start–end]

## What Was Built
[Bullet list — artifacts, decisions, actions with file paths]

## Key Decisions
[Numbered list — decisions not obvious from the files themselves]

## Next Session Starting Point
1. [specific first action — file path or person]
2. [specific second action]
3. [specific third action]
```

If multiple sessions happen the same day, append `-2`, `-3` to the filename.

---

## Step 5 — Commit and push

Stage all changed and new files. Commit message format:

```
close: YYYY-MM-DD — [one-line summary of what was built]
```

Examples:
- `close: 2026-07-05 — Rwanda webinar runsheet, griot-state initialised`
- `close: 2026-07-08 — First DBIA article draft, HE Rembendambya outreach email`

Push immediately after commit:
```bash
git push
```

If no remote tracking branch: `git push -u origin main`

**Why push matters:** a committed-but-unpushed session is still at risk. Off-machine is the only safe state.

---

## Non-negotiables

- Do not commit before Steps 1–4 are complete
- Never delete a file — archive before removing (APOLLO protection)
- If a git hook fails, fix the underlying issue — do not use `--no-verify`
- The session is not closed until the git push succeeds — commit without push is incomplete
