#!/usr/bin/env node
/**
 * html-to-pdf.js — converts A4 HTML documents to PDF
 *
 * Usage:
 *   node html-to-pdf.js <input.html> [output.pdf] [--portrait]
 *
 * Flags:
 *   --portrait   Portrait A4 (default: landscape A4)
 *
 * If output path is omitted, saves alongside the input as <name>.pdf
 *
 * Engine resolution order:
 *   1. puppeteer          (npm install in this folder)
 *   2. puppeteer-core     (npm install in this folder)
 *   3. image-gen's node_modules/puppeteer-core (shared install)
 *   4. playwright         (remote Linux env — Chromium at /opt/pw-browsers/chromium)
 *   4a. Auto-installs playwright if nothing else is found
 */

const path = require('path');
const fs   = require('fs');
const { execSync } = require('child_process');

const args     = process.argv.slice(2);
const portrait = args.includes('--portrait');
const files    = args.filter(a => !a.startsWith('--'));

// ── Chrome / Chromium path candidates ────────────────────────────────────────
const CHROME_CANDIDATES = [
  // Linux — remote Claude Code environment (Playwright pre-installed)
  '/opt/pw-browsers/chromium',
  '/opt/pw-browsers/chromium/chrome',
  // Linux — system Chrome/Chromium
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
  '/usr/bin/chromium',
  // Windows — Chrome
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  path.join(process.env.USERPROFILE || '', '.cache/puppeteer/chrome/win64-148.0.7778.97/chrome-win64/chrome.exe'),
];
const chromePath = CHROME_CANDIDATES.find(p => fs.existsSync(p));

// ── Engine loading ────────────────────────────────────────────────────────────
function loadPuppeteer() {
  try { return { engine: require('puppeteer'), type: 'puppeteer' }; } catch {}
  try { return { engine: require('puppeteer-core'), type: 'puppeteer' }; } catch {}
  try {
    const p = path.join(__dirname, '..', 'image-gen', 'node_modules', 'puppeteer-core');
    return { engine: require(p), type: 'puppeteer' };
  } catch {}
  return null;
}

function loadPlaywright() {
  try { return { engine: require('playwright'), type: 'playwright' }; } catch {}
  return null;
}

function installAndLoadPlaywright() {
  console.log('No browser engine found — installing playwright...');
  // PUPPETEER_SKIP_DOWNLOAD stops puppeteer (also in package.json) from
  // attempting to download Chrome during this install — Chrome is pre-installed
  // in the remote env at /opt/pw-browsers/chromium.
  execSync('npm install playwright', {
    cwd: __dirname,
    stdio: 'inherit',
    env: {
      ...process.env,
      PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: '1',
      PLAYWRIGHT_BROWSERS_PATH: process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers',
      PUPPETEER_SKIP_DOWNLOAD: '1',
      PUPPETEER_SKIP_CHROMIUM_DOWNLOAD: '1',
    }
  });
  return { engine: require('playwright'), type: 'playwright' };
}

async function convert(htmlPath, pdfPath) {
  const absoluteHtml = path.resolve(htmlPath);
  if (!fs.existsSync(absoluteHtml)) {
    console.error(`File not found: ${absoluteHtml}`);
    process.exit(1);
  }

  fs.mkdirSync(path.dirname(path.resolve(pdfPath)), { recursive: true });

  const loaded = loadPuppeteer() || loadPlaywright() || installAndLoadPlaywright();
  const launchArgs = ['--no-sandbox', '--disable-setuid-sandbox'];

  let browser, page;

  if (loaded.type === 'playwright') {
    // Playwright API
    const { chromium } = loaded.engine;
    const launchOpts = { args: launchArgs };
    if (chromePath) launchOpts.executablePath = chromePath;
    browser = await chromium.launch(launchOpts);
    page = await browser.newPage();
    // WHY networkidle: Playwright's networkidle is more reliable than Puppeteer's networkidle0
    await page.goto(`file://${absoluteHtml}`, { waitUntil: 'networkidle' });
  } else {
    // Puppeteer API
    const launchOpts = { headless: 'new', args: launchArgs };
    if (chromePath) launchOpts.executablePath = chromePath;
    browser = await loaded.engine.launch(launchOpts);
    page = await browser.newPage();
    // WHY 'load' not 'networkidle0': base64-heavy docs + CDN fonts cause networkidle0 to
    // hang until the 30s timeout fires. 'load' fires when the DOM is ready. 120s covers
    // large embedded-image documents on slow machines (HP ProBook HDD mode).
    await page.goto(`file://${absoluteHtml}`, { waitUntil: 'load', timeout: 120000 });
  }

  await page.pdf({
    path: pdfPath,
    format: 'A4',
    landscape: !portrait,
    printBackground: true,
    // margins are controlled by the HTML @page rule — set to 0 here to avoid double margins
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });

  await browser.close();
  console.log(`PDF saved: ${pdfPath}`);
}

// ── CLI entry point ───────────────────────────────────────────────────────────
const [inputArg, outputArg] = files;

if (!inputArg) {
  console.error('Usage: node html-to-pdf.js <input.html> [output.pdf] [--portrait]');
  console.error('');
  console.error('Examples:');
  console.error('  node html-to-pdf.js proposal.html                    # landscape (default)');
  console.error('  node html-to-pdf.js report.html report.pdf --portrait');
  process.exit(1);
}

const resolvedInput  = path.resolve(inputArg);
const resolvedOutput = outputArg
  ? path.resolve(outputArg)
  : resolvedInput.replace(/\.html$/i, '.pdf');

convert(resolvedInput, resolvedOutput).catch(err => {
  console.error('PDF generation failed:', err.message);
  process.exit(1);
});
