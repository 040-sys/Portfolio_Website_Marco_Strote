# Anleitung

Diese Datei ist für dich geschrieben — ohne Fachbegriffe, ohne Programmierkenntnisse.

---

## Das Wichtigste in einem Satz

Alle Texte der Website stehen in **zwei Dateien**: `content/de.json` (deutsch) und
`content/en.json` (englisch). Wer diese Texte ändert, ändert die Website.

---

## Was du liefern musst

Die Seite steht vollständig — Design, Struktur, Technik. Was fehlt, sind **deine
Inhalte**. Auf der Website siehst du sie als **orange markierte Felder**.

| Was | Wohin | Warum |
|---|---|---|
| **Lebenslauf-Text** (Stationen, Zertifikate, Ausbildung) | einfach im Chat schicken | füllt Erfahrung, Qualifikationen, Über mich |
| **Porträtfoto** | `assets/img/portrait.jpg`, hochkant, mind. 800 × 1000 Pixel | Hero-Bereich |
| **Lebenslauf als PDF** | `assets/files/Lebenslauf-Marco-Strote.pdf` | Download-Button |
| **Deine Postanschrift** | im Chat schicken | Impressum — in Deutschland gesetzlich vorgeschrieben |
| **2–3 Empfehlungen** | im Chat schicken | Abschnitt „Stimmen" |

> **Zum Download-Button:** Solange keine PDF-Datei vorhanden ist, wird der Button
> automatisch ausgeblendet. Ein Button, der ins Leere führt, wirkt bei Recruitern
> schlechter als gar kein Button.

---

## Website ansehen

Doppelklick auf **`vorschau-starten.cmd`**. Es öffnet sich ein schwarzes Fenster —
das muss offen bleiben. Danach im Browser aufrufen:

    http://localhost:4173

Zum Beenden das schwarze Fenster schließen.

---

## Website ändern

1. `content/de.json` in einem Texteditor öffnen (Rechtsklick → Öffnen mit → Editor)
2. Text zwischen den Anführungszeichen ersetzen
3. Speichern
4. Doppelklick auf **`aktualisieren.cmd`**

Beim Bearbeiten gilt nur eine Regel: **Anführungszeichen und Kommas nicht löschen.**
Nur den Text dazwischen ändern.

Falsch:

    "title": Kompetenzen,

Richtig:

    "title": "Kompetenzen",

---

## Live schalten

Die Website liegt auf GitHub und wird über **GitHub Pages** veröffentlicht. Nach
dem ersten Einrichten passiert alles automatisch: Sobald eine Änderung
hochgeladen wird, ist die Seite ein bis zwei Minuten später online.

### Einmalig einrichten

1. Auf github.com im Repository **Settings → Pages** öffnen
2. Bei „Source" **GitHub Actions** auswählen
3. Fertig — die Seite läuft unter `https://<dein-benutzername>.github.io/Portfolio_Website_Marco_Strote/`

### Eigene Domain (z. B. marco-strote.de)

1. Domain bei einem Anbieter kaufen (IONOS, Strato, Namecheap — etwa 10–15 € pro Jahr)
2. Beim Anbieter diese DNS-Einträge setzen:

   | Typ | Name | Wert |
   |---|---|---|
   | A | @ | 185.199.108.153 |
   | A | @ | 185.199.109.153 |
   | A | @ | 185.199.110.153 |
   | A | @ | 185.199.111.153 |
   | CNAME | www | `<dein-benutzername>.github.io` |

3. Auf github.com unter **Settings → Pages → Custom domain** die Domain eintragen
4. Haken bei **Enforce HTTPS** setzen (kann bis zu 24 Stunden dauern)

Sag mir Bescheid, sobald die Domain steht — ich passe die Adressangaben in der
Website an, damit Google und die KI-Suchmaschinen die richtige Adresse sehen.

---

## Was nach dem Livegang zu tun ist

- **Google Search Console** (kostenlos): Website anmelden, `sitemap.xml` einreichen.
  Ohne diesen Schritt dauert es deutlich länger, bis Google die Seite kennt.
- **Bing Webmaster Tools**: dasselbe. Wichtig, weil ChatGPT-Suche auf Bing aufbaut.
- **LinkedIn-Profil**: Website-Adresse im Profil eintragen. Das ist der stärkste
  einzelne Faktor dafür, dass die Seite überhaupt gefunden wird.

---

## Wozu die einzelnen Ordner da sind

    content/      ← deine Texte (hier änderst du etwas)
    assets/img/   ← Bilder (Porträt, Vorschaubild)
    assets/files/ ← Lebenslauf-PDF
    assets/css/   ← Aussehen
    assets/js/    ← Verhalten (Menü, Akkordeon)
    src/          ← Bauwerkzeug
    index.html    ← wird automatisch erzeugt, nicht von Hand ändern

Alles, was `src/` erzeugt (`index.html`, `en/index.html`, `sitemap.xml`,
`robots.txt`, `llms.txt`), wird bei jedem Update überschrieben. Änderungen dort
gehen verloren — deshalb immer `content/de.json` ändern, nie das HTML.
