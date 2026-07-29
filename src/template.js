'use strict';

/* HTML-Renderer. Erzeugt aus content/*.json vollständig statisches HTML —
   entscheidend für SEO und GEO: alle Inhalte stehen im Quelltext, nichts
   wird per JavaScript nachgeladen. */

/* --- Hilfsfunktionen ------------------------------------------------------ */

const esc = (v) =>
  String(v == null ? '' : v)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const PLACEHOLDER_RE = /\[\[(?:PLATZHALTER|PLACEHOLDER):?\s*([^\]]*)\]\]\s*/g;

/* Platzhaltermarkierung entfernen, den Beispieltext dahinter aber erhalten —
   so bleibt die Seite auch im Entwurfsstand lesbar. */
const clean = (v) => String(v == null ? '' : v).replace(PLACEHOLDER_RE, '').trim();

/* Klartext für JSON-LD und llms.txt: dort dürfen keine Platzhalter landen. */
const isPlaceholder = (v) => /\[\[(?:PLATZHALTER|PLACEHOLDER)/.test(String(v == null ? '' : v));

/* Hinweistext aus einer reinen Platzhalter-Angabe ziehen. */
const placeholderHint = (v) => {
  const m = String(v == null ? '' : v).match(/\[\[(?:PLATZHALTER|PLACEHOLDER):?\s*([^\]]*)\]\]/);
  return m && m[1].trim() ? m[1].trim() : 'Angabe ergänzen';
};

/* Text für den Seiteninhalt. Steht hinter dem Platzhalter noch ein
   Beispieltext, wird dieser gezeigt. Fehlt er ganz, erscheint statt einer
   leeren Zeile ein sichtbar markierter Hinweis. */
const t = (v) => {
  const rest = clean(v);
  if (rest) return esc(rest);
  if (isPlaceholder(v)) return `<mark class="todo">${esc(placeholderHint(v))}</mark>`;
  return '';
};

/* Text für Attributwerte — hier darf niemals Markup entstehen. */
const ta = (v) => {
  const rest = clean(v);
  return esc(rest || (isPlaceholder(v) ? placeholderHint(v) : ''));
};

const jsonLd = (obj) =>
  JSON.stringify(obj, null, 2).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');

/* Interne URL. Der Basis-Pfad ist leer, wenn die Seite unter einer eigenen
   Domain liegt, und '/Repository-Name', wenn sie als GitHub-Projektseite
   veröffentlicht wird. Ohne diese Unterscheidung würden dort saemtliche
   Verweise auf CSS, Bilder und Unterseiten ins Leere laufen. */
const u = (c, p) => {
  const s = String(p == null ? '' : p);
  if (!s || s.startsWith('#') || s.startsWith('mailto:') || /^[a-z]+:/i.test(s)) return s;
  return (c.site.basePath || '') + s;
};

const abs = (c, path) => c.site.domain.replace(/\/$/, '') + u(c, path);

/* --- Icons (inline, damit keine externen Requests entstehen) -------------- */

const icon = {
  arrowRight: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M2 8h12M9 3l5 5-5 5"/></svg>',
  download: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M8 2v9M4 7l4 4 4-4M2 14h12"/></svg>',
  arrowUp: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M8 14V2M3 7l5-5 5 5"/></svg>',
};

/* --- Kopf und Fuß --------------------------------------------------------- */

function head(c, page) {
  const canonical = abs(c, page.path);
  const isHome = page.type === 'home';

  const schemas = isHome ? homeSchemas(c) : [legalSchema(c, page)];

  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(page.title)}</title>
<meta name="description" content="${ta(page.description)}">
${page.keywords ? `<meta name="keywords" content="${esc(page.keywords)}">` : ''}
<meta name="author" content="${esc(c.site.name)}">
<meta name="robots" content="${page.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'}">
<meta name="theme-color" content="#f7f5f1" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#14130f" media="(prefers-color-scheme: dark)">
<meta name="format-detection" content="telephone=no">

<link rel="canonical" href="${esc(canonical)}">
<link rel="alternate" hreflang="de" href="${esc(abs(c, page.hrefDe))}">
<link rel="alternate" hreflang="en" href="${esc(abs(c, page.hrefEn))}">
<link rel="alternate" hreflang="x-default" href="${esc(abs(c, page.hrefDe))}">

<meta property="og:type" content="${isHome ? 'profile' : 'article'}">
<meta property="og:site_name" content="${esc(c.site.name)}">
<meta property="og:locale" content="${esc(c.locale)}">
<meta property="og:title" content="${esc(page.title)}">
<meta property="og:description" content="${ta(page.description)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:image" content="${esc(abs(c, c.meta.ogImage))}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${ta(c.meta.ogImageAlt)}">
${isHome ? `<meta property="profile:first_name" content="Marco">\n<meta property="profile:last_name" content="Strote">` : ''}
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(page.title)}">
<meta name="twitter:description" content="${ta(page.description)}">
<meta name="twitter:image" content="${esc(abs(c, c.meta.ogImage))}">

