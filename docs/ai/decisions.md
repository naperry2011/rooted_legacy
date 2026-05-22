# Architecture Decisions

ADR log. Write entries when a decision is hard to reverse, affects multiple components, or future-you will ask "why did we do it this way?"

---

## ADR-001: Next.js 15 App Router + TypeScript + Tailwind v4

**Date:** 2026-05-11
**Status:** Accepted

**Context**
Single developer building a marketing-plus-content site that might grow into commerce, auth, and live data. Need SSR/SSG for SEO, room for server actions, styling flexible enough to match a hand-drawn logo aesthetic.

**Decision**
Next.js 15 App Router + TypeScript, Tailwind CSS v4 (CSS-first config), lucide-react icons, hosted on Vercel.

**Consequences**
- Positive: zero-config deploys; RSC keeps client bundles small; clear path to server actions / auth / commerce
- Negative: locks us into Vercel for easiest path; stricter React 19 lint rules
- Neutral: Tailwind v4's CSS-first config differs from older muscle memory

---

## ADR-002: MDX-in-repo for history + recipes; typed TS for events

**Date:** 2026-05-12, expanded 2026-05-22
**Status:** Accepted

**Context**
Three content shapes: long-form prose (history, recipes), structured records (events, vendors), tabular weekly inventory (produce). Each suits a different store.

**Decision**
Long-form → MDX in `content/{history,recipes}/*.mdx` rendered via `next-mdx-remote/rsc`. Structured records → Supabase Postgres tables. Produce inventory → Google Sheets (staff-managed, read-only on the site).

**Consequences**
- Positive: each layer matches its editor (devs for MDX, SQL/admin for Supabase, staff for Sheets); type safety on event shape; fast iteration
- Negative: three different mental models; cross-references between layers (recipe ↔ shop item) are file-based and unindexed
- Neutral: easy migration paths if any becomes painful — MDX can move into Supabase, Sheets can move into Supabase

---

## ADR-003: OpenWeather over Open-Meteo

**Date:** 2026-05-12 (initial) → 2026-05-13 (reverted to single provider)
**Status:** Accepted

**Context**
Open-Meteo is free + key-less; OpenWeather is free with a key. Briefly ran both via a provider abstraction during OpenWeather key activation lag.

**Decision**
Single-provider OpenWeather. `lib/weather.ts` carries `import "server-only"` and gates on `OPENWEATHER_API_KEY` — UI shows graceful fallbacks when unset.

---

## ADR-004: Header is a client component; rest of layout stays server

**Date:** 2026-05-13
**Status:** Accepted

**Context**
Mobile hamburger needs `useState`. Everything else can stay RSC.

**Decision**
Only `components/layout/Header.tsx` is `"use client"`. Close-on-navigate via `onClick` on the `<Link>` (not `useEffect(pathname)`, which trips `react-hooks/set-state-in-effect` in React 19).

---

## ADR-005: Git workflow — single working branch (`perry-v2`)

**Date:** 2026-05-13 (initial), revised 2026-05-22
**Status:** Accepted

**Context**
Originally planned `develop` + `feat/*` branches. With one developer and one prod environment, this added overhead without value.

**Decision**
Single working branch `perry-v2` off `main`. All work commits to `perry-v2`. PRs go `perry-v2 → main`. Vercel auto-deploys `main`. `develop` + all historical `feat/*` branches deleted.

**Consequences**
- Positive: minimal mental model; matches actual cadence
- Negative: no staging tier between feature and prod — Vercel preview deploys on PRs are the only check
- Neutral: can reintroduce branching if a second developer joins

---

## ADR-006: Supabase as the backend (DB + Auth + Storage)

**Date:** 2026-05-22
**Status:** Accepted

**Context**
Phase 1 MVP needs accounts, RSVPs persisted, a newsletter list, vendor applications, contact messages, gallery photos. Choices: Supabase, Neon + Auth.js + Vercel Blob, or skip backend entirely.

