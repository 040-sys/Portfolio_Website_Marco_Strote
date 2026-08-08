---
title: The AI Inventory — The Least Glamorous First Step
description: No inventory, no risk classification. No classification, no compliance. A practical guide to building a defensible AI inventory — and where it usually falls apart.
date: 2026-06-25
category: Practice
tags: [EU AI Act, AI Inventory, Guide]
---

Every EU AI Act compliance effort starts in the same place, and it's the most boring one: a list. What are we actually using?

The instinct to skip this step and jump straight into risk assessment is understandable, and it reliably leads to a dead end. You can only classify what you know about.

## Why the list rarely exists

AI didn't arrive in the company as a project. It came in through the back door — usually through several back doors at once:

- Through **individual subscriptions** that employees signed up for themselves
- Through **features bolted onto existing software** by the vendor, without anyone actively signing off
- Through **service providers** who use AI in delivering their own services
- Through **prototypes** that were never formally put into production and are running in production anyway

None of these paths go through central approval. Which is why there's no central list either.

## What an entry needs to contain

An inventory that only collects product names doesn't help with classification. What matters is the purpose — because the risk classification depends on that, not on the tool.

| Field | Why it's needed |
|---|---|
| Name and provider | Basis for provider documentation and contract review |
| Concrete purpose of use | Determines the classification under Annex III |
| Business unit and responsible person | No effective oversight without named ownership |
| Groups of people affected | Employees, applicants, customers — determines the level of risk |
| Data categories | Links to GDPR documentation |
| Degree of automation | Suggestion, partial decision, or autonomous decision |
| Intervention option | How, and at what point, can a human stop it? |

The "degree of automation" field gets forgotten a lot, and it's one of the most important ones. A system that makes a suggestion a human then reviews is a different thing from a system that autonomously screens people out — even if the same software is behind both.

## How the survey actually works in practice

**Not by mass email.** The responses come back incomplete, because people don't know what counts as AI. "We don't use AI" is the single most common wrong answer.

A combination of three sources has proven effective:

1. **Procurement and IT.** What software is licensed? What subscriptions run through company cards? This captures the official footprint.
2. **Short conversations per business unit.** Twenty minutes, concrete questions: What does software help you with when you decide, draft, sort, or predict something? That phrasing surfaces things that the question "do you use AI?" never does.
3. **Contract review with service providers.** Does the service provider itself use AI? For staffing agencies, call centers, and translation firms, the answer is often yes.

## From the list to the classification

Once the inventory exists, classification goes surprisingly fast. For most entries, three checks are enough:

1. Does the purpose fall under the **prohibited practices** in Article 5? Then shut it down immediately.
2. Does it fall under one of the areas in **Annex III**? Then it's high-risk, with the full set of obligations from Chapter III.
3. Does the system interact with people or generate content? Then at minimum the **transparency obligations** under Article 50 apply.

Anything that falls through this filter isn't subject to special requirements — but should still be documented, because purposes of use change.

## The effort, realistically

For a mid-sized company, a defensible first inventory is achievable in two to four weeks, if the business units engage. Most of that time doesn't go into data collection — it goes into clarifying purposes of use, which means conversations.

The result is more than a compliance obligation. In most cases, it's the first time anyone in the company can say, completely, where automated decisions are actually being made. That overview is worth having even without a regulation behind it.
