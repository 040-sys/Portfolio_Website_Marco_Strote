'use strict';

/* Lebenslauf als eigene Seite — gespeist aus denselben Daten wie die Website,
   damit beide nie auseinanderlaufen. Aus dieser Seite erzeugt
   src/make-cv.js das PDF. */

const { esc, t, ta, u, abs, clean, isPlaceholder, jsonLd } = require('./template');

/* Zertifikate nach Kategorie bündeln, Reihenfolge des Auftretens beibehalten */
function groupCertifications(items) {
  const groups = new Map();
  for (const item of items) {
    const key = clean(item.category) || '—';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  }
  return [...groups.entries()];
}

function renderCv(c) {
  const cv = c.cv;
  const mail = `${c.contact.emailUser}@${c.contact.emailDomain}`;
  const hasLinkedIn = !isPlaceholder(c.contact.linkedin.url);
  const webLabel = c.site.domain.replace(/^https?:\/\//, '');

  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: c.site.name,
    jobTitle: clean(c.meta.jobTitle),
    description: clean(cv.profile),
    email: `mailto:${mail}`,
    url: abs(c, c.site.path),
    ...(hasLinkedIn ? { sameAs: [clean(c.contact.linkedin.url)] } : {}),
  };

  const contactRows = [
    { label: cv.labels.email, value: `<a href="mailto:${esc(mail)}">${esc(mail)}</a>` },
    hasLinkedIn ? { label: cv.labels.linkedin, value: `<a href="${esc(c.contact.linkedin.url)}">${t(c.contact.linkedin.label)}</a>` } : null,
    { label: cv.labels.location, value: t(c.contact.location) },
    { label: cv.labels.availability, value: t(c.contact.availability) },
  ].filter(Boolean);

  /* Stationen ohne Detailpunkte werden kompakter gesetzt — die weiter
     zurueckliegenden Positionen brauchen weniger Raum als die aktuellen. */
  const experience = c.experience.items
    .map(
      (it) => `<article class="cv-entry${it.highlights && it.highlights.length ? '' : ' is-compact'}">
        <p class="cv-period">${t(it.period)}</p>
        <div>
          <h3>${t(it.role)}</h3>
          <p class="cv-org">${t(it.company)}${it.location && !isPlaceholder(it.location) ? ` <span>· ${t(it.location)}</span>` : ''}</p>
          ${it.summary && !isPlaceholder(it.summary) ? `<p class="cv-summary">${t(it.summary)}</p>` : ''}
          ${
            it.highlights && it.highlights.length
              ? `<ul class="cv-highlights">${it.highlights.map((h) => `<li>${t(h)}</li>`).join('')}</ul>`
              : ''
          }
        </div>
      </article>`
    )
    .join('\n      ');

  const certifications = groupCertifications(c.certifications.items)
    .map(
      ([category, items]) => `<div class="cv-cert-group">
        <h3>${esc(category)}</h3>
        <ul class="cv-certs">
          ${items
            .map(
              (i) => `<li><b>${t(i.name)}</b><time>${t(i.issuer).replace(' Global Best Practice', '')} ${t(i.year)}</time></li>`
            )
            .join('\n          ')}
        </ul>
      </div>`
    )
    .join('\n      ');

  return `<!doctype html>
<html lang="${esc(c.lang)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(cv.docTitle)} — ${esc(c.site.name)}</title>
<meta name="description" content="${ta(cv.profile).slice(0, 200)}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="${esc(abs(c, c.lang === 'de' ? '/lebenslauf.html' : '/en/cv.html'))}">
<link rel="icon" href="${esc(u(c, '/assets/img/favicon.svg'))}" type="image/svg+xml">
<link rel="stylesheet" href="${esc(u(c, '/assets/css/cv.css'))}">
<script type="application/ld+json">
${jsonLd(person)}
</script>
</head>
<body>

<div class="cv-hint">
  <span>${esc(cv.docTitle)} — mit „Als PDF speichern" drucken oder <a href="${esc(u(c, '/assets/files/' + cv.fileName))}">fertiges PDF herunterladen</a>.</span>
  <button type="button" onclick="window.print()">Drucken / PDF</button>
</div>

<div class="page">

  <header class="cv-head">
    <div>
      <p class="cv-eyebrow">${esc(cv.docTitle)}</p>
      <h1 class="cv-name">${esc(c.site.name)}</h1>
      <p class="cv-role">${t(c.meta.jobTitle)}</p>

      <dl class="cv-contact">
        ${contactRows.map((r) => `<div><dt>${esc(r.label)}</dt><dd>${r.value}</dd></div>`).join('\n        ')}
      </dl>
    </div>
    <figure class="cv-photo">
      <img src="${esc(u(c, c.hero.portraitSrc))}" alt="${ta(c.hero.portraitAlt)}" width="800" height="1000">
    </figure>
  </header>

  <section class="cv-section">
    <h2>${esc(cv.profileTitle)}</h2>
    <p class="cv-profile">${t(cv.profile)}</p>
  </section>

  <section class="cv-section">
    <h2>${esc(cv.skillsTitle)}</h2>
    <div class="cv-skills">
      ${c.skills.groups
        .map(
          (g) => `<div class="cv-skill-group">
        <h3>${t(g.title)}</h3>
        <p>${g.tags.map((tag) => t(tag)).join(' · ')}</p>
      </div>`
        )
        .join('\n      ')}
    </div>
  </section>

  <section class="cv-section">
    <h2>${esc(cv.experienceTitle)}</h2>
    ${experience}
  </section>

  <section class="cv-section">
    <h2>${esc(cv.certificationsTitle)}</h2>
    ${certifications}
  </section>

  <section class="cv-section">
    <div class="cv-two-col">
      <section>
        <h2>${esc(cv.educationTitle)}</h2>
        <ul class="cv-simple">
          ${c.experience.education.items
            .map(
              (e) => `<li>
            <span class="cv-period">${t(e.period)}</span>
            <div><strong>${t(e.degree)}</strong><span>${t(e.institution)}</span></div>
          </li>`
            )
            .join('\n          ')}
        </ul>
      </section>
      <section>
        <h2>${esc(cv.languagesTitle)}</h2>
        <ul class="cv-languages">
          ${cv.languages.map((l) => `<li><strong>${t(l.name)}</strong><span>${t(l.level)}</span></li>`).join('\n          ')}
        </ul>
      </section>
    </div>
  </section>

  <footer class="cv-foot">
    <span>${esc(c.site.name)} · ${esc(cv.footNote)}</span>
    <a href="${esc(abs(c, c.site.path))}">${esc(webLabel)}</a>
  </footer>

</div>
</body>
</html>
`;
}

module.exports = { renderCv };
