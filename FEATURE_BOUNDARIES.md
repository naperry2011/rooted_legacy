# FEATURE_BOUNDARIES

## Site Shell (app/layout.tsx + components/layout/*)

Owns: HTML document, fonts, viewport + theme color, header (desktop primary nav + mobile hamburger), footer (newsletter signup + secondary nav), root metadata
Does NOT Own: Page bodies, auth state UI, data fetches
Communicates With: content/site.ts (nav, partners, address); app/globals.css (tokens); NewsletterSignup
Isolation Level: Strong

## Auth (app/login/* + app/auth/* + middleware.ts + lib/auth.ts)

Owns: Magic-link sign-in flow, session cookie refresh, role resolution (visitor / staff / admin), route gating for /admin and /account
Does NOT Own: Profile data shape (delegated to Supabase profiles table), email send (delegated to Supabase Auth)
Communicates With: Supabase Auth + profiles table; ADMIN_EMAIL_ALLOWLIST env var
Isolation Level: Strong

## Account (app/account/*)

Owns: Logged-in visitor surface — currently just RSVP list + sign-out
Does NOT Own: Auth flow, admin features
Communicates With: lib/auth.ts; createServerClient (reads own bookings)
Isolation Level: Strong

## Marketing Home (app/page.tsx + components/marketing/*)

Owns: Home page composition (Hero, WhatWeDo, WhatsGrowing + WeatherWidget side-by-side, LocationCard, PartnerStrip)
Does NOT Own: Weather/produce data fetching (embedded widgets fetch themselves)
Communicates With: content/site.ts; public/brand/*
Isolation Level: Strong

## Events + RSVP (app/events/* + components/events/* + lib/events.ts)

Owns: Event index/detail rendering from Supabase, RSVP form, booking creation server action, build-safe slug enumeration
Does NOT Own: Calendar persistence (Supabase), email delivery (Resend), payments (Phase 2)
Communicates With: createPublicClient for reads; createAdminClient for inserts; lib/resend.ts for confirmations
Isolation Level: Strong

## Produce / Farm Stand (app/shop/* + components/produce/* + lib/sheets.ts)

Owns: Google Sheets reader + normalization + 15-min cache, /shop catalog, /shop/[sku] detail, home WhatsGrowing widget
Does NOT Own: Checkout (Phase 2), inventory persistence (Google Sheet is source of truth, not us)
Communicates With: Google Sheets API; lib/recipes.ts for cross-links
Isolation Level: Strong

## Recipes (app/recipes/* + lib/recipes.ts + content/recipes/*.mdx)

Owns: MDX recipe discovery, ingredient cross-reference, recipe rendering
Does NOT Own: Database storage (file-based by design); shop catalog
Communicates With: filesystem at build; next-mdx-remote/rsc
Isolation Level: Strong

## History (app/history/* + lib/mdx.ts + content/history/*.mdx)

Owns: MDX article discovery + rendering, frontmatter parsing
Does NOT Own: Anything else
Communicates With: filesystem; next-mdx-remote/rsc
Isolation Level: Strong

## Newsletter (components/marketing/NewsletterSignup.tsx + app/actions/newsletter.ts + app/api/newsletter/confirm/route.ts)

Owns: Signup form, double-opt-in flow, confirmation token redemption
Does NOT Own: Broadcast sending (manual via Resend dashboard for MVP)
Communicates With: Supabase subscribers table; Resend
Isolation Level: Strong

## Vendor Application (app/vendors/apply/*)

Owns: Application form + acceptance/notification emails
Does NOT Own: Public vendor directory (Phase 2 — only application surface lives in MVP)
Communicates With: Supabase vendor_applications; Resend
Isolation Level: Strong

## Contact (app/contact/*)

Owns: Public contact form
Does NOT Own: Any reply workflow
Communicates With: Supabase contact_messages; Resend (forward + replyTo)
Isolation Level: Strong

## Gallery (app/gallery/* + lib/gallery.ts)

Owns: Photo listing + path resolution (local vs Storage)
Does NOT Own: Uploads (Phase 2; admin uses Supabase Studio for MVP)
Communicates With: Supabase gallery_photos + Storage bucket
Isolation Level: Strong

## Admin (app/admin/* + components/admin/*)

Owns: Role-gated dashboard, read-only list views (bookings, subscribers, vendors, messages)
Does NOT Own: Edit workflows (Phase 2); raw data shape (mirrors DB)
Communicates With: createAdminClient (service role); lib/auth.ts requireAdmin
Isolation Level: Strong

## Weather (app/weather/* + components/weather/* + lib/weather.ts)

Owns: OpenWeather fetch + mapping + ISR; /weather page; home widget
Does NOT Own: User-customizable location (defaults to farm coords; env var override)
Communicates With: OpenWeather; OPENWEATHER_API_KEY
Isolation Level: Strong

## Supabase Layer (lib/supabase/*, supabase/*)

Owns: 4 client variants (server, browser, admin, public), Database type, migrations, seed
Does NOT Own: Feature logic; just plumbing
Communicates With: Every feature that touches the DB
Isolation Level: Strong; the Database type in `types.ts` is the load-bearing contract

## Email Layer (lib/resend.ts)

Owns: Resend SDK wrapper, branded HTML envelope, soft no-op when key missing
Does NOT Own: Domain verification, broadcast composition
Communicates With: Resend API; every server action that sends email
Isolation Level: Strong

## Forms Layer (components/forms/fields.tsx + lib/validations/*.ts)

Owns: Shared Input/Textarea/Field/SubmitButton/FormAlert primitives; zod schemas reused between client + server
Does NOT Own: Form-specific business logic
Communicates With: Every form component + server action
Isolation Level: Strong

## Build / Tooling (package.json, tsconfig.json, next.config.ts, eslint.config.mjs, postcss.config.mjs, middleware.ts)

Owns: Dependency graph, scripts, TypeScript config, lint rules, PostCSS/Tailwind v4, middleware route matcher
Does NOT Own: Runtime behavior beyond dispatch
Communicates With: All source files (compile-time + every request through middleware)
Isolation Level: Strong

## Deployment (Vercel + GitHub)

Owns: Production hosting at rooted-legacy-phi.vercel.app, environment variables, auto-deploys from `main`
Does NOT Own: Source-of-truth code (GitHub `main`); local secrets (`.env.local` gitignored)
Communicates With: GitHub repo, Supabase, OpenWeather, Resend, Google APIs at runtime
Isolation Level: Strong

## Deferred / Phase 2 (placeholder, not built)

- Payments (Stripe) — paid tickets + farm-stand checkout + CSA subscriptions
- Public vendor directory (/vendors)
- Full admin CRUD (event editor, vendor approval action, refund flow)
- Wholesale order portal
- QR check-in / live attendance dashboard / run-of-show
- File uploads from forms (vendor logos, gallery)
