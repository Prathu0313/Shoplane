/* ═══ index.js — Homepage logic, fully wired to Spring Boot backend ════════ */

/* ── Hero Slider ── */
let heroIdx = 0;
const heroTrack = document.getElementById('hero-track');
const heroSlides = heroTrack.querySelectorAll('.hero-slide');
const heroDots = document.getElementById('hero-dots');
heroSlides.forEach((_, i) => {
  const d = document.createElement('button');
  d.className = 'hero-dot' + (i === 0 ? ' active' : '');
  d.setAttribute('aria-label', 'Slide ' + (i+1));
  d.onclick = () => goSlide(i);
  heroDots.appendChild(d);
});
function goSlide(n) {
  heroSlides[heroIdx].classList.remove('active');
  heroIdx = (n + heroSlides.length) % heroSlides.length;
  heroTrack.style.transform = `translateX(-${heroIdx * 100}%)`;
  heroSlides[heroIdx].classList.add('active');
  heroDots.querySelectorAll('.hero-dot').forEach((d, i) => d.classList.toggle('active', i === heroIdx));
}
setInterval(() => goSlide(heroIdx + 1), 5000);

/* ── Marquee ── */
const marqueeItems = ['Free Shipping Over ₹999','New Arrivals Weekly','30-Day Easy Returns','Premium Quality Fabrics','Made in India','Zara · Levi\'s · Pantaloons · UCB'];
const mt = document.getElementById('marquee-track');
const mc = marqueeItems.map(t => `<span class="marquee-item"><span class="marquee-dot"></span>${t}</span>`).join('');
mt.innerHTML = mc + mc;

/* ── Cart (read from localStorage) ── */
function getCart() { return JSON.parse(localStorage.getItem('shoplane-cart') || '[]'); }
function saveCart(cart) {
  localStorage.setItem('shoplane-cart', JSON.stringify(cart));
  // Legacy key for checkout-details.js compatibility
  localStorage.setItem('product-list', JSON.stringify(cart.map(i => ({ ...i, count: i.qty }))));
  refreshCartCount();
}

function addToCart(product) {
  const cart = getCart();
  const idx = cart.findIndex(i => String(i.id) === String(product.id));
  if (idx > -1) cart[idx].qty++;
  else cart.push({ id: product.id, name: product.name, brand: product.brand, price: product.price, preview: product.preview, qty: 1 });
  saveCart(cart);
  showToast(`${product.name} added to cart ✓`);
}

/* ── Wishlist ── */
let wishlist = new Set(JSON.parse(localStorage.getItem('shoplane-wishlist') || '[]'));
function toggleWishlist(id, btn) {
  const numId = Number(id);
  if (wishlist.has(numId)) { wishlist.delete(numId); btn.classList.remove('wishlisted'); showToast('Removed from wishlist'); }
  else { wishlist.add(numId); btn.classList.add('wishlisted'); showToast('Added to wishlist ♥'); }
  localStorage.setItem('shoplane-wishlist', JSON.stringify([...wishlist]));
}

/* ── Build product card DOM ── */
const cardRevealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('card-visible'); cardRevealObs.unobserve(e.target); } });
}, { threshold: 0.08 });

