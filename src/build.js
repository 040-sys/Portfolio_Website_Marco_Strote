'use strict';

/* Baut die komplette Website aus content/de.json und content/en.json.
   Keine externen Abhängigkeiten — laeuft mit `node src/build.js`. */

const fs = require('fs');
const path = require('path');
const { renderHome, renderLegal, clean, isPlaceholder } = require('./template');
const { renderCv } = require('./cv-template');

const ROOT = path.join(__dirname, '..');
const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));

const write = (rel, content) => {
  const full = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf8');
  return rel;
};

const de = read('content/de.json');
const en = read('content/en.json');

/* Basis-Pfad und Domain koennen von aussen gesetzt werden. Der GitHub-Actions-
   Workflow uebergibt beides automatisch, damit die Seite sowohl unter einer
   eigenen Domain als auch als GitHub-Projektseite (…github.io/Repo-Name/)
   funktioniert. */
const BASE = (process.env.BASE_PATH || de.site.basePath || '').replace(/\/$/, '');
for (const c of [de, en]) {
  c.site.basePath = BASE;
  if (process.env.SITE_URL) c.site.domain = new URL(process.env.SITE_URL).origin;
}

/* Der Lebenslauf-Button wird nur ausgegeben, wenn die PDF-Datei wirklich
   vorhanden ist — ein toter Download-Link auf der wichtigsten Schaltfläche
   wäre schlimmer als gar keine Schaltfläche. */
