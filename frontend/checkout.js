/* ═══ checkout.js — Cart page, reads localStorage ══════════════════════════ */

function getCart() { return JSON.parse(localStorage.getItem('shoplane-cart') || '[]'); }
function saveCart(cart) {
  localStorage.setItem('shoplane-cart', JSON.stringify(cart));
  localStorage.setItem('product-list', JSON.stringify(cart.map(i => ({ ...i, count: i.qty }))));
  refreshCartCount();
}

function buildCartItem(item, index) {
  const card = document.createElement('div');
  card.className = 'cart-item-card';
  card.innerHTML = `
    <img class="cart-item-img" src="${item.preview || ''}" alt="${item.name}" loading="lazy"
         onerror="this.style.background='#f0ece6';this.removeAttribute('src')"/>
    <div class="cart-item-info">
      <div class="cart-item-brand">${item.brand || ''}</div>
      <div class="cart-item-name">${item.name}</div>
      ${item.size ? `<div class="cart-item-size">Size: ${item.size}</div>` : ''}
      <div class="cart-item-price">₹${Number(item.price).toLocaleString('en-IN')} each</div>
    </div>
    <div class="cart-item-right">
      <div class="cart-item-total">₹${(Number(item.price) * (item.qty || 1)).toLocaleString('en-IN')}</div>
      <div class="qty-control">
        <button class="qty-ctrl-btn" data-action="minus" data-index="${index}">−</button>
        <span class="qty-num">${item.qty || 1}</span>
        <button class="qty-ctrl-btn" data-action="plus" data-index="${index}">+</button>
      </div>
      <button class="btn-remove" data-index="${index}">
        <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg> Remove
      </button>
    </div>`;
  return card;
}

function renderCart() {
  const cart = getCart();
  const list = document.getElementById('cart-items-list');
  const emptyEl = document.getElementById('empty-cart');
  const contentEl = document.getElementById('cart-content');

  list.innerHTML = '';

  if (cart.length === 0) {
    emptyEl.style.display = 'flex';
    contentEl.style.display = 'none';
    return;
  }
  emptyEl.style.display = 'none';
  contentEl.style.display = 'grid';

  let subtotal = 0;
  cart.forEach((item, i) => {
    list.appendChild(buildCartItem(item, i));
    subtotal += Number(item.price) * (item.qty || 1);
  });

  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;
  document.getElementById('item-count').textContent = cart.reduce((s, i) => s + (i.qty || 1), 0);
  document.getElementById('summary-subtotal').textContent = `₹${subtotal.toLocaleString('en-IN')}`;
  document.getElementById('summary-shipping').textContent = shipping === 0 ? 'Free' : `₹${shipping}`;
  document.getElementById('summary-shipping').className = shipping === 0 ? 'text-green' : '';
  document.getElementById('summary-total').textContent = `₹${total.toLocaleString('en-IN')}`;

  // Event delegation for qty buttons and remove
  list.onclick = e => {
    const cart2 = getCart();
    const minus = e.target.closest('[data-action="minus"]');
    const plus = e.target.closest('[data-action="plus"]');
    const remove = e.target.closest('.btn-remove');
    if (minus) { const i = Number(minus.dataset.index); if (cart2[i].qty > 1) cart2[i].qty--; else cart2.splice(i, 1); saveCart(cart2); renderCart(); }
    else if (plus) { const i = Number(plus.dataset.index); if (cart2[i].qty < 10) cart2[i].qty++; saveCart(cart2); renderCart(); }
    else if (remove) { const i = Number(remove.dataset.index); cart2.splice(i, 1); saveCart(cart2); renderCart(); showToast('Item removed'); }
  };
}

document.getElementById('btn-proceed').addEventListener('click', () => {
  if (getCart().length === 0) { showToast('Your cart is empty', 'error'); return; }
  window.location.href = 'checkout-details.html';
});

renderCart();
