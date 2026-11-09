#!/usr/bin/env node
/*
 * Builds the static, search-engine-friendly parts of problemset.in from the
 * Google Sheet. Run by .github/workflows/build-pages.yml (every few hours and
 * on every push to main); can also be run locally:  node tools/build-pages.cjs
 *
 * It loads the real site in headless Chromium, so the questions, their IDs and
 * the share images come from exactly the same code visitors run. Writes:
 *   q/<id>/index.html          one page per question (text in the HTML, own preview picture)
 *   assets/og/<id>.png         1200×630 preview picture (the site's image card)
 *   assets/data/questions.json snapshot so first-time visitors see questions instantly
 *   <topic>/index.html         static list of the topic's questions (between @questions markers)
 *   sitemap.xml, robots.txt, 404.html
 *
 * Requires: playwright (+ Chromium).
 */
'use strict';
const fs = require('fs');
const path = require('path');
const http = require('http');
const crypto = require('crypto');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const SITE = 'https://problemset.in';
const TOPIC_ORDER = ['number-theory', 'trigonometry', 'calculus', 'combinatorics', 'algebra'];
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const write = (f, s) => { fs.mkdirSync(path.dirname(path.join(ROOT, f)), { recursive: true }); fs.writeFileSync(path.join(ROOT, f), s); };
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const between = (s, a, b) => { const i = s.indexOf(a), j = s.indexOf(b, i); if (i < 0 || j < 0) throw new Error('marker ' + a); return s.slice(i + a.length, j); };

// ---------- tiny static server for the repo ----------
function serve() {
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json' };
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0]);
    if (p.endsWith('/')) p += 'index.html';
    const file = path.join(ROOT, p);
    if (!file.startsWith(ROOT) || !fs.existsSync(file)) { res.writeHead(404); return res.end('not found'); }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise(r => server.listen(0, '127.0.0.1', () => r(server)));
}

