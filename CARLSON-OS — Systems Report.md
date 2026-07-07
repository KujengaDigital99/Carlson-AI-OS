# Carlson AI OS — Systems Report

**Last Updated:** 30 June 2026
**Guardian:** GRIOT | Tenure: June 2026 – May 2027
**Audience:** Carlson Ifughe (primary) | Kujenga Digital (build partner)
**Living document** — update when any sub-system is built, any project closes, or any gap is resolved.

---

## 1. What This OS Is

Carlson AI OS is the AI operating system built for Carlson Ifughe's work at DBIA and AEM. It is not a chatbot. It is the intelligence layer that sits alongside Carlson and helps him do two things his current workflow cannot do alone:

1. **Write** — convert his knowledge and experience into published articles for the DBIA Online Magazine
2. **Prepare** — have everything he needs before every webinar, every ambassador meeting, every AEM session

The guardian of this system is **GRIOT** — the West African keeper of oral history. Where Kujenga11 runs on Jarvis, Carlson AI OS runs on a Griot: warm, authoritative, Africa-informed, and relentlessly specific.

---

## 2. Who Carlson Is

| Field | Detail |
|---|---|
| Full name | Carlson Ifughe |
| Role | COO, Africa Entrepreneurship Masterminds (AEM) |
| Also | Secretary, DBIA; Host, Diaspora Investor Webinar Series |
| Key partner | Musakala Kabamba (Kujenga Digital) |
| Strength | Convening, hosting, relationship-building, diplomatic network |
| Gap | Written output — articles, briefs, structured communications |
| Primary need | Article writing for the DBIA Online Magazine |
| 2026 anchor | Diaspora Investor Webinar Series: 6 monthly webinars, July–December |

---

## 3. System Architecture

```
                    ┌─────────────────────────────┐
                    │       CARLSON AI OS          │
                    │       GRIOT (Guardian)        │
                    │  Knowledge keeper · Scribe    │
                    └──────────────┬───────────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                    │
     ┌────────▼───────┐  ┌────────▼───────┐  ┌────────▼───────┐
     │    CONTENT      │  │    WEBINARS    │  │  STAKEHOLDERS  │
     │ Article writing │  │ Monthly prep   │  │  Relationship  │
     │ DBIA Magazine   │  │ Diaspora       │  │  management    │
     │                 │  │ Investor       │  │                │
     └────────┬───────┘  └────────┬───────┘  └────────┬───────┘
              │                    │                    │
              └────────────────────▼────────────────────┘
                                   │
                    ┌──────────────▼───────────────┐
                    │          KNOWLEDGE            │
                    │  DBIA · AEM · H2 Calendar    │
                    │  Platform Status · Contacts   │
                    └──────────────────────────────┘
```

---

## 4. Sub-System Map

| Sub-System | Responsibility | Status | Path |
|---|---|---|---|
| CONTENT | Article writing for DBIA Online Magazine | `Active` | `Systems/CONTENT/` |
| WEBINARS | Monthly Diaspora Investor Webinar preparation | `Active` | `Systems/WEBINARS/` |
| STAKEHOLDERS | Relationship and outreach management | `Building` | `Systems/STAKEHOLDERS/` |

---

## 4b. Tools

| Tool | What it does | Command |
|---|---|---|
| **Image Gen** | Generate DBIA LinkedIn post cards (headline, quote, webinar templates) | `node Tools/image-gen/generate.js --template headline-card --headline "..."` |
| **Buffer Post** | Schedule posts to LinkedIn via Buffer | `node Tools/post.js send --text "..."` |

### Image Gen — Quick Reference
```bash
# Headline card (article announcement)
node Tools/image-gen/generate.js --template headline-card \
  --headline "Africa's Investment Window\nIs Open" \
  --subtext "DIASPORA WEBINAR SERIES" \
  --watermark "INVEST" \
  --output Tools/image-gen/output/post.jpg

# Quote card
node Tools/image-gen/generate.js --template quote-card \
  --quote "The continent is not waiting.\nIt is building." \
  --attribution "Carlson Ifughe, DBIA" \
  --output Tools/image-gen/output/quote.jpg

# Webinar announcement card
node Tools/image-gen/generate.js --template webinar-card \
  --headline "Diaspora Investor Webinar #1\nRwanda" \
  --subtext "DIASPORA INVESTOR SERIES · 2026" \
  --date "Thursday, 17 July 2026 · 18:00 SAST" \
  --output Tools/image-gen/output/webinar.jpg
```
Sizes: `--size landscape` (1600×1000, default) | `--size square` (1080×1080) | `--size portrait` (800×1600)
Output lands in `Tools/image-gen/output/` — move to `Systems/CONTENT/Articles/` or `Systems/WEBINARS/` after review.