<link rel="icon" href="${esc(u(c, '/assets/img/favicon.svg'))}" type="image/svg+xml">
<link rel="apple-touch-icon" href="${esc(u(c, '/assets/img/apple-touch-icon.png'))}">
<link rel="manifest" href="${esc(u(c, '/site.webmanifest'))}">
<link rel="stylesheet" href="${esc(u(c, '/assets/css/style.css'))}">
<script src="${esc(u(c, '/assets/js/main.js'))}" defer></script>

${schemas.map((s) => `<script type="application/ld+json">\n${jsonLd(s)}\n</script>`).join('\n')}`;
}

function header(c, page) {
  const navItems = page.type === 'home' ? c.nav.items : [];
  return `<header class="site-header">
  <div class="wrap header-inner">
    <a class="brand" href="${esc(u(c, page.homePath))}">${esc(c.site.name)}</a>

    <nav class="nav-desktop" aria-label="${ta(c.nav.menuLabel)}">
      ${navItems.map((i) => `<a class="nav-link" href="${esc(i.href)}">${t(i.label)}</a>`).join('\n      ')}
      <a class="btn btn-primary" href="${esc(u(c, page.type === 'home' ? c.nav.cta.href : page.homePath + c.nav.cta.href))}">${t(c.nav.cta.label)}</a>
      <a class="lang-switch" href="${esc(u(c, page.altPath))}" hreflang="${esc(c.site.altLang)}" lang="${esc(c.site.altLang)}" title="${ta(c.site.altTitle)}">${esc(c.site.altLabel)}</a>
    </nav>

    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-mobile"
            aria-label="${ta(c.nav.openMenu)}"
            data-label-open="${ta(c.nav.openMenu)}" data-label-close="${ta(c.nav.closeMenu)}">
      <span></span><span></span><span></span>
    </button>
  </div>
</header>

<div class="nav-mobile" id="nav-mobile">
  <nav aria-label="${ta(c.nav.menuLabel)}">
    <ul>
      ${(page.type === 'home' ? c.nav.items.concat([c.nav.cta]) : [{ href: page.homePath, label: c.legal.backLink }])
        .map((i, n) => `<li><a class="nav-m-link" href="${esc(u(c, i.href))}" style="--i:${n}"><span>${String(n + 1).padStart(2, '0')}</span>${t(i.label)}</a></li>`)
        .join('\n      ')}
    </ul>
  </nav>
  <div class="nav-mobile-foot">
    <a href="#" data-mail-user="${esc(c.contact.emailUser)}" data-mail-domain="${esc(c.contact.emailDomain)}" data-mail-print>${esc(c.contact.emailUser)}&#64;${esc(c.contact.emailDomain)}</a>
    <a class="lang-switch" href="${esc(u(c, page.altPath))}" hreflang="${esc(c.site.altLang)}" lang="${esc(c.site.altLang)}">${esc(c.site.altLabel)}</a>
  </div>
