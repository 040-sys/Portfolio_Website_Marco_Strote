'use strict';

/* Erzeugt die Rastergrafiken, die soziale Netzwerke und iOS zwingend als
   PNG/JPG brauchen (SVG wird dort nicht unterstützt):
     - assets/img/og-image.png      1200 × 630  (LinkedIn, X, WhatsApp, Slack)
     - assets/img/apple-touch-icon.png  180 × 180

   Benötigt `sharp`. Fehlt das Paket, bricht das Skript nicht ab —
   der normale Seiten-Build (src/build.js) läuft ohne Abhängigkeiten.

   Aufruf:  node src/make-images.js
*/

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const de = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/de.json'), 'utf8'));

const clean = (v) => String(v == null ? '' : v).replace(/\[\[(PLATZHALTER|PLACEHOLDER)[^\]]*\]\]\s*/g, '').trim();
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* Zeilenumbruch nach ungefährer Zeichenbreite */
function wrap(text, maxChars) {
  const words = clean(text).split(/\s+/);
  const lines = [];
  let current = '';
  for (const word of words) {
    if ((current + ' ' + word).trim().length > maxChars && current) {
      lines.push(current.trim());
      current = word;
    } else {
      current = (current + ' ' + word).trim();
    }
  }
  if (current) lines.push(current);
  return lines;
}

const SERIF = "Georgia, 'Times New Roman', Times, serif";
const SANS = "'Segoe UI', system-ui, Arial, Helvetica, sans-serif";

const headline = wrap(de.hero.headline, 52).slice(0, 3);
const domain = de.site.domain.replace(/^https?:\/\//, '');

const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#14130f"/>
  <rect x="0" y="0" width="1200" height="6" fill="#a84d24"/>

  <text x="80" y="132" font-family="${SANS}" font-size="20" letter-spacing="4" fill="#a8a296">PORTFOLIO</text>

  <text x="80" y="248" font-family="${SERIF}" font-size="92" fill="#f7f5f1">${esc(de.site.name)}</text>

  <rect x="80" y="292" width="120" height="2" fill="#a84d24"/>

  ${headline
    .map((l, i) => `<text x="80" y="${368 + i * 52}" font-family="${SERIF}" font-size="38" fill="#d9d4c9">${esc(l)}</text>`)
    .join('\n  ')}

  <text x="80" y="556" font-family="${SANS}" font-size="24" fill="#a8a296">${esc(clean(de.footer.tagline))}</text>
  <text x="1120" y="556" text-anchor="end" font-family="${SANS}" font-size="24" fill="#a84d24">${esc(domain)}</text>
</svg>`;

const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
  <rect width="180" height="180" fill="#14130f"/>
  <text x="90" y="118" text-anchor="middle" font-family="${SERIF}" font-size="82" fill="#f7f5f1">MS</text>
  <rect x="46" y="140" width="88" height="5" rx="2.5" fill="#a84d24"/>
</svg>`;

/* SVG-Quellen mitschreiben — nachvollziehbar und ohne sharp anpassbar */
fs.writeFileSync(path.join(ROOT, 'assets/img/og-image.svg'), ogSvg + '\n', 'utf8');

let sharp;
try {
  sharp = require('sharp');
} catch {
  console.log('Hinweis: `sharp` ist nicht installiert — PNGs wurden nicht erzeugt.');
  console.log('Installieren mit:  npm install');
  console.log('assets/img/og-image.svg wurde trotzdem aktualisiert.');
  process.exit(0);
}

(async () => {
  await sharp(Buffer.from(ogSvg)).png().toFile(path.join(ROOT, 'assets/img/og-image.png'));
  await sharp(Buffer.from(iconSvg)).png().toFile(path.join(ROOT, 'assets/img/apple-touch-icon.png'));
  console.log('✓ assets/img/og-image.png (1200 × 630)');
  console.log('✓ assets/img/apple-touch-icon.png (180 × 180)');
})().catch((err) => {
  console.error('Fehler beim Erzeugen der PNGs:', err.message);
  process.exit(1);
});
