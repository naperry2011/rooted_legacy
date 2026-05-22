# Architecture

System design at a glance. Pair with CODE_MAP.md (file map) and DATA_FLOW.md (system flows).

## System Overview

Rooted Legacy is a content-driven marketing-plus-application site for an Indianapolis urban farm. It serves mostly-static pages (home, about, events, history, gallery, recipes, vendor directory), reads live data from external services (Supabase for events/bookings/users, Google Sheets for produce, OpenWeather for weather), and accepts user input via Supabase-backed forms (RSVPs, newsletter signups, vendor applications, contact messages). Single developer, single low-traffic prod environment; no separate staging.

**Style:** Static + ISR (Next.js App Router, RSC) + Supabase backend
**Hosting:** Vercel (production: https://rooted-legacy-phi.vercel.app)
**Branching:** `main` (prod, auto-deploys) + `perry-v2` (single working branch)

## Core Components

### Site Shell
- **Responsibility:** HTML document, fonts, header/footer, viewport metadata, default OG image + Twitter card
- **Key files:** `app/layout.tsx`, `components/layout/{Header,Footer}.tsx`, `app/globals.css`, `content/site.ts`

### About / Our Story
- **Responsibility:** Photo-hero story page tying the farm's mission to the Black agricultural heritage thread
- **Key files:** `app/about/page.tsx`, `public/gallery/grand-opening-class.jpg`

### Auth + Account
- **Responsibility:** Magic-link sign-in, session cookie refresh, role resolution, `/account`
- **Key files:** `middleware.ts`, `lib/auth.ts`, `lib/supabase/server.ts`, `app/login/*`, `app/auth/*`, `app/account/page.tsx`

### Marketing Home
- **Responsibility:** Hero + What We Do + side-by-side WhatsGrowing/Weather + Location + Partners
- **Key files:** `app/page.tsx`, `components/marketing/*`

### Events + RSVP + Featured-event flair
- **Responsibility:** DB-backed event index/detail; RSVP form; featured-event treatment (radial glow, tagline, themes pillars, price + perks card); ticketed-event "Tickets opening soon" placeholder until Phase 2
- **Key files:** `app/events/**`, `components/events/{EventCard,BookingForm}.tsx`, `lib/events.ts`, `supabase/migrations/0002_event_flair.sql`

### Vendor Directory
- **Responsibility:** Public directory of long-term partners + featured vendors; apply CTA
- **Key files:** `app/vendors/page.tsx`, `components/vendors/VendorCard.tsx`, `content/vendors.ts`, `content/site.ts` (partners section)

### Vendor Application
- **Responsibility:** Public application form + admin notification + applicant ack
- **Key files:** `app/vendors/apply/**`, `lib/validations/vendor.ts`

### Produce / Farm Stand
- **Responsibility:** Google Sheets reader; `/shop` + `/shop/[sku]`; home WhatsGrowing widget
- **Key files:** `lib/sheets.ts`, `app/shop/**`, `components/produce/*`

### Recipes
- **Responsibility:** MDX recipe rendering + ingredient cross-reference for shop items
- **Key files:** `lib/recipes.ts`, `app/recipes/**`, `content/recipes/*.mdx`

### History
- **Responsibility:** MDX article rendering
- **Key files:** `lib/mdx.ts`, `app/history/**`, `content/history/*.mdx`

### Forms (Newsletter / Vendor / Contact)
- **Responsibility:** Public input forms with server-action persistence + Resend side effects
- **Key files:** `components/marketing/NewsletterSignup.tsx`, `app/{contact,vendors/apply}/**`, `app/actions/newsletter.ts`, `app/api/newsletter/confirm/route.ts`

### Gallery + Event Photos
- **Responsibility:** Photo grid for `/gallery`; per-event photo lookup via `listPhotosForEvent`; path resolution (local /public vs Supabase Storage)
- **Key files:** `lib/gallery.ts`, `app/gallery/page.tsx`, event detail page

### Admin (Read-only)
- **Responsibility:** Role-gated dashboard + 4 list views
- **Key files:** `app/admin/**`, `components/admin/DataTable.tsx`, `lib/auth.ts` (requireAdmin)

### Weather
- **Responsibility:** OpenWeather current + hourly + daily; home widget; ISR
- **Key files:** `lib/weather.ts`, `app/weather/page.tsx`, `components/weather/WeatherWidget.tsx`

### Supabase Layer
- **Responsibility:** 4 client variants + Database type + migrations + seed
- **Key files:** `lib/supabase/*`, `supabase/migrations/{0001_init,0002_event_flair}.sql`, `supabase/seed.sql`

### Email Layer
- **Responsibility:** Resend wrapper; branded HTML; soft no-op when key missing
- **Key files:** `lib/resend.ts`

## Data Flow (Critical Path)

1. **Request** hits Vercel edge
2. **Middleware** refreshes Supabase session cookies; gates /admin + /account
3. **App Router** dispatches to the route
4. For data-driven routes:
   - `/`, `/weather` → `lib/weather.ts` → OpenWeather (ISR 30 min)
   - `/`, `/shop`, `/shop/[sku]` → `lib/sheets.ts` → Google Sheets (15 min cache)
   - `/events*` → `lib/events.ts` → Supabase public client
   - `/events/[slug]` → also `lib/gallery.ts` → photos for this event
   - `/history*`, `/recipes*` → fs + gray-matter at build
   - `/about`, `/vendors` → static rendered against `content/site.ts` + `content/vendors.ts`
   - `/account` → server Supabase client → own bookings
   - `/admin*` → admin Supabase client → full-table reads
5. **RSC** renders, streams HTML
6. **Form submits** → server action → zod validate → admin client write → Resend email → state return
7. **Magic-link** → `signInWithOtp` → email → `/auth/callback?code=…` → cookie → redirect

## Data Stores

- **Supabase Postgres** — 7 MVP tables (profiles, events, bookings, vendor_applications, subscribers, gallery_photos, contact_messages). 5 additional columns on events from 0002 (tagline, price_cents, themes, included_perks, is_featured). RLS on all.
- **Supabase Storage** — optional `gallery` bucket
- **Google Sheets** — produce inventory; 13-column schema; staff-managed
- **Filesystem (build-time only)** — MDX for history + recipes; typed arrays in content/* (events seed, vendors, site)
- **Resend** — sent-email log (external)
- **OpenWeather** — current + forecast (external)

## External Integrations

- **Supabase** — DB + Auth + Storage
- **Resend** — transactional + newsletter email
- **Google Sheets API** — produce inventory
- **OpenWeather** — `/data/2.5/*` free-tier endpoints
- **Vercel** — hosting + CI/CD + env-var management
- **GitHub** — source-of-truth repo
- **Google Fonts** — Cormorant Garamond, Inter (self-hosted at build)
- **Google Maps** — link-out only

## Security Boundaries

- **Server-only modules** with `import "server-only"`: `lib/supabase/{server,admin,public}.ts`, `lib/auth.ts`, `lib/events.ts`, `lib/gallery.ts`, `lib/sheets.ts`, `lib/weather.ts`, `lib/resend.ts`
- **Middleware** refreshes Supabase session cookies; gates `/admin` and `/account`
- **Admin role** enforced twice (middleware redirect + layout `requireAdmin`); conferred via `ADMIN_EMAIL_ALLOWLIST` at sign-in
- **RLS** on every table. Public-read on `events` (published), `gallery_photos`. Owner-read on `bookings`. Everything else server-write only.
- **Secrets** in Vercel project env vars (prod) + `.env.local` (dev — gitignored). `.env.example` is the only env file checked in.

## Known Constraints / Trade-offs

- **No CMS** — content edits via PRs or Supabase Studio. Phase 2 admin CRUD will close this gap.
- **Free-tier Supabase + Resend + OpenWeather** — sufficient for v1.
- **Single revalidate strategy (15–30 min)** — fine for marketing; not real-time.
- **No tests** — risk for the demo; Phase 2 prerequisite before interactive flows ship.
- **Hand-maintained Database type** — drift risk per migration. Switch to generated types in Phase 2.
- **Vendor data split** — `site.partners` (long-term) + `content/vendors.ts` (featured event vendors). Convenient for MVP, unify in Phase 2 once DB-backed `vendor_profiles` exists.
- **`gallery_photos.path` overload** — `/public/...` + Supabase Storage paths in one column. Resolver handles both, but a `source` enum would clarify intent.
- **Featured-event flair as additive columns** — preferred to a separate `featured_events` table for one-to-zero-or-one data. Will grow if many more flair fields appear.
- **"Tickets opening soon" placeholder** — must not ship a featured paid event to prod without a real flow as the event date approaches.
