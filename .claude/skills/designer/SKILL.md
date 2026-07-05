# /designer

Generate a branded image for a LinkedIn post or campaign asset.

## When to use
Carlson needs a visual for a LinkedIn post, webinar announcement, speaker spotlight, or campaign graphic.

## Inputs required (ask if missing)

1. **Image type** — LinkedIn post card / webinar announcement / speaker spotlight / quote card
2. **Headline** — the main text (keep under 10 words for cards)
3. **Subtext** — supporting line (optional, under 15 words)
4. **Context** — which country, webinar, or campaign is this for?
5. **Person to feature** — speaker name + title (for speaker spotlights)

## Brand constraints (non-negotiable)

Carlson's brand for DBIA content:
- Background: `#000000` (dark) or `#FFFFFF` (light)
- Accent: `#8DC63F` (lime) for primary highlights
- Text: `#FFFFFF` on dark backgrounds, `#1C1C1C` on light
- Fonts loaded from `C:\laragon\www\kdr\public\fonts` (Inter/system fallback in canvas)
- No gradients. No stock-photo collages. No generic Africa imagery.

## Build sequence

### Step 1 — Configure
Open or update the DBIA client config:
```
Systems/Tools/image-gen/clients/dbia.js
```
Set the correct headline, subtext, and any speaker details for this specific image.

### Step 2 — Generate
```bash
node Systems/Tools/image-gen/generate.js dbia
```
Output lands in `Systems/Tools/image-gen/output/`.

### Step 3 — Review
Open the generated image. Check:
- Text is readable and not cut off
- Colours match brand tokens
- Layout looks intentional

If it needs adjustments, edit the config and regenerate.

### Step 4 — Move to campaign folder
```
Systems/CONTENT/[campaign-folder]/Images/[slug]-[YYYY-MM-DD].png
```
Never leave images in `image-gen/output/` between sessions. Move immediately after approval.

### Step 5 — Report
Tell Carlson: image path + suggested LinkedIn post text to accompany it.

## Notes
- The `output/` folder is a staging area only — always cleared before session close
- Font path dependency: `C:\laragon\www\kdr\public\fonts` — both repos must be on the same machine
