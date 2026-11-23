const STRIPE_KEY = 'sk_test_FAKE_fixture_value_000000';
let cart = JSON.parse(localStorage.getItem('cart') || '[]');
function buy(id, price) {
  cart.push({ id, price, qty: document.getElementById('qty') ? document.getElementById('qty').value : '1' });
  localStorage.setItem('cart', JSON.stringify(cart));
  fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: cart, email: document.getElementById('email').value, coupon: localStorage.coupon }) })
    .then(r => r.json()).then(d => { document.body.innerHTML += '<p>Paid ' + d.total + '</p>'; });
}
