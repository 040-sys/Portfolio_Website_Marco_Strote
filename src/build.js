'use strict';

/* Baut die komplette Website aus content/de.json und content/en.json.
   Keine externen Abhängigkeiten — laeuft mit `node src/build.js`. */

const fs = require('fs');
const path = require('path');
const { renderHome, renderLegal, renderThankYou, clean, isPlaceholder } = require('./template');
const { renderCv } = require('./cv-template');
const { renderBlogIndex, renderPost, renderFeed } = require('./blog-template');
const { parseFrontmatter, toPlainText } = require('./markdown');

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
/* Vercel liefert im Wurzelverzeichnis aus — dort gibt es keinen Basis-Pfad.
   VERCEL_PROJECT_PRODUCTION_URL ist die dauerhafte Adresse des Projekts und
   zeigt auf eine eigene Domain, sobald eine verbunden ist. */
const ON_VERCEL = !!process.env.VERCEL;
const VERCEL_HOST = process.env.VERCEL_PROJECT_PRODUCTION_URL;

const BASE = ON_VERCEL ? '' : (process.env.BASE_PATH || de.site.basePath || '').replace(/\/$/, '');

/* Vorschau-Bereitstellungen dürfen nicht in den Suchindex: sonst konkurrieren
   Zwischenstände unter wechselnden Adressen mit der echten Seite. */
const NOINDEX = ON_VERCEL && process.env.VERCEL_ENV !== 'production';

for (const c of [de, en]) {
  c.site.basePath = BASE;
  c.site.noindex = NOINDEX;

  if (process.env.SITE_URL) c.site.domain = new URL(process.env.SITE_URL).origin;
  else if (VERCEL_HOST) c.site.domain = 'https://' + VERCEL_HOST;
}

/* Kontaktformular: der Web3Forms Access Key kommt aus einer Vercel-
   Umgebungsvariable, nicht aus dem Repository. So bleibt er austauschbar,
   ohne Code anzufassen, und steht nicht offen im Git-Verlauf. Ist keine
   Umgebungsvariable gesetzt, bleibt der Platzhalter aus content/*.json
   stehen — die Seite baut trotzdem, das Formular zeigt dann den
   "wird eingerichtet"-Hinweis statt eines funktionslosen Formulars. */
const WEB3FORMS_KEY = process.env.WEB3FORMS_ACCESS_KEY;
if (WEB3FORMS_KEY) {
  for (const c of [de, en]) c.contact.form.web3formsKey = WEB3FORMS_KEY;
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

/* --- Blog-Artikel einlesen ------------------------------------------------ */
/* Quelle sind Markdown-Dateien in content/blog. Die Reihenfolge ergibt sich
   aus dem Datum im Frontmatter, nicht aus dem Dateinamen. */

const BLOG_DIR = path.join(ROOT, 'content/blog');

const posts = (fs.existsSync(BLOG_DIR) ? fs.readdirSync(BLOG_DIR) : [])
  .filter((f) => f.endsWith('.md'))
  .map((file) => {
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8');
    const { data, body } = parseFrontmatter(raw);
    const slug = file.replace(/\.md$/, '');
    const words = toPlainText(body).split(/\s+/).filter(Boolean).length;

    if (!data.title || !data.date) {
      console.log(`⚠  content/blog/${file}: title oder date fehlt — Artikel übersprungen.`);
      return null;
    }

    return {
      slug,
      file,
      body,
      words,
      minutes: Math.max(1, Math.round(words / 200)),
      title: data.title,
      description: data.description || '',
      date: data.date,
      category: data.category || 'Notiz',
      tags: Array.isArray(data.tags) ? data.tags : data.tags ? [data.tags] : [],
      url: `/blog/${slug}.html`,
    };
  })
  .filter(Boolean)
  .sort((a, b) => (a.date < b.date ? 1 : -1));

/* --- 1. HTML-Seiten -------------------------------------------------------- */

written.push(write('index.html', renderHome(de, de.blog.enabled ? posts : [])));
written.push(write('en/index.html', renderHome(en, en.blog.enabled ? posts : [])));

written.push(write('lebenslauf.html', renderCv(de)));
written.push(write('en/cv.html', renderCv(en)));

/* Danke-Seiten: Ziel des Web3Forms-"redirect"-Felds für Besucher ohne
   JavaScript. Bewusst nicht in der Sitemap — sie sollen nicht über die
   Suche gefunden werden, sondern nur nach einer Formularabgabe erscheinen. */
written.push(write('kontakt-danke.html', renderThankYou(de)));
written.push(write('en/thank-you.html', renderThankYou(en)));

/* Blog — derzeit nur auf Deutsch; en.json hat blog.enabled: false */
if (de.blog.enabled && posts.length) {
  written.push(write('blog/index.html', renderBlogIndex(de, posts)));
  written.push(write('blog/feed.xml', renderFeed(de, posts)));

  for (const post of posts) {
    const related = posts.filter((p) => p.slug !== post.slug).slice(0, 2);
    written.push(write(`blog/${post.slug}.html`, renderPost(de, post, related)));
  }
}

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
    NOINDEX
      ? `# Vorschau-Bereitstellung — nicht indexieren.\nUser-agent: *\nDisallow: /\n`
      : `# ${de.site.name} — robots.txt
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

/* Blog-Seiten gibt es bisher nur auf Deutsch — deshalb ohne Sprachalternativen.
   Ein hreflang auf eine nicht existierende englische Fassung wäre ein Fehler. */
if (de.blog.enabled && posts.length) {
  pages.push({ loc: de.blog.path, priority: '0.9', changefreq: 'weekly', noAlt: true });
  for (const post of posts) {
    pages.push({ loc: post.url, priority: '0.8', changefreq: 'yearly', lastmod: post.date, noAlt: true });
  }
}

written.push(
  write(
    'sitemap.xml',
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${pages
  .map(
    (p) => `  <url>
    <loc>${DOMAIN}${p.loc}</loc>${
      p.noAlt
        ? ''
        : `
    <xhtml:link rel="alternate" hreflang="de" href="${DOMAIN}${p.de}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${DOMAIN}${p.en}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${DOMAIN}${p.de}"/>`
    }
    <lastmod>${p.lastmod || TODAY}</lastmod>
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
  '## Beiträge',
  '',
  posts.length
    ? posts
        .map((p) => `- [${p.title}](${DOMAIN}${p.url}) — ${p.category}, ${p.date}. ${p.description}`)
        .join('\n')
    : '- (noch keine)',
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
  `- [Lebenslauf](${DOMAIN}/lebenslauf.html)`,
  ...(posts.length ? [`- [Beiträge](${DOMAIN}/blog/)`] : []),
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