const cvMissing = [];
for (const c of [de, en]) {
  for (const cta of [c.hero.secondaryCta, c.contact.cvCta]) {
    cta.available = fs.existsSync(path.join(ROOT, cta.href.replace(/^\//, '')));
    if (!cta.available && !cvMissing.includes(cta.href)) cvMissing.push(cta.href);
  }
}

/* Welche Porträt-Varianten liegen tatsächlich vor? Nur vorhandene Dateien
   werden im HTML angeboten — sonst entstünden tote Verweise. */
const hasImg = (p) => fs.existsSync(path.join(ROOT, p.replace(/^\//, '')));
for (const c of [de, en]) {
  const base = c.hero.portraitSrc.replace(/\.(jpg|jpeg|png)$/i, '');
  const ext = (c.hero.portraitSrc.match(/\.(jpg|jpeg|png)$/i) || [''])[0];
  c.hero.portraitVariants = {
    webp: hasImg(base + '.webp'),
    retina: !!ext && hasImg(base + '@2x' + ext),
    retinaWebp: hasImg(base + '@2x.webp'),
  };
}
const DOMAIN = de.site.domain.replace(/\/$/, '') + BASE;
const TODAY = new Date().toISOString().slice(0, 10);

const written = [];

/* --- 1. HTML-Seiten -------------------------------------------------------- */

written.push(write('index.html', renderHome(de)));
written.push(write('en/index.html', renderHome(en)));

written.push(write('lebenslauf.html', renderCv(de)));
written.push(write('en/cv.html', renderCv(en)));

written.push(
  write('impressum.html', renderLegal(de, 'imprint', { self: '/impressum.html', alt: '/en/imprint.html', de: '/impressum.html', en: '/en/imprint.html' }))
);
written.push(
  write('datenschutz.html', renderLegal(de, 'privacy', { self: '/datenschutz.html', alt: '/en/privacy.html', de: '/datenschutz.html', en: '/en/privacy.html' }))
);
written.push(
  write('en/imprint.html', renderLegal(en, 'imprint', { self: '/en/imprint.html', alt: '/impressum.html', de: '/impressum.html', en: '/en/imprint.html' }))
);
written.push(
  write('en/privacy.html', renderLegal(en, 'privacy', { self: '/en/privacy.html', alt: '/datenschutz.html', de: '/datenschutz.html', en: '/en/privacy.html' }))
);

/* --- 2. robots.txt --------------------------------------------------------- */
/* KI-Crawler werden ausdrücklich zugelassen (GEO): Nur was gecrawlt werden
   darf, kann von ChatGPT, Perplexity oder Google AI Overviews zitiert werden. */

const aiCrawlers = [
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User',
  'ClaudeBot', 'Claude-User', 'Claude-SearchBot', 'anthropic-ai',
  'PerplexityBot', 'Perplexity-User',
  'Google-Extended', 'GoogleOther',
  'Applebot', 'Applebot-Extended',
  'Bingbot', 'meta-externalagent', 'Amazonbot', 'DuckAssistBot', 'cohere-ai', 'YouBot', 'Diffbot',
];

written.push(
  write(
    'robots.txt',
    `# ${de.site.name} — robots.txt
# Diese Seite soll gefunden UND von KI-Assistenten zitiert werden.

User-agent: *
Allow: /

${aiCrawlers.map((bot) => `User-agent: ${bot}\nAllow: /`).join('\n\n')}

Sitemap: ${DOMAIN}/sitemap.xml
`
  )
);

/* --- 3. sitemap.xml -------------------------------------------------------- */

const pages = [
  { loc: '/', de: '/', en: '/en/', priority: '1.0', changefreq: 'monthly' },
  { loc: '/en/', de: '/', en: '/en/', priority: '0.9', changefreq: 'monthly' },
  { loc: '/lebenslauf.html', de: '/lebenslauf.html', en: '/en/cv.html', priority: '0.8', changefreq: 'monthly' },
  { loc: '/en/cv.html', de: '/lebenslauf.html', en: '/en/cv.html', priority: '0.7', changefreq: 'monthly' },
  { loc: '/impressum.html', de: '/impressum.html', en: '/en/imprint.html', priority: '0.2', changefreq: 'yearly' },
  { loc: '/datenschutz.html', de: '/datenschutz.html', en: '/en/privacy.html', priority: '0.2', changefreq: 'yearly' },
  { loc: '/en/imprint.html', de: '/impressum.html', en: '/en/imprint.html', priority: '0.2', changefreq: 'yearly' },
  { loc: '/en/privacy.html', de: '/datenschutz.html', en: '/en/privacy.html', priority: '0.2', changefreq: 'yearly' },
];

written.push(
  write(
    'sitemap.xml',
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${pages
  .map(
    (p) => `  <url>
    <loc>${DOMAIN}${p.loc}</loc>
    <xhtml:link rel="alternate" hreflang="de" href="${DOMAIN}${p.de}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${DOMAIN}${p.en}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${DOMAIN}${p.de}"/>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`
  )
);

/* --- 4. llms.txt ----------------------------------------------------------- */
/* Klartext-Fassung der Kernfakten. Sprachmodelle zitieren am zuverlässigsten,
   was unmissverständlich und ohne Markup dasteht. */

const line = (label, value) => (isPlaceholder(value) ? null : `${label}: ${clean(value)}`);

const llms = [
  `# ${de.site.name}`,
  '',
  `> ${clean(de.hero.headline)}`,
  '',
  '## Kurzprofil',
  '',
  [
    line('Name', de.site.name),
    line('Positionierung', de.footer.tagline),
    line('Standort', de.contact.location),
    line('Verfügbarkeit', de.contact.availability),
    line('Website', DOMAIN),
    line('E-Mail', `${de.contact.emailUser}@${de.contact.emailDomain}`),
    line('LinkedIn', de.contact.linkedin.url),
  ]
    .filter(Boolean)
    .map((l) => `- ${l}`)
    .join('\n'),
  '',
  '## Kompetenzen',
  '',
  de.skills.groups
    .map((g) => {
      const tags = g.tags.map(clean).filter(Boolean);
      return `- ${clean(g.title)}: ${tags.join(', ')}`;
    })
    .join('\n'),
  '',
  '## Zertifizierungen',
  '',
  de.certifications.items
    .filter((i) => !isPlaceholder(i.name))
    .map((i) => `- ${clean(i.name)} (${clean(i.issuer)}, ${clean(i.year)})`)
    .join('\n') || '- (noch nicht hinterlegt)',
  '',
  '## Beruflicher Werdegang',
  '',
  de.experience.items
    .filter((i) => !isPlaceholder(i.role))
    .map((i) => `- ${clean(i.period)} — ${clean(i.role)}, ${clean(i.company)}${i.location && !isPlaceholder(i.location) ? ` (${clean(i.location)})` : ''}: ${clean(i.summary)}`)
    .join('\n') || '- (noch nicht hinterlegt)',
  '',
  '## Ausbildung',
  '',
  de.experience.education.items
    .filter((e) => !isPlaceholder(e.degree))
    .map((e) => `- ${clean(e.period)} — ${clean(e.degree)}, ${clean(e.institution)}`)
    .join('\n') || '- (noch nicht hinterlegt)',
  '',
  '## Projekte',
  '',
  de.projects.items
    .filter((p) => !isPlaceholder(p.title))
    .map((p) => `- ${clean(p.title)} (${clean(p.client)}, ${clean(p.year)}) — Ausgangslage: ${clean(p.challenge)} Vorgehen: ${clean(p.approach)} Ergebnis: ${clean(p.result)}`)
    .join('\n') || '- (noch nicht hinterlegt)',
  '',
  '## Häufige Fragen',
  '',
  de.faq.items
    .filter((i) => !isPlaceholder(i.a))
    .map((i) => `### ${clean(i.q)}\n\n${clean(i.a)}`)
    .join('\n\n') || '(noch nicht hinterlegt)',
  '',
  '## Seiten',
  '',
  `- [Startseite (Deutsch)](${DOMAIN}/)`,
  `- [Homepage (English)](${DOMAIN}/en/)`,
  `- [Impressum](${DOMAIN}/impressum.html)`,
  `- [Datenschutz](${DOMAIN}/datenschutz.html)`,
  '',
  `Stand: ${TODAY}`,
  '',
].join('\n');

written.push(write('llms.txt', llms));

/* --- 5. Web-Manifest ------------------------------------------------------- */

written.push(
  write(
    'site.webmanifest',
    JSON.stringify(
      {
        name: de.site.name,
        short_name: 'M. Strote',
        description: clean(de.meta.description),
        start_url: '/',
        display: 'standalone',
        background_color: '#f7f5f1',
        theme_color: '#f7f5f1',
        lang: 'de',
        icons: [
          { src: '/assets/img/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
          { src: '/assets/img/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
        ],
      },
      null,
      2
    ) + '\n'
  )
);

/* --- 6. Bericht ------------------------------------------------------------ */

/* Abgeschaltete Abschnitte werden übersprungen — vor Platzhaltern zu warnen,
   die gar nicht auf der Seite erscheinen, wäre nur Rauschen. */
const countPlaceholders = (node) => {
  if (typeof node === 'string') return isPlaceholder(node) ? 1 : 0;
  if (Array.isArray(node)) return node.reduce((n, v) => n + countPlaceholders(v), 0);
  if (node && typeof node === 'object') {
    if (node.enabled === false) return 0;
    return Object.values(node).reduce((n, v) => n + countPlaceholders(v), 0);
  }
  return 0;
};

const open = countPlaceholders(de) + countPlaceholders(en);

console.log('Build fertig — ' + written.length + ' Dateien:');
written.forEach((f) => console.log('  ' + f));

if (open > 0) {
  console.log('\n⚠  Noch ' + open + ' Platzhalter in content/de.json + content/en.json.');
  console.log('   Diese Stellen sind auf der Seite orange markiert.');
} else {
  console.log('\n✓ Keine Platzhalter mehr — die Seite ist inhaltlich vollständig.');
}

if (cvMissing.length) {
  console.log('\n⚠  Lebenslauf fehlt — der Download-Button wird deshalb nicht angezeigt.');
  cvMissing.forEach((p) => console.log('   Erwartet: ' + p.replace(/^\//, '')));
}
