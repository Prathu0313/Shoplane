/* ═══ checkout-details.js — POSTs order to Spring Boot /api/orders ════════ */

function getCart() {
  return JSON.parse(localStorage.getItem('shoplane-cart') || '[]');
}

const cart = getCart();

/* ── Guard: redirect if cart empty ── */
if (!cart || cart.length === 0) {
  alert('Your cart is empty. Please add items first.');
  window.location.href = 'index.html';
}

/* ── Render order summary sidebar ── */
let total = 0;
const summaryItems = document.getElementById('summary-items');
cart.forEach(item => {
  const lineTotal = Number(item.price) * (item.qty || item.count || 1);
  total += lineTotal;
  const row = document.createElement('div');
  row.className = 'summary-item';
  row.innerHTML = `
    <img class="summary-item-img" src="${item.preview || ''}" alt="${item.name}" loading="lazy"
         onerror="this.style.background='#f0ece6';this.removeAttribute('src')"/>
    <div>
      <div class="summary-item-name">${item.name}</div>
      <div class="summary-item-qty">x${item.qty || item.count || 1}${item.size ? ' · ' + item.size : ''}</div>
    </div>
    <div class="summary-item-price">₹${lineTotal.toLocaleString('en-IN')}</div>`;
  summaryItems.appendChild(row);
});
document.getElementById('summary-total').textContent = '₹' + total.toLocaleString('en-IN');

/* ── Pre-fill saved details ── */
try {
  const saved = JSON.parse(localStorage.getItem('checkout-customer') || '{}');
  ['fullName','phone','email','address1','address2','city','state','pincode','country'].forEach(function(k) {
    var el = document.getElementById(k);
    if (el && saved[k]) el.value = saved[k];
  });
} catch(e) {}

/* ── Validation helpers ── */
function val(id) {
  return (document.getElementById(id) ? document.getElementById(id).value : '').trim();
}

function setErr(id, msg) {
  var errEl = document.querySelector('.err[data-for="' + id + '"]');
  var input = document.getElementById(id);
  if (errEl) errEl.textContent = msg || '';
  if (input) {
    if (msg) input.classList.add('invalid');
    else input.classList.remove('invalid');
  }
}

function clearAllErrors() {
  document.querySelectorAll('.err').forEach(function(el) { el.textContent = ''; });
  document.querySelectorAll('input.invalid').forEach(function(el) { el.classList.remove('invalid'); });
}

function validateForm() {
  var ok = true;

  /* Required fields — ALL checked independently so every red error shows at once */
  var required = [
    { id: 'fullName', label: 'Full Name' },
    { id: 'phone',    label: 'Phone Number' },
    { id: 'address1', label: 'Address Line 1' },
    { id: 'city',     label: 'City' },
    { id: 'state',    label: 'State' },
    { id: 'pincode',  label: 'Pincode' },
    { id: 'country',  label: 'Country' }
  ];

  required.forEach(function(f) {
    if (!val(f.id)) {
      setErr(f.id, f.label + ' is required');
      ok = false;
    } else {
      setErr(f.id, '');
    }
  });

  /* Phone format */
  var phoneVal = val('phone');
  if (phoneVal && !/^\+?[\d\s\-]{7,15}$/.test(phoneVal)) {
    setErr('phone', 'Enter a valid phone number');
    ok = false;
  }

  /* Pincode format */
  var pincodeVal = val('pincode');
  if (pincodeVal && !/^\d{4,10}$/.test(pincodeVal)) {
    setErr('pincode', 'Enter a valid pincode (4–10 digits)');
    ok = false;
  }

  /* Email — optional */
  var emailVal = val('email');
  if (emailVal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
    setErr('email', 'Enter a valid email address');
    ok = false;
  } else {
    setErr('email', '');
  }

  return ok;
}

/* ── Form submit → POST /api/orders ── */
document.getElementById('customer-form').addEventListener('submit', async function(e) {
  e.preventDefault();

  clearAllErrors();
  var errBanner = document.getElementById('api-error');
  errBanner.textContent = '';
  errBanner.classList.remove('visible');

  /* Validate — show ALL errors at once */
  if (!validateForm()) {
    if (typeof showToast === 'function') showToast('Please fill in all required fields', 'error');
    var firstInvalid = document.querySelector('input.invalid');
    if (firstInvalid) firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  var emailVal = val('email');
  var payload = {
    fullName:    val('fullName'),
    phone:       val('phone'),
    email:       emailVal,
    address1:    val('address1'),
    address2:    val('address2'),
    city:        val('city'),
    state:       val('state'),
    pincode:     val('pincode'),
    country:     val('country'),
    cartJson:    JSON.stringify(cart),
    totalAmount: total
  };

  /* Save for thank-you page */
  localStorage.setItem('checkout-customer', JSON.stringify(payload));

  /* Button loading state */
  var btn = document.getElementById('btn-place-order');
  var btnLabel = document.getElementById('btn-label');
  var btnSpinner = document.getElementById('btn-spinner');
  btn.disabled = true;
  if (btnLabel) btnLabel.style.display = 'none';
  if (btnSpinner) btnSpinner.style.display = 'block';

  try {
    var apiUrl = (window.ShoplaneAPI && window.ShoplaneAPI.orders)
      ? window.ShoplaneAPI.orders
      : 'http://localhost:8080/api/orders';

    var res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(12000)
    });

    if (!res.ok) {
      var errMsg = 'Server error (' + res.status + ')';
      try {
        var errData = await res.json();
        errMsg = errData.error || errData.message || errMsg;
      } catch(_) {}
      throw new Error(errMsg);
    }

    /* ✅ SUCCESS — clear cart and go to confirmation */
    localStorage.setItem('shoplane-cart', JSON.stringify([]));
    localStorage.setItem('product-list', JSON.stringify([]));
    window.location.href = 'thankyou.html';

  } catch (err) {
    /* Reset button */
    btn.disabled = false;
    if (btnLabel) btnLabel.style.display = '';
    if (btnSpinner) btnSpinner.style.display = 'none';

    var userMsg;
    if (err.name === 'TimeoutError' || err.name === 'AbortError') {
      userMsg = '⚠ Request timed out. Make sure the Spring Boot backend is running on localhost:8080.';
    } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError') || err.message.includes('fetch')) {
      userMsg = '⚠ Cannot reach backend. Run: ./mvnw spring-boot:run  (in the backend folder)';
    } else {
      userMsg = '⚠ Could not place order: ' + err.message;
    }

    errBanner.textContent = userMsg;
    errBanner.classList.add('visible');
    errBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (typeof showToast === 'function') showToast('Order failed — see error above', 'error');
    console.error('Order POST failed:', err);
  }
});
