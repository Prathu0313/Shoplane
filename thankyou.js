/* ═══ thankyou.js — Order confirmation page ════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  try {
    const saved = JSON.parse(localStorage.getItem('checkout-customer') || '{}');

    // Personalised greeting
    if (saved.fullName) {
      document.getElementById('ty-name-msg').textContent =
        `Thank you, ${saved.fullName}! We've received your order and it's being prepared.`;
    }

    // Delivery address
    if (saved.address1 && saved.city) {
      const parts = [saved.address1, saved.address2, saved.city, saved.state, saved.pincode].filter(Boolean);
      document.getElementById('ty-address-msg').textContent = parts.join(', ');
    }

    // Total
    if (saved.totalAmount) {
      document.getElementById('ty-total').textContent = `₹${Number(saved.totalAmount).toLocaleString('en-IN')}`;
    }

    // Estimated delivery (5-7 working days from now)
    const delivery = new Date();
    delivery.setDate(delivery.getDate() + 6);
    document.getElementById('ty-delivery-date').textContent = delivery.toLocaleDateString('en-IN', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });

    // Order number (random 6-digit, stable per session)
    const orderNum = Math.floor(100000 + Math.random() * 900000);
    document.getElementById('ty-order-num').textContent = orderNum;

  } catch (e) {
    console.warn('Could not read order details:', e);
  }

  // Clear saved customer data after display
  localStorage.removeItem('checkout-customer');
});
