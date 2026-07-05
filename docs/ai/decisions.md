# Architecture Decisions

ADR log. Write entries when a decision is hard to reverse, affects multiple components, or future-you will ask "why did we do it this way?"

---

## ADR-001: Next.js 15 App Router + TypeScript + Tailwind v4

**Date:** 2026-05-11
**Status:** Accepted

**Context**
Single developer building a marketing-plus-content site that might grow into commerce, auth, and live data.

**Decision**
Next.js 15 App Router + TypeScript, Tailwind CSS v4, lucide-react icons, hosted on Vercel.

---

## ADR-002: MDX-in-repo for history + recipes; typed TS for events; Google Sheets for produce

**Date:** 2026-05-12, expanded 2026-05-22
**Status:** Accepted

**Context**
Three content shapes (long-form, structured records, weekly inventory) each fit a different store.

**Decision**
Long-form → MDX. Structured records → Supabase Postgres. Produce inventory → Google Sheets.

---

## ADR-003: OpenWeather over Open-Meteo

**Date:** 2026-05-12 → 2026-05-13 (reverted to single provider)
**Status:** Accepted

Single-provider OpenWeather. Graceful fallback when API key unset.

---

## ADR-004: Header is a client component; rest of layout stays server

**Date:** 2026-05-13
**Status:** Accepted

Only `components/layout/Header.tsx` is `"use client"`. Close-on-navigate via `onClick` (not `useEffect(pathname)`).

---

## ADR-005: Git workflow — single working branch `perry-v2`

**Date:** 2026-05-13, revised 2026-05-22
**Status:** Accepted

Single `perry-v2` branch off `main`. PRs go `perry-v2 → main`. Vercel auto-deploys `main`. `develop` and `feat/*` deleted.

---

## ADR-006: Supabase as the backend (DB + Auth + Storage)

**Date:** 2026-05-22
**Status:** Accepted

Supabase: Postgres + Auth (magic link MVP) + Storage + RLS in one product.

---

## ADR-007: Four Supabase client variants

**Date:** 2026-05-22
**Status:** Accepted

`lib/supabase/{server,browser,admin,public}.ts` — each with a different auth/cookie profile. Choose by use case.

---

## ADR-008: Hand-maintained `Database` type

**Date:** 2026-05-22
**Status:** Accepted; supersede when schema stabilizes

Hand-write `lib/supabase/types.ts`. Include `Relationships: []` per table or insert types collapse to `never[]`.

---

## ADR-009: Google Sheets as produce inventory source of truth

**Date:** 2026-05-22
**Status:** Accepted

Staff edits one shared sheet. `lib/sheets.ts` reads via service-account JWT, caches 15 min.

---

## ADR-010: Read-only admin in MVP

**Date:** 2026-05-22
**Status:** Accepted

`/admin` has dashboard + 4 list views. Edits happen in Supabase Studio. Phase 2 introduces forms.

---

## ADR-011: Event "flair" via additive nullable columns

**Date:** 2026-05-22
**Status:** Accepted

**Context**
Soothing Sundays event needed a custom detail-page treatment (tagline, price, themed pillars, included perks, featured badge). Three options:
1. Hard-code per-event behavior in the page based on slug
2. Add a separate `featured_events` table joined to events
3. Add optional columns to the existing `events` table

**Decision**
Option 3 — migration `0002_event_flair.sql` adds `tagline`, `price_cents`, `themes (jsonb)`, `included_perks (jsonb)`, `is_featured (boolean)` columns. All nullable / default-empty so existing rows are unaffected. The event detail page checks `is_featured` and renders the richer treatment conditionally.

**Consequences**
- **Positive:** any future event can opt into the flair just by setting these columns; no per-event code paths; data lives next to its event
- **Negative:** widens the events table by 5 columns even though most events won't use them; adding more flair fields in the future means more nullable columns
- **Neutral:** matches the spirit of the existing `highlights` + `partners` jsonb columns

**Alternatives considered**
- Separate `featured_events` table — adds join complexity for a one-to-zero-or-one relationship that's better as columns
- Slug-based hard-coding — fragile, doesn't scale beyond one featured event

---

## ADR-012: Vendor data — typed array in MVP, DB in Phase 2

**Date:** 2026-05-22
**Status:** Accepted; revisit in Phase 2

**Context**
The `/vendors` directory page needs to display partners and featured vendors. Two data sources already exist for partners: `content/site.ts` `partners[]` (long-term partners shown on home strip). Pure-trition and similar event vendors don't fit there — they appeared at one event but aren't ongoing co-organizers.

**Decision**
For MVP, vendor directory is rendered from two static sources:
1. `site.partners` — long-term partners (Bodi Buzz, Cre8tive Alignment Network)
2. `content/vendors.ts` `featuredVendors[]` — typed array of featured event vendors (Pure-trition)

Vendor applications still write to the `vendor_applications` table; admin approves them manually for now via Supabase Studio.

In Phase 2, build the DB-backed `vendor_profiles` table. Admin approval becomes a single click that creates a row. Retire `content/vendors.ts` as a one-time seed.

**Consequences**
- **Positive:** zero infra; the directory ships now; clear migration path
- **Negative:** approving a vendor application doesn't currently create a directory entry — admin must edit `content/vendors.ts` and PR it. Acceptable in MVP because applications are infrequent.
- **Neutral:** two sources of truth for vendor-shaped data (partners in site.ts + featuredVendors in vendors.ts) — both render in the same UI section, so users don't notice the split

**Alternatives considered**
- Unify everything under `site.partners` — would conflate long-term partners with one-off vendors
- Build vendor_profiles in MVP — would have meant building the admin approval flow too, expanding MVP scope

---

## ADR-013: Default Open Graph image points at a community photo

**Date:** 2026-05-22
**Status:** Accepted

**Context**
Site-wide default OG image was the bare logo on a black background — fine on the home page but uninspiring for share previews from history articles, recipes, or general pages.

**Decision**
Root layout's `openGraph.images` defaults to `/gallery/grand-opening-vendors-tents.jpg` (1200×900). Logo kept as a secondary entry. Twitter card set to `summary_large_image` with the same source. Specific routes (`/about`, `/vendors`, `/events/[slug]`) override with contextual images.

**Consequences**
- **Positive:** shares show actual farm life
- **Negative:** the default depends on a file that must be saved before it works; until then social previews fall back to whatever crawler default
- **Neutral:** routes that don't override (history, recipes, contact) all show the market photo — fine for now, can be customized per-route later

---
