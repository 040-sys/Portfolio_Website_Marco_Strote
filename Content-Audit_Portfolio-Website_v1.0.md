# Content-Audit: Portfolio-Website marco-strote.vercel.app

**Version:** 1.0 (mit Nachtrag vom 08.08.2026, 16:20 Uhr)
**Geprüft am:** 08.08.2026, 10:37 Uhr (CEST)
**Geprüfter Datenstand:** `content/de.json`, `content/en.json`, gerenderte Ausgabe (`index.html`, `en/index.html`, `robots.txt`, `sitemap.xml`, `llms.txt`) — Build vom 07.08.2026
**Geprüft von:** Claude (im Auftrag von Marco Strote)
**Scope:** Alle Sektionen der Startseite (Hero bis Footer), DE und EN, plus technische SEO-/GEO-/Performance-Basis
**Nicht geprüft in dieser Version:** Lebenslauf-PDFs (CV-Dokumente), Blog-Einzelartikel (Volltext), Impressum/Datenschutz-Detailtext (nur strukturell erfasst)

---

## Nachtrag vom 08.08.2026, 16:20 Uhr (CEST)

Der ursprüngliche Bericht bleibt unten unverändert stehen (Prüfstand vom 07.08.2026) — dieser Nachtrag dokumentiert, was sich seither geändert hat, statt den Bericht rückwirkend zu beschönigen.

- **Befund C1 (Kontaktformular nie konfiguriert) war ein Fehlalarm.** Der Web3Forms Access Key wird produktiv über eine Vercel-Umgebungsvariable (`WEB3FORMS_ACCESS_KEY`) gesetzt, nicht über `content/*.json` — bewusst so gebaut, damit der Key nicht im Git-Verlauf steht. `build.js` überschreibt `contact.form.web3formsKey` damit zur Build-Zeit. Lokale Builds ohne diese Variable zeigen deshalb korrekt den Platzhalter — das ist das erwartete Verhalten, kein Defekt. Marco hat bestätigt, dass das Formular auf der Live-Seite bereits getestet wurde und funktioniert. Die „2 Platzhalter"-Warnung von `build.js` bezieht sich auf genau diesen Fall und ist ebenfalls kein Fehler, sondern das vorgesehene Verhalten bei lokalen Builds.
- **Befund C3 (EN-Blog fehlt) ist behoben.** Die drei Fachartikel liegen seit dem 08.08.2026 auch auf Englisch vor (`content/blog-en/`), `en.blog.enabled` ist `true`, die Seiten sind unter `/en/blog/` live. DE- und EN-Version verweisen artikelweise per `hreflang` aufeinander, RSS-Feed und Sitemap sind zweisprachig erweitert. Damit funktioniert die Belegkette „dokumentiert in eigenen Fachartikeln" jetzt auch für englischsprachige Leser.
- Welle 1 und Welle 2 der Maßnahmenliste (Befunde 1–3, 5–6) wurden ebenfalls bereits umgesetzt. Details dazu in der Maßnahmenliste unten (Status-Spalte).

---

## Wie dieser Bericht zu lesen ist

Jeder Befund ist mit einem Schweregrad markiert:

- 🔴 **Kritisch** — Widerspruch oder Falschaussage, die bei Nachfrage auffliegt und Vertrauen kostet. Zeitnah beheben.
- 🟠 **Hoch** — echte Lücke gegen eines der Ziele (Job finden / Projekte gewinnen) oder gegen SEO/GEO/UX-Anforderungen.
- 🟡 **Mittel** — spürbar, aber nicht geschäftskritisch.
- ⚪ **Hinweis** — Detailoptimierung, kein Handlungsdruck.
- ✅ **Stärke** — bewusst benannt, weil der Auftrag "fair" verlangt, nicht nur Schwächen zu suchen.

Jeder Befund enthält die exakte Fundstelle (Sektion, Feld, teils Zitat), damit er ohne erneute Suche nachvollzogen werden kann.

---

## Management Summary

Die Website ist inhaltlich reif, ehrlich in der Grundhaltung und technisch überdurchschnittlich sauber gebaut (Ladezeit, Struktur, KI-Crawler-Freigabe). Die eigentliche Ehrlichkeits-Arbeit der letzten Wochen — Zeugnis-genaue Formulierungen, Rollenmodell, Modulzahlen — ist an den meisten Stellen erfolgreich in den Content eingeflossen.

