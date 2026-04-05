/* =========================================
SECRET SYSTEMS — Main Site JS
========================================= */

(function () {
‘use strict’;

/* — Intersection Observer for fade-up animations — */
function initFadeUps() {
const observer = new IntersectionObserver(
(entries) => {
entries.forEach((entry) => {
if (entry.isIntersecting) {
entry.target.classList.add(‘in-view’);
observer.unobserve(entry.target);
}
});
},
{ threshold: 0.15 }
);

```
// Apply to key elements
const targets = document.querySelectorAll(
  '.work-card, .service-item, .ps-step, .stat, .hero-tag, .hero-title, .hero-body, .hero-actions, .hero-stats'
);

targets.forEach((el, i) => {
  el.classList.add('fade-up');
  el.style.transitionDelay = `${(i % 4) * 80}ms`;
  observer.observe(el);
});
```

}

/* — Nav: hide on scroll down, show on scroll up — */
function initNav() {
const nav = document.getElementById(‘site-nav’);
let lastScroll = 0;
let ticking = false;

```
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const currentScroll = window.scrollY;
      // Only manage nav when past vault sequence
      if (currentScroll > 2200) {
        if (currentScroll > lastScroll + 10) {
          nav.style.transform = 'translateY(-100%)';
        } else if (currentScroll < lastScroll - 4) {
          nav.style.transform = 'translateY(0)';
        }
      } else {
        nav.style.transform = 'translateY(0)';
      }
      lastScroll = currentScroll;
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });
```

}

/* — Smooth scroll for anchor links — */
function initSmoothScroll() {
document.querySelectorAll(‘a[href^=”#”]’).forEach((link) => {
link.addEventListener(‘click’, (e) => {
const target = document.querySelector(link.getAttribute(‘href’));
if (target) {
e.preventDefault();
target.scrollIntoView({ behavior: ‘smooth’, block: ‘start’ });
}
});
});
}

/* — Contact form — */
window.handleForm = function (e) {
e.preventDefault();
const status = document.getElementById(‘form-status’);
const btn = e.target.querySelector(‘button[type=“submit”]’);
const originalText = btn.textContent;

```
btn.textContent = 'Sending...';
btn.disabled = true;
btn.style.opacity = '0.7';

// Simulate async submission
setTimeout(() => {
  status.textContent = '✓ Message received. We\'ll be in touch within 24 hours.';
  status.style.color = '#c8a84b';
  btn.textContent = originalText;
  btn.disabled = false;
  btn.style.opacity = '1';
  e.target.reset();

  // Clear status after 6 seconds
  setTimeout(() => {
    status.textContent = '';
  }, 6000);
}, 1400);
```

};

/* — Cursor glow effect on desktop — */
function initCursorGlow() {
if (window.matchMedia(’(hover: none)’).matches) return; // skip on touch

```
const glow = document.createElement('div');
glow.style.cssText = `
  position: fixed;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(200,168,75,0.04) 0%, transparent 70%);
  pointer-events: none;
  z-index: 9998;
  transform: translate(-50%, -50%);
  transition: opacity 0.3s;
  will-change: transform;
`;
document.body.appendChild(glow);

let mouseX = 0, mouseY = 0;
let glowX = 0, glowY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateGlow() {
  glowX += (mouseX - glowX) * 0.08;
  glowY += (mouseY - glowY) * 0.08;
  glow.style.transform = `translate(${glowX - 150}px, ${glowY - 150}px)`;
  requestAnimationFrame(animateGlow);
}
animateGlow();
```

}

/* — Gold number counter animation — */
function initCounters() {
const stats = document.querySelectorAll(’.stat-n’);
const observer = new IntersectionObserver((entries) => {
entries.forEach((entry) => {
if (!entry.isIntersecting) return;
const el = entry.target;
const text = el.textContent;
const num = parseFloat(text);
if (isNaN(num)) return;

```
    const suffix = text.replace(/[\d.]/g, '');
    let start = 0;
    const duration = 1200;
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = start + (num - start) * eased;
      el.textContent = (num % 1 === 0 ? Math.floor(current) : current.toFixed(1)) + suffix;
      if (t < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
    observer.unobserve(el);
  });
}, { threshold: 0.5 });

stats.forEach((el) => observer.observe(el));
```

}

/* — Init all — */
function init() {
initFadeUps();
initNav();
initSmoothScroll();
initCursorGlow();
initCounters();
}

if (document.readyState === ‘loading’) {
document.addEventListener(‘DOMContentLoaded’, init);
} else {
init();
}

})();
