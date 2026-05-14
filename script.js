// NAV
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 50));

// Mobile menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));

// SPOTLIGHT
const heroWrap = document.getElementById('heroWrap');
const spotlight = document.getElementById('spotlight');
const heroHint = document.getElementById('heroHint');
const heroImg = document.getElementById('heroImg');

let hasEntered = false;

heroWrap.addEventListener('mousemove', (e) => {
  const rect = heroWrap.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  spotlight.style.left = x + 'px';
  spotlight.style.top = y + 'px';
  spotlight.style.opacity = '1';

  if (!hasEntered) {
    hasEntered = true;
    heroHint.style.opacity = '0';
    heroImg.style.filter = 'grayscale(60%) brightness(0.4)';
  }
});

heroWrap.addEventListener('mouseleave', () => {
  spotlight.style.opacity = '0';
  heroImg.style.filter = 'grayscale(100%) brightness(0.35)';
  hasEntered = false;
  heroHint.style.opacity = '1';
});

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
