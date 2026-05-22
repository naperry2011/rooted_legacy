# Project Memory

Running history of what's been built and current state. Update after major changes.

## Current State

**Status:** Active Development — Phase 1 MVP shipped on `perry-v2`; PR to `main` not yet merged
**Last Updated:** 2026-05-22
**Version:** perry-v2 @ `3945199`

### What's Working
- Marketing v1 (home / events / history / weather / gallery / contact) — mobile-responsive, deployed
- Supabase wired: schema migrated locally + remote (after user runs SQL), magic-link auth, RSVP bookings, newsletter double-opt-in, vendor application form, contact form, gallery
- /shop catalog + WhatsGrowing widget reading from Google Sheets (cached 15 min); /shop item pages cross-link to recipes
- 2 seed recipes (summer tomato salad, kale & cowpea stew) on /recipes
- /admin role-gated dashboard with read-only list views for RSVPs, subscribers, vendor apps, contact messages
- Every external integration degrades gracefully when its env var is missing — site stays usable

### Known Issues
- `feat/mobile-responsive` and other historical branches deleted in favor of single `perry-v2` working branch
- Resend, Google Sheets, and the Supabase Storage `gallery` bucket are not yet provisioned by the client — site shows "Not configured" notices in those spots until env vars are set
- OpenWeather API key currently in `.env.local` was shared in chat history months ago; should be rotated
- Supabase dev keys (sb_publishable_* / sb_secret_*) shared in chat; should also be rotated before prod
- Vercel project still needs the Supabase + Resend + Sheets env vars set; current deploys reflect only the previous milestone

### In Progress
- Awaiting user to: (1) run `supabase/migrations/0001_init.sql` + `seed.sql` in their Supabase project, (2) configure Auth redirect URLs, (3) mirror env vars into Vercel, (4) merge `perry-v2 → main`
- Resend / Google Sheets / Stripe will be added incrementally as the client provisions them

## Implementation History

### 2026-05-11 — Foundation
**What was built:** Next.js 15 + Tailwind v4 + TypeScript scaffold; brand tokens; home (Hero / WhatWeDo / LocationCard / PartnerStrip); MDX history; site shell
**Files affected:** app/**, components/**, content/site.ts, content/history/welcome.mdx, public/brand/*

### 2026-05-12 — Events, Black-history article, Weather
**What was built:** /events index + 3 detail pages, "Black History in Farming" article, OpenWeather integration with home widget. Briefly added Open-Meteo dual provider then reverted to OpenWeather only.
**Files affected:** app/events/**, app/weather/**, components/{events,weather}/*, lib/weather.ts, content/events.ts, .env.example

### 2026-05-13 — Mobile responsive pass
**What was built:** Hamburger menu under `md`, viewport meta + theme color, weather 5-day list grid refactor (was overflowing on phones), tighter typography across all pages
**Files affected:** app/layout.tsx, app/globals.css, app/{events,history,weather}/**, components/{layout,marketing,events,weather}/*

### 2026-05-22 — Phase 1 MVP (perry-v2)
**What was built:** Full backend stack — Supabase (Postgres + Auth + Storage + RLS) with 4 client variants and a hand-written Database type; magic-link auth + `/account` + `/admin`; events migrated to DB with RSVP flow and Resend confirmations; Google Sheets reader powering `/shop` read-only catalog + `/shop/[sku]` detail + home WhatsGrowing widget; `/recipes` with 2 seed MDX recipes cross-linked from shop items; newsletter signup with double opt-in; `/contact`, `/vendors/apply`, `/gallery`; admin shell with read-only list views; consolidated to single working branch `perry-v2`
**Why:** Client signed off on MVP plan (booking, ticketing-as-RSVP, marketing, day-of foundation) plus a produce strand they expanded the brief to include
**Files affected:** 63 files; +4,418 / -118. Touched every layer.

## Architecture Evolution

Stack now is Next.js 15 (App Router) + TypeScript + Tailwind v4 on the frontend, with Supabase (Postgres + Auth + Storage) as the backend and Resend for transactional + newsletter email. Google Sheets is the produce inventory source of truth — staff edit a single shared sheet and the site reads it via service-account auth, cached 15 minutes. MDX still powers long-form prose (history, recipes). Hosted on Vercel with `main` as the production branch and `perry-v2` as the single working branch (other branches were deleted to keep the model simple). Phase 2 will add Stripe for payments (paid tickets, farm-stand checkout, CSA subscriptions) and full admin CRUD; Phase 3 covers day-of operations (QR check-in, live dashboard, run-of-show).

See architecture.md for the component-by-component map.

## Lessons Learned

- OpenWeather keys take "up to a couple hours" to activate after signup, independent of email verification — don't burn time generating new keys; just wait.
- Vercel never reads `.env.local`. Each env var must be set in Vercel project settings (Production + Preview + Development).
- React 19 / Next 16 lint flags `setState` calls inside `useEffect` — close-on-route-change should happen via `onClick` on the Link itself, not via a pathname watcher.
- Fixed-width Tailwind classes (`w-16`, `w-12`) in a horizontal flex row will quietly overflow phones — `grid-template-columns` is more predictable for forecast-row layouts.
- `generateStaticParams` runs at build time without a request context — never use a cookie-bound Supabase client there. Solution: a separate `lib/supabase/public.ts` with the anon key and no cookie binding.
- Newer versions of `@supabase/supabase-js` require each table type to include `Relationships: []` — otherwise insert calls resolve to `never[]` and break with confusing errors. Hand-written `Database` type needs the canonical shape.
- Supabase Auth callback redirects must be whitelisted in the project dashboard (`Authentication → URL Configuration`); the magic-link email will silently fail to redirect otherwise.