**Decision**
Supabase. Postgres + Auth (magic link MVP, OAuth/email-password later) + Storage + RLS all in one product.

**Consequences**
- Positive: fastest path to working accounts + DB + uploads; free tier covers the project comfortably; SQL is portable if we ever leave
- Negative: vendor concentration; service-role key must be carefully scoped
- Neutral: schema is in `supabase/migrations/*.sql`, checked into the repo; types hand-maintained in `lib/supabase/types.ts` until we run `supabase gen types`

---

## ADR-007: Four Supabase client variants

**Date:** 2026-05-22
**Status:** Accepted

**Context**
Different parts of the app need different auth/cookie contexts: build-time slug enumeration, user-context reads, anonymous public reads, privileged server-side writes.

**Decision**
Four explicit clients in `lib/supabase/*`:
- `server.ts` — cookies-bound, for RSC + route handlers that need user context
- `browser.ts` — `"use client"`, for any client-side Supabase usage
- `admin.ts` — service role, server-only, for writes that accept guest input + admin reads
- `public.ts` — anon key, no cookies, safe at build (used by `generateStaticParams`) and for unauthenticated public reads

**Consequences**
- Positive: every call site picks the right privilege level by name; failures are explicit
- Negative: four files instead of one; engineers must learn the distinction
- Neutral: each caches its client; no per-request churn

---

## ADR-008: Hand-maintained `Database` type (for now)

**Date:** 2026-05-22
**Status:** Accepted; supersede when schema stabilizes

**Context**
`@supabase/supabase-js` insert types collapse to `never[]` without a `Database` generic. Could either run `supabase gen types typescript` (requires CLI + project link) or hand-write.

**Decision**
Hand-write `lib/supabase/types.ts` for the MVP tables. Each table includes `Row`, `Insert`, `Update`, and (critically) `Relationships: []` — the last one is required by newer SDK versions, otherwise inserts break.

**Consequences**
- Positive: no CLI dependency for now; minimal surface
- Negative: drift risk — if a migration changes a column and the type isn't updated, TypeScript will lie to us
- Neutral: switch to generated types in Phase 2 when payments tables stabilize

---

## ADR-009: Google Sheets as produce inventory source of truth

**Date:** 2026-05-22
**Status:** Accepted

**Context**
Staff already track produce weekly in spreadsheets. Building an admin UI for it would duplicate their existing workflow and require training.

**Decision**
Staff maintains a single Google Sheet (column spec in `docs/SETUP.md`). `lib/sheets.ts` reads via a service-account JWT with `spreadsheets.values.get`, normalizes rows into a typed `ProduceItem[]`, and caches in Next.js fetch cache for 15 minutes with tag `produce` so admin can force-refresh.

**Consequences**
- Positive: staff stays in tools they know; zero admin UI needed for MVP; cheap; resilient (sheet is the source of truth, the site is just a view)
- Negative: no validation of staff-entered data (we coerce in TS but bad rows fail silently); sheet structure changes require coordinated `lib/sheets.ts` updates
- Neutral: Phase 2 farm-stand checkout still pulls from this sheet, but order rows go to Postgres

---

## ADR-010: Read-only admin in MVP; full CRUD in Phase 2

**Date:** 2026-05-22
**Status:** Accepted

**Context**
Phase 1 wants to demo value fast. Building admin forms for every table is multi-week work.

**Decision**
`/admin` has a dashboard + 4 list views (bookings, subscribers, vendors, messages). All read-only. Edits happen in Supabase Studio (the dashboard SQL editor + table editor) for now. Phase 2 introduces forms.

**Consequences**
- Positive: MVP ships fast; "real data" demo without half-built edit UIs
- Negative: client/staff need Supabase Studio access to make changes; brittle for non-technical users
- Neutral: easy to layer admin forms onto existing pages later
