# Portfolio-Website Marco Strote

Statische One-Page-Website mit Fokus auf Recruiter, HR-Abteilungen und
Auftraggeber. Zweisprachig (Deutsch/Englisch), ohne Cookies, ohne Tracking,
ohne externe Ressourcen.

**Für die Bedienung ohne Programmierkenntnisse: [ANLEITUNG.md](ANLEITUNG.md)**

---

## Aufbau

Die Seite wird aus zwei JSON-Dateien erzeugt. Es gibt kein Framework und keine
Laufzeit-Abhängigkeit — das fertige HTML enthält alle Inhalte im Quelltext.

```
content/de.json  ─┐
                  ├─→  src/build.js  ─→  index.html, en/index.html,
content/en.json  ─┘                      impressum.html, datenschutz.html,
                                         en/imprint.html, en/privacy.html,
                                         sitemap.xml, robots.txt, llms.txt,
                                         site.webmanifest
```

| Befehl | Wirkung |
|---|---|
| `npm run build` | Seite aus den JSON-Dateien erzeugen |
| `npm start` | Vorschau-Server auf http://localhost:4173 |
| `npm run dev` | beides nacheinander |
| `npm run images` | OG-Vorschaubild und Touch-Icon neu erzeugen (braucht `sharp`) |

`npm run build` und `npm start` laufen ohne installierte Pakete. `sharp` wird
ausschließlich für die Rastergrafiken gebraucht.

## Seitenstruktur

1. **Hero** — Name, Positionierung, Standort/Verfügbarkeit, Kontakt- und CV-Button
2. **Kompetenzen** — Tag-Grid, in drei Sekunden scanbar
3. **Qualifikationen** — neun Zertifizierungen als Kachel-Raster
4. **Erfahrung** — Timeline mit Jahr, Rolle, Unternehmen, Ergebnissen
5. **Über mich** — Bio mit der Doppelperspektive Berater/Produktverantwortlicher
6. **Projekte** — Case Studies nach dem Muster Ausgangslage → Vorgehen → Ergebnis
7. **Stimmen** — Empfehlungen
8. **FAQ** — Akkordeon mit den Standardfragen von Recruitern
9. **Kontakt** — E-Mail, LinkedIn, Standort, Verfügbarkeit
10. **Footer** — Namenszug, Impressum, Datenschutz

## SEO

- Vollständig statisches HTML, keine Inhalte per JavaScript nachgeladen
- Semantische Gliederung, genau eine `h1` pro Seite
- `canonical` und `hreflang` (de / en / x-default) auf allen sechs Seiten
- Open Graph und Twitter Cards mit generiertem 1200 × 630-Vorschaubild
- `sitemap.xml` mit Sprachalternativen, `robots.txt`
- JSON-LD: `Person`, `ProfilePage`, `FAQPage`, `EducationalOccupationalCredential`
- Keine externen Schriften oder Skripte — kurze Ladezeit, keine Render-Blocker

## GEO (Generative Engine Optimization)

Damit ChatGPT, Perplexity und Google AI Overviews die Seite als Quelle nutzen
können:

- **KI-Crawler ausdrücklich erlaubt** in `robots.txt` (GPTBot, ClaudeBot,
  PerplexityBot, Google-Extended, Applebot-Extended u. a.). Ohne diese Freigabe
  kann kein Sprachmodell die Seite zitieren.
- **`llms.txt`** — alle Kernfakten als Klartext ohne Markup: Kurzprofil,
  Kompetenzen, Zertifizierungen, Werdegang, Projekte, FAQ.
- **FAQ als `FAQPage`-Schema** — klare Frage-Antwort-Paare sind das Format, das
  Sprachmodelle am zuverlässigsten wörtlich übernehmen.
- **Faktendichte Formulierung** — Jahreszahlen, Rollen, Unternehmen und
  Ergebnisse stehen als eindeutige Aussagen statt als Fließtext-Andeutung.

Platzhalter werden aus `llms.txt` und den JSON-LD-Daten automatisch
herausgefiltert: Solange eine Angabe fehlt, wird sie strukturierten Daten nicht
untergeschoben.

## Barrierefreiheit

Skip-Link, sichtbare Fokus-Rahmen, `aria-expanded`/`aria-controls` an Menü und
Akkordeon, Trefferflächen ab 24 px, `prefers-reduced-motion` wird respektiert,
Farbkontraste nach WCAG AA.

## Datenschutz

Keine Cookies, kein Analytics, keine eingebetteten Social-Media-Plugins, keine
Google Fonts. Schriften kommen aus dem Betriebssystem. Die E-Mail-Adresse wird
erst im Browser zusammengesetzt (Spam-Schutz). Impressum und
Datenschutzerklärung liegen in beiden Sprachen vor.

> Die Rechtstexte sind sorgfältig vorbereitet, aber keine Rechtsberatung. Vor
> dem Livegang bitte auf Vollständigkeit prüfen — insbesondere die Anschrift im
> Impressum, die in Deutschland Pflicht ist.

## Veröffentlichung

Push auf `main` löst `.github/workflows/deploy.yml` aus: Die Seite wird gebaut
und auf GitHub Pages veröffentlicht. Einmalig muss unter *Settings → Pages* als
Quelle **GitHub Actions** gewählt werden.