</div>`;
}

function footer(c, page) {
  return `<footer class="site-footer">
  <div class="wrap">
    <div class="footer-top">
      <div>
        <p class="footer-name">${esc(c.site.name)}</p>
        <p class="footer-tagline">${t(c.footer.tagline)}</p>
      </div>
      <a class="to-top" href="#top">${t(c.footer.backToTop)} ${icon.arrowUp}</a>
    </div>
    <div class="footer-bottom">
      <p>&copy; <span data-current-year>2026</span> ${esc(c.site.name)}. ${t(c.footer.copyright)}</p>
      <nav class="footer-links" aria-label="Legal">
        ${c.footer.links.map((l) => `<a href="${esc(u(c, l.href))}">${t(l.label)}</a>`).join('\n        ')}
        <a href="${esc(u(c, page.altPath))}" hreflang="${esc(c.site.altLang)}" lang="${esc(c.site.altLang)}">${esc(c.site.altLabel)}</a>
      </nav>
    </div>
  </div>
</footer>`;
}

function shell(c, page, body) {
  return `<!doctype html>
<html lang="${esc(c.lang)}">
<head>
${head(c, page)}
</head>
<body id="top">
<a class="skip-link" href="#main">${t(c.nav.skipToContent)}</a>
${header(c, page)}
<main id="main">
${body}
</main>
${footer(c, page)}
</body>
</html>
`;
}

/* --- Sektionen der Startseite --------------------------------------------- */

function sectionHead(s, delay = 0) {
  return `<div class="section-head" data-reveal${delay ? ` style="--reveal-delay:${delay}ms"` : ''}>
      <span class="eyebrow">${t(s.eyebrow)}</span>
      <h2>${t(s.title)}</h2>
      ${s.lead ? `<p class="lead">${t(s.lead)}</p>` : ''}
    </div>`;
}

function heroSection(c) {
  const h = c.hero;
  return `<section class="hero">
  <div class="wrap hero-grid">
    <div>
      <span class="eyebrow" data-reveal>${t(h.eyebrow)}</span>
      <h1 data-reveal style="--reveal-delay:60ms">${esc(h.name)}</h1>
      <p class="hero-headline" data-reveal style="--reveal-delay:120ms">${t(h.headline)}</p>
      <p class="hero-intro" data-reveal style="--reveal-delay:180ms">${t(h.intro)}</p>

      <dl class="hero-facts" data-reveal style="--reveal-delay:240ms">
        ${h.facts.map((f) => `<div><dt>${t(f.label)}</dt><dd>${t(f.value)}</dd></div>`).join('\n        ')}
      </dl>

      <div class="hero-cta" data-reveal style="--reveal-delay:300ms">
        <a class="btn btn-primary" href="${esc(u(c, h.primaryCta.href))}">${t(h.primaryCta.label)} ${icon.arrowRight}</a>
        ${h.secondaryCta.available ? `<a class="btn btn-ghost" href="${esc(u(c, h.secondaryCta.href))}" download>${t(h.secondaryCta.label)} ${icon.download}</a>` : ''}
      </div>
    </div>

    <figure class="hero-portrait" data-reveal style="--reveal-delay:160ms">
      <img src="${esc(u(c, h.portraitSrc))}" alt="${ta(h.portraitAlt)}" width="800" height="1000" fetchpriority="high" decoding="async">
    </figure>
  </div>
</section>

<div class="marquee" aria-hidden="true">
  <div class="marquee-track">
    ${c.skills.groups.flatMap((g) => g.tags.slice(0, 3)).map((s) => `<span>${t(s)}</span>`).join('\n    ')}
  </div>