// ---------- shared layout pieces, taken from the hand-made pages ----------
function layout() {
  const about = read('about/index.html');
  const absolute = s => s.replace(/(href|src)="\.\.\//g, '$1="/');
  const head = absolute(about.slice(0, about.indexOf('</head>')));
  const header = absolute(between(about, '<!-- @header -->\n', '<!-- /@header -->'))
    .replace(' is-active', '').replace(' aria-current="page"', '').replace(' class="active"', '');
  const footer = absolute(between(about, '<!-- @footer -->\n', '<!-- /@footer -->'));
  const ver = (about.match(/app\.js\?v=([\w-]+)/) || [])[1];
  const topicPages = {};
  for (const k of TOPIC_ORDER) topicPages[k] = read(`${k}/index.html`);
  return { head, header, footer, ver, topicPages };
}

function pageHead(L, { title, description, url, image, katex }) {
  let h = L.head;
  const set = (re, val) => { h = h.replace(re, val); };
  set(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`);
  set(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${url}">`);
  set(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${esc(title)}">`);
  set(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${esc(description)}">`);
  set(/<meta property="og:image" content="[^"]*">/, `<meta property="og:image" content="${image}">`);
  set(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${esc(title)}">`);
  set(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${esc(description)}">`);
  set(/<meta name="twitter:image" content="[^"]*">/, `<meta name="twitter:image" content="${image}">`);
  const extra = [`<meta name="description" content="${esc(description)}">`, `<link rel="canonical" href="${url}">`];
  if (katex) extra.push(
    '<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>',
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" crossorigin="anonymous">',
    '<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>',
    '<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"></script>');
  return h.replace(/(<meta name="viewport"[^>]*>\n)/, `$1${extra.join('\n')}\n`) + '</head>\n';
}

function scripts(L, init) {
  return `<script src="/assets/app.js?v=${L.ver}"></script>
<script>
  ${init}
  initCursorGlow();
  initTopicMenu();
  initSupportCard();
  initThemeToggle();
  initSpotlightSearch();
  initMathEasterEgg();
  initTabAwayMessage(["Come back! 👋", "Your questions miss you 🥲", "∑ waiting for you..."]);
</script>
`;
}

// ---------- the 404 page's background: y = 1/x, undefined at x = 0 ----------
function reciprocalMotif() {
  const W = 600, H = 420, cx = 300, cy = 210, k = 3600;
  const branch = sign => {
    const pts = [];
    for (let x = 12; x <= 290; x += 2) { const y = k / x; if (y < 220) pts.push(`${(cx + sign * x).toFixed(1)} ${(cy - sign * y).toFixed(1)}`); }
    return 'M' + pts.join(' L');
  };
  return `<svg class="bg-motif" viewBox="0 0 ${W} ${H}" fill="none" stroke="currentColor" stroke-linecap="round" aria-hidden="true" focusable="false">
    <path d="M20 ${cy}H${W - 20}" stroke-width="1" opacity="0.35"/>
    <path d="M${cx} 10V${H - 10}" stroke-width="1.2" stroke-dasharray="6 7" opacity="0.6"/>
    <path d="${branch(1)}" stroke-width="1.7"/><path d="${branch(-1)}" stroke-width="1.7"/>
    <circle cx="${cx}" cy="${cy}" r="7" stroke-width="1.6" fill="none"/>
  </svg>`;
}

function bgLayer(motifSvg) {
  return `<div class="bg-layer" aria-hidden="true">\n  <div class="bg-grid"></div>\n  <div class="bg-glow"></div>\n  ${motifSvg}\n</div>\n`;
}

function topicMotif(L, key) {
  return between(L.topicPages[key], '<!-- @bg -->\n', '<!-- /@bg -->').match(/<svg class="bg-motif"[\s\S]*<\/svg>/)[0];
}

// ---------- page templates ----------
function questionPage(L, q) {
  const url = `${SITE}/q/${q.id}/`;
  const shortText = q.plain.length > 70 ? q.plain.slice(0, 68).replace(/\s+\S*$/, '') + '…' : q.plain;
  const title = `${q.topicLabel} question: ${shortText} — problemset`;
  const description = (q.plain.length > 155 ? q.plain.slice(0, 152).replace(/\s+\S*$/, '') + '…' : q.plain);
  const header = L.header.replace(`<a href="/${q.topic}/">`, `<a href="/${q.topic}/" class="active">`);
  const ld = { '@context': 'https://schema.org', '@type': 'Quiz', name: `${q.topicLabel} question ${q.index + 1}`, about: q.topicLabel, educationalLevel: 'Undergraduate',
    url, hasPart: [{ '@type': 'Question', text: q.plain, eduQuestionType: 'Problem' }], isPartOf: { '@type': 'WebSite', name: 'problemset', url: SITE } };
  return `<!DOCTYPE html>
<html lang="en">
${pageHead(L, { title, description, url, image: `${SITE}/assets/og/${q.id}.png`, katex: true })}<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>
<body data-accent="${q.accentKey}" data-qid="${q.id}">
${bgLayer(topicMotif(L, q.topic))}${header}
<main id="content" class="page page-topic page-question container">
  <nav class="crumbs" aria-label="Breadcrumb">
    <a href="/">Home</a><span aria-hidden="true">/</span><a href="/${q.topic}/">${esc(q.topicLabel)}</a><span aria-hidden="true">/</span><span aria-current="page" id="qPosition">Question ${q.index + 1} of ${q.count}</span>
  </nav>
  <header class="topic-head">
    <span class="topic-head-icon" id="topicHeadIcon" aria-hidden="true"></span>
    <div>
      <h1>${esc(q.topicLabel)} question</h1>
      <p class="lede">${esc(q.difficulty[0].toUpperCase() + q.difficulty.slice(1))} · from the problemset ${esc(q.topicLabel.toLowerCase())} collection</p>
    </div>
  </header>

  <div id="questionList" class="question-area">
    <div class="question-list"><div class="q-item"><div class="q-row">
      <span class="q-index">${String(q.index + 1).padStart(2, '0')}</span>
      <div class="q-body"><div class="q-text">${esc(q.q)}</div></div>
    </div></div></div>
  </div>

  <div class="q-page-actions">
    <a class="btn btn-secondary" href="/${q.topic}/?q=${q.id}">See all ${esc(q.topicLabel)} questions →</a>
  </div>
</main>
${L.footer}
${scripts(L, `initQuestionPage(${JSON.stringify(q.id)}, ${JSON.stringify(q.topic)});`)}</body>
</html>
`;
}

function notFoundPage(L, topics) {
  const chips = TOPIC_ORDER.map(k => `<a class="nf-chip" href="/${k}/" style="--card-accent: var(--accent-${topics[k].accentKey})"><span class="nf-chip-ic">${topics[k].icon}</span>${esc(topics[k].label)}</a>`).join('\n        ');
  return `<!DOCTYPE html>
<html lang="en">
${pageHead(L, { title: 'Page not found — problemset', description: 'This page does not exist. Browse the problemset topics or search every question.', url: `${SITE}/404.html`, image: `${SITE}/assets/og-image.png`, katex: false })
  .replace('<meta name="viewport"', '<meta name="robots" content="noindex">\n<meta name="viewport"')}<body data-accent="comb">
${bgLayer(reciprocalMotif())}${L.header}
<main id="content" class="page page-404 container">
  <div class="nf">
    <p class="nf-code" aria-hidden="true"><span>4</span><span class="nf-zero">0</span><span>4</span></p>
    <h1>This page is <span class="accent">undefined.</span></h1>
    <p class="lede">Like 1 / 0, the page you asked for doesn't exist. The link may be mistyped, or the page may have moved.</p>
    <div class="nf-actions">
      <a class="btn btn-primary" href="/">Go to the homepage</a>
      <button class="btn btn-secondary" type="button" id="nfSearch">Search every question</button>
    </div>
    <div class="nf-topics">
      <p class="nf-topics-label">Or jump to a topic</p>
      <div class="nf-chips">
        ${chips}
      </div>
    </div>
  </div>
</main>
${L.footer}
${scripts(L, 'initNotFoundPage();')}</body>
</html>
`;
}

function topicStaticList(questions) {
  if (!questions.length) return '';
  return `\n<ol class="q-static-list">\n${questions.map(q => `  <li><a href="/q/${q.id}/">${esc(q.plain)}</a></li>`).join('\n')}\n</ol>\n`;
}

function sitemap(questions) {
  const urls = ['/', ...TOPIC_ORDER.map(k => `/${k}/`), '/about/', ...questions.map(q => `/q/${q.id}/`)];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${SITE}${u}</loc></url>`).join('\n')}\n</urlset>\n`;
}

// ---------- main ----------
(async () => {
  const L = layout();
  const server = await serve();
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch();
  try {
    // 1) Questions, exactly as the site reads them (live sheet → published fallback).
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(base + '/about/', { waitUntil: 'domcontentloaded' });
    const { data, topics } = await page.evaluate(async () => {
      const data = await fetchFreshData();
      const topics = {};
      Object.values(TOPICS).forEach(t => { topics[t.key] = { label: t.label, icon: t.icon, accentKey: (t.accent.match(/--accent-(\w+)/) || [])[1] }; });
      for (const k of Object.keys(data)) data[k].questions.forEach(q => { q.plain = latexToPlain(q.q); });
      return { data, topics };
    });
    await ctx.close();
    const questions = [];
    for (const k of TOPIC_ORDER) {
      const qs = data[k] ? data[k].questions : [];
      qs.forEach((q, i) => questions.push({ ...q, topic: k, topicLabel: topics[k].label, accentKey: topics[k].accentKey, index: i, count: qs.length }));
    }
    if (!questions.length) throw new Error('No questions found: refusing to overwrite the site.');
    console.log(`Loaded ${questions.length} questions.`);

    // 2) Preview pictures: the site's own image card, on a 1200×630 canvas.
    const manifestFile = 'assets/data/og-manifest.json';
    const manifest = fs.existsSync(path.join(ROOT, manifestFile)) ? JSON.parse(read(manifestFile)) : {};
    const sig = q => crypto.createHash('sha1').update(JSON.stringify([q.q, q.difficulty, q.topic, 2])).digest('hex').slice(0, 16);
    const todo = questions.filter(q => manifest[q.id] !== sig(q) || !fs.existsSync(path.join(ROOT, `assets/og/${q.id}.png`)));
    if (todo.length) {
      const ictx = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 });
      await ictx.addInitScript(() => {
        localStorage.setItem('problemset_theme', 'dark');
        window.__blob = null;
        window.ClipboardItem = class { constructor(o) { this.o = o; } };
        Object.defineProperty(navigator, 'clipboard', { value: { write: async items => { window.__blob = items[0].o['image/png']; }, writeText: async () => {} } });
      });
      const ip = await ictx.newPage();
      for (const topic of [...new Set(todo.map(q => q.topic))]) {
        await ip.goto(`${base}/${topic}/`, { waitUntil: 'networkidle' });
        await ip.waitForSelector('.q-item');
        for (const q of todo.filter(t => t.topic === topic)) {
          const png = await ip.evaluate(async (qid) => {
            window.__blob = null;
            const el = Array.from(document.querySelectorAll('.q-item')).find(e => e.dataset.qid === qid);
            if (!el) return null;
            el.querySelector('.img-btn').click();
            for (let i = 0; i < 200 && !window.__blob; i++) await new Promise(r => setTimeout(r, 100));
            if (!window.__blob) return null;
            const card = await createImageBitmap(window.__blob);
            const accent = getComputedStyle(el).getPropertyValue('--glow').trim() || '#7d9cff';
            const c = document.createElement('canvas'); c.width = 1200; c.height = 630;
            const x = c.getContext('2d');
            x.fillStyle = '#0b0b0e'; x.fillRect(0, 0, 1200, 630);
            const g = x.createRadialGradient(960, 0, 0, 960, 0, 760);
            g.addColorStop(0, accent + '40'); g.addColorStop(1, accent + '00');
            x.fillStyle = g; x.fillRect(0, 0, 1200, 630);
            x.strokeStyle = 'rgba(255,255,255,0.045)'; x.lineWidth = 1;
            for (let i = 0; i <= 1200; i += 40) { x.beginPath(); x.moveTo(i + 0.5, 0); x.lineTo(i + 0.5, 630); x.stroke(); }
            for (let j = 0; j <= 630; j += 40) { x.beginPath(); x.moveTo(0, j + 0.5); x.lineTo(1200, j + 0.5); x.stroke(); }
            const s = Math.min(1100 / card.width, 570 / card.height);
            const w = card.width * s, h = card.height * s;
            x.imageSmoothingQuality = 'high';
            x.drawImage(card, (1200 - w) / 2, (630 - h) / 2, w, h);
            return c.toDataURL('image/png');
          }, q.id);
          if (!png) throw new Error(`Could not render the image for ${q.id}`);
          write(`assets/og/${q.id}.png`, Buffer.from(png.split(',')[1], 'base64'));
          manifest[q.id] = sig(q);
          console.log(`  image: ${q.id}`);
        }
      }
      await ictx.close();
    }

    // 3) Write pages + data, and remove pages for deleted questions.
    const ids = new Set(questions.map(q => q.id));
    for (const q of questions) write(`q/${q.id}/index.html`, questionPage(L, q));
    if (fs.existsSync(path.join(ROOT, 'q'))) for (const d of fs.readdirSync(path.join(ROOT, 'q'))) if (!ids.has(d)) fs.rmSync(path.join(ROOT, 'q', d), { recursive: true });
    if (fs.existsSync(path.join(ROOT, 'assets/og'))) for (const f of fs.readdirSync(path.join(ROOT, 'assets/og'))) if (!ids.has(f.replace(/\.png$/, ''))) { fs.rmSync(path.join(ROOT, 'assets/og', f)); delete manifest[f.replace(/\.png$/, '')]; }
    write(manifestFile, JSON.stringify(manifest, null, 1) + '\n');
    const clean = JSON.parse(JSON.stringify(data));
    for (const k of Object.keys(clean)) clean[k].questions.forEach(q => { delete q.plain; });
    write('assets/data/questions.json', JSON.stringify({ data: clean }) + '\n');
    for (const k of TOPIC_ORDER) {
      const f = `${k}/index.html`;
      const html = read(f).replace(/<!-- @questions -->[\s\S]*?<!-- \/@questions -->/, `<!-- @questions -->${topicStaticList(questions.filter(q => q.topic === k))}<!-- /@questions -->`);
      write(f, html);
    }
    write('404.html', notFoundPage(L, topics));
    write('sitemap.xml', sitemap(questions));
    write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
    console.log(`Wrote ${questions.length} question pages, ${todo.length} new image(s), sitemap, 404.`);
  } finally {
    await browser.close();
    server.close();
  }
})().catch(err => { console.error(err); process.exit(1); });
