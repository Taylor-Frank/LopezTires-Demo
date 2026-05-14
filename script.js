// NAV
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 50));

// Mobile menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));

// MUSTANG COLOR REVEAL
const wrap = document.getElementById('canvasWrap');
const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');
const hint = document.getElementById('heroHint');
const heroInfo = document.getElementById('heroInfo');

const img = new Image();
img.src = './img-mustang.jpg';

let W, H, sat = 0, targetSat = 0, revealed = false;
let mouseX = -1, mouseY = -1;
let isTouch = false;

function resize() {
  W = canvas.width = wrap.offsetWidth;
  H = canvas.height = wrap.offsetHeight;
  render();
}

function render() {
  if (!img.complete || !img.naturalWidth) {
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, W, H);
    return;
  }

  // Draw full color image
  ctx.drawImage(img, 0, 0, W, H);

  // Draw grayscale version on top, then cut out circle around mouse
  const offscreen = document.createElement('canvas');
  offscreen.width = W;
  offscreen.height = H;
  const off = offscreen.getContext('2d');

  off.drawImage(img, 0, 0, W, H);
  off.globalCompositeOperation = 'saturation';
  off.fillStyle = `hsl(0,0%,50%)`;
  off.fillRect(0, 0, W, H);

  // Blend based on sat
  if (sat < 0.99) {
    ctx.drawImage(img, 0, 0, W, H);
    ctx.globalCompositeOperation = 'saturation';
    const s = Math.round((1 - sat) * 100);
    ctx.fillStyle = `hsl(0,${s}%,50%)`;
    ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'source-over';
  }

  // Dark overlay that fades as sat increases
  const overlayAlpha = (1 - sat) * 0.55;
  ctx.fillStyle = `rgba(0,0,0,${overlayAlpha})`;
  ctx.fillRect(0, 0, W, H);

  // Gradient at bottom for info section transition
  const grad = ctx.createLinearGradient(0, H * 0.6, 0, H);
  grad.addColorStop(0, 'rgba(14,14,14,0)');
  grad.addColorStop(1, 'rgba(14,14,14,0.95)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
}

function animate() {
  sat += (targetSat - sat) * 0.05;

  render();

  hint.style.opacity = sat > 0.3 ? String(1 - (sat - 0.3) / 0.3) : '1';

  if (sat > 0.6 && !revealed) {
    revealed = true;
    heroInfo.classList.add('visible');
  }

  if (sat < 0.4 && revealed) {
    revealed = false;
    heroInfo.classList.remove('visible');
  }

  requestAnimationFrame(animate);
}

img.onload = () => {
  resize();
  animate();
};

// If image already cached
if (img.complete && img.naturalWidth) {
  resize();
  animate();
}

window.addEventListener('resize', resize);

// Mouse events
wrap.addEventListener('mouseenter', () => { targetSat = 1; });
wrap.addEventListener('mouseleave', () => { targetSat = 0; });

// Touch events — tap to toggle
wrap.addEventListener('touchstart', (e) => {
  e.preventDefault();
  targetSat = targetSat === 1 ? 0 : 1;
}, { passive: false });

// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

reveals.forEach(el => observer.observe(el));