</div>`;
}

function skillsSection(c) {
  const s = c.skills;
  return `<section class="section" id="${esc(s.id)}" aria-labelledby="${esc(s.id)}-title">
  <div class="wrap">
    <div class="section-head" data-reveal>
      <span class="eyebrow">${t(s.eyebrow)}</span>
      <h2 id="${esc(s.id)}-title">${t(s.title)}</h2>
      <p class="lead">${t(s.lead)}</p>
    </div>

    <div class="skill-groups">
      ${s.groups
        .map(
          (g, i) => `<div class="skill-group" data-reveal style="--reveal-delay:${i * 80}ms">
        <h3>${t(g.title)} <b>${String(g.tags.length).padStart(2, '0')}</b></h3>
        <ul class="skill-tags">
          ${g.tags.map((tag) => `<li class="tag">${t(tag)}</li>`).join('\n          ')}
        </ul>
      </div>`
        )
        .join('\n      ')}
    </div>
  </div>
</section>`;
}

function certSection(c) {
  const s = c.certifications;
  return `<section class="section" id="${esc(s.id)}" aria-labelledby="${esc(s.id)}-title">
  <div class="wrap">
    <div class="section-head" data-reveal>
      <span class="eyebrow">${t(s.eyebrow)}</span>
      <h2 id="${esc(s.id)}-title">${t(s.title)}</h2>
      <p class="lead">${t(s.lead)}</p>
    </div>

    <ul class="cert-grid">
      ${s.items
        .map(
          (it, i) => `<li class="cert" data-reveal style="--reveal-delay:${(i % 3) * 70}ms">
        <div class="cert-top">
          <span class="cert-cat">${t(it.category)}</span>
          <span class="cert-year">${t(it.year)}</span>
        </div>
        <h3>${t(it.name)}</h3>
        <p>${t(it.issuer)}</p>
      </li>`
        )
        .join('\n      ')}
    </ul>
  </div>
</section>`;
}

function experienceSection(c) {
  const s = c.experience;
  return `<section class="section" id="${esc(s.id)}" aria-labelledby="${esc(s.id)}-title">
  <div class="wrap">
    <div class="section-head" data-reveal>
      <span class="eyebrow">${t(s.eyebrow)}</span>
      <h2 id="${esc(s.id)}-title">${t(s.title)}</h2>
      <p class="lead">${t(s.lead)}</p>
    </div>

    <ol class="timeline">
      ${s.items
        .map(
          (it) => `<li class="tl-item" data-reveal>
        <p class="tl-period">${t(it.period)}</p>
        <div class="tl-body">
          <h3>${t(it.role)}</h3>
          <p class="tl-company">${t(it.company)}${it.location ? ` <i>· ${t(it.location)}</i>` : ''}</p>
          <p class="tl-summary">${t(it.summary)}</p>
          ${
            it.highlights && it.highlights.length
              ? `<ul class="tl-highlights">
            ${it.highlights.map((h) => `<li>${t(h)}</li>`).join('\n            ')}
          </ul>`
              : ''
          }
        </div>
      </li>`
        )
        .join('\n      ')}
    </ol>

    ${
      s.education && s.education.items.length
        ? `<div class="education" data-reveal>
      <h3>${t(s.education.title)}</h3>
      <ul>
        ${s.education.items
          .map(
            (e) => `<li>
          <span class="edu-period">${t(e.period)}</span>
          <span class="edu-degree">${t(e.degree)}</span>
          <span class="edu-inst">${t(e.institution)}</span>
        </li>`
          )
          .join('\n        ')}
      </ul>
    </div>`
        : ''
    }
  </div>
</section>`;
}

function aboutSection(c) {
  const s = c.about;
  return `<section class="section" id="${esc(s.id)}" aria-labelledby="${esc(s.id)}-title">
  <div class="wrap">
    <div class="section-head" data-reveal>
      <span class="eyebrow">${t(s.eyebrow)}</span>
      <h2 id="${esc(s.id)}-title">${t(s.title)}</h2>
    </div>

    <div class="about-grid">
      <div class="about-text" data-reveal>
        <blockquote class="pullquote">${t(s.pullquote)}</blockquote>
        ${s.paragraphs.map((p) => `<p>${t(p)}</p>`).join('\n        ')}
      </div>

      <div class="principles">
        ${s.principles
          .map(
            (p, i) => `<div class="principle" data-reveal style="--reveal-delay:${i * 90}ms">
          <h3>${t(p.title)}</h3>
          <p>${t(p.text)}</p>
        </div>`
          )
          .join('\n        ')}
      </div>
    </div>
  </div>
