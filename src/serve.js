'use strict';

/* Kleiner Vorschau-Server für die lokale Ansicht.
   Nötig, weil die Seite absolute Pfade (/assets/...) verwendet, die beim
   direkten Öffnen einer Datei im Browser (file://) nicht aufgelöst werden.

   Aufruf:  node src/serve.js        →  http://localhost:4173
*/

const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PORT = Number(process.env.PORT) || 4173;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

http
  .createServer((req, res) => {
    let rel = decodeURIComponent(req.url.split('?')[0]);
    if (rel.endsWith('/')) rel += 'index.html';

    const full = path.join(ROOT, path.normalize(rel).replace(/^(\.\.[/\\])+/, ''));

    if (!full.startsWith(ROOT)) {
      res.writeHead(403).end('Forbidden');
      return;
    }

    fs.readFile(full, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>404</h1><p>Nicht gefunden: ' + rel + '</p><p><a href="/">Zur Startseite</a></p>');
        return;
      }
      res.writeHead(200, {
        'Content-Type': TYPES[path.extname(full).toLowerCase()] || 'application/octet-stream',
        'Cache-Control': 'no-store',
      });
      res.end(data);
    });
  })
  .listen(PORT, () => {
    console.log('Vorschau läuft auf  http://localhost:' + PORT);
    console.log('Beenden mit Strg + C');
  });
