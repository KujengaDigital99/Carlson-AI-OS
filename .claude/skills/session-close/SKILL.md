---
name: session-close
skill_id: GRIOT-SKILL-002
type: system
trigger: /session-close
description: Run at the end of every working session. Updates the dashboard, extracts patterns, commits all changes, and pushes. The session is not closed until the push succeeds.
---

# Session Close

**Goal:** Leave no session unrecorded. Every article, every webinar prep, every stakeholder note — placed, committed, and pushed before closing.

Run this before ending any session, no matter how short.

---

## Step 1 — Artifact audit

Run `git status --short`.

For every new or modified file:
- Verify it is in the correct `Systems/` path per the file placement rules in `.claude/CLAUDE.md`
- Flag any file outside `Systems/`, `Knowledge/`, `memory/`, or `.claude/` — move it before continuing
- APOLLO rule: if a file is being removed, confirm it has been moved to `Archive/` first

---

## Step 2 — Update the dashboard

Update `Systems/TRACKING/griot-dashboard.md`:

- **Articles:** add any new draft or published article with date and status
- **Webinars:** update status of next session if prep work was done
- **Stakeholders:** record any outreach or touchpoint made this session with today's date
- **Platform gates:** update any MINERVA gate that changed status
- **Session log:** add a row to the Session Log table at the bottom

---

## Step 3 — Extract patterns

Ask: what did this session produce that is reusable?

| If this happened | Do this |
|---|---|
| New article structure worked well | Add to `memory/griot-patterns.md` — Writing patterns |
| Carlson responded well to a specific question type | Add to `memory/griot-patterns.md` — Voice extraction |
| A stakeholder outreach approach worked | Add to `memory/griot-patterns.md` — Stakeholder patterns |
| Webinar prep revealed a new country research method | Add to `memory/griot-patterns.md` — Webinar patterns |

If nothing reusable emerged: confirm and skip.

---

## Step 4 — MINERVA check

If any investment platform discussion happened this session:
- Update `Systems/MINERVA/Data/References/investment-platform-fais-popia.md` with the latest gate status
- Note date and what changed

---

## Step 5 — Commit and push

Stage all changed files. Write the commit message:

```
Session YYYY-MM-DD: [one-line summary of what was built]
```

Examples:
- `Session 2026-07-01: Rwanda webinar runsheet, Carlson voice extraction for article 1`
- `Session 2026-07-15: Article 1 draft complete — Kigali investment case`

After the commit: push immediately.
```bash
git push
```

If push fails (no remote tracking): `git push -u origin main`

**The session is not closed until the push succeeds.** A committed-but-unpushed session is still at risk.

---

## Non-negotiables

- Do not commit before completing Steps 1–4
- APOLLO protection: never delete — archive first
- Never use `--no-verify` on a git hook
- If multiple sessions happen the same day, they get separate dashboard rows with times noted