</section>`;
}

function projectsSection(c) {
  const s = c.projects;
  const L = c.lang === 'de'
    ? { challenge: 'Ausgangslage', approach: 'Vorgehen', result: 'Ergebnis', client: 'Kunde', year: 'Jahr', role: 'Rolle' }
    : { challenge: 'Situation', approach: 'Approach', result: 'Result', client: 'Client', year: 'Year', role: 'Role' };

  return `<section class="section" id="${esc(s.id)}" aria-labelledby="${esc(s.id)}-title">
  <div class="wrap">
    <div class="section-head" data-reveal>
      <span class="eyebrow">${t(s.eyebrow)}</span>
      <h2 id="${esc(s.id)}-title">${t(s.title)}</h2>
      <p class="lead">${t(s.lead)}</p>
    </div>

    <div class="projects">
      ${s.items
        .map(
          (p) => `<article class="project" data-reveal>
        <div class="project-meta">
          <h3>${t(p.title)}</h3>
          <dl>
            <div><dt>${L.client}</dt><dd>${t(p.client)}</dd></div>
            <div><dt>${L.year}</dt><dd>${t(p.year)}</dd></div>
            <div><dt>${L.role}</dt><dd>${t(p.role)}</dd></div>
          </dl>
        </div>
        <div class="project-body">
          <div class="project-block"><h4>${L.challenge}</h4><p>${t(p.challenge)}</p></div>
          <div class="project-block"><h4>${L.approach}</h4><p>${t(p.approach)}</p></div>
          <div class="project-block is-result"><h4>${L.result}</h4><p>${t(p.result)}</p></div>
          ${p.tags && p.tags.length ? `<ul class="project-tags">${p.tags.map((tag) => `<li class="tag">${t(tag)}</li>`).join('')}</ul>` : ''}
        </div>
      </article>`
        )
        .join('\n      ')}
    </div>
  </div>
</section>`;
}

function testimonialsSection(c) {
  const s = c.testimonials;
  return `<section class="section testimonials-section" id="${esc(s.id)}" aria-labelledby="${esc(s.id)}-title">
  <div class="wrap">
    <div class="section-head" data-reveal>
      <span class="eyebrow">${t(s.eyebrow)}</span>
      <h2 id="${esc(s.id)}-title">${t(s.title)}</h2>
      <p class="lead">${t(s.lead)}</p>
    </div>

    <div class="quotes">
      ${s.items
        .map(
          (q, i) => `<figure class="quote" data-reveal style="--reveal-delay:${i * 90}ms">
        <blockquote>${t(q.quote)}</blockquote>
        <figcaption>
          <cite>${t(q.author)}</cite>
          <span>${t(q.role)}${q.company ? `, ${t(q.company)}` : ''}</span>
        </figcaption>
      </figure>`
        )
        .join('\n      ')}
    </div>
  </div>
</section>`;
}

function faqSection(c) {
  const s = c.faq;
  return `<section class="section" id="${esc(s.id)}" aria-labelledby="${esc(s.id)}-title">
  <div class="wrap">
    <div class="section-head" data-reveal>
      <span class="eyebrow">${t(s.eyebrow)}</span>
      <h2 id="${esc(s.id)}-title">${t(s.title)}</h2>
      <p class="lead">${t(s.lead)}</p>
    </div>

    <div class="faq-list">
      ${s.items
        .map(
          (item, i) => `<div class="faq-item" data-reveal>
        <h3>
          <button class="faq-q" type="button" id="faq-q-${i}" aria-expanded="false" aria-controls="faq-a-${i}">
            ${t(item.q)}
            <span class="faq-icon" aria-hidden="true"></span>
          </button>
        </h3>
        <div class="faq-a" id="faq-a-${i}" role="region" aria-labelledby="faq-q-${i}">
          <div><p>${t(item.a)}</p></div>
        </div>
      </div>`
        )
        .join('\n      ')}
    </div>
  </div>
