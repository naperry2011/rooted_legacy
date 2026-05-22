# Project Memory

Running history of what's been built and current state. Update after major changes.

## Current State

**Status:** Active Development — Phase 1 MVP shipped on `perry-v2`; client provisioning Supabase + reviewing
**Last Updated:** 2026-05-22
**Version:** perry-v2 @ `c412af9`

### What's Working
- Marketing v1 (home / events / history / weather / gallery / contact) — mobile-responsive, deployed
- `/about` page with photo hero + 3-value strip + CTA card to history article
- `/vendors` directory: long-term partners (Bodi Buzz, Cre8tive Alignment Network) + featured vendors (Pure-trition seeded)
- Supabase wired: auth, RSVPs, newsletter double-opt-in, vendor application, contact, gallery, admin
- Featured events (Soothing Sundays) get a custom detail-page treatment — radial glow, themes pillars, price + perks card
- Event detail pages render a "From the day" / "From past events" photo grid pulled by event_id
- /shop catalog + WhatsGrowing widget reading Google Sheets (when configured)
- 2 seed recipes; /recipes index + slug pages
- Default Open Graph image set to a community photo; Twitter card configured
- /admin role-gated dashboard with read-only list views
- All external integrations degrade gracefully when env vars missing

### Known Issues
- The 4 Grand Opening photos and the Soothing Sundays flyer haven't been saved to disk yet (`public/gallery/grand-opening-*.jpg` and `public/brand/flyer_soothing_sundays.jpg`). The image placeholders render with broken `<img>` until those files exist + commit.
- Resend, Google Sheets, and the Supabase Storage `gallery` bucket are not yet provisioned by the client — site shows "Not configured" notices in those spots
- Vercel project still needs Supabase + Resend + Sheets env vars set (Supabase keys configured in `.env.local` and likely in Vercel; not verified for Resend/Sheets)
- Supabase dev keys + OpenWeather key shared in chat history; rotate before public launch

### In Progress
- User saving 5 image files + committing them
- Phase 2 design (Stripe + paid tickets + CSA + admin CRUD) deferred until client signs off on the demo

## Implementation History

