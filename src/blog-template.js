'use strict';

/* Blog: Übersichtsseite und Artikelseiten.

   Jeder Artikel bekommt eine eigene URL zu einem eigenen Thema — das ist der
   eigentliche Hebel gegenüber der Startseite, die nur für einen Suchbegriff
   ranken kann. Für KI-Suchen zählt zusätzlich, dass Fachtexte sauber
   gegliedert und als BlogPosting ausgezeichnet sind. */

const { esc, t, ta, u, abs, clean, jsonLd } = require('./template');
const { render } = require('./markdown');

const icon = {
  arrowRight: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M2 8h12M9 3l5 5-5 5"/></svg>',
  arrowLeft: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M14 8H2M7 3L2 8l5 5"/></svg>',
};

const formatDate = (iso, lang) =>
  new Date(iso + 'T12:00:00Z').toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

const readingTime = (c, post) => c.blog.readingTime.replace('{n}', String(post.minutes));

/* --- Gemeinsames Seitengerüst --------------------------------------------- */

function shell(c, page, body, extraSchemas = []) {
  const canonical = abs(c, page.path);
  const hasAlt = !!(page.hrefDe && page.hrefEn);
  const altHref = hasAlt ? (c.lang === 'de' ? page.hrefEn : page.hrefDe) : null;

  return `<!doctype html>
<html lang="${esc(c.lang)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(page.title)}</title>
<meta name="description" content="${ta(page.description)}">
<meta name="author" content="${esc(c.site.name)}">
<meta name="robots" content="${c.site.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1'}">
<meta name="theme-color" content="#f7f5f1" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#14130f" media="(prefers-color-scheme: dark)">

<link rel="canonical" href="${esc(canonical)}">
${
  hasAlt
    ? `<link rel="alternate" hreflang="de" href="${esc(abs(c, page.hrefDe))}">
<link rel="alternate" hreflang="en" href="${esc(abs(c, page.hrefEn))}">
<link rel="alternate" hreflang="x-default" href="${esc(abs(c, page.hrefDe))}">`
    : ''
}
<link rel="alternate" type="application/rss+xml" title="${ta(c.blog.feedLabel)}" href="${esc(u(c, c.blog.path + 'feed.xml'))}">

<meta property="og:type" content="${page.type === 'post' ? 'article' : 'website'}">
<meta property="og:site_name" content="${esc(c.site.name)}">
<meta property="og:locale" content="${esc(c.locale)}">
<meta property="og:title" content="${esc(page.title)}">
<meta property="og:description" content="${ta(page.description)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:image" content="${esc(abs(c, c.meta.ogImage))}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
${page.type === 'post' ? `<meta property="article:published_time" content="${esc(page.date)}">\n<meta property="article:author" content="${esc(c.site.name)}">\n${(page.tags || []).map((tag) => `<meta property="article:tag" content="${esc(tag)}">`).join('\n')}` : ''}
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(page.title)}">
<meta name="twitter:description" content="${ta(page.description)}">
<meta name="twitter:image" content="${esc(abs(c, c.meta.ogImage))}">

<link rel="icon" href="${esc(u(c, '/assets/img/favicon.svg'))}" type="image/svg+xml">
<link rel="apple-touch-icon" href="${esc(u(c, '/assets/img/apple-touch-icon.png'))}">
<link rel="stylesheet" href="${esc(u(c, '/assets/css/style.css'))}">
<script src="${esc(u(c, '/assets/js/main.js'))}" defer></script>

${extraSchemas.map((s) => `<script type="application/ld+json">\n${jsonLd(s)}\n</script>`).join('\n')}
</head>
<body id="top">
<a class="skip-link" href="#main">${t(c.nav.skipToContent)}</a>

<header class="site-header">
  <div class="wrap header-inner">
    <a class="brand" href="${esc(u(c, c.site.path))}">${esc(c.site.name)}</a>
    <nav class="nav-desktop" aria-label="${ta(c.nav.menuLabel)}">
      <a class="nav-link" href="${esc(u(c, c.blog.path))}">${t(c.blog.eyebrow)}</a>
      <a class="nav-link" href="${esc(u(c, c.site.path))}">${t(c.blog.toHomeLabel)}</a>
      <a class="btn btn-primary" href="${esc(u(c, c.site.path + '#' + c.contact.id))}">${t(c.nav.cta.label)}</a>
      ${altHref ? `<a class="lang-switch" href="${esc(u(c, altHref))}" hreflang="${esc(c.site.altLang)}" lang="${esc(c.site.altLang)}" title="${ta(c.site.altTitle)}">${esc(c.site.altLabel)}</a>` : ''}
    </nav>
    <a class="lang-switch nav-mobile-only" href="${esc(u(c, altHref || c.site.path))}" ${altHref ? `hreflang="${esc(c.site.altLang)}" lang="${esc(c.site.altLang)}" title="${ta(c.site.altTitle)}"` : ''}>${altHref ? esc(c.site.altLabel) : t(c.blog.toHomeLabel)}</a>
  </div>
</header>

<main id="main">
${body}
</main>

<footer class="site-footer">
  <div class="wrap">
    <div class="footer-top">
      <div>
        <p class="footer-name">${esc(c.site.name)}</p>
        <p class="footer-tagline">${t(c.footer.tagline)}</p>
      </div>
      <a class="to-top" href="#top">${t(c.footer.backToTop)}</a>
    </div>
    <div class="footer-bottom">
      <p>&copy; <span data-current-year>2026</span> ${esc(c.site.name)}. ${t(c.footer.copyright)}</p>
      <nav class="footer-links" aria-label="Legal">
        ${c.footer.links.map((l) => `<a href="${esc(u(c, l.href))}">${t(l.label)}</a>`).join('\n        ')}
        <a href="${esc(u(c, c.blog.path + 'feed.xml'))}">${t(c.blog.feedLabel)}</a>
      </nav>
    </div>
  </div>
</footer>
</body>
</html>
`;
}