</section>`;
}

function contactSection(c) {
  const s = c.contact;
  const mailAttrs = `data-mail-user="${esc(s.emailUser)}" data-mail-domain="${esc(s.emailDomain)}"`;
  const mailText = `${esc(s.emailUser)}&#64;${esc(s.emailDomain)}`;
  const hasLinkedIn = !isPlaceholder(s.linkedin.url);

  return `<section class="section contact-section" id="${esc(s.id)}" aria-labelledby="${esc(s.id)}-title">
  <div class="wrap contact-grid">
    <div data-reveal>
      <span class="eyebrow">${t(s.eyebrow)}</span>
      <h2 class="contact-title" id="${esc(s.id)}-title">${t(s.title)}</h2>
      <p class="lead" style="margin-top:1.25rem">${t(s.lead)}</p>
      <a class="contact-mail" href="#" ${mailAttrs} data-mail-print>${mailText}</a>
    </div>

    <div data-reveal style="--reveal-delay:100ms">
      <dl class="contact-list">
        <div>
          <dt>${t(s.emailLabel)}</dt>
          <dd><a href="#" ${mailAttrs} data-mail-print>${mailText}</a></dd>
        </div>
        <div>
          <dt>LinkedIn</dt>
          <dd>${hasLinkedIn ? `<a href="${esc(s.linkedin.url)}" rel="noopener noreferrer me" target="_blank">${t(s.linkedin.label)}</a>` : t(s.linkedin.label)}</dd>
        </div>
        <div>
          <dt>${t(s.locationLabel)}</dt>
          <dd>${t(s.location)}</dd>
        </div>
        <div>
          <dt>${t(s.availabilityLabel)}</dt>
          <dd>${t(s.availability)}</dd>
        </div>
      </dl>
      ${
        s.cvCta.available
          ? `<div class="contact-cta">
        <a class="btn btn-ghost" href="${esc(u(c, s.cvCta.href))}" download>${t(s.cvCta.label)} ${icon.download}</a>
      </div>`
          : ''
      }
    </div>
  </div>
</section>`;
}

/* --- Strukturierte Daten (JSON-LD) ---------------------------------------- */

