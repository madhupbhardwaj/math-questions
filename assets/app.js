// ============================================================
// CONFIG — edit these to change data source or topics
// ============================================================
const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRFvuUAIJ9sPxu4uKkmBmP3GMlyRKhnYbp_L6wu7FtvI9R5SQiPfQz-kOUMTCPxhD6nXdyvER9mfTsa/pub?gid=1277823553&single=true&output=csv";
const SHOW_IMAGES = false; // set to true to bring images back
const SHOW_DONATION = true; // set to false to hide the "Support this project" card
const SHOW_PROGRESS = true; // set to false to hide "Mark solved" buttons and the solved counter

const TOPICS = {
  "Number Theory": {
    key: "number-theory",
    label: "Number Theory",
    tagline: "Primes, divisibility, modular arithmetic.",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 12h3.5V8.5h-7v7H19V5H5v14h14" opacity="0.32" stroke-width="1.2"/><circle cx="12" cy="12" r="0.9" fill="currentColor" stroke="none" opacity="0.45"/><g fill="currentColor" stroke="none"><circle cx="15.5" cy="12" r="1.45"/><circle cx="15.5" cy="8.5" r="1.45"/><circle cx="8.5" cy="8.5" r="1.45"/><circle cx="8.5" cy="15.5" r="1.45"/><circle cx="19" cy="12" r="1.45"/><circle cx="19" cy="5" r="1.45"/><circle cx="5" cy="5" r="1.45"/><circle cx="5" cy="12" r="1.45"/><circle cx="12" cy="19" r="1.45"/></g></svg>',
    accent: "var(--accent-nt)",
    accentBg: "rgba(108,143,255,0.1)"
  },
  "Trigonometry": {
    key: "trigonometry",
    label: "Trigonometry",
    tagline: "Identities, equations, angle relationships.",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 19A16 16 0 0 0 4 3" opacity="0.35" stroke-width="1.3"/><path d="M4 19h16.5M4 19V2.5" opacity="0.3" stroke-width="1.2"/><path d="M4 19 16.26 8.72V19Z" fill="currentColor" fill-opacity="0.18"/><path d="M14 19v-2.3h2.26" stroke-width="1.2" opacity="0.7"/><path d="M8.6 19a4.6 4.6 0 0 0-1.07-2.95" stroke-width="1.3"/><circle cx="16.26" cy="8.72" r="1.75" fill="currentColor" stroke="none"/></svg>',
    accent: "var(--accent-trig)",
    accentBg: "rgba(255,138,92,0.1)"
  },
  "Calculus": {
    key: "calculus",
    label: "Calculus",
    tagline: "Limits, derivatives, integrals.",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><defs><clipPath id="ps-calc-area"><path d="M4 18C9 18 10.5 6.5 15 6.5c2.4 0 3.8 1 5.5 2.5V20.5H4Z"/></clipPath></defs><g clip-path="url(#ps-calc-area)"><rect x="8" y="2" width="8.5" height="18.5" fill="currentColor" fill-opacity="0.22" stroke="none"/><path d="M8 2v18.5M16.5 2v18.5" opacity="0.6" stroke-width="1.2"/></g><path d="M3.5 3.5v17h17" opacity="0.4" stroke-width="1.3"/><path d="M4 18C9 18 10.5 6.5 15 6.5c2.4 0 3.8 1 5.5 2.5"/></svg>',
    accent: "var(--accent-calc)",
    accentBg: "rgba(126,224,140,0.1)"
  },
  "Combinatorics": {
    key: "combinatorics",
    label: "Combinatorics",
    tagline: "Counting, permutations, graph problems.",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4.5 3 19.5M12 4.5 21 19.5M9 9.5 15 19.5M15 9.5 9 19.5M6 14.5h12M9 9.5h6" opacity="0.25" stroke-width="1.1"/><g fill="currentColor" stroke="none" opacity="0.4"><circle cx="15" cy="9.5" r="1.15"/><circle cx="6" cy="14.5" r="1.15"/><circle cx="18" cy="14.5" r="1.15"/><circle cx="3" cy="19.5" r="1.15"/><circle cx="9" cy="19.5" r="1.15"/><circle cx="21" cy="19.5" r="1.15"/></g><path d="M12 4.5 9 9.5l3 5 3 5" stroke-width="1.9"/><g fill="currentColor" stroke="none"><circle cx="12" cy="4.5" r="1.8"/><circle cx="9" cy="9.5" r="1.45"/><circle cx="12" cy="14.5" r="1.45"/><circle cx="15" cy="19.5" r="1.8"/></g></svg>',
    accent: "var(--accent-comb)",
    accentBg: "rgba(214,138,255,0.1)"
  },
  "Algebra": {
    key: "algebra",
    label: "Algebra",
    tagline: "Equations, inequalities, functions.",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 6.5v12.5M8.5 19.5h7M4.5 7.5h15"/><circle cx="12" cy="5.2" r="1.5" fill="currentColor" stroke="none"/><path d="M5.5 7.5 3 13.5M5.5 7.5 8 13.5M18.5 7.5 16 13.5M18.5 7.5 21 13.5" opacity="0.4" stroke-width="1.1"/><path d="M2.5 13.5h6a3 3 0 0 1-6 0ZM15.5 13.5h6a3 3 0 0 1-6 0Z" fill="currentColor" fill-opacity="0.2"/><rect x="4.25" y="10.9" width="2.5" height="2.5" rx="0.5" fill="currentColor" stroke="none"/><circle cx="18.5" cy="12.1" r="1.3" fill="currentColor" stroke="none"/></svg>',
    accent: "var(--accent-alg)",
    accentBg: "rgba(255,209,102,0.1)"
  }
};

// ============================================================
// DATA HELPERS
// ============================================================
function normalizeDifficulty(raw) {
  const d = (raw || "").trim().toLowerCase();
  if (["easy", "beginner", "basic"].includes(d)) return "easy";
  if (["hard", "advanced", "difficult"].includes(d)) return "hard";
  return "medium";
}

function normalizeImageUrl(url) {
  if (!url) return null;
  const match = url.match(/[-\w]{25,}/);
  if (url.includes("drive.google.com") && match) {
    return `https://drive.google.com/thumbnail?id=${match[0]}&sz=w1000`;
  }
  return url;
}

function autoWrapLatex(text) {
  if (!text) return text;

  // Questions built from \text{...} blocks are always meant to be full display
  // math, even when they also contain nested $...$ fragments inside those blocks
  // (e.g. \text{such that $x=1$}). These must always get wrapped in $$...$$ —
  // otherwise anything outside the nested $...$ renders as raw literal text.
  const usesTextBlocks = /\\text\s*\{/.test(text);
  if (usesTextBlocks) return `$$${text}$$`;

  // Otherwise, a bare $ means the author hand-placed inline math markers in an
  // otherwise plain sentence (e.g. "Solve for $x$ below.") — leave it alone.
  if (text.includes("$")) return text;

  const looksLikeLatex = /\\[a-zA-Z]+|\^|_|\\frac|\\sin|\\cos|\\tan/.test(text);
  return looksLikeLatex ? `$$${text}$$` : text;
}

function buildDataFromRows(rows) {
  const data = {};
  Object.values(TOPICS).forEach(t => {
    data[t.key] = { label: t.label, icon: t.icon, accent: t.accent, accentBg: t.accentBg, questions: [] };
  });

  rows.forEach(row => {
    const topicName = (row["Topic"] || "").trim();
    const topic = TOPICS[topicName];
    if (!topic || !row["Question"]) return;

    data[topic.key].questions.push({
      id: data[topic.key].questions.length, // stable position-based ID for shareable links
      q: autoWrapLatex((row["Question"] || "").trim()),
      a: autoWrapLatex((row["Answer"] || "").trim()) || "No solution provided yet.",
      difficulty: normalizeDifficulty(row["Difficulty"]),
      img: normalizeImageUrl((row["Image"] || "").trim()),
      solutionLink: (row["Solution Link"] || "").trim()
    });
  });

  return data;
}

const CACHE_KEY = "problemset_cache_v1";

async function fetchCsvWithRetry(retries = 2, delayMs = 800) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(SHEET_CSV_URL, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      if (!text || text.trim().length === 0) throw new Error("Empty response");
      return text;
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise(r => setTimeout(r, delayMs));
    }
  }
}

// One fetch per page: the topic list and the global search share it.
let _loadDataPromise = null;
function loadData() {
  if (!_loadDataPromise) {
    _loadDataPromise = _loadDataOnce();
    _loadDataPromise.catch(() => { _loadDataPromise = null; });
  }
  return _loadDataPromise;
}

