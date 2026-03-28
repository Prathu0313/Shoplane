/* ═══ base.js — shared across all pages ════════════════════════════════════ */

/* ── Page Loader ── */
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('page-loader')?.classList.add('hidden'), 600);
});

/* ── Scroll effects ── */
const _nav = document.getElementById('nav');
const _backTop = document.getElementById('back-top');
const _progressBar = document.getElementById('scroll-progress-bar');

window.addEventListener('scroll', () => {
  const s = window.scrollY;
  _nav?.classList.toggle('scrolled', s > 20);
  _backTop?.classList.toggle('visible', s > 300);
  if (_progressBar) {
    const pct = (s / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    _progressBar.style.width = pct + '%';
  }
}, { passive: true });

/* ── Mobile Nav ── */
function toggleMobileNav() { document.getElementById('mobile-nav')?.classList.toggle('open'); }
function closeMobileNav() { document.getElementById('mobile-nav')?.classList.remove('open'); }

/* ── Cart badge (reads from localStorage) ── */
function refreshCartCount() {
  const cart = JSON.parse(localStorage.getItem('shoplane-cart') || '[]');
  const total = cart.reduce((s, i) => s + (i.qty || i.count || 0), 0);
  document.querySelectorAll('#cart-count').forEach(el => el.textContent = total);
}
refreshCartCount();

/* ── Toast ── */
function showToast(msg, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const t = document.createElement('div');
  t.className = 'toast' + (type === 'error' ? ' error' : '');
  const icon = type === 'error'
    ? '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
    : '<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>';
  t.innerHTML = icon + `<span>${msg}</span>`;
  container.appendChild(t);
  requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add('show')));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 3000);
}

/* ── Live search dropdown (on pages that have .nav-search) ── */
(function initSearch() {
  const box = document.getElementById('search-box');
  const dropdown = document.getElementById('search-dropdown');
  if (!box || !dropdown) return;

  let allProducts = [];

  // Pre-load products for search
  fetch(window.ShoplaneAPI.products)
    .then(r => r.json())
    .then(data => { allProducts = data; })
    .catch(() => {});

  box.addEventListener('input', () => {
    const q = box.value.trim().toLowerCase();
    if (!q || allProducts.length === 0) { dropdown.classList.remove('open'); return; }

    const results = allProducts.filter(p =>
      p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
    ).slice(0, 6);

    if (results.length === 0) {
      dropdown.innerHTML = `<div class="search-no-result">No results for "${q}"</div>`;
    } else {
      const depth = window.location.pathname.split('/').length - 2;
      const prefix = depth > 0 ? '../'.repeat(depth) : '';
      dropdown.innerHTML = results.map(p => `
        <div class="search-result-item" onclick="location.href='${prefix}product/details.html?p=${p.id}'">
          <img class="search-result-img" src="${p.preview}" alt="${p.name}" loading="lazy"
               onerror="this.style.background='#f0ece6';this.src=''"/>
          <div>
            <div class="search-result-name">${p.name}</div>
            <div class="search-result-brand">${p.brand}</div>
          </div>
          <div class="search-result-price">₹${Number(p.price).toLocaleString('en-IN')}</div>
        </div>`).join('');
    }
    dropdown.classList.add('open');
  });

  box.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const q = box.value.trim();
      if (q) {
        const depth = window.location.pathname.split('/').length - 2;
        const prefix = depth > 0 ? '../'.repeat(depth) : '';
        location.href = `${prefix}index.html?q=${encodeURIComponent(q)}`;
      }
    }
    if (e.key === 'Escape') dropdown.classList.remove('open');
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.nav-search')) dropdown.classList.remove('open');
  });

  // Pre-fill search box from URL param
  const q = new URLSearchParams(window.location.search).get('q');
  if (q) box.value = q;
})();

/* ── Scroll reveal observer ── */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in-view'); revealObs.unobserve(e.target); } });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));
