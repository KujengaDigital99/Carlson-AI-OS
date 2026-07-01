---
name: session-start
skill_id: GRIOT-SKILL-001
type: system
trigger: /session-start
description: Opens every session with a live brief — git state check, dashboard read, stale contact scan, next webinar status, articles in progress. Builds a prioritised action order. Stops after presenting the brief.
---

# Session Start

**Goal:** Walk into every session with full situational awareness. No hunting through files. No re-deriving what's next. Read the brief. Decide. Execute.

---

## Step 0 — Git gate check

Run:
```bash
git status --short
git log origin/main..HEAD --oneline
```

**Uncommitted changes:** If modified or untracked files exist in `Systems/` or `.claude/`, report at the top of the brief:
> "Open session detected — uncommitted changes exist. Consider running /session-close before starting."

**Unpushed commits:** If commits exist that haven't been pushed, report:
> "Unpushed commits from a previous session. Recommend: `git push` before starting."

Both are warnings, not blocks. The brief is always generated.

---

## Step 1 — Read the dashboard

Read `Systems/TRACKING/griot-dashboard.md`.

Extract:
- **Articles:** how many drafted, how many published, any in progress
- **Webinars:** next upcoming session (month + country), status
- **Stakeholders:** any contact with no touchpoint recorded in 30+ days → flag as stale
- **Platform gates:** current MINERVA/investment platform status — any gate due or overdue

---

## Step 2 — Read session memory

Read `memory/griot-patterns.md`.

Note the most recent session entry. This tells you what was left in progress and what GRIOT learned last time.

---

## Step 3 — Build the action order

Apply this priority logic:

| Priority | Condition | Why |
|---|---|---|
| **P0 — Do first** | Overdue platform gate with a named external deadline | External deadlines don't wait |
| **P1 — Ship today** | Article in progress + Carlson available to talk | Voice extraction requires Carlson — don't let momentum die |
| **P2 — Prepare** | Next webinar within 14 days + runsheet not yet written | Webinar prep has a hard lead time |
| **P3 — Reach out** | Stale contact (30+ days no touchpoint) | Relationship warmth decays — window closes |
| **P4 — Build** | Any sub-system file that is `Building` or `Not Started` | Infrastructure work |

---

## Step 4 — Present the brief

Output this structure:

```
## GRIOT Session Brief — [DATE] SAST

---

### Open Session Warning   ← only if Step 0 found issues
[list uncommitted files or unpushed commits]

---

### Situation
[3–5 one-line observations — what the data shows that matters right now]

---

### Action Order

| # | What | Why |
|---|---|---|
| 1 | [action] | [one-line reason] |
| 2 | [action] | [one-line reason] |
...

---

### Watching
[Anything blocked or waiting on external input — Carlson or third party]

---

### Stale Contacts
[Any stakeholder with 30+ days no touchpoint — name, last contact date, recommended next action]
```

After presenting the brief: **stop**. Do not begin any task. The brief is the output. Carlson decides what to do next.

---

## Non-negotiables

- Always re-derive from the dashboard directly — never rely on memory of a prior session alone
- The git gate check is always first
- The brief ends after the Watching section — nothing more
- If griot-dashboard.md cannot be read: stop and say so