async function _loadDataOnce() {
  try {
    const csvText = await fetchCsvWithRetry();
    const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
    const data = buildDataFromRows(parsed.data);
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch (e) {}
    return data;
  } catch (err) {
    // Live fetch failed even after retries — fall back to last known-good data if we have it
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        console.warn("Live fetch failed, showing cached data:", err);
        return JSON.parse(cached);
      }
    } catch (e) { /* storage blocked or cache corrupt — fall through to the original error */ }
    throw err;
  }
}

function waitForLibs(callback) {
  if (window.Papa) callback();
  else setTimeout(() => waitForLibs(callback), 50);
}

// ============================================================
// DIFFICULTY INDICATOR (visual dots + subdued label)
// ============================================================
function difficultyIndicator(difficulty) {
  const d = ["easy", "medium", "hard"].includes(difficulty) ? difficulty : "medium";
  return `<span class="diff diff-${d}" title="Difficulty: ${d}">
    <span class="diff-dots" aria-hidden="true"><i></i><i></i><i></i></span>
    <span class="diff-label">${d}</span>
  </span>`;
}

// ============================================================
// LIGHTWEIGHT TOAST (shared across features)
// ============================================================
let _psToastEl = null, _psToastTimer = null;
function problemsetToast(msg) {
  if (!_psToastEl) {
    _psToastEl = document.createElement('div');
    _psToastEl.className = 'app-toast';
    document.body.appendChild(_psToastEl);
  }
  _psToastEl.textContent = msg;
  void _psToastEl.offsetWidth; // restart transition if already showing
  _psToastEl.classList.add('show');
  clearTimeout(_psToastTimer);
  _psToastTimer = setTimeout(() => _psToastEl.classList.remove('show'), 2400);
}

// ============================================================
// COPY QUESTION AS IMAGE
// Renders a branded card (with live KaTeX) to a PNG entirely in
// the browser — no uploads. Lazy-loads html2canvas on first use.
// ============================================================
let _html2canvasPromise = null;
function ensureHtml2Canvas() {
  if (window.html2canvas) return Promise.resolve(window.html2canvas);
  if (_html2canvasPromise) return _html2canvasPromise;
  _html2canvasPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
    s.onload = () => resolve(window.html2canvas);
    s.onerror = () => { _html2canvasPromise = null; reject(new Error('Could not load html2canvas')); };
    document.head.appendChild(s);
  });
  return _html2canvasPromise;
}

// foreignObjectRendering (used below) can silently produce a fully blank
// canvas without throwing — this checks the actual pixels rather than
// trusting "no exception" as proof the capture worked.
function isCanvasBlank(canvas) {
  try {
    const ctx = canvas.getContext('2d');
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const r0 = data[0], g0 = data[1], b0 = data[2];
    // Sample sparsely across the buffer rather than every pixel, for speed.
    for (let i = 4; i < data.length; i += 4 * 97) {
      if (Math.abs(data[i] - r0) > 6 || Math.abs(data[i + 1] - g0) > 6 || Math.abs(data[i + 2] - b0) > 6) {
        return false; // found a pixel that differs from the background — content was drawn
      }
    }
    return true;
  } catch (e) {
    // Can't inspect (e.g. tainted canvas) — assume it's fine rather than
    // discard a possibly-good capture we have no way to verify.
    return false;
  }
}

