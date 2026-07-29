---
title: Agentic AI und Artikel 14 — der ungelöste Konflikt
description: Der EU AI Act verlangt menschliche Aufsicht über KI-Entscheidungen. Autonome Agenten entscheiden mit Maschinengeschwindigkeit. Was Unternehmen trotzdem sicherstellen müssen.
date: 2026-05-28
category: Analyse
tags: [EU AI Act, Agentic AI, GPAI, KI-Governance]
---

Wer GPT-4 nicht nur als Chatbot einsetzt, sondern als autonomen Agenten — mit Werkzeugnutzung, mehrstufigen Entscheidungen, Datenbankzugriffen, API-Aufrufen — betritt regulatorisches Neuland. Nicht weil die Verordnung dazu schwiege, sondern weil zwei ihrer Anforderungen in der Praxis schwer zusammengehen.

## Zwei Stufen bei Allzweck-KI

Der EU AI Act behandelt Allzweck-KI-Modelle (GPAI) gesondert und kennt dabei zwei Stufen:

**Stufe 1 — GPAI-Modell.** Dokumentationspflicht, Zusammenfassung der Trainingsdaten, Nachweis zur Einhaltung des Urheberrechts.

**Stufe 2 — systemisches Risiko.** Zusätzlich: Red Teaming, adversarielle Tests, Meldung schwerwiegender Vorfälle an das EU AI Office, Cybersicherheitsauflagen, Bewertung gesellschaftlicher Risiken. Die Schwelle liegt bei 10²⁵ FLOPs Trainingsaufwand.

Diese Schwelle ist keine theoretische Grenze. Nach Erhebungen von [Epoch AI](https://epoch.ai/) liegen die verbreiteten Spitzenmodelle darüber — GPT-4 und seine Nachfolger ebenso wie die großen Modelle von Anthropic, Google, Meta und Mistral. Wer eines davon produktiv einsetzt, arbeitet mit einem Modell, das der Gesetzgeber als systemisch riskant einstuft.

## Wo der Konflikt entsteht

Artikel 14 verlangt für Hochrisiko-Systeme **wirksame menschliche Aufsicht**. Menschen müssen die Funktionsweise verstehen, Ergebnisse richtig einordnen, Fehlentwicklungen erkennen und eingreifen können — bis hin zum Abbruch.

Agentische Systeme treffen Entscheidungen in Ketten und in Sekundenbruchteilen. Ein Agent, der eine Anfrage entgegennimmt, drei Werkzeuge aufruft, ein Ergebnis bewertet und daraufhin eine Datenbank schreibt, hat den Vorgang abgeschlossen, bevor ein Mensch die erste Zwischenentscheidung gelesen hätte.

Das ist kein theoretischer Widerspruch. Es ist eine Lücke, die auch auf Ebene der Aufsichtsbehörden noch nicht abschließend geklärt ist.

## Was sich trotzdem sicherstellen lässt

Solange die Auslegung offen ist, hilft nur, die Aufsicht konstruktiv zu verankern statt sie nachträglich zu behaupten. Vier Bausteine haben sich als tragfähig erwiesen:

**Interventionspunkte.** Definierte Stellen im Ablauf, an denen ein Mensch stoppen, korrigieren oder übersteuern kann. Nicht „im Notfall", sondern als vorgesehener Schritt — typischerweise vor schreibenden Aktionen und vor Entscheidungen mit Außenwirkung.

**Nachvollziehbare Protokolle.** Jede Entscheidung eines Agenten muss rekonstruierbar sein, auch über mehrere Werkzeugaufrufe hinweg. Ein Protokoll, das nur Ein- und Ausgabe festhält, genügt dafür nicht.

**Abschaltbarkeit im Einzelnen.** Einzelne Agenten, einzelne Werkzeuge oder einzelne schreibende Aktionen müssen isoliert deaktivierbar sein. Ein globaler Ausschalter ist kein Steuerungsinstrument, sondern ein Notaus.

**Begrenzter Handlungsrahmen.** Schriftlich festgehalten: Was darf der Agent entscheiden, was nicht? Wo endet seine Zuständigkeit? Diese Festlegung ist die Voraussetzung dafür, überhaupt beurteilen zu können, ob er sich regelkonform verhält.

## Wer die Verantwortung trägt

Ein Punkt wird regelmäßig unterschätzt: Wer ein Multi-Agenten-System auf Basis eines zugekauften Modells baut und in einen Hochrisikoprozess integriert — Personalauswahl, Kreditvergabe, Infrastruktur — wird dadurch in aller Regel selbst zum Anbieter im Sinne der Verordnung. Mit den entsprechenden Pflichten.

Die Vorstellung, das Modellhaus trage die Verantwortung, endet dort, wo aus einem allgemeinen Modell eine konkrete Anwendung mit konkretem Zweck wird.

## Warum jetzt

Ab dem 2. August 2026 werden die Pflichten für Hochrisiko-Systeme durchgesetzt. Agentische Architekturen sind die nächste Welle, und die Compliance-Praxis dafür ist noch kaum ausgeprägt. Wer erst anfängt zu dokumentieren und zu strukturieren, wenn die erste Anfrage einer Aufsichtsbehörde eintrifft, improvisiert unter Zeitdruck.

Wer jetzt beginnt, hat einen Vorsprung — und in vielen Fällen ein besser gebautes System.
