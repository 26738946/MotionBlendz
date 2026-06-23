/**
 * Motion Blendz Barbershop — script.js
 * All interactive features: loader, navbar, scroll reveal,
 * counters, gallery filter, lightbox, testimonials slider,
 * form validation, toast, back-to-top.
 */

'use strict';

/* ============================================
   1. LOADING SCREEN
   ============================================ */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 2200);
});


/* ============================================
   2. STICKY NAVBAR
   ============================================ */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');

function handleNavScroll() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Highlight active section
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) link.classList.add('active');
  });
}

window.addEventListener('scroll', handleNavScroll, { passive: true });


/* ============================================
   3. MOBILE MENU
   ============================================ */
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinksEl.classList.toggle('open');
  document.body.style.overflow = navLinksEl.classList.contains('open') ? 'hidden' : '';
});

// Close on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinksEl.classList.remove('open');
    document.body.style.overflow = '';
  });
});


/* ============================================
   4. SMOOTH SCROLLING
   ============================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});


/* ============================================
   5. SCROLL REVEAL ANIMATIONS
   ============================================ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal-fade, .reveal-up, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});


/* ============================================
   6. ANIMATED COUNTERS
   ============================================ */
const counters = document.querySelectorAll('.stat-number');

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target.toLocaleString();
  }
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

counters.forEach(c => counterObserver.observe(c));


/* ============================================
   7. GALLERY FILTER + LIGHTBOX
   ============================================ */
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');

