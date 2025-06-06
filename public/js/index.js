const product = {
    title: document.getElementById('productTitle').innerText,
    description: document.getElementById('productDescription').innerText,
    price: document.getElementById('price').innerText.replace('$', '').trim(),
    currency: 'usd'
};
const cardBody = JSON.stringify(product || {});
// visa checkout
document.getElementById('checkoutVisa').addEventListener('click', async () => {
  const res = await fetch('/stripe/create-checkout-session', { method: 'POST', body: cardBody, headers: { 'Content-Type': 'application/json' } });
  const data = await res.json();
  console.log(data);
  if (data.url) {
    window.location.href = data.url;
  } else {
    alert('Something went wrong.');
  }
});

paypal.Buttons({
  createOrder: async () => {
    const res = await fetch('/paypal/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const data = await res.json();
    return data.id; // Return the order ID to PayPal
  },
  onApprove: async function(data) {
    const res = await fetch('/paypal/capture-order', {
      method: 'POST',
    //   body: cardBody,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderID: data.orderID })
    });
    const capture = await res.json();
    
    const captureCustome = capture.purchase_units[0].payments.captures[0];

    document.getElementById('popup-status').innerText = JSON.stringify(captureCustome.status, null, 2);
    document.getElementById('popup-reference').innerText = JSON.stringify(captureCustome.id, null, 2);
    document.getElementById('popup-amount').innerText = JSON.stringify(captureCustome.amount.value, null, 2);
    document.getElementById('popup-currency').innerText = JSON.stringify(captureCustome.amount.currency_code, null, 2);
    document.getElementById('popup-date').innerText = JSON.stringify(captureCustome.create_time, null, 2);
    document.getElementById('payment-popup').classList.remove('hidden');
  },
  onCancel: function() {
    document.getElementById('result').innerText = '❌ Payment cancelled';
  },
  onError: function(err) {
    document.getElementById('result').innerText = '❌ Something went wrong with your payment';
  }
}).render('#paypal-button-container');