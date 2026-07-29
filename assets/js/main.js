/* Marco Strote — Portfolio
   Vanilla JS, keine Abhängigkeiten, kein Tracking.
   Alles ist Progressive Enhancement: ohne JS bleibt die Seite voll nutzbar. */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- 1. Header: Zustand beim Scrollen -------------------------------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* --- 2. Mobile-Navigation -------------------------------------------- */
  var toggle = document.querySelector('.nav-toggle');
  var mobileNav = document.getElementById('nav-mobile');

  if (toggle && mobileNav) {
    var setNav = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', toggle.dataset[open ? 'labelClose' : 'labelOpen'] || '');
      mobileNav.classList.toggle('is-open', open);
      document.body.classList.toggle('nav-locked', open);
    };

    toggle.addEventListener('click', function () {
      setNav(toggle.getAttribute('aria-expanded') !== 'true');
    });

    mobileNav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setNav(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setNav(false);
        toggle.focus();
      }
    });

    // Beim Wechsel auf Desktop-Breite zurücksetzen
    var desktop = window.matchMedia('(min-width: 62rem)');
    var onBreakpoint = function (e) { if (e.matches) setNav(false); };
    if (desktop.addEventListener) desktop.addEventListener('change', onBreakpoint);
    else desktop.addListener(onBreakpoint);
  }

  /* --- 3. FAQ-Akkordeon ------------------------------------------------- */
  document.querySelectorAll('.faq-q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      item.classList.toggle('is-open', !open);
    });
  });

  /* --- 4. Scroll-Reveal ------------------------------------------------- */
  var revealables = document.querySelectorAll('[data-reveal]');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });

    revealables.forEach(function (el) { revealObserver.observe(el); });
  }

  /* --- 5. Scrollspy: aktiver Navigationspunkt --------------------------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-desktop .nav-link[href^="#"]'));

  if (navLinks.length && 'IntersectionObserver' in window) {
    var sections = navLinks
      .map(function (link) { return document.querySelector(link.getAttribute('href')); })
      .filter(Boolean);

    var setActive = function (id) {
      navLinks.forEach(function (link) {
        var match = link.getAttribute('href') === '#' + id;
        if (match) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    };

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(function (section) { spy.observe(section); });
  }

  /* --- 6. E-Mail-Adresse erst per JS zusammensetzen (Spam-Schutz) ------- */
  document.querySelectorAll('[data-mail-user][data-mail-domain]').forEach(function (el) {
    var address = el.dataset.mailUser + '@' + el.dataset.mailDomain;
    el.setAttribute('href', 'mailto:' + address + (el.dataset.mailSubject ? '?subject=' + encodeURIComponent(el.dataset.mailSubject) : ''));
    if (el.hasAttribute('data-mail-print')) el.textContent = address;
  });

  /* --- 7. Marquee: Inhalt für nahtlose Schleife verdoppeln -------------- */
  var track = document.querySelector('.marquee-track');
  if (track && !reduceMotion) {
    track.innerHTML += track.innerHTML;
    track.setAttribute('aria-hidden', 'true');
  }

  /* --- 8. Jahreszahl im Footer ----------------------------------------- */
  document.querySelectorAll('[data-current-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
