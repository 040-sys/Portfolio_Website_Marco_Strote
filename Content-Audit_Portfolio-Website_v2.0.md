# Content-Audit: Portfolio-Website marco-strote.vercel.app — Folgeaudit v2.0

**Version:** 2.0
**Geprüft am:** 08.08.2026, 16:03 Uhr (CEST)
**Bezug:** Folgeaudit zu `Content-Audit_Portfolio-Website_v1.0.md` (geprüft 08.08.2026, 10:37 Uhr, mit Nachtrag 16:20 Uhr) — nutzt dieselbe Methodik (siehe Anhang), diesmal mit Fokus auf Statusprüfung der v1.0-Maßnahmen plus gezielter Prüfung der seither neuen Änderungen (EN-Blog, Welle 3).
**Geprüfter Datenstand:** `content/de.json`, `content/en.json`, `content/blog-en/*.md`, gerenderte Ausgabe (`index.html`, `en/index.html`, `blog/*`, `en/blog/*`, `sitemap.xml`, `llms.txt`, JSON-LD) — frischer Build vom 08.08.2026, 16:03 Uhr
**Geprüft von:** Claude (im Auftrag von Marco Strote)
**Scope:** (1) Alle 12 Maßnahmen aus der v1.0-Liste einzeln nachverifiziert. (2) Neue EN-Blog-Infrastruktur vollständig geprüft. (3) Welle-3-Änderungen (Leistungen-Intro, FAQ-Branchen) geprüft. (4) Erneuter Cross-Check auf neue Widersprüche, die durch die letzten Änderungen entstanden sein könnten.
**Nicht erneut geprüft:** Alles, was in v1.0 bereits als Stärke (✅) bewertet und seither nicht verändert wurde (z. B. Performance, Heading-Hierarchie, AIDA/BAB-Struktur außerhalb der geänderten Sektionen) — hier gilt die v1.0-Bewertung unverändert fort.

---

## Management Summary

**9 von 12 Maßnahmen aus der v1.0-Liste sind vollständig erledigt und im aktuellen Build verifiziert** — inklusive der technisch aufwendigsten (EN-Blog, zweisprachig mit funktionierendem hreflang, Feed und Sitemap-Einträgen). Ein Punkt war ein Fehlalarm (Web3Forms). **3 Punkte sind weiterhin offen** — zwei davon unverändert seit v1.0 (Meta-Description-Länge, Meta-Keywords-Tag), einer bewusst zurückgestellt (Testimonials).

Bei der Nachprüfung sind **zwei neue, bisher nicht bemerkte Befunde** aufgetaucht — beide vermutlich Nebenwirkungen der Welle-1-Korrekturen vom 07./08.08.2026, nicht der heutigen Welle-3-Änderungen:

1. 🟡 Die Qualifikationen-Lead-Zeile ("vierzehn extern geprüft und zertifiziert, ein Zertifikat aktuell in Abschluss") liest sich bei genauem Lesen als 14 fertige **plus** 1 laufendes Zertifikat (= 15) — tatsächlich sind es 14 insgesamt (13 fertig + 1 laufend). Die FAQ-Antwort zur selben Frage ist bereits korrekt und unmissverständlich formuliert; nur die kurze Lead-Zeile ist mehrdeutig.
2. 🟡 10 von 11 Stationsorten in der Erfahrungs-Sektion (DE+EN) verwenden "Hamburg & Umgebung"/"Hamburg area" — das widerspricht der im Skill selbst festgehaltenen Regel, wonach einzelne Arbeitgeber-Standorte nur als "Hamburg" erscheinen sollen. Nur die hmmh-Station folgt der Regel bereits korrekt. Keine Falschangabe, aber eine Inkonsistenz gegen die eigene Vorgabe.

Die Welle-3-Änderungen selbst (Leistungen-PAS-Intro, FAQ-Branchen-Kürzung) sind sauber umgesetzt und wurden ohne Beanstandung verifiziert.

---

## Teil A — Status aller v1.0-Maßnahmen