function buildCard(p, isNew = false) {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.dataset.name = (p.name || '').toLowerCase();
  const inWish = wishlist.has(Number(p.id));
  const rating = (4 + Math.random() * 0.9).toFixed(1);
  const reviews = Math.floor(60 + Math.random() * 280);
  const badge = isNew ? `<div class="card-badge badge-new">New</div>` : '';

  // Safely encode product for inline onclick
  const prodData = JSON.stringify({ id: p.id, name: p.name, brand: p.brand, price: p.price, preview: p.preview });
  const escaped = prodData.replace(/'/g, "\\'");

  card.innerHTML = `
    <div class="card-img-wrap">
      <a href="product/details.html?p=${p.id}" aria-label="View ${p.name}">
        <img src="${p.preview || ''}" alt="${p.name}" loading="lazy" decoding="async"
             onerror="this.src='https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400'"/>
      </a>
      ${badge}
      <div class="card-actions">
        <div class="card-action-btn ${inWish ? 'wishlisted' : ''}" title="Wishlist"
             onclick="event.stopPropagation(); toggleWishlist(${p.id}, this)">
          <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </div>
        <a href="product/details.html?p=${p.id}" class="card-action-btn" title="Quick View" onclick="event.stopPropagation()">
          <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        </a>
      </div>
      <button class="card-quick-add" onclick="event.stopPropagation(); addToCart(JSON.parse('${escaped.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'))">Add to Cart +</button>
    </div>
    <div class="card-body">
      <div class="card-brand">${p.brand}</div>
      <div class="card-name">${p.name}</div>
      <div class="card-footer">
        <div class="card-price">₹${Number(p.price).toLocaleString('en-IN')}</div>
        <div class="card-rating"><span class="star">★</span> ${rating} (${reviews})</div>
      </div>
    </div>`;

  cardRevealObs.observe(card);
  return card;
}

/* ── Filter pills ── */
function filterProducts(btn, keyword, gridId) {
  btn.closest('.filter-bar').querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll(`#${gridId} .product-card`).forEach(card => {
    const show = keyword === 'all' || card.dataset.name.includes(keyword);
    card.style.display = show ? '' : 'none';
  });
}

/* ── Horizontal scroll drag ── */
function initHDrag(el) {
  let isDown = false, startX, scrollLeft;
  el.addEventListener('mousedown', e => { isDown = true; startX = e.pageX - el.offsetLeft; scrollLeft = el.scrollLeft; });
  el.addEventListener('mouseleave', () => isDown = false);
  el.addEventListener('mouseup', () => isDown = false);
  el.addEventListener('mousemove', e => { if (!isDown) return; e.preventDefault(); el.scrollLeft = scrollLeft - (e.pageX - el.offsetLeft - startX) * 1.5; });
}

/* ── Backend status banner ── */
function showBackendStatus(online) {
  const banner = document.createElement('div');
  banner.className = 'backend-banner ' + (online ? 'online' : 'offline');
  banner.innerHTML = online
    ? `<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> Connected to live backend (localhost:8080)`
    : `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> Backend offline — showing sample products. Run <code>./mvnw spring-boot:run</code> to connect.`;
  document.getElementById('nav').insertAdjacentElement('afterend', banner);
}

/* ── Render products into grids ── */
function renderAll(products) {
  const clothing = products.filter(p => !p.isAccessory);
  const accessories = products.filter(p => p.isAccessory);
  const newArrivals = [...products].sort(() => Math.random() - 0.5).slice(0, 8);

  // Clothing grid
  const cGrid = document.getElementById('clothing-grid');
  cGrid.innerHTML = '';
  clothing.length
    ? clothing.forEach((p, i) => { const c = buildCard(p, i < 2); c.style.animationDelay = (i * 0.06) + 's'; cGrid.appendChild(c); })
    : cGrid.innerHTML = '<p style="padding:40px;color:var(--muted)">No clothing items found.</p>';

  // Accessory grid
  const aGrid = document.getElementById('accessory-grid');
  aGrid.innerHTML = '';
  accessories.length
    ? accessories.forEach((p, i) => { const c = buildCard(p); c.style.animationDelay = (i * 0.06) + 's'; aGrid.appendChild(c); })
    : aGrid.innerHTML = '<p style="padding:40px;color:var(--muted)">No accessories found.</p>';

  // New arrivals horizontal scroll
  const nTrack = document.getElementById('new-arrivals-track');
  nTrack.innerHTML = '';
  newArrivals.forEach(p => nTrack.appendChild(buildCard(p, true)));
  initHDrag(document.getElementById('h-scroll-wrap'));
}

/* ── Newsletter ── */
function subscribeNewsletter() {
  const email = document.getElementById('newsletter-email').value.trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showToast('Please enter a valid email', 'error'); return; }
  showToast('🎉 Subscribed! Watch your inbox.');
  document.getElementById('newsletter-email').value = '';
}

/* ── Fallback product catalogue (shown when backend is offline) ── */
const FALLBACK_PRODUCTS = [
  { id:1, name:'Classic White Shirt', brand:'Zara', price:1299, preview:'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600', isAccessory:false },
  { id:2, name:'Slim Fit Chinos', brand:"Levi's", price:1899, preview:'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600', isAccessory:false },
  { id:3, name:'Floral Summer Dress', brand:'Pantaloons', price:2199, preview:'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600', isAccessory:false },
  { id:4, name:'Oversized Hoodie', brand:'UCB', price:2499, preview:'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600', isAccessory:false },
  { id:5, name:'Linen Kurta', brand:'Pantaloons', price:999, preview:'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600', isAccessory:false },
  { id:6, name:'Denim Jacket', brand:"Levi's", price:3499, preview:'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600', isAccessory:false },
  { id:7, name:'Cotton Polo Shirt', brand:'Zara', price:1499, preview:'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600', isAccessory:false },
  { id:8, name:'Midi Wrap Dress', brand:'Pantaloons', price:1899, preview:'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600', isAccessory:false },
  { id:9, name:'Leather Wrist Watch', brand:'Zara', price:3999, preview:'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600', isAccessory:true },
  { id:10, name:'Canvas Tote Bag', brand:'UCB', price:899, preview:'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600', isAccessory:true },
  { id:11, name:'Aviator Sunglasses', brand:"Levi's", price:1499, preview:'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600', isAccessory:true },
  { id:12, name:'Leather Belt', brand:'Pantaloons', price:799, preview:'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600', isAccessory:true },
  { id:13, name:'Silk Neck Scarf', brand:'Zara', price:699, preview:'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600', isAccessory:true },
];

/* ── Fetch from Spring Boot backend ── */
async function loadProducts() {
  const searchQ = new URLSearchParams(window.location.search).get('q') || '';
  const url = searchQ ? `${ShoplaneAPI.products}?search=${encodeURIComponent(searchQ)}` : ShoplaneAPI.products;

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    showBackendStatus(true);
    renderAll(data);
  } catch (err) {
    console.warn('Backend unavailable:', err.message);
    showBackendStatus(false);
    const filtered = searchQ
      ? FALLBACK_PRODUCTS.filter(p => p.name.toLowerCase().includes(searchQ.toLowerCase()) || p.brand.toLowerCase().includes(searchQ.toLowerCase()))
      : FALLBACK_PRODUCTS;
    renderAll(filtered);
  }
}

loadProducts();
