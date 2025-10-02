(function () {
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

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || detectPreferred();
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    storeTheme(next);
    updateToggleLabel(next);
  }

  function updateToggleLabel(theme) {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    btn.textContent = theme === 'dark' ? 'Lights On' : 'Lights Off';
  }

  function updateGreeting() {
    const el = document.getElementById('greeting');
    if (!el) return;
    const hour = new Date().getHours();
    const vibe = ['✨', '🎧', '🚀', '🌈'][hour % 4];
    const text = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    el.textContent = `${text} — let\'s code with good vibes ${vibe}`;
  }

  document.addEventListener('DOMContentLoaded', function () {
    const saved = getStoredTheme();
    const initial = saved || detectPreferred();
    applyTheme(initial);
    updateToggleLabel(initial);
    updateGreeting();

    const toggle = document.getElementById('themeToggle');
    if (toggle) toggle.addEventListener('click', toggleTheme);
  });
})();