Das Audit deckt aber vier Fundstellen auf, an denen sich die Seite **selbst widerspricht**, und zwei strukturelle Lücken, die direkt gegen die Ziele "Job finden" und "Projekte gewinnen" arbeiten:

1. 🔴 Die Qualifikationen-Sektion (plus JSON-LD plus llms.txt) stellt das laufende WBS-Zertifikat als bereits abgeschlossen dar — im Widerspruch zu Erfahrung-Sektion und FAQ auf derselben Seite.
2. 🔴 Die englische FAQ behauptet, Marco habe eine System­einführung "led" (geleitet) — exakt die Übertreibung, die heute an drei anderen Stellen der Seite korrigiert wurde, hier aber übersehen wurde.
3. 🔴 Meta-Title und -Description stellen EU AI Act weiterhin als "Schwerpunkt" heraus — im Widerspruch zur heute mehrfach umgesetzten Entscheidung, EU AI Act zu einem Kompetenzfeld unter mehreren zu machen.
4. 🟠 ~~Das Kontaktformular ist seit Live-Gang nie konfiguriert (Platzhalter-API-Key)~~ — **Fehlalarm, siehe Nachtrag oben.** Der Key war bereits über eine Vercel-Umgebungsvariable gesetzt, das Formular ist getestet und funktionsfähig.
5. 🟠 Die stärkste Beweis-Sektion der Seite ("Ausgewählte Projekte", inkl. echtem ROI) fehlt komplett in der Hauptnavigation.
6. 🟠 ~~Die englische Version hat eine falsche Navigationsreihenfolge und keinen Blog~~ — **beides seit 08.08.2026 behoben, siehe Nachtrag oben.**

Alle sechs Punkte sind unten mit exakter Fundstelle und Korrekturvorschlag dokumentiert (Status siehe Nachtrag und Maßnahmenliste).

---

## Teil A — Technische Basis (SEO, GEO, Performance)

### A1. Performance ✅

- Startseite komplett (HTML + CSS + JS + Hero-Bild) wiegt **ca. 216 KB** — deutlich unter dem, was für Portfolio-Websites üblich ist.
- **Keine externen Requests**: kein Google Fonts, kein CDN, kein Tracking-Script. Ein einziges JavaScript (`main.js`, 12 KB), mit `defer` geladen — blockiert das Rendering nicht.
- Hero-Bild als `<picture>` mit WebP + 1×/2×-Set, `width`/`height` gesetzt (verhindert Layout-Shift), `fetchpriority="high"` auf dem LCP-Bild. Das ist Best Practice, nicht Standard.

**Bewertung:** Die "schnell laden"-Anforderung ist erfüllt, mit Reserve nach oben. Kein Handlungsbedarf.

### A2. On-Page-SEO

- ✅ Saubere Heading-Hierarchie: genau ein `<h1>`, konsistente `<h2>`/`<h3>`/`<h4>`-Struktur über alle Sektionen.
- ✅ `lang="de"` / `lang="en"` korrekt gesetzt, `hreflang`-Alternates und `canonical` auf allen geprüften Seiten vorhanden.
- 🟡 **Meta-Description zu lang.** DE: 176 Zeichen, EN: 193 Zeichen. Google zeigt in der Regel nur ca. 155–160 Zeichen an — beide werden im Suchergebnis abgeschnitten, EN stärker. *(`content/de.json` → `meta.description`, `content/en.json` → `meta.description`)*
- ⚪ **Title-Tag am oberen Rand.** DE 69, EN 71 Zeichen — meist noch vollständig sichtbar, aber knapp am Limit (~60 Zeichen Faustregel).
- ⚪ **Meta-Keywords-Tag ohne Wirkung.** Wird seit 2009 von Google ignoriert (andere Suchmaschinen ähnlich). Kein Schaden, aber Pflegeaufwand ohne Nutzen — könnte ersatzlos entfernt werden.

### A3. GEO (KI-Suchmaschinen-Optimierung) ✅

