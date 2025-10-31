import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config.js";

function getStoredTheme() {
  try { return localStorage.getItem("theme"); } catch (_) { return null; }
}

function storeTheme(theme) {
  try { localStorage.setItem("theme", theme); } catch (_) {}
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

function detectPreferred() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches
    ? 'light'
    : 'dark';
}

function updateToggleLabel(theme) {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  btn.textContent = theme === 'dark' ? 'Lights On' : 'Lights Off';
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || detectPreferred();
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  storeTheme(next);
  updateToggleLabel(next);
}

function updateGreeting() {
  const el = document.getElementById('greeting');
  if (!el) return;
  el.textContent = `Crush the SAT — let\'s get to elite scores 🚀`;
}

function updateSupabaseStatus(text) {
  const el = document.getElementById('supabaseStatus');
  if (el) el.textContent = `Supabase: ${text}`;
}

function isSupabaseConfigured() {
  const hasUrl = typeof SUPABASE_URL === 'string' && SUPABASE_URL.startsWith('https://');
  const hasKey = typeof SUPABASE_ANON_KEY === 'string' && SUPABASE_ANON_KEY.length > 20;
  return hasUrl && hasKey;
}

let supabase = null;
if (isSupabaseConfigured()) {
  try { supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY); } catch (_) {}
}

document.addEventListener('DOMContentLoaded', function () {
  const saved = getStoredTheme();
  const initial = saved || detectPreferred();
  applyTheme(initial);
  updateToggleLabel(initial);
  updateGreeting();

  const toggle = document.getElementById('themeToggle');
  if (toggle) toggle.addEventListener('click', toggleTheme);

  updateSupabaseStatus(isSupabaseConfigured() ? 'configured' : 'not configured');

  initTabs();
  initDrills();
  initFlashcards();
});

// Tabs
function initTabs() {
  const tabs = Array.from(document.querySelectorAll('.tab'));
  const panels = {
    lessons: document.getElementById('tab-lessons'),
    drills: document.getElementById('tab-drills'),
    strategies: document.getElementById('tab-strategies'),
    tutor: document.getElementById('tab-tutor'),
  };
  function activate(name) {
    tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === name));
    Object.entries(panels).forEach(([key, el]) => el && el.classList.toggle('active', key === name));
  }
  tabs.forEach(t => t.addEventListener('click', () => activate(t.dataset.tab)));
  activate('lessons');
}

// Drills (sample questions)
const sampleDrills = [
  {
    id: 'rw-evidence',
    question: 'In the context of SAT Reading, which choice is best supported by textual evidence?',
    choices: ['The most interesting answer', 'The longest answer', 'The answer with direct line references', 'The answer that adds new ideas'],
    answerIndex: 2,
    explain: 'SAT Reading rewards answers directly supported by the passage. Look for line references and quotes.'
  },
  {
    id: 'w-grammar',
    question: 'Which rule most often fixes Writing section errors?',
    choices: ['Dangling commas', 'Subject–Verb agreement', 'Hyphen usage', 'Em dashes everywhere'],
    answerIndex: 1,
    explain: 'Subject–Verb agreement is a top-frequency rule. Check number agreement and embedded prepositional phrases.'
  },
  {
    id: 'm-plug',
    question: 'For algebra with variables in answers, a useful strategy is to…',
    choices: ['Memorize all formulas', 'Plug in convenient numbers', 'Skip immediately', 'Draw elaborate graphs'],
    answerIndex: 1,
    explain: 'Plug in easy numbers or backsolve from answer choices to simplify reasoning.'
  }
];

function initDrills() {
  const qEl = document.getElementById('drillQuestion');
  const choicesEl = document.getElementById('drillChoices');
  const feedbackEl = document.getElementById('drillFeedback');
  const nextBtn = document.getElementById('drillNext');
  const scoreEl = document.getElementById('drillScore');
  if (!qEl || !choicesEl || !nextBtn) return;

  let index = 0;
  let score = 0;

  function renderQuestion() {
    const item = sampleDrills[index % sampleDrills.length];
    qEl.textContent = item.question;
    feedbackEl.textContent = '';
    choicesEl.innerHTML = '';
    item.choices.forEach((text, i) => {
      const btn = document.createElement('button');
      btn.className = 'button choice-btn';
      btn.type = 'button';
      btn.textContent = text;
      btn.addEventListener('click', () => {
        const correct = i === item.answerIndex;
        feedbackEl.textContent = correct ? 'Correct ✓ ' + item.explain : 'Not quite ✗ ' + item.explain;
        if (correct) score += 1;
        scoreEl.textContent = `Score: ${score}/${index + 1}`;
      });
      choicesEl.appendChild(btn);
    });
    scoreEl.textContent = `Score: ${score}/${index}`;
  }

  renderQuestion();
  nextBtn.addEventListener('click', () => {
    index += 1;
    renderQuestion();
  });
}

// Flashcards: SAT Math concepts
const mathFlashcards = [
  {
    tag: 'Algebra • Linear Equations',
    front: 'Solve 2x + 3 = 11. What is x?',
    back: '2x = 8 → x = 4'
  },
  {
    tag: 'Algebra • Systems',
    front: 'Solve: x + y = 10 and x − y = 2',
    back: 'Add: 2x = 12 → x = 6. Then y = 4'
  },
  {
    tag: 'Functions • Interpretation',
    front: 'f(x) = 3x + 5. What does 5 represent in context?',
    back: 'The initial value (y-intercept) when x = 0'
  },
  {
    tag: 'Geometry • Similarity',
    front: 'If triangles are similar with scale factor k, how do areas scale?',
    back: 'Areas scale by k²'
  },
  {
    tag: 'Data • Percent Change',
    front: 'Increase 50 by 20%, then decrease result by 20%. Final vs 50?',
    back: '50 → 60 → 48. Not symmetric; final is 48'
  }
];

function initFlashcards() {
  const tagEl = document.getElementById('flashcardTag');
  const frontEl = document.getElementById('flashcardFront');
  const backEl = document.getElementById('flashcardBack');
  const prevBtn = document.getElementById('flashPrev');
  const nextBtn = document.getElementById('flashNext');
  const flipBtn = document.getElementById('flashFlip');
  const shuffleBtn = document.getElementById('flashShuffle');
  const progressEl = document.getElementById('flashProgress');
  if (!tagEl || !frontEl || !backEl) return;

  let index = 0;
  let order = [...mathFlashcards.keys()];

  function render() {
    const card = mathFlashcards[order[index]];
    tagEl.textContent = card.tag;
    frontEl.textContent = card.front;
    backEl.textContent = card.back;
    backEl.hidden = true;
    flipBtn.textContent = 'Show Answer';
    progressEl.textContent = `Card ${index + 1} of ${order.length}`;
  }

  function next() { index = (index + 1) % order.length; render(); }
  function prev() { index = (index - 1 + order.length) % order.length; render(); }
  function flip() {
    const hidden = backEl.hidden;
    backEl.hidden = !hidden;
    flipBtn.textContent = hidden ? 'Hide Answer' : 'Show Answer';
  }
  function shuffle() {
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    index = 0; render();
  }

  if (nextBtn) nextBtn.addEventListener('click', next);
  if (prevBtn) prevBtn.addEventListener('click', prev);
  if (flipBtn) flipBtn.addEventListener('click', flip);
  if (shuffleBtn) shuffleBtn.addEventListener('click', shuffle);

  render();
}