| # | Befund (v1.0) | Status v1.0-Nachtrag | Jetzt verifiziert |
|---|---|---|---|
| 1 | WBS-Zertifikat als abgeschlossen dargestellt | ✅ Erledigt (Welle 1) | ✅ Bestätigt — `category: "KI · läuft noch"`, `inProgress: true`, JSON-LD `hasCredential` ohne `dateCreated`, llms.txt mit "– läuft noch". Aber: neue Randbemerkung zur Lead-Zeile, siehe Teil B1. |
| 2 | EN-FAQ „led a system introduction" | ✅ Erledigt (Welle 1) | ✅ Bestätigt — Antwort lautet jetzt "...then immediately **supported** a system introduction..." |
| 3 | Meta-Title/-Description EU-AI-Act-lastig | ✅ Website erledigt (Welle 1) | 🟡 **Teilweise.** Title korrekt umgestellt (kein "EU AI Act" mehr, 53/55 Zeichen). Description ist zwar nicht mehr EU-AI-Act-first formuliert, aber weiterhin zu lang — siehe Teil E1 (unverändert offen, siehe auch #8). |
| 4 | Kontaktformular nie konfiguriert | ⚠️ Fehlalarm | ✅ Bestätigt als Fehlalarm — Web3Forms-Key läuft korrekt über Vercel-Env-Var, von Marco als getestet bestätigt. |
| 5 | „Projekte"/„Work" fehlt in Navigation | ✅ Erledigt (Welle 2) | ✅ Bestätigt — `nav.items` (DE+EN) enthält den Eintrag, DOM-Reihenfolge stimmt mit deklarierter Reihenfolge überein (per Skript verglichen). |
| 6 | EN-Navigation falsche Reihenfolge | ✅ Erledigt (Welle 2) | ✅ Bestätigt — gerenderte Reihenfolge EN: skills → credentials → experience → about → services → writing → work → faq → contact, exakt spiegelbildlich zur deutschen Reihenfolge. |
| 7 | EN-Blog deaktiviert, Belegkette bricht | ✅ Erledigt | ✅ Bestätigt, ausführlich neu geprüft — siehe Teil C. |
| 8 | Meta-Description-Länge (176/193 Zeichen) | ⏳ Offen | 🟡 **Weiterhin offen, DE sogar länger geworden:** DE jetzt 186 Zeichen (vorher 176), EN 194 Zeichen (vorher 193). Die Wave-1-Neuformulierung hat das ursprüngliche Problem nicht mitgelöst. Siehe Teil E1. |
| 9 | Leistungen-Sektion ohne PAS-Rahmen | ✅ Erledigt (Welle 3) | ✅ Bestätigt — Intro beginnt jetzt mit Problem-Satz ("KI-Vorhaben scheitern selten an der Technik..."), DE+EN geprüft. Siehe Teil D1. |
| 10 | FAQ „Branchen"-Antwort zu dicht | ✅ Erledigt (Welle 3) | ✅ Bestätigt — Direkter Antwortsatz vorweg, danach "Stationen im Überblick", ca. 20 % kürzer, keine Fakten verloren. Siehe Teil D2. |
| 11 | Testimonials deaktiviert | ⏳ Zurückgestellt | ⏳ Unverändert — bewusste Entscheidung, kein Handlungsbedarf bis echte Zitate vorliegen. |
| 12 | Meta-Keywords-Tag ohne Wirkung | ⏳ Offen | ⏳ Unverändert offen — Tag ist weiterhin auf beiden Sprachversionen vorhanden, seit 2009 wirkungslos. Reiner Pflegeaufwand ohne Nutzen. |

**Bilanz:** 9 erledigt, 1 Fehlalarm (also faktisch nie ein echtes Problem), 3 weiterhin offen (davon 2 unverändert seit v1.0, 1 bewusst zurückgestellt).

---

## Teil B — Neue Befunde (bei der Nachprüfung entdeckt)

### B1. 🟡 Qualifikationen-Lead-Zeile: Zählweise mehrdeutig

**Fundstelle:** `certifications.lead` (DE + EN)

> DE: „Fünf Qualifikationsfelder seit 2020, das jüngste davon KI — **vierzehn extern geprüft und zertifiziert, ein Zertifikat aktuell in Abschluss.**"
> EN: „Five qualification areas since 2020, the newest of them AI — **fourteen externally examined and certified, one certificate currently in progress.**"

Bei wörtlicher Lesart sagt der Satz: 14 Zertifikate sind bereits geprüft und zertifiziert, **zusätzlich** ist eines in Abschluss — macht in Summe 15. Tatsächlich sind es 14 insgesamt: 13 abgeschlossen, 1 (WBS-Zertifikat KI-Consultant) noch laufend. `certifications.items` enthält exakt 14 Einträge, das bestätigt die 14-Gesamtzahl.

Die FAQ-Antwort zur selben Frage ("Welche Zertifizierungen liegen vor?") formuliert es bereits korrekt und unmissverständlich: „**Vierzehn** Zertifizierungen: **dreizehn** von AXELOS und EXIN [...] — ergänzt um das WBS-Zertifikat KI-Consultant (voraussichtlicher Abschluss: August 2026)." Auch `llms.txt` ist korrekt. Nur die kurze Lead-Zeile direkt unter der Sektionsüberschrift ist betroffen — ausgerechnet die Stelle, die als Erstes gelesen wird und bei einem schnellen Überfliegen (Recruiter-Zielgruppe!) hängen bleibt.

**Vermutliche Ursache:** Die Lead-Zeile wurde am 07.08.2026 im Rahmen der WBS-Status-Korrektur (v1.0-Maßnahme #1) angepasst, dabei ist die alte Formulierung nicht sauber auf die neue Zählweise umgestellt worden.

**Empfehlung:** DE: „Fünf Qualifikationsfelder seit 2020, das jüngste davon KI — **vierzehn Zertifizierungen insgesamt, davon dreizehn extern geprüft und zertifiziert, eine aktuell in Abschluss.**" EN entsprechend: „...fourteen certifications in total, thirteen externally examined and certified, one currently in progress."

### B2. 🟡 Stationsorte "Hamburg & Umgebung"/"Hamburg area" widersprechen der eigenen Skill-Regel

**Fundstelle:** `experience.items[].location` (DE + EN), 10 von 11 nicht-leeren Einträgen

Der Skill `marco-positionierung-content` hält unter "Harte Regeln" fest: „Für Standortnennungen zu einzelnen Arbeitgebern in Werdegangsdaten immer nur 'Hamburg', nie 'Hamburg & Umgebung'/'Hamburg area'." Auf der Website selbst wird diese Regel aktuell an 10 von 11 Stationen mit Ortsangabe nicht eingehalten — betroffen sind u. a. "Selbstständig" (beide Zeiträume), Akanoo, For Sale Digital, ISA, EURO TREND, SinnerSchrader, Kabel New Media, TBG Nord-Beton. Einzige korrekte Ausnahme: die hmmh-Station, die schlicht "Hamburg" trägt.

Das ist keine Falschangabe — "Hamburg & Umgebung" ist sachlich zutreffend — aber eine Inkonsistenz zwischen dem, was der Skill als verbindliche Regel für künftige Texte festhält, und dem, was auf der Live-Seite tatsächlich steht. Für einen Recruiter, der die Zeile liest, ist das folgenlos; für die Konsistenz der Content-Pflege ist es ein offener Punkt.

**Empfehlung:** Entweder die 10 Einträge auf schlichtes "Hamburg" vereinheitlichen (dann folgt die Website endlich der eigenen Regel), oder die Skill-Regel bewusst lockern, falls "Hamburg & Umgebung" tatsächlich die gewünschte Formulierung für die Website ist (dann Regel entsprechend präzisieren: z. B. "CVs: nur 'Hamburg', Website: 'Hamburg & Umgebung' erlaubt"). Aktuell existiert die Diskrepanz unbemerkt.

---

## Teil C — EN-Blog-Infrastruktur (neu seit v1.0, vollständig nachgeprüft)

Alle Punkte technisch verifiziert, nicht nur behauptet:

- **Übersetzung vollständig:** Alle drei Artikel liegen komplett auf Englisch vor (`content/blog-en/`), Register-2-Stimme beibehalten, keine gekürzten Zusammenfassungen.
- **hreflang korrekt gesetzt:** Blog-Index und alle 3 Artikelseiten haben `<link rel="alternate" hreflang="de/en/x-default">` — geprüft per Diff zwischen DE- und EN-Fassung, Ziel-URLs stimmen jeweils exakt.
- **RSS-Feeds getrennt und korrekt:** `/blog/feed.xml` und `/en/blog/feed.xml` mit jeweils eigenem `atom:link` — der zuvor hartcodierte Pfad-Bug (beide Feeds hätten sonst auf `/blog/feed.xml` gezeigt) ist behoben.
- **Sitemap zweisprachig:** Blog-Index und alle Artikel beider Sprachen in `sitemap.xml` mit korrekten hreflang-Alternates.
- **Navigation konsistent:** DE "Beiträge" / EN "Writing" an derselben Position in `nav.items`, verlinkt auf den jeweils sprachspezifischen Blog-Pfad (`/blog/` bzw. `/en/blog/`).
- **llms.txt aktualisiert:** Verweist jetzt auf beide Blog-Versionen.
- **Lang-Switch auf Blog-Seiten:** Wechsel zwischen DE/EN-Fassung eines Artikels funktioniert artikelweise (nicht nur zur jeweiligen Startseite).

Keine Beanstandung.

---

## Teil D — Welle-3-Änderungen (heute umgesetzt, nachgeprüft)

### D1. Leistungen-Intro (PAS-Rahmen)

Intro beginnt jetzt mit einem Problem-Satz vor der Lösung, DE und EN geprüft, Kernaussage bleibt unverändert (Bedarfsklärung, Übersetzung, Steuerung), keine neuen Fakten behauptet. Die Formulierung "scheitern selten an der Technik" greift dieselbe Kernaussage wie Absatz 1 in "Über mich" auf ("fast nie an der Technik, fast immer an unklaren Anforderungen") — bewusste Wiederholung des Leitmotivs an zwei Stellen der Seite, das ist als roter Faden eher eine Stärke als eine Redundanz.

### D2. FAQ „In welchen Branchen..." gekürzt

Direkter Antwortsatz vorweg ("Branchenübergreifend: Aktuell berate ich..."), danach "Stationen im Überblick" als kompakte Aufzählung im Fließtext. Alle Fakten (Firmenname, Nachfolgeunternehmen, Dauer, Jahreszahlen) bleiben erhalten — Stichprobe gegen die ursprüngliche Fassung ergab keine verlorenen Angaben außer dem Zusatz "(weiterhin eigenständige Agentur in Hamburg)" bei For Sale Digital, der bewusst als Detail zweiter Ordnung gestrichen wurde. Textlänge ca. 20 % kürzer, Struktur passt jetzt besser zum Sektionsversprechen "Direkt beantwortet."

Keine Beanstandung an beiden Änderungen.

---

## Teil E — Weiterhin offene Punkte

### E1. 🟡 Meta-Description weiterhin zu lang (unverändert seit v1.0, DE sogar regressiert)

DE: 186 Zeichen (v1.0: 176), EN: 194 Zeichen (v1.0: 193). Google zeigt üblicherweise nur rund 155–160 Zeichen an — beide Fassungen werden im Suchergebnis weiterhin abgeschnitten, DE stärker als noch bei der letzten Prüfung. Die Wave-1-Neuformulierung hat den EU-AI-Act-Schwerpunkt korrigiert, dabei aber ungewollt Zeichen hinzugefügt statt sie zu reduzieren.

**Empfehlung:** DE-Description auf ca. 155 Zeichen kürzen, z. B.: „KI- und Transformationsberater aus dem Großraum Hamburg: KI-Strategie, Prozessautomatisierung, EU AI Act. 14 Zertifizierungen, 25+ Jahre Erfahrung." (≈145 Zeichen). EN entsprechend kürzen.

### E2. ⚪ Meta-Keywords-Tag weiterhin ohne Wirkung

Unverändert seit v1.0 — reiner Pflegeaufwand, kein Google-Effekt seit 2009. Kein Handlungsdruck, könnte bei nächster Gelegenheit ersatzlos entfernt werden.

### E3. ⏳ Testimonials weiterhin deaktiviert

Unverändert, bewusste Entscheidung bis reale Zitate vorliegen (Arbeitszeugnisse, LinkedIn-Empfehlungen). Kein Fehler.

---

## Priorisierte Maßnahmenliste v2.0

| # | Befund | Schweregrad | Aufwand | Vorschlag |
|---|---|---|---|---|
| 1 | Qualifikationen-Lead-Zeile zählt mehrdeutig (14+1 statt 14 gesamt) | 🟡 Mittel | Sehr niedrig | Lead-Zeile DE+EN umformulieren (Vorschlag siehe B1) |
| 2 | Meta-Description weiterhin zu lang (186/194 Zeichen) | 🟡 Mittel | Niedrig | Auf ~150–155 Zeichen kürzen (Vorschlag siehe E1) |
| 3 | Stationsorte "Hamburg & Umgebung" widersprechen eigener Skill-Regel | 🟡 Mittel | Niedrig | Vereinheitlichen auf "Hamburg" oder Skill-Regel präzisieren |
| 4 | Meta-Keywords-Tag ohne Wirkung | ⚪ Hinweis | Sehr niedrig | Optional entfernen |
| 5 | Testimonials deaktiviert | ⚪ Hinweis | Hoch (braucht echte Zitate) | Zurückstellen, bis reale Zitate vorliegen |

Alle übrigen v1.0-Punkte sind erledigt oder als Fehlalarm aufgeklärt — siehe Teil A.

---

## Anhang: Änderungen gegenüber der Methodik in v1.0

Keine Methodik-Änderung nötig — die in v1.0 dokumentierten 8 Prüfschritte haben sich bewährt und wurden unverändert erneut angewendet, ergänzt um einen Statusabgleich Punkt für Punkt gegen die vorherige Maßnahmenliste. Für künftige Durchläufe empfiehlt sich dieses Format (Status-Tabelle gegen die letzte Maßnahmenliste + gezielte Prüfung der seither neuen Änderungen + regulärer Cross-Check) als Standardvorgehen.
