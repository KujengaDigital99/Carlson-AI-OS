# /build-report

Build a structured report as a branded PDF — post-webinar, investment brief, country summary, or stakeholder update.

## When to use
- Post-webinar summary for attendees or investors
- Country investment brief (Rwanda, Ghana, Malawi, Botswana, Ethiopia, South Africa)
- Stakeholder update for AEM, ambassadors, or sponsors
- DBIA platform progress report

## Inputs required (ask if missing)

1. **Report type** — post-webinar / country brief / stakeholder update / other
2. **Subject** — country name, webinar title, or topic
3. **Audience** — who reads this? (investors / ambassadors / sponsors / AEM)
4. **Key findings or content** — paste or reference the source content
5. **Date** — report date
6. **Deadline** — when does this need to be ready?

## Build sequence

### Step 1 — Draft in markdown
Write the report body first. Structure for the report type:

**Post-webinar:**
- Session summary (what was discussed, speaker highlights)
- Key investment insights (3–5 numbered points)
- Attendee highlights (if names are provided)
- Investor Q&A summary
- Next webinar: country + date

**Country brief:**
- Country at a glance (GDP, diaspora size, key sectors)
- Investment opportunity (specific, not generic)
- Entry pathway (legal, regulatory, practical)
- DBIA angle (what DBIA brings to this market)
- Key contacts (AEM partner, country ambassador)

**Stakeholder update:**
- Progress since last update
- Pipeline numbers (if available)
- Decisions needed
- Next steps

Show draft to Carlson for approval before HTML build.

### Step 2 — HTML build
Use the portrait report template:
```
Systems/Tools/templates/portrait-report-template.html
```
- Brand tokens: Poppins headings, Raleway body, `#1C1C1C` text, `#8DC63F` accent
- Register: **surface** (internal / formal stakeholder)
- No hero section. Flowing content. Clean margins.
- Save HTML to: `Systems/Reports/[slug]-[YYYY-MM-DD].html`

### Step 3 — PDF export
```bash
node Systems/Tools/html-to-pdf/html-to-pdf.js \
  Systems/Reports/[file].html \
  Systems/Reports/[file].pdf \
  --portrait
```

### Step 4 — Deliver
- Confirm PDF looks right — no overflow, no missing sections
- Flag to Carlson: PDF path + suggested distribution method
- Carlson sends — do not distribute without explicit instruction

## Output files
- HTML: `Systems/Reports/[slug]-[YYYY-MM-DD].html`
- PDF: `Systems/Reports/[slug]-[YYYY-MM-DD].pdf`
