---
name: send-email
skill_id: SKILL-006
type: comms
trigger: /send-email
description: Composes and sends an email from one of Carlson's three accounts (doing.biz, cornerstone, cornerstone-info) via the SMTP connector. Always presents the full email for approval before sending.
---

# Send Email — GRIOT

**Goal:** Compose a well-targeted email, confirm with Carlson, then send via the correct account. Never sends without explicit approval.

---

## Before starting

Confirm `GRIOT-ENGINE/.env` has the relevant SMTP credentials set. All three accounts are pre-configured:

| Account key | Address | Use for |
|---|---|---|
| `doing` | carlson@doingbiz.africa | DBIA investor comms, doing.biz brand |
| `csg` | carlson@cornerstoneglobal.africa | Cornerstone Global — formal/legal |
| `csg_info` | info@cornerstoneglobal.africa | Cornerstone general inquiries |

---

## Step 1 — Gather inputs

Ask Carlson for anything not already provided:

1. **From account** — `doing`, `csg`, or `csg_info`
2. **To** — recipient email address(es)
3. **Subject** — or ask for context to draft one
4. **Purpose** — what does this email need to accomplish?
5. **Key points** — what must the email say?
6. **Tone** — formal / warm-direct / follow-up / urgent
7. **CC / BCC** — if any
8. **Attachments** — file paths, if any

---

## Step 2 — Draft the email

Write the email body using Carlson's voice rules:

**Always:**
- Open with the recipient's name and one specific reference (their organisation, a recent interaction, why they're being contacted)
- One clear ask per email — never two
- Short paragraphs, 2–3 sentences max
- Active voice throughout
- Close with a specific next step and a deadline or proposed date

**Never:**
- "I hope this email finds you well"
- "Please do not hesitate to reach out"
- "Kindly"
- Development-speak ("empowering", "inclusive growth", "emerging markets")
- Passive voice for the ask ("it would be appreciated if...") — say what you want directly

**Email types and their structure:**

*Investor follow-up (doing account):*
- Para 1: Reference the specific webinar or conversation
- Para 2: The investment opportunity in one specific sentence
- Para 3: The ask — next call / application link / document attached
- Sign-off: Carlson Ifughe | DBIA

*Stakeholder outreach (csg account):*
- Para 1: Who Carlson is and why he is writing to this person specifically
- Para 2: The proposition — one clear sentence
- Para 3: The ask — meeting / call / intro
- Sign-off: Carlson Ifughe | Cornerstone Global Africa

*General inquiry response (csg_info account):*
- Para 1: Acknowledge the inquiry specifically
- Para 2: Answer or route
- Para 3: Next step
- Sign-off: Cornerstone Global Africa Team

---

## Step 3 — Present for approval

Show Carlson the complete email exactly as it will be sent:

```
FROM:    [address]
TO:      [address]
SUBJECT: [subject line]
CC:      [if any]

[Full email body]
```

Do not send until Carlson explicitly approves. If he edits the copy, incorporate changes and confirm before sending.

---

## Step 4 — Send

Run from the repo root:

```bash
node -e "
require('dotenv').config({ path: './GRIOT-ENGINE/.env' });
const { sendEmail } = require('./GRIOT-ENGINE/connectors/email');
sendEmail({
  from:    '[doing|csg|csg_info]',
  to:      '[recipient]',
  subject: '[subject]',
  text:    \`[plain text body]\`,
  html:    \`[html body — optional]\`,
  cc:      '[cc — optional]',
}).then(r => console.log('Sent:', r.messageId)).catch(e => console.error('FAIL:', e.message));
"
```

Confirm the response shows a `messageId` before reporting done.

---

## Step 5 — Log the send

If this email relates to a pipeline contact or webinar attendee, update the relevant file in `Systems/PIPELINE/` or `Systems/STAKEHOLDERS/`:

```
**Last contact:** YYYY-MM-DD
**Method:** Email — [account]
**Subject:** [subject]
**Next action:** [what Carlson is waiting for, and by when]
```

---

## What GRIOT does NOT do

- Send without Carlson's explicit approval on the final copy
- Send from an account that does not match the relationship context (e.g. never use `csg_info` for a personal investor follow-up)
- Send bulk or broadcast emails — use the SMTP connector only for individual or small-group sends
- Attach files without confirming the file path exists