// ============================================================
// SHARE-IMAGE QUESTION LAYOUT
// Questions are authored as one big display-math block ($$ \text{...} x^2 \\ ... $$).
// KaTeX never wraps display math, so a long line simply runs off the edge of
// the fixed-width share card. For the image we rebuild each line instead:
// \text{...} becomes real wrapping text, the math between it becomes inline
// (\displaystyle) KaTeX that can break after = + - etc., and the author's own
// \\ line breaks are kept as separate lines. Only a single formula that is
// genuinely too wide to break gets shrunk — on its own.
// ============================================================
function _escHtml(t) {
  return String(t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// Read a LaTeX command starting at s[i] === '\\'. Returns the command text.
function _readCmd(s, i) {
  let j = i + 1;
  if (/[a-zA-Z]/.test(s[j] || '')) { while (j < s.length && /[a-zA-Z]/.test(s[j])) j++; }
  else j++;
  return s.slice(i, j);
}

// Walk a LaTeX string, tracking brace / \begin..\end / \left..\right depth, and
// call onTop(cmd, i) for every command that sits at the top level. If onTop
// returns a number, scanning resumes from that index.
function _scanLatex(s, onTop, onChar) {
  let i = 0, depth = 0, env = 0, lr = 0;
  while (i < s.length) {
    const c = s[i];
    if (c === '\\') {
      const cmd = _readCmd(s, i);
      if (depth === 0 && env === 0 && lr === 0) {
        const jump = onTop(cmd, i);
        if (typeof jump === 'number') { i = jump; continue; }
      }
      if (cmd === '\\begin') env++;
      else if (cmd === '\\end') env = Math.max(0, env - 1);
      else if (cmd === '\\left') lr++;
      else if (cmd === '\\right') lr = Math.max(0, lr - 1);
      onChar(cmd);
      i += cmd.length;
      continue;
    }
    if (c === '{') depth++;
    else if (c === '}') depth = Math.max(0, depth - 1);
    onChar(c);
    i++;
  }
}

// Index just past the brace group that opens at s[k] === '{'.
function _matchBrace(s, k) {
  let d = 0;
  for (let i = k; i < s.length; i++) {
    if (s[i] === '\\') { i++; continue; }
    if (s[i] === '{') d++;
    else if (s[i] === '}' && --d === 0) return i + 1;
  }
  return s.length;
}

function _katexInline(tex) {
  if (!tex.trim()) return '';
  // Display-only environments can't sit inline; their "-ed" forms can.
  const t = tex
    .replace(/\\(begin|end)\{(gather|align)\*?\}/g, '\\$1{$2ed}')
    .replace(/\\(begin|end)\{equation\*?\}/g, '')
    // KaTeX draws ≠ / ∉ as "=" / "∈" plus a zero-width overlaid slash, which
    // html2canvas drops (so "p ≠ 0" would read "p = 0"). Use the real glyphs.
    .replace(/\\neq?(?![a-zA-Z])|\\not\s*=/g, '\\mathrel{\\char"2260}')
    .replace(/\\notin(?![a-zA-Z])|\\not\s*\\in(?![a-zA-Z])/g, '\\mathrel{\\char"2209}');
  try {
    return '<span class="sc-math">' + katex.renderToString('\\displaystyle ' + t, { throwOnError: false, displayMode: false }) + '</span>';
  } catch (e) {
    return '<span class="sc-math">' + _escHtml(tex) + '</span>';
  }
}

// Plain text that may contain hand-placed $...$ inline math.
function _textWithDollars(t, cls) {
  return t.split(/(\$[^$]+\$)/g).map(part => {
    if (/^\$[^$]+\$$/.test(part)) return _katexInline(part.slice(1, -1));
    return part ? `<span class="${cls}">${_escHtml(part)}</span>` : '';
  }).join('');
}

function _renderShareLine(line) {
  let out = '', math = '';
  const flush = () => { out += _katexInline(math); math = ''; };
  _scanLatex(line, (cmd, i) => {
    if (cmd === '\\text' || cmd === '\\textrm' || cmd === '\\mbox' || cmd === '\\textbf' || cmd === '\\textit') {
      let k = i + cmd.length;
      while (line[k] === ' ') k++;
      if (line[k] !== '{') return;
      const end = _matchBrace(line, k);
      flush();
      const cls = 'sc-text' + (cmd === '\\textbf' ? ' sc-bold' : cmd === '\\textit' ? ' sc-italic' : '');
      out += _textWithDollars(line.slice(k + 1, end - 1).replace(/\\([%&#_$])/g, '$1'), cls);
      return end;
    }
    if (cmd === '\\quad' || cmd === '\\qquad') {
      flush();
      out += '<span class="sc-gap"></span> ';
      return i + cmd.length;
    }
  }, ch => { math += ch; });
  flush();
  return out;
}

// Turn a question's source into wrapping HTML for the share card.
function buildShareQuestionHTML(src) {
  const s = (src || '').trim();
  const isDisplay = s.length >= 4 && s.startsWith('$$') && s.endsWith('$$');
  if (!isDisplay) {
    // A normal sentence with optional $...$ — it already wraps on its own.
    return `<div class="sc-line">${_textWithDollars(s, 'sc-plain')}</div>`;
  }
  const body = s.slice(2, -2);
  const lines = [];
  let start = 0;
  _scanLatex(body, (cmd, i) => {
    if (cmd === '\\\\') { lines.push(body.slice(start, i)); start = i + 2; return start; }
  }, () => {});
  lines.push(body.slice(start));
  return lines
    .filter(l => l.trim())
    .map(l => `<div class="sc-line">${_renderShareLine(l)}</div>`)
    .join('');
}

// After the card is in the DOM: shrink any single formula whose smallest
// unbreakable piece is still wider than the card, so nothing is ever clipped.
function fitShareMath(qBox) {
  const available = qBox.clientWidth;
  if (!available) return;
  qBox.querySelectorAll('.sc-math').forEach(m => {
    let widest = 0;
    m.querySelectorAll('.katex-html > .base').forEach(b => {
      widest = Math.max(widest, b.getBoundingClientRect().width);
    });
    if (!widest) widest = m.getBoundingClientRect().width;
    if (widest > available) m.style.fontSize = ((available / widest) * 0.96) + 'em';
  });
}

// Tall \left( ... \right) delimiters are drawn as an SVG nested inside several
// KaTeX "vlist" boxes; html2canvas clips it to the wrong box, so only part of
// the bracket appears in the image. Right before capture, lift each piece out
// to an absolutely-positioned copy at the exact same spot on the card (layout
// is untouched — the original is just hidden).
function liftTallDelimiters(card) {
  const cardRect = card.getBoundingClientRect();
  const cs = getComputedStyle(card);
  const offX = cardRect.left + (parseFloat(cs.borderLeftWidth) || 0);
  const offY = cardRect.top + (parseFloat(cs.borderTopWidth) || 0);
  card.querySelectorAll('.share-card-q .delimsizing.mult').forEach(delim => {
    const color = getComputedStyle(delim).color;
    delim.querySelectorAll('svg, span').forEach(el => {
      const isSvg = el.tagName.toLowerCase() === 'svg';
      if (!isSvg && (el.children.length || !el.textContent.replace(/[\s\u200b]/g, '') || el.closest('svg'))) return;
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      let copy;
      if (isSvg) {
        // html2canvas skips lifted inline <svg>, but paints <img> reliably.
        const svg = el.cloneNode(true);
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svg.setAttribute('width', r.width);
        svg.setAttribute('height', r.height);
        svg.setAttribute('fill', color);
        svg.removeAttribute('style');
        copy = document.createElement('img');
        copy.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(svg));
      } else {
        copy = el.cloneNode(true);
      }
      Object.assign(copy.style, {
        position: 'absolute', margin: '0', padding: '0',
        left: (r.left - offX) + 'px', top: (r.top - offY) + 'px',
        width: r.width + 'px', height: r.height + 'px'
      });
      if (!isSvg) {
        const ecs = getComputedStyle(el);
        Object.assign(copy.style, {
          fontFamily: ecs.fontFamily, fontSize: ecs.fontSize, lineHeight: ecs.lineHeight,
          color: color, whiteSpace: 'nowrap'
        });
      }
      card.appendChild(copy);
      el.style.visibility = 'hidden';
    });
  });
}

async function copyQuestionAsImage(item, qEl, accent, topicLabel, btn) {
  const original = btn.innerHTML;
  btn.disabled = true;
  btn.classList.add('busy');
  btn.innerHTML = '<span class="img-btn-spin">◌</span>';

  let card;
  try {
    await ensureHtml2Canvas();

    const qTextNode = qEl.querySelector('.q-text');
    card = document.createElement('div');
    card.className = 'share-card';
    card.style.setProperty('--card-accent', accent || 'var(--accent-nt)');
    card.innerHTML = `
      <div class="share-card-top">
        <div class="share-card-brand">
          <span class="share-card-mark">∑</span>
          <span class="share-card-word">problemset</span>
        </div>
        <span class="share-card-topic">${(topicLabel || '').toUpperCase()}</span>
      </div>
      <div class="share-card-q"></div>
      <div class="share-card-bottom">
        ${difficultyIndicator(item.difficulty)}
        <span class="share-card-url">problemset.in</span>
      </div>
    `;
    // Rebuild the question so long lines wrap and the card grows downward
    // instead of clipping on the right (see buildShareQuestionHTML).
    const qSlot = card.querySelector('.share-card-q');
    if (window.katex && item.q) {
      qSlot.innerHTML = buildShareQuestionHTML(item.q);
    } else if (qTextNode) {
      qSlot.appendChild(qTextNode.cloneNode(true));
    }
    document.body.appendChild(card);

    // Make sure fonts (Inter + KaTeX) are ready before measuring/snapshotting.
    if (document.fonts && document.fonts.ready) { try { await document.fonts.ready; } catch (e) {} }
    await new Promise(r => setTimeout(r, 60));

    // Shrink only formulas that can't wrap and are still wider than the card.
    // (Font-size, not CSS zoom: html2canvas paints zoomed KaTeX incorrectly.)
    const qBox = card.querySelector('.share-card-q');
    fitShareMath(qBox);
    await new Promise(r => requestAnimationFrame(() => r()));
    liftTallDelimiters(card);

    const bg = getComputedStyle(document.body).backgroundColor || '#0a0a0b';
    const baseOpts = {
      backgroundColor: bg,
      scale: Math.min(3, Math.max(2, window.devicePixelRatio || 2)),
      logging: false,
      useCORS: true,
      // Tall (long) questions: make sure the capture viewport fits the whole card
      windowWidth: Math.max(window.innerWidth, card.offsetWidth + 40),
      windowHeight: Math.max(window.innerHeight, card.offsetHeight + 40)
    };

    // foreignObjectRendering delegates painting to the browser's own SVG
    // renderer, which fixes KaTeX's SVG-based radicals/delimiters rendering
    // as garbled shapes. BUT it has a well-known failure mode: with external
    // stylesheets (our Google Fonts / KaTeX CDN <link> tags) it often does
    // NOT throw — it just silently produces a fully blank canvas. So we must
    // actually inspect the pixels rather than trust "no exception" as success.
    let canvas;
    let usedForeignObject = false;
    try {
      canvas = await html2canvas(card, { ...baseOpts, foreignObjectRendering: true });
      usedForeignObject = true;
    } catch (e) {
      console.warn('foreignObjectRendering threw, falling back:', e);
    }

    if (usedForeignObject && isCanvasBlank(canvas)) {
      console.warn('foreignObjectRendering produced a blank capture, falling back.');
      canvas = null;
    }

    if (!canvas) {
      canvas = await html2canvas(card, baseOpts);
    }

    const blob = await new Promise(res => canvas.toBlob(res, 'image/png'));
    if (!blob) throw new Error('toBlob returned null');

    let copied = false;
    if (navigator.clipboard && window.ClipboardItem) {
      try {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        copied = true;
      } catch (e) { copied = false; }
    }

    if (copied) {
      problemsetToast('✓ Image copied to clipboard');
    } else {
      // Clipboard image writes aren't supported everywhere — fall back to download.
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'problemset-question.png';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      problemsetToast('✓ Image saved');
    }
  } catch (err) {
    console.warn('Copy-as-image failed:', err);
    problemsetToast('Could not create image');
  } finally {
    if (card && card.parentNode) card.parentNode.removeChild(card);
    btn.disabled = false;
    btn.classList.remove('busy');
    btn.innerHTML = original;
  }
}

// ============================================================
// SHARED QUESTION RENDERING (used by every topic page)
// ============================================================
// ============================================================
// SOLVED-QUESTION TRACKING (per browser, stored in localStorage)
// Controlled by SHOW_PROGRESS. IDs are position-based, so append new
// questions to the END of a topic in the sheet to keep progress intact.
// ============================================================
const PROGRESS_KEY = "problemset_solved_v1";

function readAllProgress() {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {}; }
  catch (e) { return {}; }
}
function getSolvedSet(topicKey) {
  const list = readAllProgress()[topicKey];
  return new Set(Array.isArray(list) ? list : []);
}
function setSolved(topicKey, id, solved) {
  const all = readAllProgress();
  const set = new Set(Array.isArray(all[topicKey]) ? all[topicKey] : []);
  if (solved) set.add(id); else set.delete(id);
  all[topicKey] = Array.from(set);
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(all)); } catch (e) {}
}

// Open/close a question and keep the chevron button's aria-expanded in sync.
function setQuestionOpen(qEl, open) {
  qEl.classList.toggle('open', open);
  const toggle = qEl.querySelector('.chevron-btn');
  if (toggle) {
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Hide solution' : 'Show solution');
  }
}

function renderQuestionItem(item, index, accent, topicLabel, topicKey, onProgressChange) {
  const qEl = document.createElement('div');
  qEl.className = 'q-item';
  qEl.style.setProperty('--glow', accent);
  qEl.dataset.qid = item.id;
  const isSolved = SHOW_PROGRESS && topicKey && getSolvedSet(topicKey).has(item.id);
  qEl.innerHTML = `
    <div class="q-row">
      <span class="q-index">${String(index + 1).padStart(2, '0')}</span>
      <div class="q-body">
        <div class="q-text">${item.q}</div>
        ${(SHOW_IMAGES && item.img) ? `<img class="q-image${item.solutionLink ? ' q-image-linked' : ''}" src="${item.img}" alt="question diagram">` : ''}
        <div class="q-meta">
          ${difficultyIndicator(item.difficulty)}
          ${item.solutionLink ? `<a class="solution-btn" href="${item.solutionLink}" target="_blank" rel="noopener" aria-label="Watch the video solution on YouTube">
            <svg class="yt-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="4.5" fill="#FF0000"/><path d="M10 9v6l5-3-5-3z" fill="#fff"/></svg>
            Video
          </a>` : ''}
          <button class="img-btn" data-qid="${item.id}" aria-label="Copy this question as an image" title="Copy as image">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.6"/><path d="m21 15-5-5L5 21"/></svg>
            Image
          </button>
          <button class="share-btn" data-qid="${item.id}" aria-label="Copy shareable link" title="Copy link to this question">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 10.5 15.4 6.5M8.6 13.5l6.8 4"/></svg>
            Share
          </button>
          ${SHOW_PROGRESS ? `<button class="solved-btn" aria-pressed="false" title="Mark this question as solved">
            <span class="dcb" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 16 16"><rect class="dcb-box" x="1.25" y="1.25" width="13.5" height="13.5" rx="4"/><path class="dcb-check" d="M4.7 8.3 7.1 10.7l4.3-5.1" pathLength="1"/></svg></span>
            <span class="solved-label">Mark solved</span>
          </button>` : ''}
        </div>
        <div class="q-answer"><div class="q-answer-inner"><span class="label">SOLUTION</span>${item.a}</div></div>
      </div>
      <button class="chevron-btn" type="button" aria-expanded="false" aria-label="Show solution">
        <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
      </button>
    </div>
  `;

  // Diagram image: attach handlers in JS instead of inline attributes (avoids
  // breaking on quotes in the solution URL). Linked images open the video.
  const diagram = qEl.querySelector('.q-image');
  if (diagram) {
    diagram.addEventListener('error', () => { diagram.style.display = 'none'; });
    if (item.solutionLink) {
      diagram.addEventListener('click', (e) => {
        e.stopPropagation();
        window.open(item.solutionLink, '_blank', 'noopener');
      });
    }
  }

  // Solved toggle — must not toggle the answer either.
  const solvedBtn = qEl.querySelector('.solved-btn');
  if (solvedBtn) {
    const paint = (solved) => {
      qEl.classList.toggle('solved', solved);
      solvedBtn.setAttribute('aria-pressed', solved ? 'true' : 'false');
      solvedBtn.querySelector('.solved-label').textContent = solved ? 'Solved' : 'Mark solved';
    };
    paint(isSolved);
    solvedBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const next = !qEl.classList.contains('solved');
      paint(next);
      // Tactile snap on the checkbox (restart the animation every click)
      const box = solvedBtn.querySelector('.dcb');
      if (box) { box.classList.remove('dcb-pop'); void box.offsetWidth; box.classList.add('dcb-pop'); }
      if (next) {
        const r = (box || solvedBtn).getBoundingClientRect();
        const cs = getComputedStyle(qEl);
        particleBurst(r.left + r.width / 2, r.top + r.height / 2, [
          cs.getPropertyValue('--glow').trim(),
          getComputedStyle(document.documentElement).getPropertyValue('--solved').trim()
        ]);
      }
      setSolved(topicKey, item.id, next);
      if (onProgressChange) onProgressChange();
    });
  }

  const shareBtn = qEl.querySelector('.share-btn');
  shareBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    const url = `${location.origin}${location.pathname}?q=${item.id}`;
    try {
      await navigator.clipboard.writeText(url);
      const original = shareBtn.innerHTML;
      shareBtn.innerHTML = 'Copied!';
      setTimeout(() => { shareBtn.innerHTML = original; }, 1500);
    } catch (err) {
      console.warn('Clipboard copy failed:', err);
    }
  });

  // The Solution button opens its link normally (new tab), but must NOT also
  // toggle the answer reveal — stop the click from bubbling up to the item.
  const solutionBtn = qEl.querySelector('.solution-btn');
  if (solutionBtn) solutionBtn.addEventListener('click', (e) => e.stopPropagation());

  // Copy-as-image button — also must not toggle the answer.
  const imgBtn = qEl.querySelector('.img-btn');
  if (imgBtn) imgBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    copyQuestionAsImage(item, qEl, accent, topicLabel, imgBtn);
  });

  // Clicking anywhere else on the question toggles the inline answer reveal.
  // The chevron is a real <button>, so keyboard users can Tab to it and press
  // Enter/Space; its click bubbles up here and reveals the answer too.
  qEl.addEventListener('click', () => setQuestionOpen(qEl, !qEl.classList.contains('open')));
  if (item.solutionLink) qEl.classList.add('has-link');
  return qEl;
}

