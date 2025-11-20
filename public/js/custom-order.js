const orderForm = document.getElementById('orderForm');
const priceEstimate = document.getElementById('priceEstimate');

// Price calculation logic 
orderForm.addEventListener('input', () => {
  let base = 30;
  const type = orderForm.productType.value;
  const yarn = orderForm.yarnStyle.value;

  if(type === 'Clothing') base += 20;
  if(type === 'Bags') base += 25;
  if(type === 'Plushies') base += 10;
  if(type === 'Home Decor') base += 15;
  if(type === 'Baby Items') base += 10;

  if(yarn === 'Wool') base += 10;
  if(yarn === 'Cotton') base += 5;

  priceEstimate.textContent = base;
});

// ---  SUBMIT LOGIC ---
orderForm.addEventListener('submit', (e) => {
  e.preventDefault(); // Stop the form from reloading the page
  
  // 1. Get all form data
  const formData = new FormData(orderForm);
  const data = Object.fromEntries(formData.entries());
  data.estimatedPrice = priceEstimate.textContent; // Add the price

  console.log('Submitting order:', data);

  // 2. Send the data to the backend
  fetch('/api/custom-order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(result => {
    console.log('Server response:', result);
    alert('Custom order submitted! We will contact you shortly.');
    orderForm.reset();
    priceEstimate.textContent = '50';
  })
  .catch(error => {
    console.error('Error submitting order:', error);
    alert('There was an error submitting your order. Please try again.');
  });
});