'use strict';
/**
 * Carlson AI OS — DBIA Image Generator
 *
 * Generates LinkedIn post cards using DBIA brand tokens.
 * Requires Chrome or Edge installed.
 *
 * Usage:
 *   node generate.js --template headline-card --headline "Africa's Investment Window" --subtext "DIASPORA WEBINAR SERIES" --output output/post.jpg
 *   node generate.js --template quote-card --quote "The continent is open." --attribution "Carlson Ifughe, DBIA" --output output/quote.jpg
 *   node generate.js --template webinar-card --headline "Diaspora Investor Webinar #1" --subtext "RWANDA · JULY 2026" --date "Thursday, 17 July 2026 · 18:00 SAST" --output output/webinar.jpg
 *
 * --template    headline-card | quote-card | webinar-card
 * --headline    Main heading text. Use \n for line breaks.
 * --subtext     Small caps descriptor above the headline
 * --quote       Quote text (quote-card only)
 * --attribution Speaker line (quote-card only)
 * --date        Event date line (webinar-card only)
 * --watermark   Faint background word (optional)
 * --bg          Path to background photo (optional, all templates)
 * --size        landscape (1600×1000) | square (1080×1080) | portrait (800×1600)
 * --output      Output JPG path (default: output/<timestamp>.jpg)
 */

const puppeteer = require('puppeteer-core');
const fs        = require('fs');
const path      = require('path');

// ── Browser detection ─────────────────────────────────────────────────────────
const BROWSER_PATHS = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/chromium-browser',
  '/usr/bin/google-chrome',
];

function findBrowser() {
  for (const p of BROWSER_PATHS) {
    if (fs.existsSync(p)) return p;
  }
  throw new Error('No supported browser found. Install Edge or Chrome.');
}

// ── Sizes ─────────────────────────────────────────────────────────────────────
const SIZES = {
  landscape: { width: 1600, height: 1000 },
  square:    { width: 1080, height: 1080 },
  portrait:  { width: 800,  height: 1600 },
};

// ── DBIA Brand ────────────────────────────────────────────────────────────────
const BRAND = {
  green:      '#00531E',
  greenDark:  '#003714',
  gold:       '#AF8120',
  cream:      '#FAF7F2',
  dark:       '#1A1A1A',
  overlay:    'rgba(0, 55, 20, 0.76)',
};

// ── Arg parser ────────────────────────────────────────────────────────────────
function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      opts[args[i].slice(2)] = args[i + 1] || '';
      i++;
    }
  }
  return opts;
}

// ── Base64 helpers ────────────────────────────────────────────────────────────
function toBase64(filePath, mime) {
  if (!filePath || !fs.existsSync(filePath)) return null;
  return `data:${mime};base64,${fs.readFileSync(filePath).toString('base64')}`;
}

const LOGO_LIGHT = toBase64(path.join(__dirname, 'logo-light.png'), 'image/png');
const LOGO_DARK  = toBase64(path.join(__dirname, 'logo-dark.png'),  'image/png');

// ── Template renderer ─────────────────────────────────────────────────────────
function render(html, vars) {
  return html
    .replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] !== undefined ? vars[key] : '')
    .replace(/\{\{#if (\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (_, key, block) => vars[key] ? block : '');
}

// ── Headline size auto-scale ──────────────────────────────────────────────────
function headlineSize(text, width) {
  const len = text.replace(/\\n/g, '\n').replace(/\n/g, '').length;
  if (width >= 1600) return len > 60 ? 62 : len > 40 ? 74 : len > 25 ? 88 : 104;
  if (width >= 1080) return len > 60 ? 52 : len > 40 ? 62 : len > 25 ? 74 : 86;
  return len > 60 ? 42 : len > 40 ? 52 : 62;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function generate(opts) {
  const {
    template    = 'headline-card',
    headline    = '',
    subtext     = '',
    quote       = '',
    attribution = '',
    date        = '',
    watermark   = '',
    bg          = '',
    size        = 'landscape',
    output,
  } = opts;

  const dims    = SIZES[size] || SIZES.landscape;
  const tplPath = path.join(__dirname, 'templates', `${template}.html`);

  if (!fs.existsSync(tplPath)) {
    throw new Error(`Template not found: ${template}. Available: headline-card, quote-card, webinar-card`);
  }

  const bgMime = bg && bg.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';
  const bgSrc  = toBase64(bg, bgMime);
  const logo   = bgSrc ? LOGO_LIGHT : LOGO_LIGHT;

  const vars = {
    WIDTH:         dims.width,
    HEIGHT:        dims.height,
    HEADLINE:      headline.replace(/\\n/g, '\n'),
    HEADLINE_SIZE: headlineSize(headline, dims.width),
    SUBTEXT:       subtext,
    QUOTE:         quote.replace(/\\n/g, '\n'),
    ATTRIBUTION:   attribution,
    DATE:          date,
    WATERMARK:     watermark,
    WATERMARK_SIZE: Math.round(dims.width * 0.52),
    BG_SRC:        bgSrc || '',
    LOGO_SRC:      logo || '',
    GREEN:         BRAND.green,
    GREEN_DARK:    BRAND.greenDark,
    GOLD:          BRAND.gold,
    CREAM:         BRAND.cream,
    DARK:          BRAND.dark,
    OVERLAY:       BRAND.overlay,
  };

  const html    = render(fs.readFileSync(tplPath, 'utf8'), vars);
  const outPath = output || path.join(__dirname, 'output', `${Date.now()}.jpg`);

  fs.mkdirSync(path.dirname(outPath), { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: findBrowser(),
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security'],
    headless: true,
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: dims.width, height: dims.height, deviceScaleFactor: 2 });
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 20000 });
    await page.evaluate(() => document.fonts.ready);
    await new Promise(r => setTimeout(r, 500));

    await page.screenshot({ path: outPath, type: 'jpeg', quality: 95 });
    console.log(`[IMAGE-GEN] Saved: ${outPath}`);
  } finally {
    await browser.close();
  }

  return outPath;
}

// ── CLI entry ─────────────────────────────────────────────────────────────────
if (require.main === module) {
  const opts = parseArgs();
  if (!opts.template && !opts.headline && !opts.quote) {
    console.log('Usage: node generate.js --template headline-card --headline "Your headline" --subtext "DESCRIPTOR"');
    process.exit(0);
  }
  generate(opts).catch(err => { console.error('[IMAGE-GEN] Error:', err.message); process.exit(1); });
}

module.exports = { generate };
