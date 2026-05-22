# CODE_MAP

## Site Shell (Layout + Branding)

Category: UI

Primary Files:
- app/layout.tsx
- components/layout/Header.tsx
- components/layout/Footer.tsx
- components/brand/Logo.tsx
- app/globals.css

Supporting Files:
- content/site.ts (nav has `primary` flag — desktop nav shows only primaries)
- public/brand/*

External Integrations:
- Google Fonts (Cormorant Garamond, Inter)

Entry Points:
- Wraps every route as Root Layout

## Marketing Home

Category: UI

Primary Files:
- app/page.tsx
- components/marketing/Hero.tsx
- components/marketing/WhatWeDo.tsx
- components/marketing/LocationCard.tsx
- components/marketing/PartnerStrip.tsx

Supporting Files:
- components/weather/WeatherWidget.tsx (embedded on home)
- components/produce/WhatsGrowing.tsx (embedded on home, side-by-side with weather)

External Integrations:
- OpenWeather (via WeatherWidget)
- Google Sheets (via WhatsGrowing)

Entry Points:
- `/` (ISR 30 min)

## Auth (Magic-link)

Category: Service + UI

Primary Files:
- app/login/page.tsx
- app/login/LoginForm.tsx
- app/login/actions.ts
- app/auth/callback/route.ts
- app/auth/signout/route.ts
- lib/auth.ts (getCurrentUser, getCurrentRole, requireAdmin)
- middleware.ts (protects /admin/*, /account/*)

Supporting Files:
- lib/supabase/server.ts, browser.ts

External Integrations:
- Supabase Auth (OTP / magic link)
- Resend (Supabase sends the magic-link email itself unless overridden)

Entry Points:
- `/login`, `/auth/callback`, `/auth/signout`

## Account Area

Category: UI

Primary Files:
- app/account/page.tsx

Supporting Files:
- lib/auth.ts

Entry Points:
- `/account` (auth-required; redirects to /login)

## Events + RSVP

Category: UI + Service

Primary Files:
- app/events/page.tsx
- app/events/[slug]/page.tsx
- app/events/[slug]/actions.ts (createBooking server action)
- components/events/EventCard.tsx
- components/events/BookingForm.tsx
- lib/events.ts (listPublishedEvents, getEventBySlug, partitionEvents, listPublishedEventSlugsForBuild)
- lib/validations/booking.ts

Supporting Files:
- content/events.ts (formatEventDate, formatTimeRange helpers; original array kept for seed)
- supabase/migrations/0001_init.sql (events, bookings)
- supabase/seed.sql

External Integrations:
- Supabase Postgres (events, bookings)
- Resend (RSVP confirmation email)

Entry Points:
- `/events`, `/events/[slug]`

## Produce (Farm Stand)

Category: Service + UI

Primary Files:
- app/shop/page.tsx
- app/shop/[sku]/page.tsx
- components/produce/ShopCard.tsx
- components/produce/WhatsGrowing.tsx
- lib/sheets.ts (Google Sheets reader, 15-min cache)

External Integrations:
- Google Sheets API (service-account read)

Entry Points:
- `/shop`, `/shop/[sku]`
- Home widget

## Recipes

Category: UI

Primary Files:
- app/recipes/page.tsx
- app/recipes/[slug]/page.tsx
- lib/recipes.ts (MDX loader; listRecipes, getRecipe, listRecipesByIngredient)
- content/recipes/*.mdx (2 seed recipes)

Supporting Files:
- /shop/[sku] cross-links to matching recipes via listRecipesByIngredient

Entry Points:
- `/recipes`, `/recipes/[slug]` (SSG)

## History (MDX)

Category: UI

Primary Files:
- app/history/page.tsx
- app/history/[slug]/page.tsx
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

Supporting Files:
- components/layout/Footer.tsx (embeds signup)
- supabase migration: subscribers table

External Integrations:
- Resend (double-opt-in email)
- Supabase (subscribers table)

Entry Points:
- Footer signup; `/api/newsletter/confirm?token=…`

## Vendor Application

Category: Service + UI

Primary Files:
- app/vendors/apply/page.tsx
- app/vendors/apply/VendorForm.tsx
- app/vendors/apply/actions.ts
- lib/validations/vendor.ts

External Integrations:
- Supabase (vendor_applications)
- Resend (notification to CONTACT_TO_EMAIL + acknowledgement to applicant)

Entry Points:
- `/vendors/apply`

## Contact

Category: Service + UI

Primary Files:
- app/contact/page.tsx
- app/contact/ContactForm.tsx
- app/contact/actions.ts
- lib/validations/contact.ts

External Integrations:
- Supabase (contact_messages)
- Resend (forward to CONTACT_TO_EMAIL)

Entry Points:
- `/contact`

## Gallery

Category: UI

Primary Files:
- app/gallery/page.tsx
- lib/gallery.ts (resolves local /public paths or Supabase Storage URLs)

External Integrations:
- Supabase Storage (`gallery` bucket; optional)

Entry Points:
- `/gallery`

## Admin (Read-only)

Category: UI

Primary Files:
- app/admin/layout.tsx (role-gated)
- app/admin/page.tsx (dashboard counts)
- app/admin/bookings/page.tsx
- app/admin/subscribers/page.tsx
- app/admin/vendors/page.tsx
- app/admin/messages/page.tsx
- components/admin/DataTable.tsx (DataTable, StatusBadge, formatDateTime)

Supporting Files:
- lib/supabase/admin.ts (service-role client)
- lib/auth.ts (requireAdmin)

Entry Points:
- `/admin`, `/admin/{bookings,subscribers,vendors,messages}`

## Weather

Category: Service + UI (unchanged from v1)

Primary Files:
- app/weather/page.tsx
- components/weather/WeatherWidget.tsx
- lib/weather.ts

External Integrations:
- OpenWeather

Entry Points:
- `/weather`

## Supabase Layer (cross-cutting)

Category: Infra

Primary Files:
- lib/supabase/server.ts (RSC + route handlers; cookies)
- lib/supabase/browser.ts (client components)
- lib/supabase/admin.ts (service role; server-only)
- lib/supabase/public.ts (anon, cookie-less; safe at build + RSC)
- lib/supabase/types.ts (hand-written Database type)
- supabase/migrations/0001_init.sql
- supabase/seed.sql

Entry Points:
- Imported by every feature that touches the DB

## Email (cross-cutting)

Category: Service

Primary Files:
- lib/resend.ts (sendEmail, wrapHtml, soft no-op when RESEND_API_KEY missing)

External Integrations:
- Resend

## Build / Tooling

Category: Infra

Primary Files:
- package.json, tsconfig.json, next.config.ts, eslint.config.mjs, postcss.config.mjs
- .env.example
- .gitignore

## Documentation

Category: Other

Primary Files:
- README.md, FEATURE_SPEC.md
- CODE_MAP.md, ENTRY_POINTS.md, DATA_FLOW.md, IMPORT_GRAPH_SUMMARY.md, FEATURE_BOUNDARIES.md
- docs/ai/{memory,roadmap,tasks,decisions,architecture}.md
- docs/SETUP.md (provisioning Supabase + Resend + Google Sheets)
- llms.txt