function renderMath(container) {
  if (window.renderMathInElement) {
    renderMathInElement(container, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false }
      ]
    });
  }
}

function renderSkeleton(container, count) {
  const list = document.createElement('div');
  list.className = 'skeleton-list';
  for (let i = 0; i < count; i++) {
    const row = document.createElement('div');
    row.className = 'skeleton-item';
    row.innerHTML = `
      <div class="skeleton-index"></div>
      <div class="skeleton-lines">
        <div class="skeleton-line"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-tag"></div>
      </div>
    `;
    list.appendChild(row);
  }
  container.innerHTML = '';
  container.appendChild(list);
}

// (Difficulty donut chart removed in the redesign: see renderStats in initTopicPage)
// ============================================================
// SINGLE-TOPIC PAGE LOGIC
// Call initTopicPage("trigonometry") from that page's inline script.
// ============================================================
function initTopicPage(topicKey) {
  const main = document.getElementById('questionList') || document.getElementById('main');
  const topicDef = Object.values(TOPICS).find(t => t.key === topicKey);
  const headIcon = document.getElementById('topicHeadIcon');
  if (headIcon && topicDef) headIcon.innerHTML = topicDef.icon;
  renderPager();
  let allQuestions = [];
  let accent = 'var(--accent-nt)';
  let topicLabel = '';
  let currentFilter = 'all';
  let currentSearch = '';

  function render() {
    main.innerHTML = '';
    const filtered = allQuestions.filter(item => {
      const matchesFilter = currentFilter === 'all' || item.difficulty === currentFilter;
      const matchesSearch = item.q.toLowerCase().includes(currentSearch.toLowerCase());
      return matchesFilter && matchesSearch;
    });

    if (allQuestions.length === 0) {
      main.innerHTML = '<div class="empty-state">No questions here yet — check back soon.</div>';
      return;
    }

    if (filtered.length === 0) {
      main.innerHTML = '<div class="empty-state">No questions match your search. <button type="button" class="empty-reset">Clear filters</button></div>';
      main.querySelector('.empty-reset').addEventListener('click', () => {
        currentFilter = 'all';
        currentSearch = '';
        const input = document.getElementById('searchInput');
        if (input) input.value = '';
        document.querySelectorAll('.pill').forEach(p => p.classList.toggle('active', p.dataset.filter === 'all'));
        render();
      });
      return;
    }

    const list = document.createElement('div');
    list.className = 'question-list';
    filtered.forEach((item, i) => list.appendChild(
      renderQuestionItem(item, i, accent, topicLabel, topicKey, updateSolvedCount)
    ));
    main.appendChild(list);
    renderMath(main);
  }

  // Shows "N solved" in the stats row (SHOW_PROGRESS only).
  function updateSolvedCount() {
    const el = document.getElementById('stat-solved');
    if (!el) return;
    const solved = getSolvedSet(topicKey);
    el.textContent = allQuestions.filter(q => solved.has(q.id)).length;
  }

  // Slim stats row: question count, solved count, difficulty split.
  function renderStats() {
    const box = document.getElementById('topicStats');
    if (!box) return;
    const c = { easy: 0, medium: 0, hard: 0 };
    allQuestions.forEach(q => { c[q.difficulty]++; });
    box.innerHTML = `
      <div class="ts-item"><span class="ts-num" id="stat-count">${allQuestions.length}</span><span class="ts-label">question${allQuestions.length !== 1 ? 's' : ''}</span></div>
      ${SHOW_PROGRESS ? '<div class="ts-item"><span class="ts-num" id="stat-solved">0</span><span class="ts-label">solved</span></div>' : ''}
      ${allQuestions.length ? `<div class="ts-diff">${diffBarHTML(c)}
        <div class="ts-legend">${['easy', 'medium', 'hard'].map(d => `<span><i class="db-${d}"></i>${c[d]} ${d}</span>`).join('')}</div></div>` : ''}`;
    updateSolvedCount();
  }

  // Previous / next topic links at the bottom of the page.
  function renderPager() {
    const pager = document.getElementById('topicPager');
    if (!pager) return;
    const list = Object.values(TOPICS);
    const i = list.findIndex(t => t.key === topicKey);
    const prev = list[i - 1], next = list[i + 1];
    const link = (t, dir) => t ? `<a class="pager-link pager-${dir}" href="../${t.key}/" style="--card-accent:${t.accent}">
        <span class="pager-dir">${dir === 'prev' ? '← Previous topic' : 'Next topic →'}</span>
        <span class="pager-name"><span class="pager-ic">${t.icon}</span>${t.label}</span></a>` : '<span></span>';
    pager.innerHTML = link(prev, 'prev') + link(next, 'next');
  }

  // Adds a live count to each filter pill, e.g. "Easy 4".
  function renderPillCounts() {
    const counts = { all: allQuestions.length, easy: 0, medium: 0, hard: 0 };
    allQuestions.forEach(q => { counts[q.difficulty]++; });
    document.querySelectorAll('.pill').forEach(pill => {
      let badge = pill.querySelector('.pill-count');
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'pill-count';
        pill.appendChild(badge);
      }
      badge.textContent = counts[pill.dataset.filter] ?? '';
    });
  }

  renderSkeleton(main, 5);

  waitForLibs(() => {
    loadData().then(data => {
      const section = data[topicKey];
      allQuestions = section ? section.questions : [];
      accent = section ? section.accent : accent;
      topicLabel = section ? section.label : '';

      renderStats();
      renderPillCounts();

      // If the URL has ?q=<id>, make sure filters don't hide it, then scroll + highlight
      const params = new URLSearchParams(location.search);
      const sharedId = params.get('q');
      if (sharedId !== null) {
        currentFilter = 'all';
        currentSearch = '';
      }

      render();

      if (sharedId !== null) {
        setTimeout(() => {
          const target = main.querySelector(`.q-item[data-qid="${sharedId}"]`);
          if (target) {
            setQuestionOpen(target, true);
            target.classList.add('shared-highlight');
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => target.classList.remove('shared-highlight'), 2200);
          }
        }, 50);
      }
    }).catch(err => {
      console.error("Failed to load questions:", err);
      main.innerHTML = '<div class="empty-state">Could not load questions right now. Check back shortly.</div>';
    });
  });

  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value;
      render();
    });
  }

  document.querySelectorAll('.pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentFilter = pill.dataset.filter;
      render();
    });
  });
}

