# Rooted Legacy — Feature Spec

## Overview

Rooted Legacy is an early-stage garden / community platform. This spec is derived directly from the brainstorm in `SuperGarden.txt`; no code exists yet. Each feature below restates a brainstorm item, assigns a category, and lists open questions the team will need to answer before implementation.

## Features

### 1. Garden Classes

- **Description:** Offer classes related to gardening.
- **Category:** Education
- **Open questions:**
  - In-person, virtual, or hybrid?
  - Free, paid, or subscription-gated?
  - Who creates and schedules class content?
  - Registration / capacity limits?

### 2. Menu for Purchase / Products

- **Description:** A menu listing products available for purchase.
- **Category:** Commerce
- **Open questions:**
  - Product types (produce, seeds, merchandise, class tickets)?
  - Payment processor (Stripe, Square, Shopify, other)?
  - Inventory management approach?
  - Pickup, delivery, or shipping at checkout?

### 3. Events / Subscriptions Model (Public Calendar)

- **Description:** Public-facing calendar of events; subscription mechanism for ongoing access.
- **Category:** Events
- **Open questions:**
  - Calendar source (built-in, Google Calendar, iCal feed)?
  - Subscription tiers and pricing?
  - What unlocks behind a subscription vs. public?
  - RSVP / ticketing flow?

### 4. Informative Content — History

- **Description:** Educational pages where visitors can learn the history (presumably of Rooted Legacy and/or the practice/site).
- **Category:** Content
- **Open questions:**
  - Whose history — the organization, the land, gardening practices?
  - CMS choice (Markdown in repo, Notion, headless CMS, WordPress)?
  - Who authors and edits?
  - Multimedia (photos, video, audio interviews)?

### 5. Weather Tracker

- **Description:** A weather tracker embedded in the platform.
- **Category:** Data
- **Open questions:**
  - Single location or user-selectable?
  - Data provider (NOAA, OpenWeather, Weather.gov, Tomorrow.io)?
  - Just current conditions, or forecast + planting advisories?
  - Refresh cadence?

### 6. Produce Shipping to Local Stores and Families

- **Description:** Process for shipping produce to local stores and possibly families.
- **Category:** Logistics
- **Open questions:**
  - Wholesale (stores) and DTC (families) — same flow or separate?
  - Order intake (built-in checkout vs. phone/email)?
  - Fulfillment partner or self-delivery?
  - Cold-chain / packaging requirements?
  - Service area / radius?

## Cross-Cutting Concerns (all TBD)

- **Authentication:** Account model for class registration, subscriptions, and orders — not yet specified.
- **Payments:** Single processor across products / classes / subscriptions, or per-feature?
- **Content management:** Where pages, classes, events, and product listings are authored and stored.
- **Hosting / tech stack:** No platform, framework, or hosting choice has been made.
- **Admin tooling:** No admin/back-office surface defined.

## Reference Assets

### Design Anchor — `rooted_legacyp1.jpg`

This is the **base of design for the website**. It is the Rooted Legacy logo: a circular badge on a black field showing a tree with full green canopy above and an extensive root system below, the words **ROOTED LEGACY** in a textured yellow/ochre serif across the center, ringed by a thin orange-brown circular border, with vegetables arranged around the perimeter (corn, tomato, garlic, bell pepper, herb sprig, beet, carrot) and a small stylized cityscape silhouette behind the tree trunk.

Design implications derived from the logo:

- **Palette:** deep black background, warm yellow/ochre primary, orange-brown accent, foliage greens, vegetable-tone secondaries (tomato red, carrot orange, garlic cream).
- **Typography:** weathered/textured serif for display headings (echoing the wordmark); pair with a clean sans-serif for body.
- **Motifs:** tree + roots (heritage, growth), encircling produce (commerce, harvest), faint cityscape (community / local stores). These map cleanly to the feature set — history, classes, produce, local distribution.
- **Tone:** earthy, handcrafted, community-rooted; avoid sterile/corporate styling.

### Other Reference Images

- `rooted_legacyp2.jpg`
- `rooted_legacyp3.jpg`
- `rooted_legacyp4.jpg`

Not yet reviewed in this pass; a future pass should classify each and link it to the feature(s) it informs.

## Next Steps

1. Resolve the open questions above (especially payments, hosting, and CMS — they gate most other choices).
2. Choose a tech stack and scaffold the project.
3. Re-run `/code-map` once source code exists; that will generate the proper `CODE_MAP.md` / `ENTRY_POINTS.md` / `DATA_FLOW.md` / `IMPORT_GRAPH_SUMMARY.md` / `FEATURE_BOUNDARIES.md` documents.