- `robots.txt` erlaubt explizit GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-User, Claude-SearchBot, PerplexityBot, Perplexity-User, Google-Extended, Applebot-Extended, Amazonbot, DuckAssistBot, cohere-ai, YouBot, Diffbot — eine ungewöhnlich vollständige Freigabeliste.
- `llms.txt` vorhanden, strukturiert (Kurzprofil, Kompetenzen, Zertifizierungen, Werdegang, Ausbildung) — genau das Format, das KI-Assistenten zum Zitieren bevorzugen.
- JSON-LD deckt `Person`, `ProfilePage`, `FAQPage`, `EducationalOccupationalCredential`, `Organization` ab.
- 🔴 **Aber:** Sowohl `llms.txt` als auch das JSON-LD (`hasCredential`) übernehmen den unter B1 beschriebenen WBS-Zertifikat-Fehler unverändert. Ein KI-Assistent, der die Seite zitiert, würde denselben overclaim reproduzieren — die GEO-Stärke der Seite verstärkt hier ungewollt den inhaltlichen Fehler, statt ihn zu neutralisieren.

### A4. Struktur-/Navigationsfehler (technisch verifiziert)

- 🟠 **"Projekte" / "Work" fehlt in `nav.items`** (DE und EN). Im DOM existiert die Sektion (`id="projekte-title"` bzw. `id="work-title"`), ist aber weder in der Desktop- noch der Mobile-Navigation verlinkt. Verifiziert durch Abgleich der gebauten `index.html`/`en/index.html` gegen `content/*.json`.
- 🟠 **EN-Navigation in falscher Reihenfolge.** Nav-Reihenfolge lt. `en.json`: Skills → Credentials → Experience → **Services → About** → FAQ. Tatsächliche DOM-Reihenfolge: Skills → Credentials → Experience → **About → Services** → Work → FAQ → Contact. Die deutsche Navigation ist korrekt (identisch mit DOM-Reihenfolge); nur die englische hat `services` und `about` vertauscht. *(`content/en.json` → `nav.items`)*

---

## Teil B — Kritische Content-Widersprüche

### B1. 🔴 WBS-Zertifikat wird als abgeschlossen dargestellt

**Fundstellen:**

| Ort | Text | Problem |
|---|---|---|
| `certifications.items[0]` | „WBS-Zertifikat KI-Consultant, WBS TRAINING, 2026" | Gleichrangig neben 13 tatsächlich abgeschlossenen Zertifikaten gelistet, ohne Kennzeichnung "läuft noch" |
| `certifications.lead` | „…jedes einzelne extern geprüft und zertifiziert." | Impliziert wörtlich, alle 14 Einträge seien bereits zertifiziert |
| JSON-LD `hasCredential` | `dateCreated: "2026"`, keine Qualifizierung | Strukturierte Daten übernehmen den Fehler 1:1 |
| `llms.txt` | „WBS-Zertifikat KI-Consultant (WBS TRAINING, 2026)" | GEO-Ebene übernimmt den Fehler ebenfalls |

**Widerspricht:**
- `experience.items[0].summary`: „7 von 9 Praxismodulen … abgeschlossen"
- `faq.items[7].a`: „…ergänzt um das WBS-Zertifikat KI-Consultant (**voraussichtlicher Abschluss: August 2026**)"

Eine Person, die zuerst die Qualifikationen-Kachel liest, bekommt einen anderen Stand mitgeteilt als jemand, der die FAQ liest — auf derselben Seite. Für die Zielgruppe Recruiter ist das das riskanteste Detail im gesamten Audit: Nachfragen im Gespräch würden eine andere Auskunft ergeben als die Website.

**Selbe Systematik in EN:** `certifications.items[0].name` = „WBS AI Consultant Certificate", `certifications.lead` = „…each one externally examined and certified."