// ============================================================
// LANDING PAGE LOGIC
// Call initLandingPage() from index.html's inline script.
// ============================================================
function initLandingPage() {
  const grid = document.getElementById('topicGrid');
  if (!grid) return;
  grid.innerHTML = Object.keys(TOPICS).map(() => `
    <div class="topic-card is-skeleton" aria-hidden="true">
      <div class="sk sk-icon"></div><div class="sk sk-line" style="width:55%"></div>
      <div class="sk sk-line" style="width:80%"></div><div class="sk sk-bar"></div>
    </div>`).join('');

  waitForLibs(() => {
    loadData().then(data => {
      const total = Object.values(data).reduce((sum, s) => sum + s.questions.length, 0);
      const heroCount = document.getElementById('heroCount');
      if (heroCount) heroCount.textContent = total;
      const statLine = document.getElementById('statLine');
      const live = Object.values(TOPICS).filter(t => (data[t.key] ? data[t.key].questions.length : 0) > 0).length;
      if (statLine) statLine.textContent = `${total} questions · ${live} topics`;

      grid.innerHTML = Object.values(TOPICS).map(topic => {
        const qs = data[topic.key] ? data[topic.key].questions : [];
        const n = qs.length;
        if (!n) {
          return `<a class="topic-card is-soon" href="${topic.key}/" style="--card-accent:${topic.accent}">
            <div class="tc-head"><span class="topic-icon">${topic.icon}</span><span class="badge">Coming soon</span></div>
            <h3>${topic.label}</h3>
            <p class="tc-tag">${topic.tagline}</p>
            <div class="diffbar is-empty" aria-hidden="true"></div>
            <div class="tc-foot"><span>Problems on the way</span><span class="tc-arrow" aria-hidden="true">→</span></div>
          </a>`;
        }
        const c = { easy: 0, medium: 0, hard: 0 };
        qs.forEach(q => { c[q.difficulty]++; });
        const solvedSet = getSolvedSet(topic.key);
        const solved = qs.filter(q => solvedSet.has(q.id)).length;
        return `<a class="topic-card" href="${topic.key}/" style="--card-accent:${topic.accent}">
          <div class="tc-head"><span class="topic-icon">${topic.icon}</span><span class="tc-count">${n} question${n !== 1 ? 's' : ''}</span></div>
          <h3>${topic.label}</h3>
          <p class="tc-tag">${topic.tagline}</p>
          ${diffBarHTML(c)}
          <div class="tc-foot">
            <span>${SHOW_PROGRESS ? `<b>${solved}</b> / ${n} solved` : ''}</span>
            <span class="tc-arrow" aria-hidden="true">→</span>
          </div>
        </a>`;
      }).join('');
    }).catch(err => {
      console.error("Failed to load questions:", err);
      grid.innerHTML = '<div class="empty-state">Could not load topics right now. Check back shortly.</div>';
    });
  });
}

// A thin easy/medium/hard bar used on topic cards and the topic header.
function diffBarHTML(c) {
  const label = `${c.easy} easy, ${c.medium} medium, ${c.hard} hard`;
  return `<div class="diffbar" role="img" aria-label="${label}">${
    ['easy', 'medium', 'hard'].map(d => c[d] ? `<span class="db-${d}" style="flex:${c[d]}"></span>` : '').join('')
  }</div>`;
}

