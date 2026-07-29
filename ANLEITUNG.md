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
| **Ergebniszahlen zu zwei Projekten** | im Chat schicken | Abschnitt „Projekte" — Zahlen unterscheiden eine Case Study von einer Tätigkeitsbeschreibung |
| **2–3 Empfehlungen** | im Chat schicken | Abschnitt „Stimmen" |

> **Zum Download-Button:** Solange keine PDF-Datei vorhanden ist, wird der Button
> automatisch ausgeblendet. Ein Button, der ins Leere führt, wirkt bei Recruitern
> schlechter als gar kein Button.

---

## Der Lebenslauf

Der Lebenslauf wird **aus denselben Daten erzeugt wie die Website**. Du pflegst
also nichts doppelt: Sobald sich in `content/de.json` etwas ändert, ändert sich
auch der Lebenslauf.

Es gibt ihn in drei Formen:

| Form | Wo |
|---|---|
| Als Webseite | `lebenslauf.html` (englisch: `en/cv.html`) |
| Als PDF zum Herunterladen | `assets/files/Lebenslauf-Marco-Strote.pdf` |
| Als Download-Button | auf der Startseite, oben und im Kontaktbereich |

**Nach einer inhaltlichen Änderung** genügt ein Doppelklick auf
**`lebenslauf-erstellen.cmd`** — dann werden Website und PDF gemeinsam neu
erzeugt.

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

## Die Seite ist live

    https://marco-strote.vercel.app

| Wo | Wofür |
|---|---|
| https://vercel.com/mstrote-9879s-projects | Hosting — hier läuft die Seite |
| https://github.com/040-sys/Portfolio_Website_Marco_Strote | Speicherort aller Dateien |

Vercel beobachtet das Repository: Sobald dort etwas hochgeladen wird, baut es die
Seite automatisch neu.

### Änderungen veröffentlichen

Doppelklick auf **`aenderungen-hochladen.cmd`**. Das Skript baut Website und
Lebenslauf neu, lädt alles hoch und stößt die Veröffentlichung an. Ein bis zwei
Minuten später ist die neue Fassung online.

### Eigene Domain (z. B. marco-strote.de)

1. Domain bei einem Anbieter kaufen (IONOS, Strato, Namecheap — etwa 10–15 € pro Jahr)
2. Bei Vercel im Projekt auf **Settings → Domains → Add** die Domain eintragen
3. Vercel zeigt an, welche DNS-Einträge beim Domain-Anbieter zu hinterlegen sind —
   in der Regel ein A-Eintrag auf `76.76.21.21` und ein CNAME für `www`
4. Warten, bis Vercel „Valid Configuration" meldet. Das HTTPS-Zertifikat wird
   automatisch ausgestellt.

**Danach ist nichts weiter zu tun.** Die Website liest ihre eigene Adresse aus
Vercel aus — Verweise, Sitemap und die Angaben für Google stellen sich von selbst
auf die neue Domain um.

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