// Filter
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    galleryItems.forEach(item => {
      const category = item.dataset.category;
      if (filter === 'all' || category === filter) {
        item.classList.remove('hidden');
        item.style.opacity = '0';
        item.style.transform = 'scale(0.9)';
        // Animate in
        setTimeout(() => {
          item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        }, 20);
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

// Lightbox
let currentLightboxIndex = 0;
const visibleItems = () => [...galleryItems].filter(i => !i.classList.contains('hidden'));

galleryItems.forEach((item, idx) => {
  item.addEventListener('click', () => {
    currentLightboxIndex = [...visibleItems()].indexOf(item);
    openLightbox();
  });
});

function openLightbox() {
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
  updateLightboxContent();
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function updateLightboxContent() {
  const items = visibleItems();
  const item = items[currentLightboxIndex];
  if (!item) return;

  const lbImg = document.getElementById('lightboxImg');
  const realImg = item.querySelector('.gallery-real-img');

  if (realImg) {
    // Real photo — show it in the lightbox
    lbImg.src = realImg.src;
    lbImg.alt = realImg.alt || 'Motion Blendz Work';
    lbImg.style.display = 'block';
  } else {
    // Still a placeholder — show a generic message
    lbImg.src = '';
    lbImg.alt = 'Photo coming soon';
    lbImg.style.display = 'none';
  }
}

document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
document.querySelector('.lightbox-overlay').addEventListener('click', closeLightbox);

document.querySelector('.lightbox-prev').addEventListener('click', () => {
  const items = visibleItems();
  currentLightboxIndex = (currentLightboxIndex - 1 + items.length) % items.length;
  updateLightboxContent();
});

document.querySelector('.lightbox-next').addEventListener('click', () => {
  const items = visibleItems();
  currentLightboxIndex = (currentLightboxIndex + 1) % items.length;
  updateLightboxContent();
});

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') document.querySelector('.lightbox-prev').click();
  if (e.key === 'ArrowRight') document.querySelector('.lightbox-next').click();
});


/* ============================================
   8. TESTIMONIALS SLIDER
   ============================================ */
const track = document.getElementById('testimonialsTrack');
const dotsContainer = document.getElementById('testiDots');
const cards = track ? [...track.querySelectorAll('.testi-card')] : [];
let currentSlide = 0;
let testiInterval;

// Determine how many cards are visible at once
function visibleCount() {
  if (window.innerWidth <= 768) return 1;
  if (window.innerWidth <= 900) return 2;
  return 3;
}

function totalSlides() {
  return Math.max(1, cards.length - visibleCount() + 1);
}

// Build dots
function buildDots() {
  dotsContainer.innerHTML = '';
  for (let i = 0; i < totalSlides(); i++) {
    const dot = document.createElement('button');
    dot.className = 'testi-dot' + (i === currentSlide ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }
}

function updateDots() {
  dotsContainer.querySelectorAll('.testi-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

function goToSlide(n) {
  currentSlide = Math.max(0, Math.min(n, totalSlides() - 1));
  const cardWidth = cards[0] ? cards[0].offsetWidth + 24 : 0; // +gap
  track.style.transform = `translateX(-${currentSlide * cardWidth}px)`;
  updateDots();
}

function nextSlide() {
  goToSlide(currentSlide < totalSlides() - 1 ? currentSlide + 1 : 0);
}

function prevSlide() {
  goToSlide(currentSlide > 0 ? currentSlide - 1 : totalSlides() - 1);
}

function startAutoplay() {
  stopAutoplay();
  testiInterval = setInterval(nextSlide, 4500);
}

function stopAutoplay() {
  clearInterval(testiInterval);
}

if (track) {
  buildDots();
  startAutoplay();

  document.getElementById('testiNext').addEventListener('click', () => { nextSlide(); startAutoplay(); });
  document.getElementById('testiPrev').addEventListener('click', () => { prevSlide(); startAutoplay(); });

  // Pause on hover
  track.addEventListener('mouseenter', stopAutoplay);
  track.addEventListener('mouseleave', startAutoplay);

  // Touch support
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? nextSlide() : prevSlide();
    startAutoplay();
  });

  window.addEventListener('resize', () => {
    buildDots();
    goToSlide(0);
  });
}


/* ============================================
   9. BOOKING FORM VALIDATION & TOAST
   ============================================ */
const bookingForm = document.getElementById('bookingForm');

function showToast(message, isError = false) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  const icon = toast.querySelector('i');

  toastMsg.textContent = message;
  icon.className = isError ? 'fas fa-exclamation-circle' : 'fas fa-check-circle';
  icon.style.color = isError ? '#ff4444' : '#FF0000';
  toast.classList.add('show');

  setTimeout(() => toast.classList.remove('show'), 4000);
}

function validateField(input) {
  const group = input.closest('.form-group');
  const error = group ? group.querySelector('.field-error') : null;
  let valid = true;
  let msg = '';

  if (input.hasAttribute('required') || input.value.trim()) {
    if (!input.value.trim()) {
      valid = false;
      msg = 'This field is required.';
    } else if (input.type === 'tel') {
      const phoneRegex = /^[0-9+\-\s()]{7,15}$/;
      if (!phoneRegex.test(input.value.trim())) {
        valid = false;
        msg = 'Enter a valid phone number.';
      }
    }
  }

  if (error) error.textContent = msg;
  input.classList.toggle('error', !valid && !!msg);
  return valid || !msg;
}

if (bookingForm) {
  // Live validation
  bookingForm.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('error')) validateField(field);
    });
  });

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let allValid = true;

    const required = ['fullName', 'phone', 'service', 'prefDate', 'prefTime'];
    required.forEach(id => {
      const field = document.getElementById(id);
      if (field) {
        const v = validateField(field);
        if (!v) allValid = false;
      }
    });

    if (!allValid) {
      showToast('Please fill in all required fields.', true);
      return;
    }

    // Simulate submission (replace with real API call)
    const submitBtn = bookingForm.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking...';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-calendar-check"></i> Confirm Booking';
      bookingForm.reset();
      showToast('Booking confirmed! We\'ll contact you shortly. ✂️');
    }, 2000);
  });
}


/* ============================================
   10. BACK TO TOP
   ============================================ */
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 500);
}, { passive: true });

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ============================================
   11. FOOTER YEAR
   ============================================ */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();


/* ============================================
   12. PARALLAX ON HERO DECORATIONS
   ============================================ */
const heroDeco1 = document.querySelector('.hero-deco-1');
const heroDeco2 = document.querySelector('.hero-deco-2');

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  if (heroDeco1) heroDeco1.style.transform = `translateY(${scrolled * 0.15}px)`;
  if (heroDeco2) heroDeco2.style.transform = `translateY(${scrolled * -0.1}px)`;
}, { passive: true });