// ============================================================
// CUSTOM CURSOR GLOW
// Call initCursorGlow() from every page's inline script.
// Skips itself automatically on touch devices.
// ============================================================
function initCursorGlow() {
  // Precision cursor: a small dot that tracks the pointer exactly, plus a thin
  // ring that follows with a light easing. The ring expands and takes the page's
  // accent colour over clickable things; text fields keep the native I-beam.
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  document.body.append(ring, dot);
  root.classList.add('cursor-ready');

  let mx = -100, my = -100, rx = -100, ry = -100;
  let raf = null, shown = false;
  const place = (el, x, y) => { el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`; };

  function follow() {
    rx += (mx - rx) * 0.22;
    ry += (my - ry) * 0.22;
    place(ring, rx, ry);
    if (Math.abs(mx - rx) > 0.1 || Math.abs(my - ry) > 0.1) raf = requestAnimationFrame(follow);
    else raf = null;
  }

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    place(dot, mx, my);
    if (!shown) {
      // First move (or re-entry): snap the ring into place instead of sliding in from a corner
      rx = mx; ry = my;
      place(ring, rx, ry);
      shown = true;
      root.classList.add('cursor-visible');
    }
    if (reduceMotion) place(ring, mx, my);
    else if (!raf) raf = requestAnimationFrame(follow);
  });

  document.addEventListener('mouseout', (e) => {
    if (!e.relatedTarget) { shown = false; root.classList.remove('cursor-visible'); }
  });

  const interactive = 'a, button, .q-item, .topic-card, .pill, label, [role="button"]';
  const textual = 'input, textarea, select, [contenteditable="true"]';
  document.addEventListener('mouseover', (e) => {
    const t = e.target;
    if (!(t instanceof Element)) return;
    const isText = !!t.closest(textual);
    root.classList.toggle('cursor-text', isText);
    root.classList.toggle('cursor-hover', !isText && !!t.closest(interactive));
  });

  document.addEventListener('mousedown', () => root.classList.add('cursor-down'));
  document.addEventListener('mouseup', () => root.classList.remove('cursor-down'));
}

// ============================================================
// MOBILE NAV MENU TOGGLE
// Call initMobileMenu() from every page's inline script.
// ============================================================
function initMobileMenu() {
  const btn = document.getElementById('menuToggle');
  const links = document.querySelector('.nav-links');
  if (!btn || !links) return;
  btn.addEventListener('click', () => links.classList.toggle('open'));
}

// ============================================================
// GOOEY TOPIC MENU (top-right of every page)
// A pill that shows the current topic; clicking it drops a panel of topics
// out of the pill like a drop of liquid. The "goo" comes from an SVG filter
// (blur + alpha threshold) applied to two plain shapes, the pill and the
// panel, so they visually melt together while they are close. The text and
// links sit on a separate, unfiltered layer above, so they stay crisp.
// Built from the existing .nav-links, which remain the no-JS fallback.
// ============================================================
const GOO_ALL_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="4" width="6.5" height="6.5" rx="1.6"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.6" fill="currentColor" fill-opacity="0.25"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.6" fill="currentColor" fill-opacity="0.25"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.6"/></svg>';
const GOO_ABOUT_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5"/><circle cx="12" cy="7.8" r="1.1" fill="currentColor" stroke="none"/></svg>';

function initTopicMenu() {
  const links = document.querySelector('.nav-links');
  const controls = document.querySelector('.nav-controls');
  const logo = document.querySelector('.logo');
  if (!links || !controls) { initMobileMenu(); return; }

  const isHome = !!document.getElementById('topicGrid');
  const items = [{ label: 'All topics', href: logo ? logo.getAttribute('href') : '/', icon: GOO_ALL_ICON, accent: 'var(--goo-fg)', active: isHome }];
  links.querySelectorAll('a').forEach(a => {
    const label = a.textContent.trim();
    const t = TOPICS[label];
    items.push({
      label, href: a.getAttribute('href'),
      icon: t ? t.icon : GOO_ABOUT_ICON,
      accent: t ? t.accent : 'var(--goo-fg-dim)',
      active: a.classList.contains('active'),
      sep: !t
    });
  });
  const current = items.find(it => it.active && it.label !== 'All topics' && it.label !== 'About');
  const trigIcon = current ? current.icon : GOO_ALL_ICON;
  const trigAccent = current ? current.accent : 'var(--goo-fg)';
  const trigLabel = current ? current.label : 'Topics';

  const wrap = document.createElement('div');
  wrap.className = 'goo';
  wrap.dataset.open = 'false';
  wrap.innerHTML = `
    <svg class="goo-defs" width="0" height="0" aria-hidden="true" focusable="false">
      <filter id="ps-goo" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">
        <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur"/>
        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -12" result="goo"/>
        <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
      </filter>
    </svg>
    <div class="goo-blobs" aria-hidden="true"><div class="goo-pill"></div><div class="goo-panel"></div></div>
    <button class="goo-trigger" type="button" aria-haspopup="menu" aria-expanded="false" aria-controls="gooMenu">
      <span class="goo-ic" style="--item-accent:${trigAccent}">${trigIcon}</span>
      <span class="goo-label">${trigLabel}</span>
      <svg class="goo-chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
    </button>
    <ul class="goo-list" id="gooMenu" role="menu" aria-label="Topics">
      ${items.map((it, i) => `${it.sep ? '<li class="goo-sep" role="separator"></li>' : ''}<li role="none" style="--i:${i}"><a role="menuitem" tabindex="-1" href="${it.href}" class="goo-item${it.active ? ' active' : ''}" style="--item-accent:${it.accent}"${it.active ? ' aria-current="page"' : ''}><span class="goo-ic">${it.icon}</span><span class="goo-text">${it.label}</span>${it.active ? '<span class="goo-dot" aria-hidden="true"></span>' : ''}</a></li>`).join('')}
    </ul>`;
  const mount = document.getElementById('topicMenuMount');
  if (mount) { mount.appendChild(wrap); wrap.classList.add('goo--left'); }
  else controls.appendChild(wrap);
  document.documentElement.classList.add('has-goo');

  const trigger = wrap.querySelector('.goo-trigger');
  const list = wrap.querySelector('.goo-list');
  const menuItems = Array.from(wrap.querySelectorAll('.goo-item'));

  // The two blobs must match the real sizes of the button and the list.
  function layout() {
    const tw = trigger.offsetWidth, th = trigger.offsetHeight;
    const pw = list.offsetWidth, ph = list.offsetHeight;
    wrap.style.setProperty('--tw', tw + 'px');
    wrap.style.setProperty('--th', th + 'px');
    wrap.style.setProperty('--pw', pw + 'px');
    wrap.style.setProperty('--ph', ph + 'px');
    // Closed: shrink the panel so it hides entirely inside the pill
    // (same colour, so it's invisible), centred under the pill.
    if (pw && ph) {
      wrap.style.setProperty('--sx', Math.min(1, (tw * 0.6) / pw).toFixed(4));
      wrap.style.setProperty('--sy', Math.min(1, (th * 0.6) / ph).toFixed(4));
      wrap.style.setProperty('--ox', (wrap.classList.contains('goo--left') ? tw / 2 : pw - tw / 2) + 'px');
    }
  }
  layout();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
  window.addEventListener('resize', layout);

  let open = false;
  function setOpen(next, focusFirst) {
    if (next === open) return;
    open = next;
    if (open) layout();
    wrap.dataset.open = String(open);
    trigger.setAttribute('aria-expanded', String(open));
    menuItems.forEach(a => a.tabIndex = open ? 0 : -1);
    if (open && focusFirst) {
      const target = menuItems.find(a => a.classList.contains('active')) || menuItems[0];
      setTimeout(() => target.focus({ preventScroll: true }), 120);
    }
  }

  trigger.addEventListener('click', (e) => { e.stopPropagation(); setOpen(!open, e.detail === 0); });
  trigger.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true, true); }
  });
  list.addEventListener('keydown', (e) => {
    const i = menuItems.indexOf(document.activeElement);
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const n = menuItems.length;
      const next = e.key === 'ArrowDown' ? (i + 1) % n : (i - 1 + n) % n;
      menuItems[next].focus();
    } else if (e.key === 'Home') { e.preventDefault(); menuItems[0].focus(); }
    else if (e.key === 'End') { e.preventDefault(); menuItems[menuItems.length - 1].focus(); }
    else if (e.key === 'Tab') { setOpen(false); }
  });
  document.addEventListener('click', (e) => { if (open && !wrap.contains(e.target)) setOpen(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) { setOpen(false); trigger.focus(); }
  });
}

// ============================================================
// GRAVITY PARTICLE BURST
// A short physical burst (velocity, gravity, friction, fade) drawn on one
// shared full-screen canvas. Used when a question is marked solved.
// ============================================================
let _burstCanvas = null, _burstCtx = null, _burstParticles = [], _burstRaf = null;
function particleBurst(x, y, colors) {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const palette = (colors || []).filter(Boolean);
  if (!palette.length) palette.push('#6c8fff');
  if (!_burstCanvas) {
    _burstCanvas = document.createElement('canvas');
    _burstCanvas.className = 'burst-canvas';
    _burstCanvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(_burstCanvas);
    _burstCtx = _burstCanvas.getContext('2d');
  }
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  if (_burstCanvas.width !== Math.round(innerWidth * dpr) || _burstCanvas.height !== Math.round(innerHeight * dpr)) {
    _burstCanvas.width = Math.round(innerWidth * dpr);
    _burstCanvas.height = Math.round(innerHeight * dpr);
  }
  const now = performance.now();
  for (let i = 0; i < 34; i++) {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.35;
    const speed = 2.6 + Math.random() * 5.2;
    _burstParticles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1.2,
      size: 1.6 + Math.random() * 2.8,
      color: palette[i % palette.length],
      square: Math.random() < 0.35,
      rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3,
      born: now, life: 650 + Math.random() * 450
    });
  }
  if (!_burstRaf) _burstRaf = requestAnimationFrame(_burstTick);
}
function _burstTick(t) {
  const ctx = _burstCtx, dpr = _burstCanvas.width / innerWidth;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, _burstCanvas.width, _burstCanvas.height);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  _burstParticles = _burstParticles.filter(p => t - p.born < p.life);
  for (const p of _burstParticles) {
    p.vy += 0.22;           // gravity
    p.vx *= 0.985; p.vy *= 0.985;  // friction
    p.x += p.vx; p.y += p.vy; p.rot += p.vr;
    const k = 1 - (t - p.born) / p.life;
    ctx.globalAlpha = Math.max(0, Math.min(1, k * 1.4));
    ctx.fillStyle = p.color;
    if (p.square) {
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.fillRect(-p.size, -p.size, p.size * 2, p.size * 2);
      ctx.restore();
    } else {
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
  if (_burstParticles.length) _burstRaf = requestAnimationFrame(_burstTick);
  else { _burstRaf = null; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, _burstCanvas.width, _burstCanvas.height); }
}

// ============================================================
// SPOTLIGHT SEARCH (⌘K / Ctrl+K, "/" or the Search button)
// Searches every question across all topics and jumps straight to it.
// ============================================================
const _LATEX_WORDS = {
  alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', theta: 'θ', phi: 'φ', chi: 'χ', pi: 'π', omega: 'ω', lambda: 'λ', mu: 'μ', sigma: 'σ',
  leq: '≤', geq: '≥', le: '≤', ge: '≥', neq: '≠', ne: '≠', lt: '<', gt: '>', in: '∈', notin: '∉', infty: '∞', cdot: '·', times: '×', circ: '∘', pm: '±',
  sum: 'Σ', prod: 'Π', int: '∫', sqrt: '√', dots: '…', ldots: '…', cdots: '⋯',
  sin: 'sin', cos: 'cos', tan: 'tan', log: 'log', ln: 'ln', lim: 'lim', mathbb: ''
};
// Turn a question's LaTeX source into readable plain text for searching/snippets.
function latexToPlain(src) {
  let s = String(src || '');
  for (let i = 0; i < 3; i++) s = s.replace(/\\(?:text|textrm|mathrm|mbox|textbf|textit|operatorname)\s*\{([^{}]*)\}/g, ' $1 ');
  for (let i = 0; i < 3; i++) s = s.replace(/\\[dt]?frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}/g, ' ($1)/($2) ');
  // Superscripts / subscripts → real Unicode where possible (10^6 → 10⁶, S_{999} → S₉₉₉)
  const SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '+': '⁺', '-': '⁻', 'n': 'ⁿ', 'i': 'ⁱ' };
  const SUB = { '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉', '+': '₊', '-': '₋', 'i': 'ᵢ', 'n': 'ₙ', 'k': 'ₖ', 'r': 'ᵣ', 'x': 'ₓ' };
  const script = (map, body, mark) => {
    const t = body.replace(/\s+/g, '');
    return [...t].every(c => c in map) ? [...t].map(c => map[c]).join('') : mark + (t.length > 1 ? '(' + t + ')' : t);
  };
  s = s.replace(/\^\s*\{?\\circ\}?/g, '°')
       .replace(/\^\s*\{([^{}]*)\}/g, (m, b) => script(SUP, b, '^'))
       .replace(/\^\s*([0-9A-Za-z+-])/g, (m, b) => script(SUP, b, '^'))
       .replace(/_\s*\{([^{}]*)\}/g, (m, b) => script(SUB, b, '_'))
       .replace(/_\s*([0-9A-Za-z])/g, (m, b) => script(SUB, b, '_'));
  s = s
       .replace(/\\([a-zA-Z]+)/g, (m, w) => (w in _LATEX_WORDS ? ' ' + _LATEX_WORDS[w] + ' ' : ' '))
       .replace(/\\./g, ' ')
       .replace(/\$+/g, ' ')
       .replace(/[{}&]/g, ' ')
       .replace(/[\^_]/g, '')
       .replace(/\(\s*([^()\s]+)\s*\)\/\(\s*([^()\s]+)\s*\)/g, '$1/$2')
       .replace(/\s+([,.;:?)])/g, '$1').replace(/\(\s+/g, '(')
       .replace(/\s+([⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻ⁿⁱ₀₁₂₃₄₅₆₇₈₉₊₋ᵢₙₖᵣₓ])/g, '$1')
       .replace(/\s+/g, ' ').trim();
  return s;
}

function initSpotlightSearch() {
  const trigger = document.getElementById('searchTrigger');
  const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent);
  if (trigger) {
    const kbd = trigger.querySelector('.st-kbd');
    if (kbd) kbd.textContent = isMac ? '⌘K' : 'Ctrl K';
  }
  const logo = document.querySelector('.logo');
  const base = logo ? logo.getAttribute('href') : '/';  // "./" on the home page, "../" elsewhere

  let overlay, panel, input, list, hl, countEl, index = null, results = [], active = 0, lastFocus = null;

  function build() {
    overlay = document.createElement('div');
    overlay.className = 'spot-overlay';
    overlay.hidden = true;
    overlay.innerHTML = `
      <div class="spot" role="dialog" aria-modal="true" aria-label="Search all questions">
        <div class="spot-head">
          <svg class="spot-icon" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/></svg>
          <input class="spot-input" type="text" placeholder="Search every question…" autocomplete="off" autocorrect="off" spellcheck="false"
                 role="combobox" aria-autocomplete="list" aria-expanded="true" aria-controls="spotList" aria-label="Search questions">
          <kbd class="spot-esc">Esc</kbd>
        </div>
        <div class="spot-body">
          <div class="spot-hl" aria-hidden="true"></div>
          <ul class="spot-list" id="spotList" role="listbox" aria-label="Results"></ul>
        </div>
        <div class="spot-foot">
          <span><kbd>↑</kbd><kbd>↓</kbd> to move</span><span><kbd>↵</kbd> to open</span><span class="spot-count"></span>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    panel = overlay.querySelector('.spot');
    input = overlay.querySelector('.spot-input');
    list = overlay.querySelector('.spot-list');
    hl = overlay.querySelector('.spot-hl');
    countEl = overlay.querySelector('.spot-count');

    overlay.addEventListener('mousedown', (e) => { if (e.target === overlay) close(); });
    overlay.querySelector('.spot-esc').addEventListener('click', close);
    input.addEventListener('input', () => { active = 0; render(); });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
      else if (e.key === 'Enter') { e.preventDefault(); go(results[active]); }
      else if (e.key === 'Escape') { e.preventDefault(); close(); }
      else if (e.key === 'Tab') { e.preventDefault(); move(e.shiftKey ? -1 : 1); }
    });
    list.addEventListener('mousemove', (e) => {
      const li = e.target.closest('.spot-item');
      if (li && +li.dataset.i !== active) { active = +li.dataset.i; paintActive(); }
    });
    list.addEventListener('click', (e) => {
      const li = e.target.closest('.spot-item');
      if (li) go(results[+li.dataset.i]);
    });
  }

  function buildIndex(data) {
    const items = [];
    Object.values(TOPICS).forEach(t => {
      const section = data[t.key];
      (section ? section.questions : []).forEach(q => {
        const plain = latexToPlain(q.q);
        items.push({ type: 'q', topic: t, id: q.id, plain, difficulty: q.difficulty,
                     hay: (plain + ' ' + t.label + ' ' + q.difficulty).toLowerCase() });
      });
    });
    return items;
  }

  function topicResults(tokens) {
    return Object.values(TOPICS)
      .filter(t => !tokens.length || tokens.every(tok => t.label.toLowerCase().includes(tok)))
      .map(t => ({ type: 't', topic: t }));
  }

  function search(q) {
    const tokens = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!tokens.length) return topicResults([]);
    const topics = topicResults(tokens);
    const qs = (index || [])
      .map(it => {
        let score = 0;
        for (const tok of tokens) {
          const at = it.hay.indexOf(tok);
          if (at < 0) return null;
          score += at + (it.hay.indexOf(' ' + tok) >= 0 || it.hay.startsWith(tok) ? 0 : 40);
        }
        return { it, score };
      })
      .filter(Boolean)
      .sort((a, b) => a.score - b.score)
      .slice(0, 40)
      .map(x => x.it);
    return topics.concat(qs);
  }

  function snippet(plain, tokens) {
    const lower = plain.toLowerCase();
    let at = -1;
    for (const tok of tokens) { const i = lower.indexOf(tok); if (i >= 0 && (at < 0 || i < at)) at = i; }
    let start = Math.max(0, (at < 0 ? 0 : at) - 32);
    let text = plain.slice(start, start + 120);
    if (start > 0) text = '…' + text.replace(/^\S*\s/, '');
    if (start + 120 < plain.length) text = text.replace(/\s\S*$/, '') + '…';
    if (!tokens.length) return _escHtml(text);
    const re = new RegExp('(' + tokens.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')', 'gi');
    return text.split(re).map((part, i) => i % 2 ? `<mark>${_escHtml(part)}</mark>` : _escHtml(part)).join('');
  }

  function render() {
    const q = input.value.trim();
    const tokens = q.toLowerCase().split(/\s+/).filter(Boolean);
    results = search(q);
    let html = '', lastType = null;
    results.forEach((r, i) => {
      if (r.type !== lastType) {
        html += `<li class="spot-group" role="presentation">${r.type === 't' ? (q ? 'Topics' : 'Jump to a topic') : 'Questions'}</li>`;
        lastType = r.type;
      }
      const t = r.topic;
      if (r.type === 't') {
        html += `<li class="spot-item spot-topic" role="option" id="spot-${i}" data-i="${i}" style="--item-accent:${t.accent}">
          <span class="spot-ic">${t.icon}</span><span class="spot-main"><span class="spot-title">${t.label}</span><span class="spot-sub">${t.tagline}</span></span>
          <span class="spot-go" aria-hidden="true">↵</span></li>`;
      } else {
        html += `<li class="spot-item" role="option" id="spot-${i}" data-i="${i}" style="--item-accent:${t.accent}">
          <span class="spot-ic">${t.icon}</span>
          <span class="spot-main"><span class="spot-snip">${snippet(r.plain, tokens)}</span>
          <span class="spot-meta">${t.label} · ${difficultyIndicator(r.difficulty)}</span></span>
          <span class="spot-go" aria-hidden="true">↵</span></li>`;
      }
    });
    if (!results.length) {
      html = `<li class="spot-empty" role="presentation">${index ? 'No questions match “' + _escHtml(q) + '”.' : 'Loading questions…'}</li>`;
    }
    list.innerHTML = html;
    const nq = results.filter(r => r.type === 'q').length;
    countEl.textContent = q ? `${nq} question${nq === 1 ? '' : 's'}` : (index ? `${index.length} questions in total` : '');
    active = Math.min(active, Math.max(0, results.length - 1));
    paintActive(true);
  }

  function paintActive(instant) {
    const items = list.querySelectorAll('.spot-item');
    items.forEach(el => el.classList.toggle('is-active', +el.dataset.i === active));
    const el = items[active];
    if (!el) { hl.style.opacity = '0'; input.removeAttribute('aria-activedescendant'); return; }
    input.setAttribute('aria-activedescendant', el.id);
    if (instant) hl.classList.add('no-anim');
    hl.style.opacity = '1';
    hl.style.transform = `translateY(${el.offsetTop}px)`;
    hl.style.height = el.offsetHeight + 'px';
    if (instant) requestAnimationFrame(() => hl.classList.remove('no-anim'));
    const body = list.parentElement;
    if (el.offsetTop < body.scrollTop) body.scrollTop = el.offsetTop - 6;
    else if (el.offsetTop + el.offsetHeight > body.scrollTop + body.clientHeight) body.scrollTop = el.offsetTop + el.offsetHeight - body.clientHeight + 6;
  }

  function move(d) {
    if (!results.length) return;
    active = (active + d + results.length) % results.length;
    paintActive();
  }

  function go(r) {
    if (!r) return;
    const url = r.type === 't' ? `${base}${r.topic.key}/` : `${base}${r.topic.key}/?q=${r.id}`;
    close();
    window.location.href = url;
  }

  function open() {
    if (!overlay) build();
    if (!overlay.hidden) return;
    lastFocus = document.activeElement;
    overlay.hidden = false;
    document.documentElement.classList.add('spot-open');
    requestAnimationFrame(() => overlay.classList.add('is-open'));
    input.value = '';
    active = 0;
    render();
    setTimeout(() => input.focus({ preventScroll: true }), 10);
    if (!index) {
      waitForLibs(() => loadData().then(data => {
        index = buildIndex(data);
        if (!overlay.hidden) render();
      }).catch(() => { index = []; if (!overlay.hidden) render(); }));
    }
  }

  function close() {
    if (!overlay || overlay.hidden) return;
    overlay.classList.remove('is-open');
    document.documentElement.classList.remove('spot-open');
    setTimeout(() => { overlay.hidden = true; }, 180);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  if (trigger) trigger.addEventListener('click', open);
  const heroSearch = document.getElementById('heroSearch');
  if (heroSearch) {
    heroSearch.addEventListener('click', open);
    const hk = heroSearch.querySelector('.hs-kbd');
    if (hk) hk.textContent = isMac ? '⌘K' : 'Ctrl K';
  }
  document.addEventListener('keydown', (e) => {
    const k = e.key.toLowerCase();
    if ((e.metaKey || e.ctrlKey) && k === 'k') { e.preventDefault(); (overlay && !overlay.hidden) ? close() : open(); return; }
    const typing = /^(input|textarea|select)$/i.test((e.target.tagName || '')) || e.target.isContentEditable;
    if (e.key === '/' && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) { e.preventDefault(); open(); }
  });
}