**Empfehlung:** In der Qualifikationen-Kachel und im `lead`-Satz einen Status-Zusatz ergänzen (z. B. Badge/Klammer „laufend, Abschluss vorauss. Aug. 2026" direkt an der Kachel), damit die Aussage ohne Blick in FAQ/Erfahrung konsistent ist. Gleiches in JSON-LD (z. B. `dateCreated` weglassen oder durch ein Statusfeld ergänzen) und `llms.txt` nachziehen.

### B2. 🔴 EN-FAQ: "led a system introduction" — Bruch der heute festgelegten Harten Regel

**Fundstelle:** `content/en.json`, FAQ „Why the move from sales to consulting?":

> „In 2020 I acquired the methodological side systematically, then immediately **led** a system introduction as IT project manager."

Das Zeugnis von Dr. Jörg Freytag belegt „unterstützte" (supported), nicht „leitete" (led) — diese Korrektur wurde heute bereits in `about`-Absatz 2 (DE+EN), im Experience-Highlight (DE+EN) und im Skill als Harte Regel festgehalten. Die englische FAQ-Antwort ist offenbar keine Übersetzung der aktuellen deutschen FAQ-Antwort, sondern ein älterer, eigenständiger Text, der bei der Korrekturrunde nicht mitgeprüft wurde.

**Auch die deutsche FAQ-Antwort ist zu prüfen:** „…direkt danach als IT-Projektmanager ein System eingeführt." — „eingeführt" ist schwächer als „geleitet", aber immer noch stärker als das Zeugnis-Wort „unterstützt", das im About-Text verwendet wird. Empfehlung: an allen drei Stellen (About, Experience, FAQ) exakt dieselbe Wortwahl verwenden.

### B3. 🔴 Meta-Title/-Description widersprechen der EU-AI-Act-Positionierungsentscheidung

**Fundstellen:**
- `meta.title`: „Marco Strote — KI- & Transformationsberater | **EU AI Act** | Hamburg"
- `meta.description`: „…**Schwerpunkt EU AI Act**, KI-Strategie und Digitalisierung…"

Heute wurden Footer-Tagline, Kontakt-Lead und die FAQ-Formulierungen bewusst so überarbeitet, dass EU AI Act nicht mehr als Markenkern, sondern als eines von mehreren Kompetenzfeldern erscheint (siehe Skill-Regel „Positionierung: breit aufgestellt, nicht EU-AI-Act-only"). Der SEO-Layer — Browser-Tab-Titel, Google-Snippet, Lesezeichen-Name — ist genau der Teil der Seite, den Besucher zuerst sehen, und transportiert dort weiterhin die alte, engere Positionierung. Gleiches Muster: LinkedIn-Headline („KI & Transformationsberater | EU AI Act I Digitalisierung mit messbarem Business Impact") — Cross-Channel-Inkonsistenz zur neuen Positionierung.

**Empfehlung:** Title/Description auf den breiteren Claim umstellen (analog zur Footer-Tagline), EU AI Act als eines von mehreren Stichworten in die Description, nicht in den Title.

---

## Teil C — Strukturelle Lücken gegen die Ziele

### C1. ⚠️ Kontaktformular seit Live-Gang nie konfiguriert — *Fehlalarm, siehe Nachtrag oben*

`contact.form.web3formsKey` ist in `de.json` **und** `en.json` weiterhin der Platzhalter-String — exakt die „2 Platzhalter", vor denen `build.js` bei jedem Build warnt. Das Template fängt den Fall sauber ab (zeigt „Das Formular wird gerade eingerichtet" statt einer kaputten Form — **kein Datenverlust-Risiko**), aber: das vollständig gebaute, kategorisierte Kontaktformular (Name/E-Mail/Anliegen-Dropdown/Nachricht) war auf der Live-Seite bisher schlicht nie benutzbar. Jede Kontaktaufnahme lief zwangsläufig über manuell verfasste E-Mail statt über den strukturierten, niedrigschwelligeren Weg.

**Empfehlung:** Web3Forms-Account anlegen, Access Key eintragen (in beiden Sprachdateien), neu bauen.

### C2. 🟠 "Ausgewählte Projekte" fehlt in der Navigation

Die Sektion `projects` enthält vier Case Studies nach Herausforderung/Vorgehen/Ergebnis-Logik — inklusive der einzigen konkreten ROI-Zahl der ganzen Seite (~131 % über sechs Monate). Genau diese Sektion ist am Leitmotiv „Belege statt Behauptungen" ausgerichtet und damit die überzeugendste Beweisquelle für die Zielgruppe „Projekte gewinnen". Sie fehlt aber in `nav.items`, wird von keinem Hero-CTA angesteuert und von der Leistungen-Sektion nur als Fließtext erwähnt („Details siehe „Projekte" unten"), nicht verlinkt. Wer nicht bis fast ganz nach unten scrollt (die Sektion liegt hinter Leistungen und Beiträge), sieht sie nicht.

