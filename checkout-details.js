$(document).ready(function () {
  // --- Guard: if cart empty, go back to cart
  function getCart() {
    var list = window.localStorage.getItem('product-list');
    list = list ? JSON.parse(list) : [];
    return list;
  }
  var cart = getCart();
  if (!cart || cart.length === 0) {
    alert('Your cart is empty. Add items before checkout.');
    window.location.href = 'index.html';
    return;
  }

  // --- Prefill from localStorage if available
  var saved = window.localStorage.getItem('checkout-customer');
  if (saved) {
    try {
      var data = JSON.parse(saved);
      for (var key in data) {
        if (data.hasOwnProperty(key) && document.getElementById(key)) {
          document.getElementById(key).value = data[key];
        }
      }
    } catch (e) {}
  }

  // --- Render summary
  var total = 0;
  cart.forEach(function (item) {
    var li = document.createElement('div');
    li.className = 'summary-item';

    var img = document.createElement('img');
    img.src = item.preview;
    img.alt = item.name;
    img.loading = 'lazy'; img.decoding = 'async';

    var name = document.createElement('div');
    name.innerHTML = '<strong>' + item.name + '</strong><br>x' + item.count;

    var amt = document.createElement('div');
    var itemTotal = parseInt(item.count) * parseInt(item.price);
    amt.textContent = 'Rs ' + itemTotal;

    li.appendChild(img);
    li.appendChild(name);
    li.appendChild(amt);

    document.getElementById('summary-list').appendChild(li);
    total += itemTotal;
  });
  document.getElementById('summary-amount').textContent = total;

  // --- Simple validation helpers
  function setErr(id, msg) {
    var el = document.querySelector('.err[data-for="' + id + '"]');
    if (el) el.textContent = msg || '';
  }

  function required(id, msg) {
    var val = (document.getElementById(id).value || '').trim();
    if (!val) { setErr(id, msg || 'Required'); return false; }
    setErr(id, ''); return true;
  }

  function match(id, regex, msg) {
    var val = (document.getElementById(id).value || '').trim();
    if (!regex.test(val)) { setErr(id, msg); return false; }
    setErr(id, ''); return true;
  }

  // --- Submit
  $('#customer-form').on('submit', function (e) {
    e.preventDefault();

    var ok =
      required('fullName') &
      required('phone') &
      required('address1') &
      required('city') &
      required('state') &
      required('pincode') &
      required('country') &
      match('phone', /^\+?\d[\d\s\-]{7,}$/, 'Enter a valid phone') &
      match('pincode', /^\d{4,10}$/, '4–10 digits');

    // Email is optional but if present, validate
    var emailVal = ($('#email').val() || '').trim();
    if (emailVal.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      setErr('email', 'Invalid email'); ok = 0;
    } else {
      setErr('email', '');
    }

    if (!ok) return;

    // Save to localStorage
    var customer = {
      fullName: $('#fullName').val().trim(),
      phone: $('#phone').val().trim(),
      email: emailVal,
      address1: $('#address1').val().trim(),
      address2: $('#address2').val().trim(),
      city: $('#city').val().trim(),
      state: $('#state').val().trim(),
      pincode: $('#pincode').val().trim(),
      country: $('#country').val().trim()
    };
    window.localStorage.setItem('checkout-customer', JSON.stringify(customer));

    // Clear cart and finish
    window.localStorage.setItem('product-list', JSON.stringify([]));
    window.location.href = 'thankyou.html';
  });
});
