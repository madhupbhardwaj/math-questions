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
// SHARED QUESTION RENDERING (used by every topic page)
// ============================================================
function renderQuestionItem(item, index, accent) {
  const qEl = document.createElement('div');
  qEl.className = 'q-item';
  qEl.style.setProperty('--glow', accent);
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
        <div class="q-meta"><span class="tag tag-${item.difficulty}">${item.difficulty}</span></div>
        <div class="q-answer"><div class="q-answer-inner"><span class="label">SOLUTION</span>${item.a}</div></div>
      </div>
      <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
      ${item.solutionLink ? `<svg class="link-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14 21 3"/></svg>` : ''}
    </div>
  `;
  qEl.addEventListener('click', () => {
    if (item.solutionLink) {
      window.open(item.solutionLink, '_blank');
    } else {
      qEl.classList.toggle('open');
    }
  });
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
    filtered.forEach((item, i) => list.appendChild(renderQuestionItem(item, i, accent)));
    main.appendChild(list);
    renderMath(main);
  }

  renderSkeleton(main, 5);

  waitForLibs(() => {
    loadData().then(data => {
      const section = data[topicKey];
      allQuestions = section ? section.questions : [];
      accent = section ? section.accent : accent;

      const countEl = document.getElementById('stat-count');
      if (countEl) countEl.textContent = allQuestions.length;

      render();
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
  const card = document.getElementById('supportCard');
  if (!card) return;

  if (!SHOW_DONATION) {
    card.style.display = 'none';
    return;
  }

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
