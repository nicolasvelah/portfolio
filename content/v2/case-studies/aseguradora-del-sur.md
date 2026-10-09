---
slug: aseguradora-del-sur
title: Aseguradora del Sur
tagline: From three panic buttons to a connected-car platform.
client: Aseguradora del Sur (car insurer, Ecuador) · via ITZAM
year: 2019 – 2021
role: Project lead · Mobile app designer · Web front-end and back-end developer · Infrastructure
team: "Me plus a partner who built most of the Flutter app [TODO: confirm with Nicolas — total team size]"
status: Shipped
stack:
  - React 16
  - TypeScript
  - Node / Express
  - WebSockets
  - Flutter
  - Linux server
outcome: "Shipped to iOS and Android in Ecuador, backed by a React command center and a real-time API. [TODO: confirm with Nicolas — downloads, rating or usage numbers]"
cover: curated/aseguradora-del-sur/04-driver-score.png
images:
  - src: curated/aseguradora-del-sur/01-initial-proposal-home.png
    alt: "Early app concept. A home screen titled 'Need help?' with three large round buttons: stranded, robbed, crashed. Below, a carousel of extra insurance products."
    caption: "Initial proposal. Three emergencies, one tap each."
  - src: curated/aseguradora-del-sur/02-me-quede-tow.png
    alt: "Stranded-on-the-road flow. A map of Quito with a pin to set the pickup point and a sheet requesting a tow truck, with a confirm button."
    caption: "Stranded → tow truck. Set the origin on the map, confirm, done."
  - src: curated/aseguradora-del-sur/03-trips.png
    alt: "Trips screen in the navy and cyan system. A route from A to B drawn over a map of Quito, with distance and duration above."
    caption: "Phase 2. GPS telemetry turns into a trip history."
  - src: curated/aseguradora-del-sur/04-driver-score.png
    alt: "Driver score detail. A 3.45 score with stars, then expandable rows for speeding, hard braking with a weekly line chart, acceleration, and day and night distance."
    caption: "Driver score. A number the driver can open up and understand."
  - src: curated/aseguradora-del-sur/05-services-escort.png
    alt: "Escort service in progress. A walking route on a map with an SOS button, a chat button, and a swipe control to end the service."
    caption: "Add-on services: a live escort with SOS one tap away."
  - src: curated/aseguradora-del-sur/06-whitelabel-nissan-login.png
    alt: "White-label pilot login screen themed for Nissan."
    caption: "White-label pilot: Nissan theme."
  - src: curated/aseguradora-del-sur/07-whitelabel-casabaca-login.png
    alt: "The same login screen themed for Casabaca."
    caption: "Same app, Casabaca theme."
  - src: curated/aseguradora-del-sur/08-whitelabel-mitsubishi-login.png
    alt: "The same login screen themed for Mitsubishi."
    caption: "Same app, Mitsubishi theme."
retake:
  original: curated/aseguradora-del-sur/04-driver-score.png
  description: "The driver score, rebuilt as a live React component. It leads with the reason behind the number, not the number alone."
_redact:
  - "[TODO: confirm with Nicolas — redact before publishing: plate and address in 02; addresses in 03; plate, policy number in 04; escort name and addresses in 05.]"
---

## Context

Aseguradora del Sur is a car insurer in Ecuador. We built its connected-car ecosystem: a mobile app for policyholders, a web command center for the insurer, and the real-time API between them. It shipped to the App Store and Google Play in Ecuador.

## Problem

An insurance app gets opened at the worst moment of someone's day. The car broke down, got stolen, or crashed. The first job was to make help one tap away.

Then the brief grew. GPS devices in the cars started sending telemetry. The same app now had to show trips, score driving, sell add-ons and handle renewals, without burying the emergency buttons.

## Design decisions

**Triage first.** The initial proposal opened on one question, "Need help?", and three answers: stranded, robbed, crashed. Each starts its own flow. Stranded goes straight to a map to set the tow-truck pickup.

**From panic buttons to a platform.** Phase 2 moved to a navy and cyan system built for data: trips on a map, vehicles, policies, history. "Help" stayed first in the tab bar, always one tap away.

**A score people can read.** A driving score is useless if the driver can't tell why it dropped. The detail screen breaks the number into speeding, hard braking, acceleration and day versus night distance. Each row opens into a weekly trend.

**Designed with the client.** I designed 100% of the mobile app and ran the UX work in sessions with the insurer's team.

[TODO: confirm with Nicolas — design tool used for the app screens (XD? Sketch?)]

## Engineering

The ecosystem has four parts:

- **Mobile app** in Flutter, for iOS and Android.
- **Command center** in React 16: notifications to policyholders, data control, direct communication.
- **API** in Node/Express and TypeScript, with WebSockets for live updates. I built it and ran it in production.
- **Vehicle Assistance Monitoring**, a back office to supervise assistance providers.

Three integrations carry the product:

- **Assistance provider**: roadside help and real-time tracking of the responder.
- **Insurer systems**: policy renewals and new product purchases from inside the app.
- **In-car GPS devices**: telemetry for trips and driver score, in the app and on the insurer's platforms.

[TODO: confirm with Nicolas — 2–3 non-obvious technical decisions (e.g. how live tracking was pushed over WebSockets, how telemetry was ingested)]

[TODO: confirm with Nicolas — screenshots of the command center]

## Outcome

- Shipped to iOS and Android in Ecuador.
- Command center and real-time API in production, built and operated by me.
- [TODO: confirm with Nicolas — downloads, rating, active users or assistance requests handled]

## My role

I led the project. I designed the whole mobile app. I built the entire web front end and back end. My partner implemented most of the Flutter app; I reviewed that code.

> ### The modules traveled
>
> The same app became a white-label pilot for three car brands: Nissan, Casabaca and Mitsubishi. Logo, login and header color, and content changed per brand. Grid, tab bar, flows and icons stayed the same. It reused part of the insurer's modules: SOS, safe trip, assistance, online doctor.
>
> It was a pilot and never reached production. It proved the design system could be themed without being redrawn.

## 2026 re-take

Original screen on the left. Live component on the right.

- [TODO: confirm with Nicolas — final bullets once the component is built. Draft:] Lead with the cause. The biggest factor behind the score sits next to the number.
- One scale for every metric, so rows compare at a glance.
- Trends show this week against the previous one, not a raw 26-week line.
