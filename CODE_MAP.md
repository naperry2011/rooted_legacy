# CODE_MAP

## Site Shell (Layout + Branding)

Category: UI

Primary Files:
- app/layout.tsx (now sets default OG image + Twitter card)
- components/layout/Header.tsx
- components/layout/Footer.tsx
- components/brand/Logo.tsx
- app/globals.css

Supporting Files:
- content/site.ts (nav has `primary` flag — desktop nav shows only primaries)
- public/brand/*, public/gallery/*

External Integrations:
- Google Fonts (Cormorant Garamond, Inter)

## About / Our Story

Category: UI

Primary Files:
- app/about/page.tsx

Supporting Files:
- public/gallery/grand-opening-class.jpg (hero)
- content/site.ts

Entry Points:
- `/about`

## Marketing Home

Category: UI

Primary Files:
- app/page.tsx
- components/marketing/Hero.tsx
- components/marketing/WhatWeDo.tsx
- components/marketing/LocationCard.tsx
- components/marketing/PartnerStrip.tsx (enriched: tagline, service pills, IG + email links)

Supporting Files:
- components/weather/WeatherWidget.tsx
- components/produce/WhatsGrowing.tsx

External Integrations:
- OpenWeather (via WeatherWidget)
- Google Sheets (via WhatsGrowing)

Entry Points:
- `/` (ISR 30 min)

## Events + RSVP (with Featured Event flair)

Category: UI + Service

Primary Files:
- app/events/page.tsx
- app/events/[slug]/page.tsx (Featured-event treatment: radial glow, tagline, themes pillars, price + perks card)
- app/events/[slug]/actions.ts (createBooking server action)
- components/events/EventCard.tsx (Featured pill + tagline + price chip)
- components/events/BookingForm.tsx
- lib/events.ts (formatPriceCents helper)
- lib/validations/booking.ts

Supporting Files:
- content/events.ts (formatEventDate, formatTimeRange)
- supabase/migrations/0001_init.sql (events, bookings)
- supabase/migrations/0002_event_flair.sql (tagline, price_cents, themes, included_perks, is_featured)
- supabase/seed.sql (4 events incl. Soothing Sundays + 4 event photos)

External Integrations:
- Supabase Postgres
- Resend (RSVP confirmations)

Entry Points:
- `/events`, `/events/[slug]`

## Vendor Directory + Application

Category: UI

Primary Files:
- app/vendors/page.tsx (directory: long-term partners + featured vendors)
- app/vendors/apply/page.tsx + VendorForm + actions
- components/vendors/VendorCard.tsx
- content/vendors.ts (typed Vendor[], MVP source of truth)
- lib/validations/vendor.ts

Supporting Files:
- content/site.ts `partners` (long-term partners shown in directory)
- public/gallery/grand-opening-pure-trition.jpg (Pure-trition card)

External Integrations:
- Supabase (vendor_applications writes)
- Resend (admin notify + applicant ack)

Entry Points:
- `/vendors`, `/vendors/apply`

## Auth (Magic-link)

Category: Service + UI

Primary Files:
- app/login/page.tsx, LoginForm.tsx, actions.ts
- app/auth/callback/route.ts, signout/route.ts
- lib/auth.ts (getCurrentUser, getCurrentRole, requireAdmin)
- middleware.ts (protects /admin/*, /account/*)

External Integrations:
- Supabase Auth (OTP / magic link)

Entry Points:
- `/login`, `/auth/callback`, `/auth/signout`

## Account Area

Category: UI

Primary Files:
- app/account/page.tsx

Entry Points:
- `/account` (auth-required)

## Produce (Farm Stand)

Category: Service + UI

Primary Files:
- app/shop/page.tsx
- app/shop/[sku]/page.tsx
- components/produce/ShopCard.tsx
- components/produce/WhatsGrowing.tsx
- lib/sheets.ts (Google Sheets reader, 15-min cache)

External Integrations:
- Google Sheets API

Entry Points:
- `/shop`, `/shop/[sku]`

## Recipes

Category: UI

Primary Files:
- app/recipes/page.tsx, app/recipes/[slug]/page.tsx
- lib/recipes.ts
- content/recipes/*.mdx (2 seed recipes)

Entry Points:
- `/recipes`, `/recipes/[slug]` (SSG)

## History (MDX)

Category: UI

Primary Files:
- app/history/page.tsx, app/history/[slug]/page.tsx
- lib/mdx.ts
- content/history/*.mdx

Entry Points:
- `/history`, `/history/[slug]` (SSG)

## Newsletter

Category: Service + UI

Primary Files:
- components/marketing/NewsletterSignup.tsx
- app/actions/newsletter.ts
- app/api/newsletter/confirm/route.ts
- lib/validations/newsletter.ts

External Integrations:
- Resend, Supabase

## Contact

Category: Service + UI

Primary Files:
- app/contact/page.tsx, ContactForm.tsx, actions.ts
- lib/validations/contact.ts

External Integrations:
- Supabase, Resend

## Gallery

Category: UI

Primary Files:
- app/gallery/page.tsx
- lib/gallery.ts (listGalleryPhotos, listPhotosForEvent)

Supporting Files:
- public/gallery/grand-opening-*.jpg (4 photos, event-linked via gallery_photos.event_id)
- public/brand/flyer_*.jpg, partner_*.jpg

External Integrations:
- Supabase Storage (`gallery` bucket; optional)

Entry Points:
- `/gallery`
- Event detail pages render `listPhotosForEvent(event.id)` as "From the day"

## Admin (Read-only)

Category: UI

Primary Files:
- app/admin/layout.tsx (role-gated)
- app/admin/page.tsx
- app/admin/{bookings,subscribers,vendors,messages}/page.tsx
- components/admin/DataTable.tsx

Entry Points:
- `/admin`, `/admin/*`

## Weather

Category: Service + UI

Primary Files:
- app/weather/page.tsx
- components/weather/WeatherWidget.tsx
- lib/weather.ts

Entry Points:
- `/weather`

## Supabase Layer (cross-cutting)

Category: Infra

Primary Files:
- lib/supabase/{server,browser,admin,public}.ts
- lib/supabase/types.ts (Database type)
- supabase/migrations/0001_init.sql
- supabase/migrations/0002_event_flair.sql
- supabase/seed.sql

## Email (cross-cutting)

Category: Service

Primary Files:
- lib/resend.ts

## Build / Tooling

Category: Infra

Primary Files:
- package.json, tsconfig.json, next.config.ts, eslint.config.mjs, postcss.config.mjs
- .env.example, .gitignore

## Documentation

Category: Other

Primary Files:
- README.md, FEATURE_SPEC.md
- CODE_MAP.md, ENTRY_POINTS.md, DATA_FLOW.md, IMPORT_GRAPH_SUMMARY.md, FEATURE_BOUNDARIES.md
- docs/ai/{memory,roadmap,tasks,decisions,architecture}.md
- docs/SETUP.md
- llms.txt
