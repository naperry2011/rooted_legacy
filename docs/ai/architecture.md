# Architecture

System design at a glance. Pair with CODE_MAP.md (file map) and DATA_FLOW.md (system flows).

## System Overview

Rooted Legacy is a content-driven marketing-plus-application site for an Indianapolis urban farm. It serves mostly-static pages (home, events, history, gallery, recipes), reads live data from external services (Supabase for events/bookings/users, Google Sheets for produce, OpenWeather for weather), and accepts user input via Supabase-backed forms (RSVPs, newsletter signups, vendor applications, contact messages). Single developer, single low-traffic prod environment; no separate staging.

**Style:** Static + ISR (Next.js App Router, RSC) + Supabase backend
**Hosting:** Vercel (production: https://rooted-legacy-phi.vercel.app)
**Branching:** `main` (prod, auto-deploys) + `perry-v2` (single working branch)

## Core Components

### Site Shell
- **Responsibility:** HTML document, fonts, brand chrome (header with mobile menu + footer with newsletter signup), viewport metadata, role-aware nav
- **Tech:** Next.js App Router; only the Header is a client component
- **Key files:** `app/layout.tsx`, `components/layout/{Header,Footer}.tsx`, `app/globals.css`, `content/site.ts`

### Auth + Account
- **Responsibility:** Magic-link sign-in, session cookie refresh via middleware, role resolution, `/account` for visitors
- **Tech:** Supabase Auth + `@supabase/ssr`
- **Key files:** `middleware.ts`, `lib/auth.ts`, `lib/supabase/server.ts`, `app/login/*`, `app/auth/*`, `app/account/page.tsx`
- **Depends on:** `ADMIN_EMAIL_ALLOWLIST` for role conferral, Supabase Auth redirect URL allowlist

### Marketing Home
- **Responsibility:** Hero + What We Do + side-by-side WhatsGrowing/Weather + Location + Partners
- **Tech:** Server components only; ISR 30 min (inherited from widgets)
- **Key files:** `app/page.tsx`, `components/marketing/*`, `components/produce/WhatsGrowing.tsx`, `components/weather/WeatherWidget.tsx`

### Events + RSVP
- **Responsibility:** DB-backed event index/detail; RSVP form with zod validation; confirmation email
- **Tech:** Public Supabase client for reads (works at build); admin client for inserts; Resend for email
- **Key files:** `app/events/**`, `components/events/{EventCard,BookingForm}.tsx`, `lib/events.ts`, `lib/validations/booking.ts`

### Produce / Farm Stand
- **Responsibility:** Google Sheets reader with 15-min cache; read-only `/shop` catalog + `/shop/[sku]` detail; home WhatsGrowing widget; cross-link to recipes
- **Tech:** `googleapis` JWT auth; Next.js `unstable_cache` with revalidate tag
- **Key files:** `lib/sheets.ts`, `app/shop/**`, `components/produce/*`

### Recipes
- **Responsibility:** MDX recipe discovery + rendering; ingredient cross-reference for shop items
- **Tech:** Filesystem MDX, `next-mdx-remote/rsc`
- **Key files:** `lib/recipes.ts`, `app/recipes/**`, `content/recipes/*.mdx`

### History
- **Responsibility:** MDX article rendering (unchanged from v1)
- **Tech:** Filesystem MDX
- **Key files:** `lib/mdx.ts`, `app/history/**`, `content/history/*.mdx`

### Forms (Newsletter / Vendor / Contact)
- **Responsibility:** Public input forms with server-action persistence + Resend side-effects
- **Tech:** `useActionState`, `react-hook-form` available but not yet adopted, zod schemas in `lib/validations/*`
- **Key files:** `components/marketing/NewsletterSignup.tsx`, `app/{contact,vendors/apply}/**`, `app/actions/newsletter.ts`, `app/api/newsletter/confirm/route.ts`

### Gallery
- **Responsibility:** Photo grid sourced from `gallery_photos` rows; resolves local `/public` paths or Supabase Storage URLs transparently
- **Tech:** Public Supabase client; Storage `getPublicUrl`
- **Key files:** `lib/gallery.ts`, `app/gallery/page.tsx`

### Admin (Read-only)
- **Responsibility:** Role-gated dashboard with counts + list views for the 4 user-input tables
- **Tech:** Service-role Supabase client; layout-level role gate
- **Key files:** `app/admin/**`, `components/admin/DataTable.tsx`, `lib/auth.ts` (requireAdmin)

### Weather (v1)
- **Responsibility:** OpenWeather current + hourly + daily; home widget; ISR 30 min; graceful fallbacks
- **Tech:** `fetch` with `next.revalidate`
- **Key files:** `lib/weather.ts`, `app/weather/page.tsx`, `components/weather/WeatherWidget.tsx`

### Supabase Layer
- **Responsibility:** Four client variants + hand-written Database type + migrations
- **Tech:** `@supabase/supabase-js` v2, `@supabase/ssr`
- **Key files:** `lib/supabase/*`, `supabase/migrations/0001_init.sql`, `supabase/seed.sql`

### Email Layer
- **Responsibility:** Resend wrapper; branded HTML envelope; soft no-op when key missing
- **Tech:** `resend` SDK
- **Key files:** `lib/resend.ts`

## Data Flow (Critical Path)

1. **Request** hits Vercel edge
2. **Middleware** refreshes Supabase session cookies; redirects unauth'd users from `/admin` or `/account` to `/login`
3. **App Router** dispatches to the matching route
4. For data-driven routes:
   - `/` and `/weather` → `lib/weather.ts` → `fetch(OpenWeather)` with `next.revalidate: 1800`
   - `/` and `/shop` and `/shop/[sku]` → `lib/sheets.ts` → Google Sheets API via service account, cached 15m
   - `/events*` → `lib/events.ts` → public Supabase client (or admin at build for slugs)
   - `/history*`, `/recipes*` → fs + gray-matter at build (SSG)
   - `/account` → server Supabase client (cookies) → own bookings
   - `/admin*` → admin Supabase client (service role) → full-table reads
5. **RSC** renders server-side, streams HTML to client
6. **Form submits** hit a server action → zod validate → admin client write → side-effect email via Resend → return state to UI
7. **Magic-link sign-in** → server action → `signInWithOtp` → email → `/auth/callback?code=…` → session cookie → redirect

## Data Stores

- **Supabase Postgres** — 7 MVP tables: profiles, events, bookings, vendor_applications, subscribers, gallery_photos, contact_messages. RLS on all.
- **Supabase Storage** — optional `gallery` bucket for photo uploads (Phase 2)
- **Google Sheets** — produce inventory; 13-column schema; staff-managed
- **Filesystem (build-time only)** — MDX for history + recipes
- **Resend** — sent-email log (external)
- **OpenWeather** — current + forecast (external, remote)

## External Integrations

- **Supabase** — DB + Auth + Storage; primary backend
- **Resend** — transactional + newsletter email
- **Google Sheets API** — produce inventory read; service-account JWT auth
- **OpenWeather** — `/data/2.5/*` free-tier endpoints
- **Vercel** — hosting + CI/CD + env-var management
- **GitHub** — source-of-truth repo
- **Google Fonts** — Cormorant Garamond (display), Inter (body); self-hosted at build
- **Google Maps** — link-out only for directions

## Security Boundaries

- **Server-only modules** carry `import "server-only"`: every `lib/supabase/*` except `browser.ts`, `lib/auth.ts`, `lib/events.ts`, `lib/sheets.ts`, `lib/gallery.ts`, `lib/weather.ts`, `lib/resend.ts`. The service role key cannot leak into a client bundle.
- **Middleware** refreshes the Supabase session cookie on every request and gates `/admin` and `/account`.
- **Admin role** is enforced twice: by `requireAdmin()` in `app/admin/layout.tsx` and by the layout's redirect to `/account` if the role isn't `admin`. The role is conferred by `ADMIN_EMAIL_ALLOWLIST` at sign-in time and synced to the `profiles` row.
- **RLS** is enabled on every table. Public-read policies on `events` (where `status='published'`) and `gallery_photos`. Owner-read on `bookings`. Everything else is server-write only.
- **Secrets** live in Vercel project env vars (prod) and `.env.local` (dev — gitignored). `.env.example` is the only env file checked in; its values are placeholders.
- **No PII in client bundles** — every fetch that touches user data runs server-side.

## Known Constraints / Trade-offs

- **No CMS** — all content edits happen in PRs or in Supabase Studio. Adequate for one dev; will require admin CRUD or a CMS when an editorial team joins (Phase 2 partly addresses this).
- **Free-tier Supabase** — fine until we hit ~500MB DB or 1GB egress. The MVP won't sniff this.
- **Free-tier Resend** — 3k emails/month. Sufficient for v1.
- **Single revalidate strategy (15-30 min)** — fresh enough for marketing; not suitable for severe-weather alerts or live inventory below 15 min. On-demand revalidation hooks are wired (`revalidateTag('produce')`) but no UI button yet.
- **No tests** — MVP risk; introduce Vitest + Playwright before any interactive feature ships.
- **`overflow-x: hidden`** on html/body is a safety net but hides any genuine overflow bug. Re-evaluate if we need horizontal scroll patterns.
- **Hand-maintained Database type** — risk of drift if a migration adds a column without updating `lib/supabase/types.ts`. Switch to generated types in Phase 2.
- **`gallery_photos.path` overload** — same column stores `/public/...` paths and Storage bucket paths. Convenient for MVP, confusing long-term. Normalize during Phase 2 (e.g. add a `source` enum).