### 2026-05-11 — Foundation
**What was built:** Next.js 15 + Tailwind v4 + TypeScript scaffold; brand tokens; home (Hero / WhatWeDo / LocationCard / PartnerStrip); MDX history; site shell
**Files affected:** app/**, components/**, content/site.ts, content/history/welcome.mdx, public/brand/*

### 2026-05-12 — Events, Black-history article, Weather
**What was built:** /events index + 3 detail pages, "Black History in Farming" article, OpenWeather integration with home widget. Briefly added Open-Meteo dual provider then reverted.
**Files affected:** app/events/**, app/weather/**, components/{events,weather}/*, lib/weather.ts, content/events.ts, .env.example

### 2026-05-13 — Mobile responsive pass
**What was built:** Hamburger menu, viewport meta + theme color, weather 5-day list grid refactor, tighter typography across all pages
**Files affected:** app/layout.tsx, app/globals.css, app/{events,history,weather}/**, components/{layout,marketing,events,weather}/*

### 2026-05-22 — Phase 1 MVP (perry-v2)
**What was built:** Full backend stack — Supabase (Postgres + Auth + Storage + RLS) with 4 client variants and a hand-written Database type; magic-link auth + `/account` + `/admin`; events migrated to DB with RSVP flow + Resend confirmations; Google Sheets reader powering `/shop` + home WhatsGrowing widget; `/recipes` with 2 seed MDX recipes cross-linked from shop items; newsletter signup with double opt-in; `/contact`, `/vendors/apply`, `/gallery`; admin shell with read-only list views; consolidated to single working branch `perry-v2`
**Files affected:** 63 files; +4,418 / -118

### 2026-05-22 — Bodi Buzz partner enrichment
**What was built:** Extended `content/site.ts` partners with tagline, services, instagram, email. PartnerStrip rewritten to render service pills + tagline pull-quote + IG/email links. Event detail partners now link to URL when matched against site.partners.
**Files affected:** content/site.ts, components/marketing/PartnerStrip.tsx, app/events/[slug]/page.tsx

### 2026-05-22 — Soothing Sundays + featured-event flair
**What was built:** Migration 0002_event_flair.sql adds tagline, price_cents, themes, included_perks, is_featured columns. Event detail page gains a featured treatment (radial glow + tagline + 3-icon themes pillars + price/perks card + Tickets-opening-soon CTA). EventCard gains Featured pill + tagline + price chip. Soothing Sundays seeded for 2026-05-24 with all flair fields populated.
**Files affected:** supabase/migrations/0002_event_flair.sql, supabase/seed.sql, lib/events.ts, lib/supabase/types.ts, app/events/[slug]/page.tsx, components/events/EventCard.tsx

### 2026-05-22 — Event photo linkage
**What was built:** lib/gallery.ts gains `listPhotosForEvent(eventId)`. Event detail page renders a hover-captioned 2/3/4-col photo grid when photos exist for the event ("From the day" past / "From past events" upcoming). Seed inserts 4 Grand Opening photo rows linked to the event via subquery. public/gallery/ directory created.
**Files affected:** lib/gallery.ts, app/events/[slug]/page.tsx, supabase/seed.sql, public/gallery/.gitkeep

### 2026-05-22 — About page + Vendor Directory + Default OG card
**What was built:** `/about` photo-hero story page with 3 values + history-article CTA. `/vendors` directory with two sections (long-term partners from site.ts + featured vendors from new content/vendors.ts, seeded with Pure-trition). VendorCard component. Default Open Graph image switched from logo to the vendor-tents community photo; Twitter card added. About + Vendors added to nav.
**Files affected:** app/about/page.tsx, app/vendors/page.tsx, components/vendors/VendorCard.tsx, content/vendors.ts, app/layout.tsx, components/layout/Footer.tsx, content/site.ts

## Architecture Evolution

Stack: Next.js 15 App Router + TypeScript + Tailwind v4. Supabase (Postgres + Auth + Storage) for the backend. Resend for transactional + newsletter email. Google Sheets API for produce inventory (staff-managed). MDX still powers long-form prose (history, recipes). Hosted on Vercel with `main` as production and `perry-v2` as the single working branch. Phase 2 will add Stripe (tickets, farm-stand, CSA) and full admin CRUD; Phase 3 covers day-of operations.

See architecture.md for the component-by-component map.

## Lessons Learned

- OpenWeather keys take "up to a couple hours" to activate after signup, independent of email verification.
- Vercel never reads `.env.local`. Every env var must be set in the Vercel project (Production + Preview + Development).
- React 19 / Next 16 lint flags `setState` calls inside `useEffect` — close-on-route-change should happen via `onClick` on the Link, not a pathname watcher.
- `generateStaticParams` runs at build time without a request context — never use a cookie-bound Supabase client there. Solution: `lib/supabase/public.ts`.
- Newer `@supabase/supabase-js` requires each table type to include `Relationships: []` — otherwise insert calls resolve to `never[]` and confuse the user with cryptic errors.
- Supabase Auth callback URLs must be allowlisted in the project dashboard.
- Hand-maintained `Database` type drifts the moment a migration ships — every schema change requires a matching TS type change.
- Migrations and seed must be applied in numeric order. The seed references the columns added by 0002, so attempting to seed before applying 0002 errors with `42703: column "..." does not exist`.
- Image binary content can't flow from chat into the repo — the user has to save attachments to specific paths. Predictable filenames + a `.gitkeep` placeholder folder make this less error-prone.
- `lucide-react` does not export an `Instagram` icon; use `AtSign` for handles or hand-roll an SVG for brand-specific marks.
