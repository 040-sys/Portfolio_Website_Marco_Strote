---
title: Agentic AI and Article 14 — The Unresolved Conflict
description: The EU AI Act requires human oversight of AI decisions. Autonomous agents decide at machine speed. What companies need to ensure regardless.
date: 2026-05-28
category: Analysis
tags: [EU AI Act, Agentic AI, GPAI, AI Governance]
---

Anyone using GPT-4 not just as a chatbot but as an autonomous agent — with tool use, multi-step decisions, database access, API calls — enters regulatory uncharted territory. Not because the regulation is silent on it, but because two of its requirements are hard to reconcile in practice.

## Two tiers for general-purpose AI

The EU AI Act treats general-purpose AI models (GPAI) separately, with two tiers:

**Tier 1 — GPAI model.** Documentation obligations, a summary of training data, evidence of copyright compliance.

**Tier 2 — systemic risk.** In addition: red teaming, adversarial testing, reporting serious incidents to the EU AI Office, cybersecurity requirements, assessment of societal risks. The threshold sits at 10²⁵ FLOPs of training compute.

This threshold isn't theoretical. According to [Epoch AI](https://epoch.ai/), the widely used frontier models sit above it — GPT-4 and its successors, as well as the large models from Anthropic, Google, Meta, and Mistral. Anyone deploying one of these in production is working with a model the legislator classifies as posing systemic risk.

## Where the conflict arises

Article 14 requires **effective human oversight** for high-risk systems. People must understand how the system works, correctly interpret its outputs, recognize when something is going wrong, and be able to intervene — up to and including shutting it down.

Agentic systems make decisions in chains, in fractions of a second. An agent that receives a request, calls three tools, evaluates a result, and then writes to a database has completed the whole process before a human could have read the first intermediate decision.

This isn't a theoretical contradiction. It's a gap that hasn't been conclusively resolved even at the level of supervisory authorities.

## What can be ensured anyway

As long as the interpretation remains open, the only real option is to build oversight in constructively rather than claim it after the fact. Four building blocks have proven workable:

**Intervention points.** Defined places in the workflow where a human can stop, correct, or override — not "in an emergency," but as a designed step, typically before write actions and before decisions with external effect.

**Traceable logs.** Every decision an agent makes must be reconstructable, even across multiple tool calls. A log that only records input and output isn't enough.

**Granular shutdown.** Individual agents, individual tools, or individual write actions must be independently disable-able. A single global kill switch is not a control instrument — it's an emergency stop.

**A bounded mandate.** Written down: what is the agent allowed to decide, and what not? Where does its authority end? This is the precondition for being able to judge whether it's actually behaving within the rules at all.

## Who carries the responsibility

One point is routinely underestimated: anyone who builds a multi-agent system on top of a purchased model and integrates it into a high-risk process — hiring, credit decisions, infrastructure — generally becomes a provider under the regulation themselves, with the corresponding obligations.

The idea that the model vendor carries the responsibility ends exactly where a general model becomes a concrete application with a concrete purpose.

## Why now

From 2 August 2026, the obligations for high-risk systems become enforceable. Agentic architectures are the next wave, and compliance practice for them barely exists yet. Anyone who only starts documenting and structuring once the first inquiry from a supervisory authority arrives will be improvising under time pressure.

Anyone who starts now has a head start — and in many cases, a better-built system.
