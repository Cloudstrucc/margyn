// ─── Theme toggle ─────────────────────────────────────────
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');
const html        = document.documentElement;

// Track theme in a module-level var — never re-read from DOM attribute
let currentTheme = localStorage.getItem('margyn-theme') || 'dark';

function applyTheme(theme) {
  currentTheme = theme;
  html.setAttribute('data-theme', theme);
  if (themeIcon) {
    themeIcon.className = theme === 'light' ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
  }
  // Update toggle button tooltip
  if (themeToggle) themeToggle.title = theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode';
  localStorage.setItem('margyn-theme', theme);
}

// Apply on load (no-flash script already set the attribute; this syncs the icon)
applyTheme(currentTheme);

themeToggle?.addEventListener('click', () => {
  applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

// ─── Sidebar toggle ──────────────────────────────────────
const sidebar = document.getElementById('sidebar');
const openBtn = document.getElementById('sidebarOpen');
const closeBtn = document.getElementById('sidebarClose');
const overlay = document.getElementById('sidebarOverlay');

function openSidebar() {
  sidebar?.classList.add('show');
  overlay?.classList.add('show');
}

function closeSidebar() {
  sidebar?.classList.remove('show');
  overlay?.classList.remove('show');
}

openBtn?.addEventListener('click', openSidebar);
closeBtn?.addEventListener('click', closeSidebar);
overlay?.addEventListener('click', closeSidebar);

// ─── Refresh button spin ──────────────────────────────────
const refreshBtn = document.getElementById('refreshBtn');
refreshBtn?.addEventListener('click', () => {
  refreshBtn.style.animation = 'spin 0.8s linear';
  setTimeout(() => { refreshBtn.style.animation = ''; }, 800);
});

// ─── Tag filter on products page ─────────────────────────
document.querySelectorAll('.tag-filter').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tag-filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const tag = btn.dataset.tag;
    document.querySelectorAll('.product-row').forEach(row => {
      if (tag === 'all') {
        row.style.display = '';
      } else {
        const tags = row.dataset.tags || '';
        row.style.display = tags.includes(tag) ? '' : 'none';
      }
    });
  });
});

// ─── Rank numbers helper ──────────────────────────────────
document.querySelectorAll('.rank-num').forEach((el, i) => {
  el.textContent = (i + 1).toString().padStart(2, '0');
});

// ─── Search bar ───────────────────────────────────────────
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    document.querySelector('.search-input')?.focus();
  }
});

// ─── Chart tab switch ─────────────────────────────────────
document.querySelectorAll('.chart-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.chart-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const type = tab.dataset.chart;
    if (window.updateSalesChart) window.updateSalesChart(type);
  });
});

// ─── Smooth entry animations ──────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.05 });

document.querySelectorAll('.stat-card, .chart-card, .data-card, .feature-card, .step-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(12px)';
  el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
  observer.observe(el);
});

// ─── Spin keyframe ───────────────────────────────────────
const style = document.createElement('style');
style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(style);

// ─── Theme Toggle ─────────────────────────────────────────
(function initTheme() {
  const html   = document.documentElement;
  const btn    = document.getElementById('themeToggle');
  if (!btn) return;

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    html.setAttribute('data-bs-theme', theme);
    localStorage.setItem('margyn-theme', theme);
  }

  btn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme') || 'dark';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
})();
