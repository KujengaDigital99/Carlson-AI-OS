---
name: write-article
skill_id: SKILL-003
type: content
trigger: /write-article
description: Writes a DBIA Online Magazine article in Carlson's voice. Runs the three-step CONTENT process — voice extraction → article structure → publish checklist. Does not skip steps. Does not draft without a grounded angle.
---

# Write Article — GRIOT

**Goal:** Produce a published DBIA Online Magazine article that sounds like Carlson in a room with ambassadors — specific, Africa-confident, and grounded in lived experience. Not a think-piece. Not a development narrative. Evidence and specificity only.

Read `Systems/CONTENT/Data/References/carlson-voice.md` before drafting anything.

---

## Step 01 — Voice Extraction

*Before writing a single sentence, extract the four elements.*

Reference: `Systems/CONTENT/Instructions/01-voice-extraction.md`

Ask Carlson for a raw input — voice note transcript, rough paragraph, "I want to write about X", a webinar topic, a meeting that generated an insight.

Then extract and reflect back:

**1. Core idea:** "What is the one thing you want the reader to walk away knowing?"

**2. Angle:** "What specific thing happened — in a room, at an event, in a conversation — that made you want to write this?"

**3. Evidence:** "Who else was in that room? What was the outcome? What did someone say that you haven't stopped thinking about?"

**4. Audience:** "Who is reading this? A diaspora investor in Chicago who has never been to Rwanda? A South African entrepreneur who knows DBIA? A DFI policy maker?"

**Do NOT proceed to Step 02 if:**
- The idea is generic ("Africa has investment opportunities") — push for specificity
- There is no lived experience grounding it — push for a real story
- The audience is "everyone" — push for one reader
- Carlson is not sure what he wants to say — help him decide first

**Step 01 output:** A 3–5 bullet brief stating:
- Core argument in one sentence
- The specific angle (the lived thing that makes it real)
- The evidence (story, person, number, event)
- The target reader and what they must think/do after reading

Present to Carlson. Confirm before proceeding.

---

## Step 02 — Article Structure

*Reference: `Systems/CONTENT/Instructions/02-article-structure.md`*

Write the full draft in Carlson's voice. Structure every article with:

**1. Opening** — one or two sentences. The specific thing that happened. Not a scene-setter — the thing itself.

**2. The argument** — what this event or experience reveals about how doing business in Africa actually works. Name the mechanism. Do not generalise.

**3. The evidence** — the specific data, person, outcome, or exchange that proves the argument. Name names. Cite numbers. Reference places.

**4. The implication** — what a diaspora investor, SME, or policy maker should do with this information. Carlson's close is always a call to action or a call to inquiry — never a vague aspiration.

**Voice rules (non-negotiable):**

| Rule | Correct | Wrong |
|---|---|---|
| Specific over general | "127 executives in the JSE boardroom on 27 May" | "a significant gathering of leaders" |
| Active voice | "DBIA matched the investor with the opportunity" | "an opportunity was identified" |
| Africa-confident | Write as insider, not explainer | "Africa is emerging as..." |
| Short paragraphs | Max 3 sentences | Long academic blocks |
| No filler openers | Never | "In today's rapidly changing..." |

**The test before presenting:** Read the draft out loud in Carlson's voice. Ask: "Would Carlson say this at the AALS conference in Kigali?" If no — rewrite until yes.

Present the draft to Carlson. Do not save until approved.

---

## Step 03 — Publish Checklist

*Reference: `Systems/CONTENT/Instructions/03-publish-checklist.md`*

Before the article is filed as ready to publish:

| Check | Pass criteria |
|---|---|
| Voice | Passes the Kigali test — Carlson would say this in a room |
| Specificity | At least one named person, one specific number or date, one named place |
| Active voice | No passive constructions in body text |
| No filler openers | First sentence is the event or argument, not scene-setting |
| Audience clarity | The reader knows exactly who this is for by the second paragraph |
| Call to action or inquiry | Article ends with something the reader can do or a question they must answer |
| Short paragraphs | Maximum 3 sentences per paragraph throughout |

All 7 checks must pass before filing. Fix and re-check any failures.

---

## Step 04 — Save the article file

Save to: `Systems/CONTENT/Articles/[slug]-YYYY-MM-DD.md`

File structure:

```markdown
# [Article headline]

**Date:** YYYY-MM-DD
**Author:** Carlson Ifughe
**Publication:** DBIA Online Magazine
**Status:** Draft / Approved / Published
**Topic:** [brief topic tag]

---

[Full article body here]
```

After saving:
- Update `Systems/STATE/griot-state.md` — mark article project status
- Update `Systems/STATE/MEMORY.md` if this closes a major deliverable
- Create `Systems/CONTENT/Articles/` directory if it does not exist

---

## What GRIOT does NOT do

- Draft without completing Step 01 — no angle, no draft
- Write in development-speak ("Africa is emerging", "empowering communities")
- Write for a generic audience — one reader, always
- Skip the voice check — if it does not sound like Carlson in a room, it is not done
