/* ═══ details.js — Product detail page, wired to backend ══════════════════ */

const productId = new URLSearchParams(window.location.search).get('p');

if (!productId) {
  document.getElementById('state-loading').style.display = 'none';
  document.getElementById('state-error').style.display = 'flex';
  document.getElementById('error-msg').textContent = 'No product ID specified in URL.';
}

let currentProduct = null;
let qty = 1;
let selectedSize = 'M';

/* ── Qty controls ── */
document.getElementById('qty-minus').addEventListener('click', () => {
  if (qty > 1) { qty--; document.getElementById('qty-value').textContent = qty; }
});
document.getElementById('qty-plus').addEventListener('click', () => {
  if (qty < 10) { qty++; document.getElementById('qty-value').textContent = qty; }
});

/* ── Size buttons ── */
document.querySelectorAll('.size-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedSize = btn.dataset.size;
  });
});

/* ── Gallery ── */
function buildThumb(url, isActive) {
  const thumb = document.createElement('div');
  thumb.className = 'gallery-thumb' + (isActive ? ' active' : '');
  const img = document.createElement('img');
  img.src = url; img.alt = 'Photo'; img.loading = 'lazy';
  img.onerror = () => { img.style.display = 'none'; thumb.style.display = 'none'; };
  thumb.appendChild(img);
  thumb.addEventListener('click', () => {
    document.getElementById('product-preview').src = url;
    document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
  });
  return thumb;
}

/* ── Zoom ── */
document.getElementById('zoom-btn').addEventListener('click', () => {
  if (!currentProduct) return;
  const src = document.getElementById('product-preview').src;
  document.getElementById('zoom-img').src = src;
  document.getElementById('zoom-overlay').classList.add('open');
});
function closeZoom() { document.getElementById('zoom-overlay').classList.remove('open'); }
document.getElementById('zoom-overlay').addEventListener('click', e => { if (e.target === e.currentTarget) closeZoom(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeZoom(); });

/* ── Cart ── */
function getCart() { return JSON.parse(localStorage.getItem('shoplane-cart') || '[]'); }
function saveCart(cart) {
  localStorage.setItem('shoplane-cart', JSON.stringify(cart));
  localStorage.setItem('product-list', JSON.stringify(cart.map(i => ({ ...i, count: i.qty }))));
  refreshCartCount();
}

document.getElementById('btn-add-to-cart').addEventListener('click', () => {
  if (!currentProduct) return;
  const cart = getCart();
  const key = `${currentProduct.id}-${selectedSize}`;
  const idx = cart.findIndex(i => i.key === key);
  if (idx > -1) { cart[idx].qty += qty; }
  else {
    cart.push({
      key, id: currentProduct.id, name: currentProduct.name,
      brand: currentProduct.brand, price: currentProduct.price,
      preview: currentProduct.preview, size: selectedSize, qty
    });
  }
  saveCart(cart);

  // Feedback
  const fb = document.getElementById('cart-feedback');
  fb.textContent = `✓ Added ${qty} × ${currentProduct.name} (${selectedSize}) to cart`;
  showToast(`${currentProduct.name} added to cart ✓`);
  setTimeout(() => { fb.textContent = ''; }, 3000);

  // Button bounce
  const btn = document.getElementById('btn-add-to-cart');
  btn.style.transform = 'scale(0.95)';
  setTimeout(() => btn.style.transform = '', 200);
});

/* ── Wishlist ── */
let wishlist = new Set(JSON.parse(localStorage.getItem('shoplane-wishlist') || '[]'));
const wishBtn = document.getElementById('btn-wishlist');
wishBtn.addEventListener('click', () => {
  if (!currentProduct) return;
  const id = Number(currentProduct.id);
  if (wishlist.has(id)) { wishlist.delete(id); wishBtn.classList.remove('active'); showToast('Removed from wishlist'); }
  else { wishlist.add(id); wishBtn.classList.add('active'); showToast('Added to wishlist ♥'); }
  localStorage.setItem('shoplane-wishlist', JSON.stringify([...wishlist]));
});

/* ── Render product ── */
function renderProduct(data) {
  currentProduct = data;

  document.title = `${data.name} — Shoplane`;
  document.getElementById('breadcrumb-cat').textContent = data.isAccessory ? 'Accessories' : 'Clothing';
  document.getElementById('breadcrumb-name').textContent = data.name;
  document.getElementById('product-title').textContent = data.name;
  document.getElementById('product-brand').textContent = data.brand;
  document.getElementById('product-price').textContent = `₹${Number(data.price).toLocaleString('en-IN')}`;
  document.getElementById('description').textContent = data.description || 'Premium quality product.';

  // Rating (random but consistent by ID)
  const seed = Number(data.id) || 1;
  const rating = (4 + (seed % 10) / 10).toFixed(1);
  const reviews = 50 + (seed * 37) % 400;
  const stars = Math.round(parseFloat(rating));
  document.getElementById('rating-stars').textContent = '★'.repeat(stars) + '☆'.repeat(5 - stars);
  document.getElementById('rating-count').textContent = `(${reviews} reviews)`;

  // Preview
  const preview = document.getElementById('product-preview');
  preview.src = data.preview || '';
  preview.alt = data.name;

  // Thumbs
  const thumbsEl = document.getElementById('gallery-thumbs');
  thumbsEl.innerHTML = '';
  let photos = Array.isArray(data.photos) ? data.photos : [];
  if (data.photosRaw) photos = data.photosRaw.split(',').map(s => s.trim()).filter(Boolean);
  if (photos.length === 0 && data.preview) photos = [data.preview];
  photos.forEach((url, i) => thumbsEl.appendChild(buildThumb(url, i === 0)));

  // Hide size selector for accessories
  if (data.isAccessory) document.getElementById('size-section').style.display = 'none';

  // Wishlist state
  if (wishlist.has(Number(data.id))) wishBtn.classList.add('active');

  // Show
  // Hide skeleton, reveal product with smooth fade
  document.getElementById('state-loading').style.display = 'none';
  const wrapper = document.getElementById('product-wrapper');
  wrapper.style.display = 'block';
}

/* ── Fetch from backend ── */
async function loadProduct() {
  if (!productId) return;
  try {
    const res = await fetch(ShoplaneAPI.product(productId), { signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    renderProduct(data);
  } catch (err) {
    document.getElementById('state-loading').style.display = 'none';
    document.getElementById('state-error').style.display = 'flex';
    document.getElementById('error-msg').innerHTML =
      '⚠ Could not load product.<br><small>Make sure the Spring Boot backend is running on <strong>localhost:8080</strong>.</small>';
  }
}

loadProduct();