/* --- Übersichtsseite ------------------------------------------------------ */

function renderBlogIndex(c, posts, altIndexPath) {
  const page = {
    type: 'index',
    path: c.blog.path,
    title: c.blog.indexTitle,
    description: c.blog.indexDescription,
    ...(altIndexPath
      ? { hrefDe: c.lang === 'de' ? c.blog.path : altIndexPath, hrefEn: c.lang === 'en' ? c.blog.path : altIndexPath }
      : {}),
  };

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': abs(c, c.blog.path) + '#blog',
    name: clean(c.blog.indexHeading),
    description: clean(c.blog.indexDescription),
    url: abs(c, c.blog.path),
    inLanguage: c.lang,
    author: { '@type': 'Person', name: c.site.name, url: abs(c, c.site.path) },
    blogPost: posts.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      description: p.description,
      datePublished: p.date,
      url: abs(c, p.url),
      author: { '@type': 'Person', name: c.site.name },
    })),
  };

  const categories = [...new Set(posts.map((p) => p.category))];

  const body = `<section class="section blog-index">
  <div class="wrap">
    <div class="section-head" data-reveal>
      <span class="eyebrow">${t(c.blog.eyebrow)}</span>
      <h1>${t(c.blog.indexHeading)}</h1>
      <p class="lead">${t(c.blog.indexLead)}</p>
    </div>

    ${
      categories.length > 1
        ? `<div class="blog-filter" role="group" aria-label="${ta(c.blog.eyebrow)}" data-reveal>
      <button class="chip is-active" type="button" data-filter="*">${t(c.blog.allCategories)}</button>
      ${categories.map((cat) => `<button class="chip" type="button" data-filter="${esc(cat)}">${esc(cat)}</button>`).join('\n      ')}
    </div>`
        : ''
    }

    <ol class="post-list">
      ${posts
        .map(
          (p) => `<li class="post-card" data-category="${esc(p.category)}" data-reveal>
        <a href="${esc(u(c, p.url))}">
          <div class="post-meta">
            <span class="post-category">${esc(p.category)}</span>
            <time datetime="${esc(p.date)}">${esc(formatDate(p.date, c.lang))}</time>
            <span class="post-reading">${esc(readingTime(c, p))}</span>
          </div>
          <h2>${esc(p.title)}</h2>
          <p>${esc(p.description)}</p>
          <span class="post-more">${icon.arrowRight}</span>
        </a>
      </li>`
        )
        .join('\n      ')}
    </ol>
  </div>
</section>`;

  return shell(c, page, body, [schema]);
}

/* --- Artikelseite --------------------------------------------------------- */

