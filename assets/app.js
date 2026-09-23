// ============================================================
// CONFIG — edit these to change data source or topics
// ============================================================
const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRFvuUAIJ9sPxu4uKkmBmP3GMlyRKhnYbp_L6wu7FtvI9R5SQiPfQz-kOUMTCPxhD6nXdyvER9mfTsa/pub?gid=1277823553&single=true&output=csv";
const SHOW_IMAGES = false; // set to true to bring images back
const SHOW_DONATION = true; // set to false to hide the "Support this project" card

const TOPICS = {
  "Number Theory": {
    key: "number-theory",
    label: "Number Theory",
    tagline: "Primes, divisibility, modular arithmetic.",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M9 12h6M12 9v6"/></svg>',
    accent: "var(--accent-nt)",
    accentBg: "rgba(108,143,255,0.1)"
  },
  "Trigonometry": {
    key: "trigonometry",
    label: "Trigonometry",
    tagline: "Identities, equations, angle relationships.",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 18c3-9 6-9 9 0s6 9 9 0"/></svg>',
    accent: "var(--accent-trig)",
    accentBg: "rgba(255,138,92,0.1)"
  },
  "Calculus": {
    key: "calculus",
    label: "Calculus",
    tagline: "Limits, derivatives, integrals.",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17 4.5c-1.5 0-2.5 1-2.8 2.5l-2.4 12c-.3 1.5-1.3 2.5-2.8 2.5"/><path d="M8 4.5h1.5M16.5 19.5H18"/></svg>',
    accent: "var(--accent-calc)",
    accentBg: "rgba(126,224,140,0.1)"
  },
  "Combinatorics": {
    key: "combinatorics",
    label: "Combinatorics",
    tagline: "Counting, permutations, graph problems.",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8 7l8 0M6 8.5v7M18 8.5v7M8 17l8 0"/></svg>',
    accent: "var(--accent-comb)",
    accentBg: "rgba(214,138,255,0.1)"
  },
  "Algebra": {
    key: "algebra",
    label: "Algebra",
    tagline: "Equations, inequalities, functions.",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h5l-4 10h5M14 7h6M14 12h6M14 17h6"/></svg>',
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

async function loadData() {
  try {
    const csvText = await fetchCsvWithRetry();
    const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
    const data = buildDataFromRows(parsed.data);
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch (e) {}
    return data;
  } catch (err) {
    // Live fetch failed even after retries — fall back to last known-good data if we have it
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      console.warn("Live fetch failed, showing cached data:", err);
      return JSON.parse(cached);
    }
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

async function copyQuestionAsImage(item, qEl, accent, topicLabel, btn) {  const original = btn.innerHTML;
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
    // Clone the already-rendered question (KaTeX spans included) so the image
    // matches exactly what's on screen.
    if (qTextNode) card.querySelector('.share-card-q').appendChild(qTextNode.cloneNode(true));
    document.body.appendChild(card);

    // Make sure fonts (Inter + KaTeX) are ready before measuring/snapshotting.
    if (document.fonts && document.fonts.ready) { try { await document.fonts.ready; } catch (e) {} }
    await new Promise(r => setTimeout(r, 60));

    // KaTeX renders wide expressions (nested radicals, stacked fractions, big
    // products) as a single non-breaking block. If that block is wider than
    // the card, it simply overflows past the edge and gets clipped in the
    // snapshot. Shrink it down until it actually fits, rather than letting it
    // clip.
    //
    // NOTE: this used to shrink via CSS `zoom`. html2canvas has never reliably
    // supported `zoom` (open upstream for years) — the browser reflows the
    // real DOM at the zoomed size, but html2canvas's clone-and-paint step
    // doesn't consistently apply that same zoom, so KaTeX's glyphs, fraction
    // bars, radicals and sub/superscripts end up painted at positions that no
    // longer match their shrunk container — i.e. overlapping/garbled math.
    // Font-size doesn't have this problem: KaTeX sizes everything internally
    // in em units, so shrinking font-size causes a genuine layout reflow that
    // both the foreignObject and manual html2canvas paths render correctly.
    const qBox = card.querySelector('.share-card-q');
    const available = qBox.clientWidth;
    const widest = Math.max(0, ...Array.from(qBox.querySelectorAll('.katex, .katex-display')).map(el => el.scrollWidth));
    if (widest > available && available > 0) {
      const ratio = (available / widest) * 0.97; // small safety margin against rounding
      const baseFontSize = parseFloat(getComputedStyle(qBox).fontSize) || 22;
      qBox.style.fontSize = (baseFontSize * ratio) + 'px';
    }

    const bg = getComputedStyle(document.body).backgroundColor || '#0a0a0b';
    const baseOpts = {
      backgroundColor: bg,
      scale: Math.min(3, Math.max(2, window.devicePixelRatio || 2)),
      logging: false,
      useCORS: true
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
function renderQuestionItem(item, index, accent, topicLabel) {
  const qEl = document.createElement('div');
  qEl.className = 'q-item';
  qEl.style.setProperty('--glow', accent);
  qEl.dataset.qid = item.id;
  qEl.innerHTML = `
    <div class="q-row">
      <span class="q-index">${String(index + 1).padStart(2, '0')}</span>
      <div class="q-body">
        <div class="q-text">${item.q}</div>
        ${(SHOW_IMAGES && item.img) ? (
          item.solutionLink
            ? `<img class="q-image q-image-linked" src="${item.img}" alt="question diagram" onerror="this.style.display='none'" onclick="event.stopPropagation(); window.open('${item.solutionLink}', '_blank')">`
            : `<img class="q-image" src="${item.img}" alt="question diagram" onerror="this.style.display='none'">`
        ) : ''}
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
        </div>
        <div class="q-answer"><div class="q-answer-inner"><span class="label">SOLUTION</span>${item.a}</div></div>
      </div>
      <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
    </div>
  `;

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
  qEl.addEventListener('click', () => qEl.classList.toggle('open'));
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

// ============================================================
// SINGLE-TOPIC PAGE LOGIC
// Call initTopicPage("trigonometry") from that page's inline script.
// ============================================================
function initTopicPage(topicKey) {
  const main = document.getElementById('main');
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

    if (filtered.length === 0) {
      main.innerHTML = '<div class="empty-state">No questions match your search.</div>';
      return;
    }

    const list = document.createElement('div');
    list.className = 'question-list';
    filtered.forEach((item, i) => list.appendChild(renderQuestionItem(item, i, accent, topicLabel)));
    main.appendChild(list);
    renderMath(main);
  }

  renderSkeleton(main, 5);

  waitForLibs(() => {
    loadData().then(data => {
      const section = data[topicKey];
      allQuestions = section ? section.questions : [];
      accent = section ? section.accent : accent;
      topicLabel = section ? section.label : '';

      const countEl = document.getElementById('stat-count');
      if (countEl) countEl.textContent = allQuestions.length;

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
            target.classList.add('open', 'shared-highlight');
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

  grid.innerHTML = Object.keys(TOPICS).map(() => `
    <div class="skeleton-card">
      <div class="skeleton-circle"></div>
      <div class="skeleton-line"></div>
      <div class="skeleton-line"></div>
    </div>
  `).join('');

  waitForLibs(() => {
    loadData().then(data => {
      const total = Object.values(data).reduce((sum, s) => sum + s.questions.length, 0);
      const totalEl = document.getElementById('stat-total');
      const topicsEl = document.getElementById('stat-topics');
      if (totalEl) totalEl.textContent = total;
      if (topicsEl) topicsEl.textContent = Object.keys(TOPICS).length;

      grid.innerHTML = '';
      Object.values(TOPICS).forEach(topic => {
        const count = data[topic.key] ? data[topic.key].questions.length : 0;
        const card = document.createElement('a');
        card.href = `${topic.key}/`;
        card.className = 'topic-card';
        card.style.setProperty('--card-accent', topic.accent);
        card.innerHTML = `
          <div class="topic-icon" style="background:${topic.accentBg}; color:${topic.accent}">${topic.icon}</div>
          <h3>${topic.label}</h3>
          <p>${count} question${count !== 1 ? 's' : ''}</p>
        `;
        grid.appendChild(card);
      });
    }).catch(err => {
      console.error("Failed to load questions:", err);
      grid.innerHTML = '<div class="empty-state">Could not load topics right now. Check back shortly.</div>';
    });
  });
}

// ============================================================
// CUSTOM CURSOR GLOW
// Call initCursorGlow() from every page's inline script.
// Skips itself automatically on touch devices.
// ============================================================
function initCursorGlow() {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const dot = document.createElement('div');
  dot.className = 'cursor-glow';
  document.body.appendChild(dot);
  document.documentElement.classList.add('cursor-ready');

  let x = 0, y = 0;
  document.addEventListener('mousemove', (e) => {
    x = e.clientX;
    y = e.clientY;
    dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    dot.classList.add('visible');
  });

  document.addEventListener('mouseleave', () => dot.classList.remove('visible'));
  document.addEventListener('mouseenter', () => dot.classList.add('visible'));

  const hoverTargets = 'a, button, .q-item, .topic-card, .pill, input';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) dot.classList.add('cursor-hover');
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) dot.classList.remove('cursor-hover');
  });
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
// LIGHT/DARK THEME TOGGLE
// Call initThemeToggle() from every page's inline script.
// Preference is saved in localStorage and applied instantly
// on future visits via the anti-flash script in <head>.
// ============================================================
function initThemeToggle() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    if (isLight) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('problemset_theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('problemset_theme', 'light');
    }
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
// Shows a subtle dismissable "Suggest a question" banner.
// Controlled by SHOW_CONTRIBUTE flag. Dismissed state is
// saved in localStorage so it only shows once per visitor.
// ============================================================
const SHOW_CONTRIBUTE = true; // set to false to hide the banner globally
const CONTRIBUTE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLScaugl3z372IpP0eLkylh8d1bLmPWjiJDyuCIFc8G3bw4Rspw/viewform";
function initContributeBanner() {
  if (!SHOW_CONTRIBUTE) return;

  const banner = document.createElement('div');
  banner.id = 'contributeBanner';
  banner.innerHTML = `
    <span class="contribute-text">
      💡 Know a great problem?
      <a href="${CONTRIBUTE_FORM_URL}" target="_blank" rel="noopener" class="contribute-link">Suggest a question →</a>
    </span>
  `;
  document.body.prepend(banner);
}
