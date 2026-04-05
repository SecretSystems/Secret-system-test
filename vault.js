# /* =========================================
SECRET SYSTEMS — Vault Scroll Animation

Scroll phases (0–1 normalized):
0.00 – 0.35  Handle spins (unlocking)
0.30 – 0.50  Bolts retract
0.45 – 0.70  Door swings open (3D rotate)
0.55 – 0.85  Camera zooms into interior
0.85 – 1.00  Vault fades out, main content fades in
========================================= */

(function () {
‘use strict’;

/* — Elements — */
const vaultScene    = document.getElementById(‘vault-scene’);
const vaultWrapper  = document.getElementById(‘vault-wrapper’);
const vaultDoor     = document.getElementById(‘vault-door’);
const doorContainer = document.getElementById(‘vault-door-container’);
const vaultHandle   = document.getElementById(‘vault-handle’);
const scrollHint    = document.getElementById(‘scroll-hint’);
const mainContent   = document.getElementById(‘main-content’);
const vaultHeadline = document.getElementById(‘vault-headline’);

/* — State — */
let scrollY    = 0;
let maxScroll  = 0; // set on init
const SCROLL_RANGE = 2200; // px of virtual scroll for the animation

/* — Create a tall scroll container so the page can scroll — */
const scrollSpacer = document.createElement(‘div’);
scrollSpacer.id = ‘scroll-spacer’;
scrollSpacer.style.cssText = `height: ${SCROLL_RANGE}px; position: relative; z-index: 0;`;
document.body.insertBefore(scrollSpacer, mainContent);

/* — Clamp helper — */
function clamp(val, min, max) {
return Math.min(Math.max(val, min), max);
}

/* — Map a value from one range to another — */
function mapRange(val, inMin, inMax, outMin, outMax) {
const t = clamp((val - inMin) / (inMax - inMin), 0, 1);
return outMin + t * (outMax - outMin);
}

/* — Ease in-out quad — */
function easeInOut(t) {
return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

/* — Ease out expo — */
function easeOutExpo(t) {
return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

/* — Main animation driver — */
function onScroll() {
scrollY = window.scrollY;
const progress = clamp(scrollY / SCROLL_RANGE, 0, 1);

```
// Hide scroll hint early
if (progress > 0.04) {
  scrollHint.classList.add('hidden');
} else {
  scrollHint.classList.remove('hidden');
}

// --- Phase 1: Handle rotates (0 → 0.38) ---
const handleProgress = mapRange(progress, 0, 0.38, 0, 1);
const handleDeg = easeInOut(handleProgress) * 720; // 2 full spins
vaultHandle.style.transform = `rotate(${handleDeg}deg)`;

// --- Phase 2: Bolts retract (0.28 → 0.50) ---
if (progress >= 0.28) {
  vaultDoor.classList.add('unlocked');
} else {
  vaultDoor.classList.remove('unlocked');
}

// --- Phase 3: Door swings open (0.44 → 0.72) ---
const doorProgress = mapRange(progress, 0.44, 0.72, 0, 1);
const doorDeg = easeOutExpo(doorProgress) * -110;
doorContainer.style.transform = `perspective(1200px) rotateY(${doorDeg}deg)`;

// --- Phase 4: Camera zoom into vault interior (0.58 → 0.88) ---
const zoomProgress = mapRange(progress, 0.58, 0.88, 0, 1);
const easedZoom = easeInOut(zoomProgress);

// Scale up the vault wrapper (zooming in)
const scaleVal = 1 + easedZoom * 14; // grows from 1x to 15x
vaultWrapper.style.transform = `scale(${scaleVal})`;

// Move vault wrapper slightly to compensate for door offset as we zoom
const translateX = easedZoom * -15; // slight left shift to center into interior
vaultWrapper.style.transformOrigin = `${50 + translateX}% 50%`;

// Fade out the headline as zoom starts
const headlineOpacity = 1 - mapRange(progress, 0.44, 0.62, 0, 1);
vaultHeadline.style.opacity = Math.max(0, headlineOpacity);

// --- Phase 5: Vault scene fades out, content fades in (0.84 → 1.0) ---
const fadeProgress = mapRange(progress, 0.84, 1.0, 0, 1);

if (fadeProgress > 0) {
  vaultScene.style.opacity = 1 - fadeProgress;
} else {
  vaultScene.style.opacity = 1;
}

if (fadeProgress >= 1) {
  // Fully hide vault and show content
  vaultScene.classList.add('hidden');
  mainContent.classList.add('visible');
  // Lock scrolling back to normal page scroll
  document.body.style.overflow = '';
} else {
  vaultScene.classList.remove('hidden');
  if (fadeProgress > 0.5) {
    mainContent.classList.add('visible');
  }
}
```

}

/* — Smooth scroll interpolation for butter-smooth feel — */
let targetScroll = 0;
let currentScroll = 0;
let isAnimating = false;

function lerp(a, b, t) {
return a + (b - a) * t;
}

function animateScroll() {
currentScroll = lerp(currentScroll, targetScroll, 0.09);

```
// Sync window scroll to our smooth value during vault phase
if (window.scrollY < SCROLL_RANGE) {
  window.scrollTo(0, currentScroll);
}

onScroll();

if (Math.abs(currentScroll - targetScroll) > 0.5) {
  requestAnimationFrame(animateScroll);
} else {
  isAnimating = false;
}
```

}

/* — Intercept wheel & touch events during vault sequence — */
let touchStartY = 0;

function handleWheel(e) {
// Only intercept during vault sequence
if (window.scrollY >= SCROLL_RANGE && mainContent.classList.contains(‘visible’)) return;

```
e.preventDefault();
targetScroll = clamp(targetScroll + e.deltaY * 1.4, 0, SCROLL_RANGE);

if (!isAnimating) {
  isAnimating = true;
  requestAnimationFrame(animateScroll);
}
```

}

function handleTouchStart(e) {
touchStartY = e.touches[0].clientY;
}

function handleTouchMove(e) {
if (window.scrollY >= SCROLL_RANGE && mainContent.classList.contains(‘visible’)) return;

```
e.preventDefault();
const delta = touchStartY - e.touches[0].clientY;
touchStartY = e.touches[0].clientY;
targetScroll = clamp(targetScroll + delta * 2, 0, SCROLL_RANGE);

if (!isAnimating) {
  isAnimating = true;
  requestAnimationFrame(animateScroll);
}
```

}

/* — Keyboard support (arrow / page keys) — */
function handleKeydown(e) {
if (window.scrollY >= SCROLL_RANGE && mainContent.classList.contains(‘visible’)) return;

```
let delta = 0;
if (e.key === 'ArrowDown' || e.key === 'PageDown') delta = 200;
if (e.key === 'ArrowUp'   || e.key === 'PageUp')   delta = -200;
if (e.key === 'End') delta = SCROLL_RANGE;
if (e.key === 'Home') delta = -SCROLL_RANGE;

if (delta !== 0) {
  e.preventDefault();
  targetScroll = clamp(targetScroll + delta, 0, SCROLL_RANGE);
  if (!isAnimating) {
    isAnimating = true;
    requestAnimationFrame(animateScroll);
  }
}
```

}

/* — Init — */
function init() {
// Prevent normal scroll during vault animation on initial load
if (window.scrollY < SCROLL_RANGE) {
window.scrollTo(0, 0);
}

```
window.addEventListener('wheel',      handleWheel,     { passive: false });
window.addEventListener('touchstart', handleTouchStart, { passive: true });
window.addEventListener('touchmove',  handleTouchMove,  { passive: false });
window.addEventListener('keydown',    handleKeydown);

// Also run on native scroll (for momentum / trackpad)
window.addEventListener('scroll', onScroll, { passive: true });

// Initial render
onScroll();
```

}

if (document.readyState === ‘loading’) {
document.addEventListener(‘DOMContentLoaded’, init);
} else {
init();
}

})();
