# FEATURE_BOUNDARIES

## Site Shell (app/layout.tsx + components/layout/*)

Owns: HTML document, fonts, viewport + theme color, header (desktop primary nav + mobile hamburger), footer (newsletter signup + secondary nav), root metadata, default OG image + Twitter card
Does NOT Own: Page bodies, auth state UI, data fetches
Communicates With: content/site.ts; app/globals.css; NewsletterSignup
Isolation Level: Strong

## About / Our Story (app/about/page.tsx)

Owns: Photo-hero story page that ties the farm's mission to the Black agricultural heritage thread
Does NOT Own: Long-form history articles (delegated to /history)
Communicates With: content/site.ts (description, address); public/gallery/grand-opening-class.jpg; links to /history/black-history-in-farming, /events, /contact
Isolation Level: Strong

## Auth (app/login/* + app/reset-password/* + app/auth/* + middleware.ts + lib/auth.ts)

Owns: Email+password sign-in, password change (`/admin/password`) + hardened reset (`/reset-password` → `/auth/confirm` verifyOtp → isolated update page → global sign-out), session refresh, role resolution, route gating for /admin and /account
Communicates With: Supabase Auth + profiles table; ADMIN_EMAIL_ALLOWLIST; Resend (SMTP, via Supabase)
Isolation Level: Strong

## Account (app/account/*)

Owns: Logged-in visitor surface — RSVP list + sign-out
Communicates With: lib/auth.ts; own bookings via createServerClient
Isolation Level: Strong

## Marketing Home (app/page.tsx + components/marketing/*)

Owns: Home composition (Hero, WhatWeDo, WhatsGrowing + WeatherWidget side-by-side, LocationCard, PartnerStrip)
Does NOT Own: Weather/produce data fetching
Communicates With: content/site.ts; public/brand/*
Isolation Level: Strong

## Events + Featured-event flair (app/events/* + components/events/* + lib/events.ts)

Owns: DB-backed event listing/detail; RSVP form with zod validation; confirmation email; **featured-event treatment** (radial glow, tagline, themes pillars, price + perks card); "Tickets opening soon" CTA for ticketed events
Does NOT Own: Calendar persistence (Supabase), email delivery (Resend), payments (Phase 2), event-linked photos (delegated to gallery)
Communicates With: Supabase events + bookings; Resend; content/site.ts (partner link lookup); lib/gallery.ts (event photos)
Isolation Level: Strong

## Vendor Directory (app/vendors/page.tsx + content/vendors.ts + components/vendors/VendorCard.tsx)

Owns: Public-facing directory of long-term partners (sourced from `site.partners`) and featured vendors (sourced from `featuredVendors` in content/vendors.ts). Routes back to /events and /vendors/apply.
Does NOT Own: Vendor applications (delegated to /vendors/apply); vendor approval (Phase 2)
Communicates With: content/site.ts, content/vendors.ts, public/gallery/grand-opening-pure-trition.jpg
Isolation Level: Strong (read-only consumer of static data)

## Vendor Application (app/vendors/apply/*)

Owns: Application form + acceptance/notification emails
Communicates With: Supabase vendor_applications; Resend
Isolation Level: Strong

## Produce / Farm Stand (app/shop/* + components/produce/* + lib/sheets.ts)

Owns: Google Sheets reader + 15-min cache, /shop catalog, /shop/[sku] detail, home WhatsGrowing widget
Communicates With: Google Sheets API; lib/recipes.ts for cross-links
Isolation Level: Strong

## Recipes (app/recipes/* + lib/recipes.ts + content/recipes/*.mdx)

Owns: MDX recipe discovery + rendering; ingredient cross-reference for shop items
Communicates With: filesystem; next-mdx-remote/rsc
Isolation Level: Strong

## History (app/history/* + lib/mdx.ts + content/history/*.mdx)

Owns: MDX article rendering
Communicates With: filesystem; next-mdx-remote/rsc
Isolation Level: Strong

## Newsletter (components/marketing/NewsletterSignup.tsx + app/actions/newsletter.ts + app/api/newsletter/confirm/route.ts)

Owns: Signup form, double-opt-in flow, confirmation token redemption
Communicates With: Supabase subscribers; Resend
Isolation Level: Strong

## Contact (app/contact/*)

Owns: Public contact form
Communicates With: Supabase contact_messages; Resend
Isolation Level: Strong

## Gallery (app/gallery/* + lib/gallery.ts)

Owns: Photo listing for `/gallery`, per-event photo lookup (`listPhotosForEvent`), path resolution for local /public + Supabase Storage URLs
Does NOT Own: Uploads (Phase 2)
Communicates With: Supabase gallery_photos + Storage; event detail pages
Isolation Level: Strong

## Admin (app/admin/* + components/admin/*)

Owns: Role-gated dashboard; **events CRUD** (create/edit/delete + attendees + CSV); **invite-only team onboarding** (create/revoke admins); password change; read-only list views (bookings, subscribers, vendors, messages)
Does NOT Own: Vendor approval → directory, gallery uploads, refunds (later Phase 2)
Communicates With: createAdminClient (incl. auth.admin.createUser); lib/auth.ts requireAdmin
Isolation Level: Strong
Note: layout redirects to /reset-password/update while a `pw_reset_pending` cookie is set (recovery must set a new password first)

## Weather (app/weather/* + components/weather/* + lib/weather.ts)

Owns: OpenWeather fetch + mapping + ISR; /weather page; home widget
Communicates With: OpenWeather
Isolation Level: Strong

## Supabase Layer (lib/supabase/*, supabase/*)

Owns: 4 client variants + hand-written Database type + migrations (0001_init.sql, 0002_event_flair.sql) + seed
Communicates With: Every feature that touches the DB
Isolation Level: Strong

## Email Layer (lib/resend.ts)

Owns: Resend SDK wrapper, branded HTML envelope, soft no-op when key missing
Communicates With: Resend; every server action that sends email
Isolation Level: Strong

## Forms Layer (components/forms/fields.tsx + lib/validations/*.ts)

Owns: Shared Input/Textarea/Field/SubmitButton/FormAlert primitives; zod schemas reused between client + server
Communicates With: Every form component + server action
Isolation Level: Strong

## Build / Tooling (package.json, tsconfig.json, next.config.ts, eslint.config.mjs, postcss.config.mjs, middleware.ts)

Owns: Dependency graph, scripts, TypeScript config, lint rules, PostCSS/Tailwind v4, middleware route matcher
Communicates With: All source files (compile-time + every request through middleware)
Isolation Level: Strong

## Deployment (Vercel + GitHub)

Owns: Production hosting at rooted-legacy-phi.vercel.app, environment variables, auto-deploys from `main`
Does NOT Own: Source-of-truth code (GitHub `main`); local secrets (`.env.local` gitignored)
Communicates With: GitHub repo; Supabase, OpenWeather, Resend, Google APIs at runtime
Isolation Level: Strong

## Deferred / Phase 2

- Payments (Stripe) — paid tickets + farm-stand checkout + CSA subscriptions; "Tickets opening soon" CTA is the placeholder
- Public vendor_profiles directory backed by DB (current /vendors page reads from content/vendors.ts as MVP)
- Full admin CRUD
- Wholesale order portal
- QR check-in / live attendance dashboard / run-of-show
- File uploads from forms
