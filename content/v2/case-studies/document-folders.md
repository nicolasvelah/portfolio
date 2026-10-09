---
slug: document-folders
title: Document Folders
tagline: Designing for the irreversible. Document control where every file is audit evidence.
client: Compliance platform for a licensed cultivation-to-distribution business · Capmation (client under NDA)
year: "2023 – [TODO: confirm with Nicolas — end year, or ongoing]"
role: UX, Figma prototype and Angular front end
team: "[TODO: confirm with Nicolas — team size and who built the .NET back end]"
status: Shipped
stack:
  - Angular 8
  - .NET
  - Azure
  - Figma
outcome: "Designed in Figma and shipped in Angular and .NET as the reference-document module of a multi-state compliance platform. [TODO: confirm with Nicolas — any usage or adoption KPI]"
cover: media/w-df-tree@2x.webp
images:
  - src: media/w-df-tree@2x.webp
    alt: "Reference Document Folders: a nested tree of folders, files, authored content and links, with last update, state and owner columns, an archive view and search."
    caption: "Original Figma design. One tree for four kinds of items, each with the state it applies to."
  - src: media/w-df-delete@2x.webp
    alt: "Delete confirmation: a warning icon, the exact folders and files that will be removed, and a checkbox that must be ticked before the Delete button unlocks."
    caption: "Delete names exactly what goes, and stays locked until you confirm."
retake:
  original: media/w-df-delete@2x.webp
  description: "The confirmation flow rebuilt as a live React component: the same gated delete, plus an undo window the original didn't have."
_todo:
  - "[TODO: confirm with Nicolas — Capmation permission to publish these design details.]"
---

> Original Figma design. Client name, logo and contact details removed.

## Context

The client grows, processes and distributes a licensed product across several U.S. states, and each state regulates the operation differently. Their compliance platform keeps the reference documents every team works from: policies, procedures, state rules, forms and links to official sources. I designed and built the module that organizes them.

## Problem

Here a document is evidence. If a procedure goes missing, or the wrong state's version gets used, the business fails an audit. So the module had two jobs that pull against each other: everyday filing has to be fast, and anything destructive has to be slow and deliberate.

## Design decisions

**One tree, four kinds of items.** Folders, uploaded files, content written inside the platform, and links to outside sources all live in the same nested tree. Each has its own icon, so people can tell them apart at a glance.

**The state is a column, not a folder.** Rules change from one state to the next, so every document carries the states it applies to. The tree can be filtered by state and owner instead of copying folders for each jurisdiction.

**Make the irreversible explicit.** Delete, archive and unarchive open a dialog that lists exactly which folders and files are affected. The action button stays locked until a "Yes, delete these documents and folders" checkbox is ticked. Archive and unarchive use the same pattern with their own color and icon, so nobody mistakes one for another.

**Archive before delete.** "My files" and "Archive" are separate views. The safe move, archiving, is always one step closer than deleting.

**A four-step form for new documents.** Information, content source, content, verify. Each step asks one question, and the last one shows everything before it's saved.

**Specs before code.** Every component was drawn in Figma with its states (selected, expanded, archived, disabled) before I built it in Angular.

## Engineering

- **Front end:** Angular 8, built from the Figma component specs.
- **Back end:** .NET on Azure.
- **Access:** controlled access to sensitive documents. [TODO: confirm with Nicolas — how access was modeled (roles, per-folder permissions?)]

[TODO: confirm with Nicolas — 1–2 non-obvious technical decisions (e.g. how the nested tree loads, how bulk selection is handled)]

## Outcome

- Shipped to production as the reference-document module of the compliance platform.
- I designed it in Figma and implemented it in code.
- [TODO: confirm with Nicolas — KPIs: documents managed, users, or audit outcomes]

## My role

I mapped the flows, prototyped every component and state in Figma, and implemented the front end in Angular. [TODO: confirm with Nicolas — who built the .NET back end and who else was on the team]

## 2026 re-take

The gated delete, rebuilt as a live React component. The decision stays the same: name what goes and confirm on purpose. The re-take adds an undo window, because a second chance is the kindest safety net.

- [TODO: confirm with Nicolas — final bullets once the re-take page is built.]