// ============================================================
// LIGHT/DARK THEME TOGGLE
// Call initThemeToggle() from every page's inline script.
// Preference is saved in localStorage and applied instantly
// on future visits via the anti-flash script in <head>.
// ============================================================
function initThemeToggle() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;

  // Keep the mobile browser's address-bar colour in step with the theme
  function syncThemeColor() {
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'theme-color';
      document.head.appendChild(meta);
    }
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    meta.content = isLight ? '#f6f7f9' : '#0b0b0e';
  }
  syncThemeColor();

  // Liquid switch: role="switch", "on" = dark mode. Enable the slide
  // transition only after first paint so it doesn't animate on page load.
  const syncSwitch = () => {
    const dark = document.documentElement.getAttribute('data-theme') !== 'light';
    btn.setAttribute('aria-checked', String(dark));
  };
  syncSwitch();
  requestAnimationFrame(() => requestAnimationFrame(() => btn.classList.add('lt-ready')));
  let moveTimer;

  btn.addEventListener('click', () => {
    btn.classList.remove('lt-moving'); void btn.offsetWidth; btn.classList.add('lt-moving');
    clearTimeout(moveTimer);
    moveTimer = setTimeout(() => btn.classList.remove('lt-moving'), 650);
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    try {
      if (isLight) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('problemset_theme', 'dark');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('problemset_theme', 'light');
      }
    } catch (e) {}
    syncThemeColor();
    syncSwitch();
  });
}

