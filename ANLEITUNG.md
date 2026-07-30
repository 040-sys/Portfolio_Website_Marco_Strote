# Anleitung

Diese Datei ist für dich geschrieben — ohne Fachbegriffe, ohne Programmierkenntnisse.

---

## Das Wichtigste in einem Satz

Alle Texte der Website stehen in **zwei Dateien**: `content/de.json` (deutsch) und
`content/en.json` (englisch). Wer diese Texte ändert, ändert die Website.

---

## Was du liefern musst

Die Seite steht vollständig — Design, Struktur, Technik. Offene inhaltliche
Punkte siehst du auf der Website als **orange markierte Felder**.

> **Zum Download-Button:** Solange keine PDF-Datei vorhanden ist, wird der Button
> automatisch ausgeblendet. Ein Button, der ins Leere führt, wirkt bei Recruitern
> schlechter als gar kein Button. Genauso beim Kontaktformular weiter unten.

---

## Kontaktformular einrichten (einmalig)

Das Kontaktformular sendet Nachrichten über den kostenlosen Dienst
**[Web3Forms](https://web3forms.com/)** an deine E-Mail-Adresse — technisch ohne
eigene Serverfunktion, ganz ohne eigene Domain nutzbar.

**Solange dieser Schritt fehlt**, zeigt die Website automatisch einen Hinweis
statt des Formulars und verweist auf die E-Mail-Adresse. Nichts ist kaputt,
es fehlt nur der eine Schlüssel.

### So richtest du es ein

> **Hinweis:** Web3Forms lehnt die direkte Anmeldung mit `@yahoo.de`-Adressen
> als Spamschutz-Maßnahme pauschal ab („This email or domain is not
> allowed"). Der Weg über Google (Schritt 1) umgeht das — die
> Empfangs-Adresse für die Nachrichten bleibt trotzdem `mstrote@yahoo.de`,
> das stellst du in Schritt 2 separat ein.

1. Auf [web3forms.com](https://web3forms.com/) über **„Continue with
   Google"** anmelden (mit einem beliebigen Google-Konto — dient nur dem
   Login, nicht dem Empfang der Nachrichten)
2. Im Dashboard eine neue Form/einen Access Key anlegen und in den
   **Form-Einstellungen** die Empfangs-E-Mail auf **mstrote@yahoo.de** setzen
3. Den angezeigten **Access Key** kopieren
4. Bei Vercel im Projekt: **Settings → Environment Variables**
5. Neue Variable anlegen:
   - Name: `WEB3FORMS_ACCESS_KEY`
   - Wert: der kopierte Access Key
   - Umgebungen: **Production** und **Preview** ankreuzen
6. Speichern, dann im Vercel-Dashboard unter **Deployments** das letzte
   Deployment über "..." → **Redeploy** einmal neu anstoßen

Ab da kommen alle Formular-Nachrichten direkt in dein normales Postfach —
mit „Antworten" schreibst du der anfragenden Person unmittelbar zurück, weil
ihre Adresse automatisch als Antwortziel hinterlegt ist.

> **Datenschutz:** Die Datenschutzerklärung nennt Web3Forms bereits als
> Auftragsverarbeiter (Abschnitt „Kontaktformular"). Nichts weiter zu tun.

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
