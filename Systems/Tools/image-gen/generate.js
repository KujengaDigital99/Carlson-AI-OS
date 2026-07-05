'use strict';

/**
 * Kujenga Image Gen — OGUN shared tool
 *
 * Usage:
 *   node generate.js --client kujenga-digital --template headline-card \
 *     --headline "The Referral Trap" --subtext "YOU DON'T NEED MORE REFERRALS" \
 *     --watermark "DEMAND" --size landscape --output output/post.jpg
 *
 * --client       kujenga-digital | dbia | aves | aon-fuels
 * --template     headline-card | stat-card | quote-card | list-card | split-card
 * --style        default | editorial | bold | minimal  (overrides client default)
 * --headline     Main text. Use \n for line breaks.
 * --subtext      Small caps descriptor (headline-card, stat-card)
 * --attribution  Speaker/source line (quote-card only)
 * --items        Pipe-delimited list items (list-card only): "Point 1|Point 2|Point 3"
 * --watermark    Faint bleed-off word in background
 * --bg           Path to background photo (all templates support it)
 * --logoScale    Multiplier on logo size (default 1). e.g. 3 = 3x bigger.
 * --size         landscape (1600x1000) | portrait (800x1600) | square (1080x1080)
 * --output       Output JPG path (default: output/<timestamp>.jpg)
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
  portrait:  { width: 800,  height: 1600 },
  square:    { width: 1080, height: 1080 },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function toBase64(filePath, mimeType) {
  if (!filePath || !fs.existsSync(filePath)) return '';
  return `data:${mimeType};base64,${fs.readFileSync(filePath).toString('base64')}`;
}

function embedFont(fontPath, family, weight) {
  if (!fs.existsSync(fontPath)) return '';
  const data = fs.readFileSync(fontPath).toString('base64');
  return `@font-face{font-family:'${family}';src:url(data:font/truetype;base64,${data}) format('truetype');font-weight:${weight};font-style:normal;}\n`;
}

function autoHeadlineSize(text, width) {
  const len = text.replace(/\\n|\n/g, ' ').length;
  if (len <= 6)  return Math.round(width * 0.130);
  if (len <= 12) return Math.round(width * 0.095);
  if (len <= 20) return Math.round(width * 0.072);
  if (len <= 35) return Math.round(width * 0.053);
  if (len <= 55) return Math.round(width * 0.040);
  return Math.round(width * 0.032);
}

function autoListHeadlineSize(text, width) {
  const len = text.replace(/\\n|\n/g, ' ').length;
  if (len <= 12) return Math.round(width * 0.053);
  if (len <= 25) return Math.round(width * 0.040);
  if (len <= 40) return Math.round(width * 0.032);
  return Math.round(width * 0.026);
}

function buildItemsHtml(itemsStr) {
  const items = (itemsStr || '').split('|').map(s => s.trim()).filter(Boolean);
  if (!items.length) return '';
  return items.map((item, i) =>
    `<div class="list-item"><span class="item-num">${String(i + 1).padStart(2, '0')}</span><span class="item-text">${item}</span></div>`
  ).join('\n');
}

function renderTemplate(html, vars) {
  html = html.replace(/\{\{#if ([A-Z_]+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (_, key, content) => {
    return vars[key] ? content : '';
  });
  html = html.replace(/\{\{([A-Z_]+)\}\}/g, (_, key) => {
    return vars[key] !== undefined ? String(vars[key]) : '';
  });
  return html;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function generate(opts = {}) {
  const {
    client      = 'kujenga-digital',
    template    = 'headline-card',
    headline    = '',
    subtext     = '',
    watermark   = '',
    attribution = '',
    items       = '',
    bg          = null,
    size        = 'landscape',
    output,
  } = opts;

  const headlineSizeOverride = opts.headlineSize ? parseInt(opts.headlineSize, 10) : null;
  const logoScale = opts.logoScale ? parseFloat(opts.logoScale) : 1;

  const brand = require(`./clients/${client}`);
  const dims  = SIZES[size] || SIZES.landscape;

  // Style CSS injection
  const styleName = opts.style || brand.defaultStyle || 'default';
  const stylePath = path.join(__dirname, 'styles', `${styleName}.css`);
  const styleCSS  = fs.existsSync(stylePath) ? fs.readFileSync(stylePath, 'utf8') : '';

  // Fonts
  const fontFace = (brand.fonts || [])
    .map(f => embedFont(f.path, f.family, f.weight))
    .filter(Boolean).join('');

  // Images
  const bgMime  = bg && bg.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';
  const bgSrc   = toBase64(bg, bgMime);
  const logoSrc = toBase64(brand.logo, 'image/png');

  // List items
  const itemsHtml = buildItemsHtml(items);

  const rawHeadlineSize = headlineSizeOverride || autoHeadlineSize(headline, dims.width);

  const vars = {
    WIDTH:             dims.width,
    HEIGHT:            dims.height,
    HEADLINE:          headline.replace(/\\n/g, '\n'),
    SUBTEXT:           subtext,
    WATERMARK:         watermark,
    ATTRIBUTION:       attribution,
    ITEMS_HTML:        itemsHtml,
    BG_SRC:            bgSrc,
    LOGO_SRC:          logoSrc,
    ACCENT_COLOR:      brand.accentColor    || '#ffffff',
    OVERLAY_COLOR:     brand.overlayColor   || 'rgba(0,0,0,0.65)',
    BRAND_COLOR:       brand.brandColor     || '#111111',
    FONT_FAMILY:       brand.fontFamily     || 'Arial',
    FONT_FACE:         fontFace,
    HEADLINE_SIZE:     rawHeadlineSize,
    LIST_HEADLINE_SIZE: headlineSizeOverride || autoListHeadlineSize(headline, dims.width),
    QUOTE_SIZE:        headlineSizeOverride || autoHeadlineSize(headline, Math.round(dims.width * 0.82)),
    HEADLINE_WEIGHT:   brand.headlineWeight || 900,
    ACCENT_CLASS:      brand.accentStyle    || 'line',
    WATERMARK_SIZE:    Math.round(dims.width * 0.22),
    QUOTE_MARK_SIZE:   Math.round(dims.width * 0.32),
    SUBTEXT_SIZE:      Math.round(dims.width * 0.014),
    ATTR_SIZE:         Math.round(dims.width * 0.016),
    LOGO_HEIGHT:       Math.round(dims.height * 0.068 * logoScale),
    ITEM_SIZE:         Math.round(dims.width * 0.020),
    ITEM_NUM_SIZE:     Math.round(dims.width * 0.015),
    STYLE_CSS:         styleCSS,
  };

  const tplPath = path.join(__dirname, 'templates', `${template}.html`);
  const html    = renderTemplate(fs.readFileSync(tplPath, 'utf8'), vars);

  const browser = await puppeteer.launch({
    executablePath: findBrowser(),
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security'],
    headless: true,
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: dims.width, height: dims.height, deviceScaleFactor: 2 });
    await page.setContent(html, { waitUntil: 'load', timeout: 15000 });
    await page.evaluate(() => document.fonts.ready);
    await new Promise(r => setTimeout(r, 350));

    const outPath = output || path.join(__dirname, 'output', `${Date.now()}.jpg`);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });

    await page.screenshot({
      path:    outPath,
      type:    'jpeg',
      quality: 95,
      clip:    { x: 0, y: 0, width: dims.width, height: dims.height },
    });

    console.log(`Saved: ${outPath}`);

    // Non-fatal usage log for KAE frequency tracking
    const usageLog = path.join(__dirname, '..', '..', '..', 'usage-log.jsonl');
    try {
      fs.appendFileSync(usageLog, JSON.stringify({
        tool: 'image-gen',
        client,
        template,
        style: opts.style || brand.defaultStyle || 'default',
        size,
        timestamp: new Date().toISOString(),
      }) + '\n');
    } catch (_) {}

    return outPath;
  } finally {
    await browser.close();
  }
}

// ── CLI ───────────────────────────────────────────────────────────────────────
if (require.main === module) {
  const opts = {};
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i += 2) {
    if (args[i] && args[i].startsWith('--')) {
      opts[args[i].slice(2)] = args[i + 1];
    }
  }
  generate(opts).catch(err => { console.error('[image-gen]', err.message); process.exit(1); });
}

module.exports = { generate };