### Buffer Post — Quick Reference
```bash
node Tools/post.js profiles           # list connected accounts
node Tools/post.js queue              # see what's scheduled
node Tools/post.js send --text "..."  # queue to LinkedIn
node Tools/post.js send --text "..." --schedule "2026-07-17T16:00:00Z"  # schedule UTC time
```
Requires `BUFFER_ACCESS_TOKEN` in `GRIOT-ENGINE/.env` (get from buffer.com/developers → Apps).
Image attachment: host the image publicly first (upload to doingbiz.africa or similar), then pass `--image-url "https://..."`.

### Setup required on Carlson's machine
1. `cd Tools/image-gen && npm install` — installs puppeteer-core
2. Chrome or Edge must be installed (image gen uses it headlessly)
3. `BUFFER_ACCESS_TOKEN` in `GRIOT-ENGINE/.env`

---

## 5. Knowledge Base

| File | Status | What it contains |
|---|---|---|
| `Knowledge/DBIA/dbia-operating-model.md` | `Complete` | DBIA engine, commercial model, magazine |
| `Knowledge/DBIA/h2-2026-calendar.md` | `Complete` | July–December 2026 activation calendar |
| `Knowledge/DBIA/investment-platform-status.md` | `Complete` | FAIS/POPIA legal status; sprint gate |
| `Knowledge/AEM/aem-programme.md` | `Complete` | AEM founding brief, 5 pillars, 6 actions |

---

## 6. Active Project Tracker

| Project | Sub-System | Owner | Deadline | Status | Next Action |
|---|---|---|---|---|---|
| DBIA Investment Platform — legal sign-off | DBIA | Carlson | 5 July 2026 | `Blocked` | Facilitate legal counsel review |
| Kigali — LMI Content Hub confirmation | WEBINARS | Carlson | This week | `Blocked` | Confirm space with LMI |
| Kigali — Gabon Embassy outreach | STAKEHOLDERS | Carlson + Kabamba | This week | `Not Started` | Contact HE Rembendambya |
| Kigali — Rwanda Development Board outreach | STAKEHOLDERS | Carlson | This week | `Not Started` | Initiate contact |
| Diaspora Webinar #1 — Rwanda | WEBINARS | Carlson | July 2026 | `Not Started` | Secure country representative after Kigali |
| AEM — 6 founding actions | AEM | All members | Before next meeting | `Not Started` | PVM draft is most urgent |
| DBIA Online Magazine — first Carlson article | CONTENT | Carlson + GRIOT | July 2026 | `Not Started` | Run Step 01 voice extraction |

---

## 7. System Health

| Working | Needs Attention | Immediate Action |
|---|---|---|
| CONTENT methodology — 3 steps built, templates ready | No articles published yet | Run first voice extraction session this week |
| WEBINARS — framework and runsheet template built | July webinar country rep not yet confirmed | Confirm Rwanda rep before 13 July |
| Knowledge base — DBIA and AEM fully documented | Investment platform sprint blocked on legal | Carlson must facilitate legal counsel by 5 July |
| STAKEHOLDERS — priority contacts identified | No contact records populated yet | Start with HE Rembendambya and Maria Lloyd |

---

## 8. Build Queue

| # | What to Build | Sub-System | Priority |
|---|---|---|---|
| 1 | First article — run CONTENT Step 01 with Carlson | CONTENT | Immediate |
| 2 | July webinar runsheet — Rwanda prep | WEBINARS | Before 13 July |
| 3 | Platform legal sign-off — facilitate and document | DBIA | By 5 July |
| 4 | STAKEHOLDERS contact records — HE Rembendambya, Maria Lloyd | STAKEHOLDERS | This week |
| 5 | AEM PVM draft — founding action #1 | AEM | Before next AEM meeting |
| 6 | August webinar runsheet — Ghana prep | WEBINARS | Before August |

---

*Carlson AI OS is built by Kujenga Digital. Guardian: GRIOT. Update this document after every build session.*
