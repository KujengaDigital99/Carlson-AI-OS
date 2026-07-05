# GRIOT Engine

Carlson Ifughe's AI OS — autonomous guardian engine.

## Setup

```bash
cd GRIOT-ENGINE
npm install
cp .env.example .env
# Edit .env — add ANTHROPIC_API_KEY
```

## Run

**Development (foreground):**
```bash
node index.js
```

**Production (pm2 — runs as background daemon):**
```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup   # auto-start on reboot
```

**Stop / restart:**
```bash
pm2 stop griot
pm2 restart griot
pm2 logs griot
```

## What It Does

Watches `Systems/` for `.md` and `.html` file changes. Routes each change to the relevant guardian:

| Path | Guardians |
|---|---|
| `Systems/CONTENT/Articles/` | VOICE + KEEPER |
| `Systems/WEBINARS/` | READINESS + KEEPER |
| `Systems/STAKEHOLDERS/` | KEEPER |
| Everything else in `Systems/` | KEEPER |
| `Systems/STATE/` | (ignored — output, not input) |

Guardian logs write to `Systems/STATE/sessions/guardian-logs/`.

## Guardians

| Name | Job |
|---|---|
| **VOICE** | Checks article drafts against Carlson's voice spec. Flags if not ready for DBIA Magazine. |
| **READINESS** | Checks webinar runsheets for missing elements. Flags blocking gaps before the event date. |
| **KEEPER** | Scans every file change for stakeholder intelligence, decisions, and action items. Flags updates needed in griot-state.md. |
