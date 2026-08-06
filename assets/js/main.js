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

  /* --- 8. Blog: Filter nach Rubrik --------------------------------------
     Reine Anzeigehilfe. Ohne JavaScript sind schlicht alle Beiträge sichtbar,
     was der brauchbare Ausgangszustand ist. */
  var filterButtons = document.querySelectorAll('.blog-filter .chip');

  if (filterButtons.length) {
    var cards = document.querySelectorAll('.post-card');

    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var wanted = btn.dataset.filter;

        filterButtons.forEach(function (b) { b.classList.toggle('is-active', b === btn); });
        cards.forEach(function (card) {
          card.hidden = wanted !== '*' && card.dataset.category !== wanted;
        });
      });
    });
  }

  /* --- 9. Kontaktformular: Absenden per fetch statt Seitenwechsel --------
     Die <form> selbst funktioniert auch ohne dieses Skript: sie sendet nativ
     an Web3Forms, das per "redirect"-Feld auf die Danke-Seite weiterleitet.
     Mit JavaScript bleibt der Besucher auf der Seite und sieht sofort, ob es
     geklappt hat. */
  document.querySelectorAll('form[data-web3forms]').forEach(function (form) {
    var status = form.querySelector('.cf-status');
    var button = form.querySelector('button[type="submit"]');
    var buttonLabel = button ? button.querySelector('span') : null;
    var botcheck = form.querySelector('.cf-botcheck');

    var showStatus = function (state, title, text) {
      status.hidden = false;
      status.dataset.state = state;
      status.innerHTML = '';
      var strong = document.createElement('strong');
      strong.textContent = title;
      var p = document.createElement('p');
      p.textContent = text;
      status.append(strong, p);
      status.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      // Ausgefülltes Honeypot-Feld verrät ein automatisiertes Skript.
      if (botcheck && botcheck.checked) return;

      var data = Object.fromEntries(new FormData(form).entries());
      var name = (data.name || '').trim();
      var reason = data.reason || '';
      data.subject = form.dataset.subject + (name ? ' — ' + name : '') + (reason ? ' (' + reason + ')' : '');
      data.botcheck = false;

      if (button) {
        button.disabled = true;
        if (buttonLabel) buttonLabel.textContent = button.dataset.labelSending;
      }

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      })
        .then(function (r) { return r.json(); })
        .then(function (result) {
          if (result.success) {
            showStatus('ok', form.dataset.successTitle, form.dataset.successText);
            form.reset();
          } else {
            showStatus('error', form.dataset.errorTitle, form.dataset.errorText);
          }
        })
        .catch(function () {
          showStatus('error', form.dataset.errorTitle, form.dataset.errorText);
        })
        .finally(function () {
          if (button) {
            button.disabled = false;
            if (buttonLabel) buttonLabel.textContent = button.dataset.labelIdle;
          }
        });
    });
  });

  /* --- 9b. "Weitere Stationen"-Aufklapper: Beschriftung spiegelt den Zustand
     Ohne das blieb der Button-Text beim Öffnen unverändert auf "+ weitere
     Stationen" stehen. Ohne sichtbare Rückmeldung tippen Nutzer im Zweifel
     ein zweites Mal — und klappen dabei über das native <details>-Verhalten
     versehentlich wieder zu, bevor sie die zusätzlichen Stationen sehen. */
  document.querySelectorAll('.tl-more, .cv-more').forEach(function (details) {
    var summary = details.querySelector('summary');
    if (!summary || !summary.dataset.labelLess) return;

    details.addEventListener('toggle', function () {
      summary.textContent = details.open ? summary.dataset.labelLess : summary.dataset.labelMore;
    });
  });

  /* --- 9c. Qualifikationen-Akkordeon: alle Gruppen-Labels gleich hoch -----
     Kategorienamen sind unterschiedlich lang ("KI" vs. "ITIL 4 IT Service
     Management / Strategic Leader") und brechen je nach Breite unterschiedlich
     oft um. Ohne Angleichung wirkt die kurze Zeile kleiner/leichter als die
     lange, obwohl beide gleich gewichtet sein sollen. Wir messen die höchste
     Beschriftung und übertragen sie auf alle - bei Resize/Schriftladen neu,
     weil sich der Umbruch mit der Breite ändert. */
  var certLabels = document.querySelectorAll('.cert-label');
  if (certLabels.length) {
    var equalizeCertLabels = function () {
      certLabels.forEach(function (el) { el.style.minHeight = ''; });
      var max = 0;
      certLabels.forEach(function (el) { max = Math.max(max, el.offsetHeight); });
      certLabels.forEach(function (el) { el.style.minHeight = max + 'px'; });
    };
    var certResizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(certResizeTimer);
      certResizeTimer = setTimeout(equalizeCertLabels, 150);
    });
    equalizeCertLabels();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(equalizeCertLabels);
  }

  /* --- 10. Vor dem Drucken alles aufklappen ------------------------------
     Auf Papier kann niemand einen Aufklapper öffnen — was zugeklappt bliebe,
     wäre für den Leser schlicht verloren. */
  window.addEventListener('beforeprint', function () {
    document.querySelectorAll('details').forEach(function (d) { d.open = true; });
    document.querySelectorAll('.faq-item').forEach(function (i) { i.classList.add('is-open'); });
  });

  /* --- 11. Jahreszahl im Footer ---------------------------------------- */
  document.querySelectorAll('[data-current-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
