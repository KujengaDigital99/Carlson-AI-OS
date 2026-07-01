# DBIA Investment Platform — FAIS/POPIA Legal Status

**Last updated:** 2026-07-01
**Status:** BLOCKED — awaiting qualified legal counsel instruction
**Critical gate:** Carlson to engage legal counsel by 5 July 2026

---

## What the Platform Does

The DBIA Investment Platform is a digital infrastructure designed to:
- Connect diaspora investors with vetted African investment opportunities
- Provide deal flow information and country investment briefs
- Facilitate introductions between investors and local partners
- Track investor interest and engagement across DBIA's country programme

---

## Why It Is Blocked

Two South African legal frameworks create risk for the platform as currently scoped:

### FAIS — Financial Advisory and Intermediary Services Act

FAIS governs anyone who provides financial advice or intermediary services relating to financial products.

**Two risk features of the platform:**

1. **Recommending specific investment products to investors** — if the platform shows a diaspora investor a specific opportunity and that investor acts on it, DBIA could be deemed to have provided financial advice
2. **Facilitating or executing transactions on an investor's behalf** — any platform functionality that moves money or formally matches an investor to an opportunity may constitute intermediary services

Both trigger FAIS licensing requirements.

**Position A — Become a licensed FSP:**
- Apply for Financial Services Provider licence under FAIS
- Expensive (legal costs, compliance infrastructure, ongoing regulatory fees)
- Slow (12–18 months to full licence in practice)
- Gives full legal protection and broadest operating scope
- Recommended if the platform will handle actual transactions

**Position B — Structure as information and deal-flow only:**
- Platform provides information, country briefs, and introductions only — not advice, not execution
- No formal matching, no transaction facilitation
- Legal exposure substantially reduced
- Faster and cheaper to launch
- Recommended for the v1 sprint
- Risk: if the platform's actual behaviour (not just its stated purpose) crosses into advice or execution, FAIS applies regardless of stated intent

**Recommendation for legal counsel to assess:** Whether the proposed platform features, as built, fall inside or outside FAIS definition of "financial advice" and "intermediary service" — and which structural modifications are required for Position B to hold.

---

### POPIA — Protection of Personal Information Act

POPIA governs how personal information is collected, stored, processed, and shared.

**Platform POPIA requirements:**

| Requirement | What it means for the platform |
|---|---|
| Lawful processing basis | Every investor's data must be collected with explicit consent or another lawful basis |
| Data minimisation | Only collect what is strictly necessary — no speculative data collection |
| Retention limits | Define how long investor data is kept and when it is deleted |
| Cross-border transfer compliance | If investor data flows to servers or processors outside South Africa, specific safeguards apply |
| Breach notification | Must notify the Information Regulator and data subjects within specific timeframes if a breach occurs |

**Cross-border dimension:**
DBIA operates across multiple African countries. If the platform collects investor data from or about individuals in jurisdictions outside South Africa (e.g., a Zambian investor using the platform), both POPIA and the receiving country's data laws apply.

---

## Gate Tracker

| Gate | Owner | Due | Status |
|---|---|---|---|
| Engage qualified legal counsel (FAIS + POPIA specialist) | Carlson | 5 July 2026 | `Not Started` |
| Instruct counsel: provide platform spec + this brief | Carlson | At engagement | `Blocked` |
| FAIS: Position A or B decision from counsel | Legal counsel | TBC | `Blocked` |
| POPIA: compliant data architecture confirmed | Legal counsel + tech | TBC | `Blocked` |
| Cross-border dimension scoped | Legal counsel + DBIA | TBC | `Not Started` |
| Sprint kick-off (Kujenga Digital) | All parties | TBC after legal sign-off | `Blocked` |

---

## How to Update This File

When a gate changes status, update the Gate Tracker table above. Add a dated note below:

### Change Log

| Date | Gate | Change | Who |
|---|---|---|---|
| 2026-06-21 | Initial analysis | Brief commissioned by Carlson | Kujenga Digital |
| 2026-07-01 | File migrated | Moved from Knowledge/DBIA/ to Systems/MINERVA/ | GRIOT |
