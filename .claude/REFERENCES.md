# References

## System Architecture

Carlson AI OS is a personal operating system built for Carlson Ifughe — General Secretary, AEM / DBIA. The guardian is GRIOT. This system has one master purpose: help Carlson put his knowledge on the page so it compounds over time.

The system layers:

| Layer | Path | Purpose |
|---|---|---|
| Systems | `Systems/[SUB-SYSTEM]/` | Active sub-systems — each with one responsibility |
| Knowledge | `Knowledge/[DOMAIN]/` | Domain knowledge — DBIA, AEM, context |
| Memory | `memory/` | GRIOT's accumulated session patterns |
| Archive | `Archive/` | Nothing deleted — all retired files land here |

## Standard Sub-System Folder Structure

Every sub-system follows this pattern exactly:

```
SUB-SYSTEM-NAME/
├── 00-overview.md
├── Instructions/
│   └── NN-kebab-case.md  (numbered)
└── Data/
    ├── References/
    └── Templates/
```

## Naming Conventions

| Content Type | Pattern | Example |
|---|---|---|
| Sub-system folders | ALLCAPS | `CONTENT/`, `WEBINARS/`, `MINERVA/` |
| Sub-system overview | `00-overview.md` | `Systems/CONTENT/00-overview.md` |
| Sub-system step files | `NN-kebab-case.md` | `01-voice-extraction.md` |
| Article files | `YYYY-MM-DD-slug.md` | `2026-07-15-kigali-investment-case.md` |
| Webinar runsheets | `YYYY-MM-DD-country-runsheet.md` | `2026-07-01-rwanda-runsheet.md` |
| Stakeholder profiles | `firstname-lastname.md` | `rod-rembendambya.md` |
| Knowledge files | `kebab-case.md` | `dbia-operating-model.md` |
| Reference files | `kebab-case.md` in `Data/References/` | `investment-platform-fais-popia.md` |
| Archive files | Original name + `-ARCHIVED-YYYY-MM-DD` | `investment-platform-status-ARCHIVED-2026-07-01.md` |

## Statuses (universal)

`Active` · `Building` · `Planning` · `Pipeline` · `Blocked` · `Wrapping` · `Complete` · `Not Started` · `Archived`

## Key People

| Name | Role | Organisation |
|---|---|---|
| Carlson Ifughe | General Secretary | AEM / DBIA |
| Musakala Kabamba | COO | AEM / Kujenga Digital |
| Justin Mthembu | Chairperson | AEM |
| HE Rod Rembendambya | Ambassador | Gabon to South Africa |
| Maria Lloyd | Representative | Black Business Chamber |
| Spencer Kitson | Partner | 80eight |
| Tshepo Ramodibe | Representative | IDC |

## DBIA Design Tokens

| Token | Value | Use |
|---|---|---|
| Primary green | `#00531E` | Headers, borders, primary actions |
| Gold/amber | `#AF8120` | Accents, highlights, callouts |
| Deep red | `#9A1D13` | Warnings, alerts |
| Font (display) | Playfair Display | Headings |
| Font (body) | Inter | Body text |

## NEVER FORGET

This is an always-evolving system. After every session, note what worked — in `memory/griot-patterns.md`. If GRIOT cannot see it in `Systems/`, the build is not complete.
