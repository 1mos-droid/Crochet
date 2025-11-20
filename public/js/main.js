document.addEventListener('DOMContentLoaded', () => {
document.body.classList.add('loaded');
});

window.addEventListener('beforeunload', () => {
document.body.classList.remove('loaded');
});
// ==============================
// Sidebar logic
// ==============================
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const logo = document.querySelector('.logo-sidebar');

function toggleSidebar() {
sidebar.classList.toggle('open');
overlay.classList.toggle('show');
}

// Only open sidebar when user clicks the logo
if (logo) logo.addEventListener('click', toggleSidebar);

// ==============================
// Carousel (Auto Fade) logic
// ==============================
const carousel = document.getElementById('product-carousel');
const slides = carousel ? carousel.querySelectorAll('.carousel-item') : [];
let currentIndex = 0;
let fadeInterval;

function initCarousel() {
if (!slides.length) return;

// Ensure all slides are layered and initially hidden
slides.forEach((slide, i) => {
slide.style.opacity = i === 0 ? '1' : '0';
slide.style.transition = 'opacity 1s ease-in-out';
slide.style.position = 'absolute';
slide.style.top = '0';
slide.style.left = '0';
slide.style.width = '100%';
});

carousel.style.position = 'relative';
startAutoFade();
}

function showSlide(index) {
slides.forEach((slide, i) => {
slide.style.opacity = i === index ? '1' : '0';
});
currentIndex = index;
}

function nextSlide() {
if (!slides.length) return;
currentIndex = (currentIndex + 1) % slides.length;
showSlide(currentIndex);
}

function prevSlide() {
if (!slides.length) return;
currentIndex = (currentIndex - 1 + slides.length) % slides.length;
showSlide(currentIndex);
}

function startAutoFade() {
stopAutoFade();
fadeInterval = setInterval(nextSlide, 4000); // change every 4 seconds
}

function stopAutoFade() {
if (fadeInterval) clearInterval(fadeInterval);
}

// Pause when hovering over carousel
if (carousel) {
carousel.addEventListener('mouseenter', stopAutoFade);
carousel.addEventListener('mouseleave', startAutoFade);
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', initCarousel);
window.addEventListener('scroll', () => {
if (window.scrollY > 20) {
document.body.classList.add('scrolled');
} else {
document.body.classList.remove('scrolled');
}
});