// ============================================================
// TAB-AWAY TITLE MESSAGE
// Changes the browser tab title when the user switches away,
// picking a random message each time, and restores the
// original title when they come back.
// Call initTabAwayMessage(["msg1", "msg2", "msg3"]) from every page.
// ============================================================
function initTabAwayMessage(messages) {
  const originalTitle = document.title;
  const list = (messages && messages.length) ? messages : ["Come back! 👋"];

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      const pick = list[Math.floor(Math.random() * list.length)];
      document.title = pick;
    } else {
      document.title = originalTitle;
    }
  });
}

// ============================================================
// DONATION / SUPPORT CARD
// Controlled by the SHOW_DONATION flag at the top of this file.
// Call initSupportCard() from the homepage's inline script.
// ============================================================
function initSupportCard() {
  const chaiBtn = document.getElementById('chaiBtn');
  const overlay = document.getElementById('supportModalOverlay');
  if (!chaiBtn || !overlay) return;

  if (!SHOW_DONATION) {
    chaiBtn.style.display = 'none';
    return;
  }

  const closeBtn = document.getElementById('supportCloseBtn');

  const openModal = () => overlay.classList.add('open');
  const closeModal = () => overlay.classList.remove('open');

  chaiBtn.addEventListener('click', openModal);
  document.querySelectorAll('[data-open-support]').forEach(el => el.addEventListener('click', openModal));
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal(); // click on the dark backdrop, not the card itself
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  const copyBtn = document.getElementById('copyUpiBtn');
  const upiText = document.getElementById('upiIdText');
  if (copyBtn && upiText) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(upiText.textContent.trim());
        const original = copyBtn.innerHTML;
        copyBtn.innerHTML = 'Copied!';
        setTimeout(() => { copyBtn.innerHTML = original; }, 1500);
      } catch (e) {
        console.warn('Clipboard copy failed:', e);
      }
    });
  }
}

// ============================================================
// ALT+MATH EASTER EGG
// Toggle a fancy serif KaTeX rendering mode.
// Hold Alt and press M to activate/deactivate.
// ============================================================
function initMathEasterEgg() {
  let active = false;

  // Inject a style tag we'll toggle on/off
  const styleEl = document.createElement('style');
  styleEl.id = 'math-serif-override';
  styleEl.textContent = `
    .katex { font-family: 'Computer Modern', 'Latin Modern Math', 'STIX Two Math', Georgia, serif !important; }
    .katex .mathrm, .katex .mathit { font-family: 'Computer Modern', Georgia, serif !important; }
    .q-text, .q-answer-inner { font-family: Georgia, 'Times New Roman', serif !important; font-size: 15.5px !important; }
  `;
  document.head.appendChild(styleEl);
  styleEl.disabled = true;

  // Toast notification
  const toast = document.createElement('div');
  toast.id = 'math-toast';
  toast.style.cssText = `
    position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%) translateY(12px);
    background: var(--bg-elevated); border: 1px solid var(--border);
    color: var(--text); font-family: var(--mono); font-size: 12px;
    padding: 10px 18px; border-radius: 8px; opacity: 0;
    transition: opacity 0.2s ease, transform 0.2s ease;
    pointer-events: none; z-index: 9998; white-space: nowrap;
  `;
  document.body.appendChild(toast);

  let toastTimer;
  function showToast(msg) {
    clearTimeout(toastTimer);
    toast.textContent = msg;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    toastTimer = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(12px)';
    }, 2200);
  }

  document.addEventListener('keydown', (e) => {
    if (e.shiftKey && e.altKey && e.code === 'KeyM') {
      e.preventDefault();
      active = !active;
      styleEl.disabled = !active;
      showToast(active ? '✦ Serif mode on — math as it should look' : '✦ Serif mode off');
    }
  });
}

// ============================================================
// CONTRIBUTE CTA BANNER
// Shows a permanent, subtle "Suggest a question" banner at the
// top of every page. Controlled by the SHOW_CONTRIBUTE flag.
// ============================================================
const SHOW_CONTRIBUTE = true; // set to false to hide the banner globally
const CONTRIBUTE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLScaugl3z372IpP0eLkylh8d1bLmPWjiJDyuCIFc8G3bw4Rspw/viewform";
function initContributeBanner() {
  // The top "Suggest a question" strip was removed in the redesign; the link
  // now lives in the footer. Kept as a no-op so older pages don't break.
}