function homeSchemas(c) {
  const url = abs(c, c.site.path);
  const jobTitle = clean(c.footer.tagline);
  const sameAs = isPlaceholder(c.contact.linkedin.url) ? [] : [clean(c.contact.linkedin.url)];

  const person = {
    '@type': 'Person',
    '@id': abs(c, '/#person'),
    name: c.site.name,
    givenName: 'Marco',
    familyName: 'Strote',
    jobTitle,
    description: clean(c.meta.description),
    email: `mailto:${c.contact.emailUser}@${c.contact.emailDomain}`,
    url,
    image: abs(c, c.hero.portraitSrc),
    knowsLanguage: ['de', 'en'],
    knowsAbout: c.skills.groups.flatMap((g) => g.tags.map(clean)).filter((s) => s && !isPlaceholder(s)),
  };

  if (sameAs.length) person.sameAs = sameAs;

  if (!isPlaceholder(c.contact.location)) {
    person.address = { '@type': 'PostalAddress', addressLocality: clean(c.contact.location).split(',')[0].trim(), addressCountry: 'DE' };
  }

  const currentRole = c.experience.items[0];
  if (currentRole && !isPlaceholder(currentRole.company)) {
    person.worksFor = { '@type': 'Organization', name: clean(currentRole.company) };
  }

  const credentials = c.certifications.items
    .filter((it) => !isPlaceholder(it.name))
    .map((it) => ({
      '@type': 'EducationalOccupationalCredential',
      name: clean(it.name),
      credentialCategory: 'certificate',
      ...(isPlaceholder(it.issuer) ? {} : { recognizedBy: { '@type': 'Organization', name: clean(it.issuer) } }),
      ...(isPlaceholder(it.year) ? {} : { dateCreated: clean(it.year) }),
    }));
  if (credentials.length) person.hasCredential = credentials;

  const alumni = c.experience.education.items
    .filter((e) => !isPlaceholder(e.institution))
    .map((e) => ({ '@type': 'EducationalOrganization', name: clean(e.institution) }));
  if (alumni.length) person.alumniOf = alumni;

  const profilePage = {
    '@type': 'ProfilePage',
    '@id': url + '#profile',
    url,
    name: c.meta.title,
    inLanguage: c.lang,
    mainEntity: { '@id': abs(c, '/#person') },
    about: { '@id': abs(c, '/#person') },
    dateModified: new Date().toISOString().slice(0, 10),
  };

  const faq = {
    '@type': 'FAQPage',
    '@id': url + '#faq',
    inLanguage: c.lang,
    mainEntity: c.faq.items
      .filter((i) => !isPlaceholder(i.a))
      .map((i) => ({
        '@type': 'Question',
        name: clean(i.q),
        acceptedAnswer: { '@type': 'Answer', text: clean(i.a) },
      })),
  };

  const graph = [person, profilePage];
  if (faq.mainEntity.length) graph.push(faq);

  return [{ '@context': 'https://schema.org', '@graph': graph }];
}

function legalSchema(c, page) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title,
    url: abs(c, page.path),
    inLanguage: c.lang,
    isPartOf: { '@type': 'WebSite', name: c.site.name, url: abs(c, '/') },
    about: { '@type': 'Person', name: c.site.name },
  };
}

/* --- Seiten --------------------------------------------------------------- */

function renderHome(c) {
  const page = {
    type: 'home',
    path: c.site.path,
    altPath: c.site.altPath,
    homePath: c.site.path,
    title: c.meta.title,
    description: c.meta.description,
    keywords: c.meta.keywords,
    hrefDe: c.lang === 'de' ? c.site.path : c.site.altPath,
    hrefEn: c.lang === 'en' ? c.site.path : c.site.altPath,
  };

  const body = [
    heroSection(c),
    skillsSection(c),
    certSection(c),
    experienceSection(c),
    aboutSection(c),
    projectsSection(c),
    testimonialsSection(c),
    faqSection(c),
    contactSection(c),
  ].join('\n\n');

  return shell(c, page, body);
}

function renderLegal(c, key, paths) {
  const data = c.legal[key];
  const page = {
    type: 'legal',
    path: paths.self,
    altPath: paths.alt,
    homePath: c.site.path,
    title: `${data.title} — ${c.site.name}`,
    description: c.lang === 'de' ? `${data.title} von ${c.site.name}.` : `${data.title} of ${c.site.name}.`,
    hrefDe: paths.de,
    hrefEn: paths.en,
  };

  const body = `<article class="legal-page">
  <div class="wrap">
    <h1>${t(data.title)}</h1>
    <p class="legal-intro">${t(data.intro)}</p>
    ${data.blocks
      .map(
        (b) => `<section class="legal-block">
      <h2>${t(b.heading)}</h2>
      ${b.lines.map((l) => `<p>${linkify(t(l))}</p>`).join('\n      ')}
    </section>`
      )
      .join('\n    ')}
    <a class="legal-back" href="${esc(u(c, c.site.path))}">&larr; ${t(c.legal.backLink)}</a>
  </div>
</article>`;

  return shell(c, page, body);
}

/* URLs in Rechtstexten klickbar machen */
function linkify(html) {
  return html.replace(/(https?:\/\/[^\s<]+[^\s<.,;:)])/g, '<a href="$1" rel="noopener noreferrer" target="_blank">$1</a>');
}

module.exports = { renderHome, renderLegal, clean, isPlaceholder, esc };
