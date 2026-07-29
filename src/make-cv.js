'use strict';

/* Erzeugt aus lebenslauf.html und en/cv.html die PDF-Dateien:

     assets/files/Lebenslauf-Marco-Strote.pdf
     assets/files/CV-Marco-Strote.pdf

   Gerendert wird mit demselben Stylesheet wie die Webansicht — das PDF
   sieht dadurch exakt so aus wie die Seite und bleibt automatisch aktuell,
   sobald sich content/de.json oder content/en.json ändert.

   Benötigt `puppeteer` (npm install). Fehlt es, bricht das Skript nicht ab:
   der normale Seiten-Build (src/build.js) laeuft ohne Abhaengigkeiten.

   Aufruf:  node src/make-cv.js
*/

const fs = require('fs');
const path = require('path');
const http = require('http');

const ROOT = path.join(__dirname, '..');
const PORT = 4199;

const de = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/de.json'), 'utf8'));
const en = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/en.json'), 'utf8'));

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
};

let puppeteer;
try {
  puppeteer = require('puppeteer');
} catch {
  console.log('Hinweis: `puppeteer` ist nicht installiert — es wurde kein PDF erzeugt.');
  console.log('Installieren mit:  npm install');
  console.log('Alternativ: lebenslauf.html im Browser oeffnen und "Als PDF speichern" waehlen.');
  process.exit(0);
}

/* Kurzlebiger lokaler Server — Chromium braucht echte URLs, damit
   Stylesheet und Bild ueber absolute Pfade gefunden werden. */
const server = http.createServer((req, res) => {
  let rel = decodeURIComponent(req.url.split('?')[0]);
  if (rel.endsWith('/')) rel += 'index.html';
  const full = path.join(ROOT, path.normalize(rel).replace(/^(\.\.[/\\])+/, ''));
  fs.readFile(full, (err, data) => {
    if (err) {
      res.writeHead(404).end('not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(full).toLowerCase()] || 'application/octet-stream' });
    res.end(data);
  });
});

const jobs = [
  { page: '/lebenslauf.html', file: de.cv.fileName, label: 'Deutsch' },
  { page: '/en/cv.html', file: en.cv.fileName, label: 'English' },
];

(async () => {
  await new Promise((resolve) => server.listen(PORT, resolve));

  const browser = await puppeteer.launch({ headless: 'new' });
  fs.mkdirSync(path.join(ROOT, 'assets/files'), { recursive: true });

  try {
    for (const job of jobs) {
      const page = await browser.newPage();
      await page.goto(`http://localhost:${PORT}${job.page}`, { waitUntil: 'networkidle0' });

      /* Bilder sicher abwarten — ein halb geladenes Portraet waere im PDF leer */
      await page.evaluate(() =>
        Promise.all(
          [...document.images].filter((i) => !i.complete).map((i) => new Promise((r) => { i.onload = i.onerror = r; }))
        )
      );

      const target = path.join(ROOT, 'assets/files', job.file);
      await page.pdf({
        path: target,
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: true,
        margin: { top: '12mm', bottom: '12mm', left: '0mm', right: '0mm' },
      });
      await page.close();

      const kb = Math.round(fs.statSync(target).size / 1024);
      console.log(`✓ assets/files/${job.file} (${job.label}, ${kb} KB)`);
    }
  } finally {
    await browser.close();
    server.close();
  }
})().catch((err) => {
  console.error('Fehler beim Erzeugen des PDF:', err.message);
  server.close();
  process.exit(1);
});
