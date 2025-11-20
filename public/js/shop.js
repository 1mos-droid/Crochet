let allProducts = [];

const productsContainer = document.querySelector('.products-grid');
const categoryFilter = document.getElementById('categoryFilter');
const yarnFilter = document.getElementById('yarnFilter');
const sizeFilter = document.getElementById('sizeFilter');
const sortFilter = document.getElementById('sortFilter');

// Function to display products
function displayProducts(list) {
  if(!list.length){
    productsContainer.innerHTML = `<p style="text-align:center; padding:2rem; color:#555;">No products found.</p>`;
    return;
  }
  productsContainer.innerHTML = list.map(p => `
    <div class="product-card">
      <img src="${p.img}" alt="${p.name}">
      <h4>${p.name}</h4>
      <p>$${p.price}</p>
      <a href="product.html" class="btn" onclick="selectProduct(${p.id})">View</a>
    </div>
  `).join('');
}

// Function to set the selected product in localStorage
function selectProduct(id) {
  // Find the product from our 'allProducts' list
  const product = allProducts.find(p => p.id === id);
  if(product) {
    localStorage.setItem('selectedProduct', JSON.stringify(product));
  }
}

// Function to filter products (uses 'allProducts' array)
function filterProducts() {
  let filtered = [...allProducts]; // Start with the full list

  // Category filter
  if(categoryFilter.value !== 'All') filtered = filtered.filter(p => p.category === categoryFilter.value);

  // Yarn filter
  if(yarnFilter.value !== 'All') filtered = filtered.filter(p => p.yarn === yarnFilter.value);

  // Size filter
  if(sizeFilter.value !== 'All') filtered = filtered.filter(p => p.size === sizeFilter.value);

  // Sorting
  if(sortFilter.value === 'priceAsc') filtered.sort((a,b) => a.price - b.price);
  if(sortFilter.value === 'priceDesc') filtered.sort((a,b) => b.price - a.price);

  displayProducts(filtered);
}

// Event listeners for filters
categoryFilter.addEventListener('change', filterProducts);
yarnFilter.addEventListener('change', filterProducts);
sizeFilter.addEventListener('change', filterProducts);
sortFilter.addEventListener('change', filterProducts);

// --- NEW CODE: FETCH DATA ON LOAD ---
document.addEventListener('DOMContentLoaded', () => {
  console.log('Fetching products from backend...');
  fetch('/api/products')
    .then(response => response.json())
    .then(productsFromServer => {
      console.log('Products received:', productsFromServer);
      allProducts = productsFromServer; // Store the list
      displayProducts(allProducts);    // Display them
    })
    .catch(error => {
      console.error('Error fetching products:', error);
      productsContainer.innerHTML = `<p style="text-align:center; padding:2rem; color:red;">Error loading products. Is the server running?</p>`;
    });
});