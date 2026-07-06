# Project Memory

Running history of what's been built and current state. Update after major changes.

## Current State

**Status:** Live in production at https://rootedlegacyfarm.com (custom domain). Phase 2 auth + admin CRUD shipped.
**Last Updated:** 2026-07-06
**Version:** `main` (deployed on Vercel); working branches created fresh off `main` per PR

> Branch note: the old `perry-v2` branch was deleted 2026-07-06 after a squash-merge-then-merge-back
> workflow silently dropped committed work twice. New rule: branch fresh off `origin/main` for each
> change; never merge `main` back into a feature branch. Each PR squash-merges to `main`.

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
- **Full admin CRUD** — `/admin/events` (create/edit/delete events + per-event attendees + CSV export); `/admin/team` (invite-only admin onboarding); the other list views remain read-only
- **Email + password auth** (magic link removed). Login → admins land on `/admin`, others `/account`
- **Password lifecycle**: `/admin/password` (change while logged in) + hardened forgot-password reset (`/reset-password` → `/auth/confirm` token_hash verify → isolated `/reset-password/update` page → signs out all sessions → re-login)
- **Header auth controls**: Log in / Admin · Account · Log out (browser-side auth check, keeps pages static)
- **Resend transactional email is LIVE** via custom SMTP from `noreply@rootedlegacyfarm.com` (verified domain)
- All external integrations degrade gracefully when env vars missing
- 5 Grand Opening / flyer images are on disk and rendering

### Known Issues
- Google Sheets (produce) and the Supabase Storage `gallery` bucket are still not provisioned — those spots show "Not configured" notices
- Supabase dev keys + OpenWeather key were shared in chat history early on; rotate before wider launch
- `www` vs apex: Supabase Site URL is the apex `https://rootedlegacyfarm.com`; both `www` and apex are allowlisted. Site resolves on both.

### In Progress
- Stripe / paid tickets / CSA still deferred (Phase 2 payments)
- Optional: also kill other sessions on the logged-in `/admin/password` change (currently only the reset flow does)

## Implementation History

### 2026-07-05/06 — Auth overhaul, admin CRUD, custom domain (Phase 2, part 1)
**What was built:** A full authenticated-admin experience, shipped as a series of squash-merged PRs:
- **Admin Events manager** (`app/admin/events/**`): create/edit/delete events via a form, per-event
  attendees view with Cancel + CSV export. Supersedes the read-only MVP admin (ADR-010).
- **Header auth controls** (`components/layout/Header.tsx`): Log in / Account / Log out, browser-side
  auth detection so pages stay statically rendered.
- **Email + password login** (`app/login/**`): replaced magic-link OTP with `signInWithPassword`;
  fixed a 405 logout bug (303 redirect); admins redirect to `/admin` on login + an "Admin" header link.
- **Invite-only admin onboarding** (`app/admin/team/**`): owner creates full-admin accounts with a temp
  password (no email/verification) via `admin.auth.admin.createUser` + `profiles.role='admin'`; revoke
  sets role back to `visitor`.
- **Security migration `0003_admin_onboarding.sql`**: revoked `UPDATE(role)` on `profiles` from
  authenticated/anon (closed a self-promotion hole); added `profiles.email` (+ trigger + backfill).
- **Password change + hardened reset**: `/admin/password` (logged-in change); forgot-password via
  `/reset-password` → `resetPasswordForEmail` → `/auth/confirm` (server-side `verifyOtp` on `token_hash`,
  since the default hash-fragment link is invisible to a server route) → isolated `/reset-password/update`
  page. A `pw_reset_pending` cookie blocks the admin area until the new password is set; saving signs out
  ALL sessions (`scope: global`) and forces re-login.
- **Custom domain + email**: registered `rootedlegacyfarm.com` (Namecheap DNS, A/CNAME to Vercel),
  verified it in Resend (DKIM/SPF/MX on the `send` subdomain), and wired Resend as Supabase's SMTP so
  auth emails send from `noreply@rootedlegacyfarm.com`. Branded the reset email template.
**Files affected:** app/admin/{events,team,password}/**, app/reset-password/**, app/auth/confirm/route.ts,
app/login/**, components/layout/Header.tsx, lib/auth.ts, lib/supabase/types.ts,
supabase/migrations/0003_admin_onboarding.sql

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

Stack: **Next.js 16** App Router (React 19) + TypeScript + Tailwind v4. Supabase (Postgres + Auth + Storage) for the backend, with **email+password auth** and DB-role-based admin access. Resend for transactional + auth email (custom SMTP on the verified `rootedlegacyfarm.com` domain). Google Sheets API for produce inventory (staff-managed). MDX still powers long-form prose (history, recipes). Hosted on Vercel; production is `main` at the custom domain **https://rootedlegacyfarm.com**; feature branches are cut fresh off `main` per PR. Admin CRUD (events + team) has shipped; Phase 2 payments (Stripe tickets/farm-stand/CSA) and Phase 3 day-of ops remain.

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
- **Squash-merge + merge-back eats work.** Squashing a PR to `main` then merging `main` back into the feature branch caused conflict resolutions that silently dropped committed changes (the reset-password link, twice). Fix: reset/recreate the working branch off `origin/main` after each merge; never merge back.
- **Supabase password-reset links use the URL hash** (`#access_token=…` / `#error=…`), which a server route handler can't read — the old `/auth/callback` returned `missing_code`. Use the `token_hash` + `verifyOtp` pattern with a dedicated `/auth/confirm` route instead.
- **A recovery session is a full session.** Clicking a reset link logs the user in with full access before they set a new password. Gate it: mark a `pw_reset_pending` cookie, force the isolated update page, and sign out `scope: 'global'` on save.
- **Supabase profiles RLS needs column-level lockdown.** `for update using (auth.uid()=id)` lets a user change ANY column of their own row, including `role`. `revoke update (role)` + `grant update (full_name)` closes self-promotion; the service-role client still sets roles.
- **Postgres column privileges override RLS.** Table-level `UPDATE` implies all columns regardless of column grants — you must `revoke update` at the table level, then `grant update (allowed_cols)`.
- **Resend needs a verified domain** — you cannot send from a `vercel.app` address. The built-in Supabase mailer is rate-limited (a few/hour) and is why reset emails "stopped"; wiring custom SMTP (Resend) fixes both deliverability and the rate limit. `onboarding@resend.dev` only sends to the account owner.
- **Vercel's current apex A record is `216.198.79.1`** (not the older `76.76.21.21`); use whatever the dashboard shows.
