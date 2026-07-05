# /research

Trigger IFA to produce a country investment brief or regulatory analysis.

## When to use
- Carlson is preparing for an upcoming DBIA webinar and needs the country brief
- Due diligence on a potential ambassador, partner, or investment opportunity
- FAIS/POPIA compliance check on DBIA platform messaging
- A stakeholder has asked a specific question about a country's investment environment

## Inputs required (ask if missing)

1. **Research type** — country brief / regulatory analysis / due diligence / investment verification
2. **Country** — which country?
3. **Specific questions** — what does Carlson need to know? (be specific; "tell me about Rwanda" is not a question)
4. **Audience** — who will use this research? (Carlson's prep / investor handout / stakeholder email)
5. **Deadline** — when is the webinar or meeting?

## Research types

### Country investment brief
Standard brief for DBIA webinar prep. Covers:
- GDP, population, diaspora size
- Key investment sectors (the real ones, not the development-speak ones)
- Regulatory environment for foreign investors
- Currency and remittance considerations
- AEM presence and country partner landscape
- Risks (real — political stability, forex, contract enforcement)
- Why this country NOW — what is the specific moment of opportunity?

### Regulatory analysis
For FAIS/POPIA compliance or country-specific investment law:
- What applies to DBIA's operations
- What Carlson can and cannot say to investors
- Required disclosures
- Gaps in current compliance posture

### Due diligence
For a person (ambassador candidate, country partner):
- Public record check
- Published work or positions
- Known affiliations
- Red flags

## Build sequence

### Step 1 — Frame the brief
Write a structured research brief in `Systems/KNOWLEDGE/Briefs/[country]-[YYYY-MM-DD].md`:
```
# [Country] Investment Brief — [Date]
**Purpose:** [webinar prep / stakeholder question / compliance]
**Questions:**
1.
2.
3.
**Audience:** [who reads this]
**Deadline:** [date]
```

Saving to `Systems/KNOWLEDGE/` triggers IFA automatically via the watcher (RESEARCH mode).

### Step 2 — Manual IFA invocation (if urgent)
If the watcher hasn't fired or you need immediate output, invoke IFA directly:
- Read the brief file
- Pass it as context to IFA's RESEARCH prompt
- IFA outputs to `Systems/STATE/sessions/guardian-logs/`

### Step 3 — Format output
IFA output is structured analysis. Format it for the audience:
- For Carlson's prep: keep the full structured output
- For investor handout: extract the clean 5–7 point summary
- For stakeholder email: one paragraph, no jargon

### Step 4 — Save and flag
- Save formatted output to `Systems/KNOWLEDGE/[country]-brief-[YYYY-MM-DD].md`
- Tell Carlson: brief is ready, path, key findings in 3 bullets