function renderPost(c, post, related, altPostUrl) {
  const page = {
    type: 'post',
    path: post.url,
    title: `${post.title} — ${c.site.name}`,
    description: post.description,
    date: post.date,
    tags: post.tags,
    ...(altPostUrl
      ? { hrefDe: c.lang === 'de' ? post.url : altPostUrl, hrefEn: c.lang === 'en' ? post.url : altPostUrl }
      : {}),
  };

  const { html, headings } = render(post.body);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': abs(c, post.url) + '#article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: c.lang,
    url: abs(c, post.url),
    mainEntityOfPage: { '@type': 'WebPage', '@id': abs(c, post.url) },
    articleSection: post.category,
    keywords: (post.tags || []).join(', '),
    wordCount: post.words,
    image: abs(c, c.meta.ogImage),
    author: {
      '@type': 'Person',
      name: c.site.name,
      jobTitle: clean(c.meta.jobTitle),
      url: abs(c, c.site.path),
    },
    publisher: { '@type': 'Person', name: c.site.name, url: abs(c, c.site.path) },
    isPartOf: { '@type': 'Blog', '@id': abs(c, c.blog.path) + '#blog' },
  };

  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: c.site.name, item: abs(c, c.site.path) },
      { '@type': 'ListItem', position: 2, name: clean(c.blog.indexHeading), item: abs(c, c.blog.path) },
      { '@type': 'ListItem', position: 3, name: post.title, item: abs(c, post.url) },
    ],
  };

  const body = `<article class="post">
  <div class="wrap post-wrap">

    <header class="post-header" data-reveal>
      <a class="post-back" href="${esc(u(c, c.blog.path))}">${icon.arrowLeft} ${t(c.blog.backLabel)}</a>
      <div class="post-meta">
        <span class="post-category">${esc(post.category)}</span>
        <time datetime="${esc(post.date)}">${esc(formatDate(post.date, c.lang))}</time>
        <span class="post-reading">${esc(readingTime(c, post))}</span>
      </div>
      <h1>${esc(post.title)}</h1>
      <p class="post-lead">${esc(post.description)}</p>
    </header>

    ${
      headings.length > 2
        ? `<nav class="post-toc" aria-label="${ta(c.blog.contentsTitle)}" data-reveal>
      <p class="post-toc-title">${t(c.blog.contentsTitle)}</p>
      <ol>
        ${headings.map((h) => `<li><a href="#${esc(h.id)}">${esc(h.text)}</a></li>`).join('\n        ')}
      </ol>
    </nav>`
        : ''
    }

    <div class="post-body" data-reveal>
${html}
    </div>

    ${
      post.tags && post.tags.length
        ? `<ul class="post-tags" data-reveal>${post.tags.map((tag) => `<li class="tag">${esc(tag)}</li>`).join('')}</ul>`
        : ''
    }

    <aside class="post-cta" data-reveal>
      <h2>${t(c.blog.ctaTitle)}</h2>
      <p>${t(c.blog.ctaText)}</p>
      <a class="btn btn-primary" href="${esc(u(c, c.site.path + '#' + c.contact.id))}">${t(c.blog.ctaLabel)} ${icon.arrowRight}</a>
    </aside>

    ${
      related.length
        ? `<section class="post-related" data-reveal>
      <h2>${t(c.blog.relatedTitle)}</h2>
      <ul>
        ${related
          .map(
            (r) => `<li>
          <a href="${esc(u(c, r.url))}">
            <span class="post-category">${esc(r.category)}</span>
            <span class="post-related-title">${esc(r.title)}</span>
          </a>
        </li>`
          )
          .join('\n        ')}
      </ul>
    </section>`
        : ''
    }

  </div>
</article>`;

  return shell(c, page, body, [schema, breadcrumbs]);
}

/* --- RSS ------------------------------------------------------------------ */

function renderFeed(c, posts) {
  const now = new Date().toUTCString();
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(clean(c.blog.indexHeading))} — ${esc(c.site.name)}</title>
    <link>${esc(abs(c, c.blog.path))}</link>
    <description>${esc(clean(c.blog.indexDescription))}</description>
    <language>${esc(c.lang)}</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${esc(abs(c, c.blog.path + 'feed.xml'))}" rel="self" type="application/rss+xml"/>
${posts
  .map(
    (p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${esc(abs(c, p.url))}</link>
      <guid isPermaLink="true">${esc(abs(c, p.url))}</guid>
      <description>${esc(p.description)}</description>
      <category>${esc(p.category)}</category>
      <pubDate>${new Date(p.date + 'T09:00:00Z').toUTCString()}</pubDate>
    </item>`
  )
  .join('\n')}
  </channel>
</rss>
`;
}

module.exports = { renderBlogIndex, renderPost, renderFeed };
