/* ============================================================
   BOTICA NATURAL — main.js
   Handles: navbar scroll, mobile menu, smooth scroll, reveal
   ============================================================ */

(function () {
  'use strict';

  /* --- Elements -------------------------------------------- */
  const navbar    = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu   = document.getElementById('navMenu');

  /* --- Navbar: scroll state -------------------------------- */
  function updateNavbar() {
    if (window.scrollY > 60) {
      navbar.classList.add('is-scrolled');
    } else {
      navbar.classList.remove('is-scrolled');
    }
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  /* --- Mobile menu toggle ---------------------------------- */
  navToggle.addEventListener('click', function () {
    const isOpen = navMenu.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  function closeMenu() {
    navMenu.classList.remove('is-open');
    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  /* Close on link click */
  navMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  /* Close on Escape key */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
      closeMenu();
    }
  });

  /* --- Smooth scroll for in-page anchors ------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();

      const offset = navbar.offsetHeight + 12;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* --- Scroll reveal (IntersectionObserver) ---------------- */
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    /* Fallback: show everything immediately */
    revealElements.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* --- Active nav link highlight on scroll ----------------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar__link');

  function highlightNav() {
    const scrollY = window.scrollY + navbar.offsetHeight + 40;

    sections.forEach(function (section) {
      const top    = section.offsetTop;
      const bottom = top + section.offsetHeight;

      if (scrollY >= top && scrollY < bottom) {
        const id = section.getAttribute('id');
        navLinks.forEach(function (link) {
          link.classList.toggle(
            'navbar__link--active',
            link.getAttribute('href') === '#' + id
          );
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });

})();
