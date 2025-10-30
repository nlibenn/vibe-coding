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
  initTutor();
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

// Tutor chat
function initTutor() {
  const log = document.getElementById('chatLog');
  const form = document.getElementById('chatForm');
  const input = document.getElementById('chatInput');
  if (!log || !form || !input) return;

  function addMsg(role, text) {
    const div = document.createElement('div');
    div.className = `chat-msg ${role}`;
    div.textContent = text;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = (input.value || '').trim();
    if (!msg) return;
    addMsg('user', msg);
    input.value = '';
    addMsg('ai', 'Thinking…');

    try {
      const reply = await getTutorReply(msg);
      log.lastChild.textContent = reply;
    } catch (_) {
      log.lastChild.textContent = 'Sorry, I could not respond right now.';
    }
  });
}

async function getTutorReply(prompt) {
  // If you deploy a backend, change this to your endpoint
  // Example: const res = await fetch('https://your-render-service.onrender.com/api/tutor', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ prompt }) });
  // For now, provide a local, on-device strategy tip
  return heuristicTutor(prompt);
}

function heuristicTutor(prompt) {
  const p = prompt.toLowerCase();
  if (p.includes('reading')) return 'Reading: read questions first; hunt for keywords and line references. Choose the answer you can prove with text.';
  if (p.includes('writing')) return 'Writing: check Subject–Verb agreement, pronoun clarity, modifier placement, and transitions. Prefer concise, grammatically sound choices.';
  if (p.includes('math') || p.includes('algebra')) return 'Math: plug in easy numbers and backsolve from choices. Translate words to algebra and check units.';
  if (p.includes('timing') || p.includes('time')) return 'Timing: 2-pass method—first sweep quick points, star tough ones, return later. Keep momentum high.';
  return 'General SAT tip: eliminate wrong answers aggressively and select the choice you can justify with explicit evidence or math.';
}