**Empfehlung:** Nav-Eintrag ergänzen (DE: „Projekte", EN: „Work"), plus einen echten Link (nicht nur Fließtext-Verweis) aus der Leistungen-Sektion.

### C3. ✅ EN-Version: Blog fehlt komplett, Belegkette bricht für englischsprachige Leser — *behoben, siehe Nachtrag oben*

`blog.enabled` ist `false` in `en.json`, `true` in `de.json`. Die drei veröffentlichten Fachartikel sind exakt der Beleg, auf den sich Experience-Highlight und FAQ berufen („dokumentiert in eigenen Fachartikeln" / „documented in my own articles"). Auf Englisch existiert dieser Beleg für die Leserschaft nicht — die Aussage steht im Raum, ohne verifizierbar zu sein. Für eine Seite, deren zentrales Versprechen „Belegen statt behaupten" ist, ist das eine Lücke speziell für internationale/englischsprachige Besucher.

**Empfehlung:** Mittelfristig mindestens Kurzfassungen/Übersetzungen der drei Artikel für die EN-Seite, oder kurzfristig den Verweis „documented in my own articles" in der EN-FAQ entschärfen, solange kein EN-Beleg existiert.

### C4. ⚪ Testimonials-Sektion deaktiviert

`testimonials.enabled: false` — nachvollziehbar und ehrlich (keine Fake-Zitate), aber es fehlt damit ein Vertrauenssignal, das beide Zielgruppen erwarten würden. Kein Fehler, aber ein offener Punkt für die Weiterentwicklung, sobald reale Zitate vorliegen (z. B. aus Arbeitszeugnissen, LinkedIn-Empfehlungen).

---

## Teil D — Copywriting-Framework-Analyse

### D1. AIDA (Hero-Sektion)

| Phase | Umsetzung | Bewertung |
|---|---|---|
| **A**ttention | „Ich mache KI im Unternehmen anwendbar — von der Strategie bis zur einsatzfähigen Anwendung." | ✅ konkret, kein Blabla |
| **I**nterest | Intro-Absatz: 25 Jahre, Markt+Fachbereich+Umsetzung | ✅ differenziert sofort |
| **D**esire | — | 🟡 schwach im Hero selbst; Differenzierung/Emotion entsteht erst in Über mich/Projekte |
| **A**ction | Primary-CTA „Kontakt aufnehmen", Secondary-CTA „Lebenslauf herunterladen" | ✅ zwei klare Pfade, aber keiner führt zu den Projekten (siehe C2) |

**Vorschlag:** Ein Satz oder eine Kennzahl aus den Projekten (z. B. die ROI-Größenordnung) direkt im Hero andeuten, um Desire früher aufzubauen, statt es komplett den unteren Sektionen zu überlassen.

### D2. PAS (Problem–Agitate–Solve)

