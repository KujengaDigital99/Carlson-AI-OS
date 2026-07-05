---
name: session-start
skill_id: SKILL-001
type: system
trigger: /session-start
description: Opens a session with a live brief — reads MEMORY.md and griot-state.md, surfaces overdue and active projects, checks for an interrupted session, and presents a prioritised critical path. Stops after the brief — execution is Carlson's call.
---

# Session Start — GRIOT

**Goal:** Walk into every session with full situational awareness. No hunting through files. No re-deriving priorities. Read the brief. Decide. Execute.

---

## Step 0 — Gate check

Run both before reading anything:

```bash
git status --short
git log origin/main..HEAD --oneline
```

**Uncommitted changes found:** Report at the top of the brief — "Open session detected — uncommitted changes exist. Consider running /session-close to close the previous session first."

**Unpushed commits found:** Report — "Unpushed commits from a prior session. Recommend pushing before starting: `git push`."

Both are warnings, not blocks. Brief is always generated.

---

## Step 1 — Read the state

Read simultaneously:

**1a. `Systems/STATE/MEMORY.md`**
Pull: last session narrative, where we left off, next step flagged.

**1b. `Systems/STATE/griot-state.md`**
Pull: all active projects with status, owner, next gate. Flag anything overdue.

**1c. Most recent `Systems/STATE/sessions/session-log-*.md`**
Read the "Next Session Starting Point" section from the last log.

---

## Step 2 — Build the critical path

Apply this priority logic:

| Priority | Condition | Why |
|---|---|---|
| **P0** | Overdue task involving a named person (ambassador, investor, partner) | Relationship warmth decays — window closes |
| **P1** | Due today, Carlson-owned, no blocker | Committed deadline |
| **P2** | GRIOT build that unblocks a P0 or P1 task | One build clears the path |
| **P3** | Article, runsheet, or communication with an external deadline | Content and credibility |
| **P4** | Active task, no deadline pressure | Keep moving |
| **P5** | Blocked — waiting on external input | Nothing to do — note unblock condition |

Number 1–N. One-line rationale per item. Parallel items = "3a / 3b".

---

## Step 3 — Guardian read

4–6 intelligence points on the situation. Each must be actionable, not observational.

Look for:
- **Relationship warmth decay** — Any task involving an ambassador, investor, or partner. Warm contacts cool within 5–7 days of last touch. Flag who is in the decay window.
- **H2 anchor pressure** — Which monthly anchor (webinar, event, launch) is approaching? What is not yet ready?
- **Dependency chains** — Which single task unblocks the most downstream work?
- **Webinar pipeline** — Country representative confirmed? Runsheet built? Registration open?
- **Article pipeline** — Any voice extractions started but not completed? Articles drafted but not published?
- **AEM deliverables** — Any founding actions (PVM, governance docs) past due?

Hard cap: 6 points.

---

## Step 4 — Present the brief

Output this structure exactly:

```
## Session Brief — [DATE] [TIME SAST]

---

### Open Session Warning  ← only if Step 0 found uncommitted files or unpushed commits
[files listed]

---

### Guardian Read
[4–6 numbered intelligence points, each ending with a specific recommended action]

---

### Critical Path

| # | Item | Owner | Priority | Why |
|---|---|---|---|---|
| 1 | [task or project] | Carlson / GRIOT | P0 | [one line] |
...

---

### Watching — blocked or waiting external

- [item] — waiting on: [specific person or event]

---

*Next session starting point (from last session log):*
1. [item 1]
2. [item 2]
3. [item 3]
```

After presenting the brief: **stop**. Do not begin any task. Carlson decides what to do next.

---

## Non-negotiables

- Always re-read griot-state.md directly — never rely on memory alone
- Gate check (Step 0) is always first
- The critical path is a recommendation — Carlson can override
- If griot-state.md cannot be read: stop and report. Do not guess from memory.
