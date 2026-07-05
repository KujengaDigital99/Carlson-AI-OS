---
name: schedule-post
skill_id: SKILL-004
type: content
trigger: /schedule-post
description: Schedules a LinkedIn post via Buffer. Takes approved post copy from Systems/CONTENT/Articles/ or drafts directly, formats it for LinkedIn, and queues it via the Buffer API connector.
---

# Schedule Post — GRIOT

**Goal:** Get Carlson's content onto LinkedIn without manual copy-paste. Draft or approved post → Buffer queue → posted at the right time.

---

## Before starting

Confirm:
1. `GRIOT-ENGINE/.env` has `BUFFER_ACCESS_TOKEN` set
2. The post copy is either in a file under `Systems/CONTENT/` or being drafted now

---

## Step 1 — Get the post copy

**If scheduling an existing article or draft:**
- Read the file from `Systems/CONTENT/Articles/[filename].md`
- Extract the body text (below the frontmatter)
- Check `**Status:**` field — only proceed if `Approved` or `Ready`

**If drafting directly:**
- Ask Carlson for the core idea and key detail
- Draft a LinkedIn post using Carlson's voice rules (see `Systems/CONTENT/Data/References/carlson-voice.md`)
- Present the draft for approval before scheduling

---

## Step 2 — Format for LinkedIn

LinkedIn has different constraints to a long-form article:

| Rule | LinkedIn standard |
|---|---|
| Length | 150–300 words for a standalone post; 800–1200 for an article |
| Hook | First line must work without "See more" — make it standalone |
| No markdown | No `**bold**`, no `## headers` — plain text only |
| Line breaks | Single blank line between paragraphs — no bullet lists unless essential |
| Closing | One strong sentence or question. No "Like and share" — never. |

Adapt the copy to these constraints. Do not truncate the argument — compress it.

---

## Step 3 — Confirm profile and timing

Ask:
- **Which profile?** (run `node -e "require('./GRIOT-ENGINE/connectors/buffer').getProfiles().then(p => p.forEach(x => console.log(x.id, x.service, x.name)))"` to list connected accounts)
- **When to post?** (immediate queue / specific date and time in SAST)

Convert SAST to UTC for the Buffer API: SAST = UTC+2, so subtract 2 hours.

---

## Step 4 — Schedule via Buffer

Run this from the repo root (after `npm install` in GRIOT-ENGINE):

```bash
node -e "
const b = require('./GRIOT-ENGINE/connectors/buffer');
require('dotenv').config({ path: './GRIOT-ENGINE/.env' });
b.schedulePost(
  \`[POST COPY HERE]\`,
  ['[PROFILE_ID]'],
  '[YYYY-MM-DDTHH:MM:SSZ]'   // UTC — omit to add to queue
).then(r => console.log(JSON.stringify(r, null, 2)));
"
```

Confirm the Buffer response shows `success: true` before reporting done.

---

## Step 5 — Update the source file

If the post came from a file in `Systems/CONTENT/`, update the `**Status:**` field:

```
**Status:** Posted
**Posted:** YYYY-MM-DD HH:MM SAST
**Channel:** LinkedIn — [profile name]
```

---

## What GRIOT does NOT do

- Schedule posts without Carlson's approval on the copy
- Post to profiles not connected in Buffer
- Schedule posts with `**Status:** Draft` — must be Approved first