- ✅ **FAQ „Warum der Wechsel von Vertrieb zu Beratung?"** nutzt PAS sauber: Problem (Einführungen scheitern) → Agitation („fast nie an der Technik, fast immer an unklaren Anforderungen") → Solve (heute beide Seiten bedienen).
- 🟡 **Leistungen-Sektion nutzt PAS nicht.** Die vier Kacheln sind eine reine Feature-Liste ohne vorangestellten Problem-Rahmen. Eine einleitende Problemzeile vor den Kacheln (z. B. eine Variante von „KI-Vorhaben scheitern selten an der Technik, sondern an Zuständigkeit und Übersetzung zwischen den Welten") würde die Sektion überzeugender machen, statt direkt mit der Lösung zu starten.

### D3. BAB (Before–After–Bridge)

- ✅ **Über mich** folgt BAB implizit über sechs Absätze: Before (Marktseite, gescheiterte Einführungen gesehen) → Bridge (2020 Weiterbildung, LIMS-Projekt, fünf Qualifikationsfelder) → After (heute: Übersetzer zwischen Geschäftsführung, Fachbereich, Technik). Inhaltlich stimmig, aber mit sechs Absätzen für eine schnelle Skim-Lesung eher lang (siehe D4).
- ✅ **Projekte-Sektion ist die sauberste BAB-Umsetzung der ganzen Seite** — jede Case Study hat exakt Herausforderung/Vorgehen/Ergebnis, also Before/Bridge/After in Reinform. Sollte als strukturelles Vorbild für die Leistungen-Sektion dienen (siehe D2).

### D4. UX-Writing-Prinzipien

| Prinzip | Befund |
|---|---|
| CTA-Konsistenz | ✅ durchgängig handlungsorientierte Verben („Kontakt aufnehmen", „Nachricht senden", „Lebenslauf herunterladen") |
| Tonalität/Register | ✅ konsistent: formelle Sie-Form im Kontaktbereich, sonst durchgängig monologische Ich-Stimme ohne direkte Leseransprache — keine Du/Sie-Mischung gefunden |
| Terminologie | ✅ „KI-Consultant" (nur CV) vs. „KI- & Transformationsberater" (Website/LinkedIn) korrekt getrennt gehalten |
| Buzzword-Kontrolle | ✅ weitgehend sauber; einzige Ausnahme: „messbaren Business Impact" (2×, Experience-Highlight + CV-Profil) — nahe an der bereits als Buzzword geflaggten Kategorie „Mehrwert schaffen" |
| Scanbarkeit FAQ | 🟡 einzelne Antworten sind sehr dicht (z. B. „In welchen Branchen…" — ein Fließtext-Absatz mit 12 Firmennamen). Widerspricht dem eigenen Sektionsversprechen „Direkt beantwortet." Aufzählung oder Kurzfassung + Verweis auf die Unternehmensprofile-Doku wäre konsistenter. |
| Gesamtlänge | ⚪ ca. 3.000 Wörter Sichttext auf der Startseite ≈ 15 Min. Lesezeit bei 200 WPM. Kein Fehler (Sektionen + Ankernavigation federn das ab), aber ein Hinweis: „Über mich" und FAQ tragen den Großteil der Länge. |
| Barrierefreiheit | ✅ Alt-Texte vorhanden, `lang`-Attribut korrekt, genau ein H1 |

---

## Teil E — Zielabgleich

### Job finden (Zielgruppe Recruiter/Personalverantwortliche)

**Stärken:** klare CV-Downloads, saubere Erfahrungs-Chronologie, FAQ beantwortet die typischsten Recruiter-Fragen direkt (Rolle, Verfügbarkeit, Arbeitsmodell, Remote/Hybrid/Vor-Ort).

**Schwäche:** Befund B1 (Qualifikationen-Overclaim) ist für diese Zielgruppe am riskantesten — ein Recruiter, der im Gespräch nachfragt und eine andere Auskunft bekommt als auf der Seite steht, verliert Vertrauen in die gesamte Selbstdarstellung, nicht nur in dieses eine Detail.

### Projekte gewinnen (Zielgruppe Auftraggeber)

**Stärken:** Projekte-Sektion mit echtem ROI, klar strukturierte Leistungen-Sektion, ungewöhnlich transparenter Datenschutztext (passt zur Compliance-affinen Zielgruppe).

**Schwäche:** Befund C2 (Projekte nicht auffindbar) trifft diese Zielgruppe am härtesten, da Case Studies der zentrale Vertrauensanker für Auftraggeber sind. Befund C1 (Kontaktformular) erhöht zusätzlich die Hürde für eine unverbindliche Erstanfrage.

### Beide Zielgruppen zugleich

Befund C4 (Testimonials deaktiviert) fehlt als Vertrauenssignal für beide Zielgruppen gleichermaßen — nachvollziehbar, aber offen.

---

## Priorisierte Maßnahmenliste

| # | Befund | Schweregrad | Aufwand | Vorschlag | Status (Stand 08.08.2026) |
|---|---|---|---|---|---|
| 1 | WBS-Zertifikat als abgeschlossen dargestellt (Qualifikationen, JSON-LD, llms.txt) | 🔴 Kritisch | Niedrig | Status-Zusatz „laufend, Abschluss vorauss. Aug. 2026" an der Kachel + JSON-LD/llms.txt nachziehen | ✅ Erledigt (Welle 1) |
| 2 | EN-FAQ „led a system introduction" | 🔴 Kritisch | Niedrig | Auf „supported"/gleiche Wortwahl wie About-Absatz umstellen; DE-FAQ „eingeführt" ebenfalls gegen „unterstützt" prüfen | ✅ Erledigt (Welle 1) |
| 3 | Meta-Title/-Description noch EU-AI-Act-lastig | 🔴 Kritisch | Niedrig | Auf breiteren Claim umstellen, analog Footer-Tagline; LinkedIn-Headline danach angleichen | ✅ Erledigt (Welle 1, Website-Teil — LinkedIn-Headline steht bei Marco noch aus) |
| 4 | Kontaktformular nie konfiguriert | 🟠 Hoch | Niedrig | Web3Forms Access Key eintragen (DE+EN), neu bauen | ⚠️ Fehlalarm — Key war bereits über Vercel-Env-Var gesetzt und laut Marco getestet, siehe Nachtrag oben |
| 5 | „Projekte"/„Work" fehlt in Navigation | 🟠 Hoch | Niedrig | Nav-Eintrag ergänzen, echten Link aus Leistungen-Sektion setzen | ✅ Erledigt (Welle 2) |
| 6 | EN-Navigation falsche Reihenfolge (Services/About vertauscht) | 🟠 Hoch | Niedrig | `nav.items` in `en.json` in DOM-Reihenfolge bringen | ✅ Erledigt (Welle 2) |
| 7 | EN-Blog deaktiviert, Belegkette bricht für EN-Leser | 🟠 Hoch | Mittel | Mind. Kurzfassungen der 3 Artikel übersetzen, oder FAQ-Verweis kurzfristig entschärfen | ✅ Erledigt — alle 3 Artikel vollständig übersetzt, `/en/blog/` live, hreflang gesetzt |
| 8 | Meta-Description-Länge (176/193 Zeichen) | 🟡 Mittel | Niedrig | Auf ~155 Zeichen kürzen | ⏳ Offen |
| 9 | Leistungen-Sektion ohne PAS-Rahmen | 🟡 Mittel | Niedrig | Einleitende Problemzeile vor den 4 Kacheln | ⏳ Offen (Welle 3) |
| 10 | FAQ „Branchen"-Antwort zu dicht für „Direkt beantwortet." | 🟡 Mittel | Niedrig | Kürzen oder als Liste strukturieren | ⏳ Offen (Welle 3) |
| 11 | Testimonials deaktiviert | ⚪ Hinweis | Hoch (braucht echte Zitate) | Zurückstellen, bis reale Zitate vorliegen | ⏳ Zurückgestellt |
| 12 | Meta-Keywords-Tag ohne Wirkung | ⚪ Hinweis | Sehr niedrig | Optional entfernen | ⏳ Offen |

---

## Anhang: Methodik (für spätere, wiederholte Prüfungen)

Diese Prüfung wurde in folgenden Schritten durchgeführt — als Vorlage für künftige, versionierte Durchläufe (z. B. als Skill):

1. Vollständige Erfassung von `content/de.json` und `content/en.json` (jedes Feld gelesen, nicht nur überflogen).
2. Abgleich der gebauten `index.html`/`en/index.html` gegen die Content-Dateien, um Render-Logik-Effekte zu erfassen (z. B. bedingtes Ausblenden bei Platzhaltern, tatsächliche DOM-Reihenfolge vs. deklarierte Nav-Reihenfolge).
3. Technische Prüfung: Asset-Größen, `<picture>`/Bild-Handling, Heading-Hierarchie, Meta-Tag-Längen (per Zeichenzählung, nicht geschätzt), JSON-LD-Typen, `robots.txt`, `sitemap.xml`, `llms.txt`.
4. Cross-Referenzierung von Fakten-Aussagen zwischen Sektionen (Qualifikationen vs. Erfahrung vs. FAQ; DE vs. EN) auf Widersprüche.
5. Abgleich gegen die dokumentierten Fakten- und Sprachregeln (Zeugnis-Zitate, Harte Regeln aus dem Positionierungs-Skill).
6. Buzzword-Scan gegen eine definierte Vermeidungsliste (automatisiert, `grep`-basiert, keine Stichprobe).
7. Framework-Analyse (AIDA/PAS/BAB) je Sektion, qualitativ anhand der Textstruktur.
8. UX-Writing-Check: CTA-Konsistenz, Tonalitäts-Konsistenz, Terminologie-Konsistenz, Scanbarkeit, Wortzahl/Lesezeit.

**Nächste Prüfung:** empfohlen nach Umsetzung der Maßnahmen 1–7 (Kritisch + Hoch), zur Verifikation. Diese Version (v1.0) dient als Baseline für den Vergleich.
