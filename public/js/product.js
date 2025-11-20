function changeImage(img) {
  document.getElementById('mainImg').src = img.src;
}

document.getElementById('addToCart').addEventListener('click', () => {
  const size = document.getElementById('productSize').value;
  const yarn = document.getElementById('productYarn').value;
  alert(`Added to cart: ${document.getElementById('productName').textContent}, Size: ${size}, Yarn: ${yarn}`);
});