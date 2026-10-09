---
slug: maresa-guc
title: Maresa GUC
tagline: A dealership's sales process, modeled as a state machine.
client: Maresa (automotive distributor, Ecuador) · via ITZAM
year: 2020 – 2021
role: Lead designer and lead developer, infrastructure
team: "Me plus 2 developers; flows and wireframes with a second designer"
status: Shipped
stack:
  - React 16
  - TypeScript
  - Node / Express
  - Ant Design
  - SignalR
  - Windows Server
outcome: "One sales pipeline driving every screen, action and email, in production. [TODO: confirm with Nicolas — number of sales reps or dealerships using it]"
cover: curated/maresa-guc/03-v2-dashboard.png
images:
  - src: curated/maresa-guc/01-sitemap.png
    alt: "Sitemap in a single column: channels, prospects, clients, charts and reports, teams, settings and users, each with its sub-pages."
    caption: "The sitemap came out of mapping every business process first."
  - src: curated/maresa-guc/02-proposal-dashboard.png
    alt: "First proposal. An orange sidebar dashboard with lead percentages by channel, a sales funnel and two bar charts of leads by campaign and by dealership."
    caption: "Before: the first orange proposal. Reports first, actions nowhere."
  - src: curated/maresa-guc/03-v2-dashboard.png
    alt: "GUC v2 dashboard. Monthly stats for the sales rep, a pipeline funnel with conversion notes, today's follow-ups and latest notifications."
    caption: "After: GUC v2. The rep's day comes first: follow-ups, new leads, the funnel."
  - src: curated/maresa-guc/04-v2-quote.png
    alt: "GUC v2 quote screen for building a vehicle quote."
    caption: "Quote builder, one stage of the pipeline."
  - src: curated/maresa-guc/05-deals.png
    alt: "Deals list. Each deal card shows source, temperature, client, next follow-up and payment parameters, with the pipeline stage highlighted on the right."
    caption: "Every deal carries its pipeline stage. The stage decides what you can do next."
retake:
  original: curated/maresa-guc/04-v2-quote.png
  description: "The pipeline stepper and the quote builder, rebuilt as one live React component. The stage you're in decides which fields and actions are available."
_redact:
  - "[TODO: confirm with Nicolas — redact before publishing: ID numbers (cédulas) and realistic names in 03 and 05; check 04 for personal data.]"
---

## Context

GUC ("Gestor Único Comercial") is the sales CRM for Maresa, a major automotive distributor in Ecuador. It follows a car sale from the first inquiry to delivery. It also covers reservations, cashier, trade-in appraisals, mailing, a web form and chat.

## Problem

A car sale crosses many hands: sales rep, credit, cashier, sales manager. The system had to make the next step obvious for each person, and impossible to skip.

## Design decisions

**Map the process before drawing screens.** We mapped every business process first. The sitemap came out of that map, not the other way around.

**From the orange proposal to GUC v1 and v2.** The first proposal led with reports. v1 and v2 put the sales rep's day first: follow-ups, new leads, notifications, then the funnel.

**Build straight from wireframes, on Ant Design.** Project conditions didn't leave room for a full visual design pass. We built directly from the hi-fi wireframes on Ant Design. A calculated risk: we traded a custom look for speed and consistency.

**One UI, permissions by role.** The sales manager sees the same screens as a sales rep, plus a few extra dialogs. One interface to design, build and test.

Tools: process flows and wireframes with a second designer, prototype in Adobe XD.

## Engineering

The pipeline has 7 stages: inquiry → demo → quote → credit → closing → pre-invoice → delivery.

[TODO: confirm with Nicolas — the v2 screens show 8 stages (prospecting, traffic, presentation, quotes, requests, approvals, closing, delivery). Which list is final?]

The stage is the state. It decides which screens a deal shows, which actions are allowed and which emails go out.

- **Front end:** React 16 and TypeScript on Ant Design.
- **Back end:** Node/Express in TypeScript.
- **Team:** 3 developers, me included.

[TODO: confirm with Nicolas — where the state machine lives (server, client or both) and 1–2 other non-obvious decisions]

## Outcome

- In production at Maresa.
- Built by a team of 3.
- [TODO: confirm with Nicolas — number of sales reps or dealerships, deals processed, or time saved]

## My role

I was the lead designer and the lead developer. I mapped the processes, designed the flows and wireframes with a second designer, prototyped in XD, and led a team of 2 developers through the build.

Related: through the same client, I also built a customer chat and video-call platform in React 16 with a TypeScript back end.

## 2026 re-take

Original quote screen on the left. Live pipeline stepper and quote builder on the right.

- [TODO: confirm with Nicolas — final bullets once the component is built. Draft:] The stepper shows where the deal is and what unlocks the next stage.
- The quote updates as you type, so the rep can talk numbers with the client in real time.
- Custom visual layer over the same component model, replacing the stock Ant Design look we accepted in 2020.
