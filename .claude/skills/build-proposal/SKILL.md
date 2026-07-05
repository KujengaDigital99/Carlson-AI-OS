# /build-proposal

Build a DBIA investment proposal or partnership deck as a branded PDF.

## When to use
Carlson needs a formal proposal for: a country investment webinar sponsorship, an ambassador partnership agreement, an investor presentation, or a DBIA platform pitch.

## Inputs required (ask if missing)

1. **Recipient** — who is this for? (name, organisation, role)
2. **Purpose** — investment case / sponsorship / ambassador / platform pitch
3. **Country focus** — which country or is it multi-country?
4. **Key ask** — what does Carlson want from this person or organisation?
5. **Key points** — 3–5 bullet points Carlson wants to make
6. **Deadline** — when does this need to be sent?

## Build sequence

### Step 1 — Structure
Draft a proposal outline in markdown:
- Cover: Title, recipient, date
- Executive Summary (2–3 paragraphs)
- The Opportunity (country case or DBIA platform context)
- Why DBIA / Why Carlson (credibility, track record, Ubuntu framing)
- The Ask (specific, one paragraph)
- Next Steps (concrete, dated)

Show the outline to Carlson for approval before proceeding.

### Step 2 — HTML build
Use the landscape proposal template:
```
Systems/Tools/templates/landscape-proposal-template.html
```
- Brand tokens: Poppins headings, Raleway body, `#1C1C1C` text, `#8DC63F` accent, `#000000` dark panels
- Register: **voice** (client-facing)
- No gradients. No glassmorphism. No cyber palette.
- Save HTML to: `Systems/Proposals/[recipient-slug]-[YYYY-MM-DD].html`

### Step 3 — PDF export
```bash
node Systems/Tools/html-to-pdf/html-to-pdf.js \
  Systems/Proposals/[file].html \
  Systems/Proposals/[file].pdf
```
Landscape is default. Use `--portrait` only for one-pagers.

### Step 4 — Review and send
- Open PDF and confirm brand, layout, no overflow
- Flag to Carlson: PDF path + suggested email subject line
- Carlson sends — do not send without explicit instruction

## Output files
- HTML: `Systems/Proposals/[recipient-slug]-[YYYY-MM-DD].html`
- PDF: `Systems/Proposals/[recipient-slug]-[YYYY-MM-DD].pdf`
