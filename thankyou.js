document.addEventListener('DOMContentLoaded', function() {
    const thankyouSection = document.getElementById('thankyou-section');

    function fadeInElement(element) {
        let opacity = 0;
        const fadeInInterval = setInterval(function() {
            if (opacity < 1) {
                opacity += 0.1;
                element.style.opacity = opacity;
            } else {
                clearInterval(fadeInInterval);
            }
        }, 100);
    }

    fadeInElement(thankyouSection);
    try {
  var saved = window.localStorage.getItem('checkout-customer');
  if (saved) {
    var c = JSON.parse(saved);
    var name = c.fullName ? ' ' + c.fullName : '';
    var msg = document.createElement('p');
    msg.textContent = 'Thanks' + name + '! Your order will be shipped to ' + c.address1 + ', ' + c.city + '.';
    document.getElementById('thankyou-section').appendChild(msg);
  }
} catch(e) {}
});
