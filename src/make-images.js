'use strict';

/* Erzeugt alle Bilddateien der Website:

     assets/img/portrait.jpg / .webp        800 × 1000   Hero-Porträt
     assets/img/portrait@2x.jpg / .webp    1400 × 1750   für hochauflösende Displays
     assets/img/og-image.png               1200 × 630    LinkedIn, X, WhatsApp, Slack
     assets/img/apple-touch-icon.png        180 × 180    iOS-Startbildschirm

   Quelle für das Porträt ist assets/img/portrait-original.jpg.
   Soziale Netzwerke und iOS unterstützen kein SVG — deshalb müssen diese
   Dateien als Rastergrafik vorliegen.

   Benötigt `sharp` (npm install). Fehlt das Paket, bricht das Skript nicht ab:
   der normale Seiten-Build (src/build.js) läuft ohne jede Abhängigkeit.

   Aufruf:  node src/make-images.js
*/

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const IMG = path.join(ROOT, 'assets/img');
const de = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/de.json'), 'utf8'));

const clean = (v) => String(v == null ? '' : v).replace(/\[\[(?:PLATZHALTER|PLACEHOLDER):?\s*([^\]]*)\]\]\s*/g, '').trim();
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

const PORTRAIT_SOURCE = path.join(IMG, 'portrait-original.jpg');
const hasPortrait = fs.existsSync(PORTRAIT_SOURCE);

/* --- Vorschaubild für soziale Netzwerke ---------------------------------- */

const domain = de.site.domain.replace(/^https?:\/\//, '');
/* Mit Foto bleibt links weniger Platz für Text */
const headline = wrap(de.hero.headline, hasPortrait ? 40 : 52).slice(0, 3);

function ogSvg(portraitDataUri) {
  const textWidth = portraitDataUri ? 720 : 1120;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="fade" x1="0" x2="1">
      <stop offset="0" stop-color="#14130f"/>
      <stop offset="0.72" stop-color="#14130f"/>
      <stop offset="1" stop-color="#14130f" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="#14130f"/>
  ${portraitDataUri ? `<image href="${portraitDataUri}" x="820" y="0" width="380" height="630" preserveAspectRatio="xMidYMin slice"/>
  <rect x="700" y="0" width="240" height="630" fill="url(#fade)"/>` : ''}
  <rect x="0" y="0" width="1200" height="6" fill="#a84d24"/>

  <text x="80" y="132" font-family="${SANS}" font-size="20" letter-spacing="4" fill="#a8a296">PORTFOLIO</text>
  <text x="80" y="248" font-family="${SERIF}" font-size="92" fill="#f7f5f1">${esc(de.site.name)}</text>
  <rect x="80" y="292" width="120" height="2" fill="#a84d24"/>

  ${headline
    .map((l, i) => `<text x="80" y="${368 + i * 52}" font-family="${SERIF}" font-size="38" fill="#d9d4c9">${esc(l)}</text>`)
    .join('\n  ')}

  <text x="80" y="556" font-family="${SANS}" font-size="24" fill="#a8a296">${esc(clean(de.footer.tagline))}</text>
  <text x="${textWidth}" y="556" text-anchor="end" font-family="${SANS}" font-size="24" fill="#a84d24">${esc(domain)}</text>
</svg>`;
}

const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
  <rect width="180" height="180" fill="#14130f"/>
  <text x="90" y="118" text-anchor="middle" font-family="${SERIF}" font-size="82" fill="#f7f5f1">MS</text>
  <rect x="46" y="140" width="88" height="5" rx="2.5" fill="#a84d24"/>
</svg>`;

let sharp;
try {
  sharp = require('sharp');
} catch {
  fs.writeFileSync(path.join(IMG, 'og-image.svg'), ogSvg(null) + '\n', 'utf8');
  console.log('Hinweis: `sharp` ist nicht installiert — es wurden keine Rastergrafiken erzeugt.');
  console.log('Installieren mit:  npm install');
  process.exit(0);
}

(async () => {
  /* --- Porträt in Web-Größen ---------------------------------------------
     Das Layout zeigt das Bild im Verhältnis 4:5. Zugeschnitten wird von
     oben ('north'), damit der Kopf auf keinen Fall angeschnitten wird. */
  if (hasPortrait) {
    const meta = await sharp(PORTRAIT_SOURCE).metadata();
    const sizes = [
      { name: 'portrait', w: 800, h: 1000 },
      { name: 'portrait@2x', w: 1400, h: 1750 },
    ];

    for (const s of sizes) {
      if (s.w > meta.width) {
        console.log(`Hinweis: ${s.name} übersprungen — Quellbild ist nur ${meta.width} px breit.`);
        continue;
      }
      const base = sharp(PORTRAIT_SOURCE).resize(s.w, s.h, { fit: 'cover', position: 'north' });
      await base.clone().jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(IMG, s.name + '.jpg'));
      await base.clone().webp({ quality: 80 }).toFile(path.join(IMG, s.name + '.webp'));
      console.log(`✓ ${s.name}.jpg / .webp (${s.w} × ${s.h})`);
    }
  } else {
    console.log('Hinweis: assets/img/portrait-original.jpg fehlt — Porträt wurde nicht erzeugt.');
  }

  /* --- Vorschaubild ------------------------------------------------------- */
  let portraitDataUri = null;
  if (hasPortrait) {
    const buf = await sharp(PORTRAIT_SOURCE).resize(380, 630, { fit: 'cover', position: 'north' }).jpeg({ quality: 78 }).toBuffer();
    portraitDataUri = 'data:image/jpeg;base64,' + buf.toString('base64');
  }

  const svg = ogSvg(portraitDataUri);
  fs.writeFileSync(path.join(IMG, 'og-image.svg'), ogSvg(null) + '\n', 'utf8');

  /* JPEG statt PNG: Mit Foto im Bild ist PNG um ein Vielfaches groesser,
     ohne sichtbaren Gewinn. Ein schnell ladendes Vorschaubild wird von
     LinkedIn und WhatsApp zuverlaessiger angezeigt. */
  await sharp(Buffer.from(svg)).jpeg({ quality: 88, mozjpeg: true }).toFile(path.join(IMG, 'og-image.jpg'));
  await sharp(Buffer.from(iconSvg)).png().toFile(path.join(IMG, 'apple-touch-icon.png'));

  const kb = Math.round(fs.statSync(path.join(IMG, 'og-image.jpg')).size / 1024);
  console.log(`✓ og-image.jpg (1200 × 630, ${kb} KB)`);
  console.log('✓ apple-touch-icon.png (180 × 180)');
})().catch((err) => {
  console.error('Fehler beim Erzeugen der Bilder:', err.message);
  process.exit(1);
});
