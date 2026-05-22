# ENTRY_POINTS

## npm Scripts

### dev / build / start / lint

Path: `package.json`
Responsibility: Next.js dev server, prod build, prod server, ESLint
Depends On: next, tsconfig, ESLint config (incl. react-hooks rules)

## Middleware

Path: `middleware.ts`
Responsibility: Refreshes Supabase session cookies on every request; redirects unauthenticated users from `/admin/*` and `/account/*` to `/login?next=…`
Invokes: `@supabase/ssr` createServerClient
Depends On: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY

## Root Layout

Path: `app/layout.tsx`
Responsibility: HTML shell, fonts, viewport + theme color, Header + Footer
Invokes: components/layout/{Header,Footer}.tsx, app/globals.css
Depends On: content/site.ts, next/font/google

## Marketing Routes

### Home
Path: `app/page.tsx` (ISR 30 min)
Invokes: Hero, WhatWeDo, WhatsGrowing, WeatherWidget, LocationCard, PartnerStrip

### Events Index
Path: `app/events/page.tsx` (ISR 5 min)
Invokes: lib/events.ts → listPublishedEvents, partitionEvents

### Event Detail (SSG when Supabase configured at build; dynamic otherwise)
Path: `app/events/[slug]/page.tsx`
Invokes: lib/events.ts → getEventBySlug, listPublishedEventSlugsForBuild; lib/auth.ts; BookingForm

### History Index / Detail
Path: `app/history/page.tsx`, `app/history/[slug]/page.tsx`
Invokes: lib/mdx.ts; next-mdx-remote/rsc

### Recipes Index / Detail
Path: `app/recipes/page.tsx`, `app/recipes/[slug]/page.tsx` (SSG)
Invokes: lib/recipes.ts; next-mdx-remote/rsc

### Shop Index
Path: `app/shop/page.tsx` (ISR 15 min)
Invokes: lib/sheets.ts → listFarmStand

### Shop Item Detail (dynamic)
Path: `app/shop/[sku]/page.tsx`
Invokes: lib/sheets.ts → listProduce; lib/recipes.ts → listRecipesByIngredient

### Gallery
Path: `app/gallery/page.tsx` (ISR 5 min)
Invokes: lib/gallery.ts → listGalleryPhotos

### Weather
Path: `app/weather/page.tsx` (ISR 30 min)
Invokes: lib/weather.ts

### Contact
Path: `app/contact/page.tsx`
Invokes: ContactForm → app/contact/actions.ts → createAdminClient + sendEmail

### Vendor Application
Path: `app/vendors/apply/page.tsx`
Invokes: VendorForm → app/vendors/apply/actions.ts → createAdminClient + sendEmail

## Auth Routes

### Login
Path: `app/login/page.tsx`
Responsibility: Magic-link form; redirects authed users to /account or `?next`
Invokes: LoginForm → app/login/actions.ts → supabase.auth.signInWithOtp

### Callback
Path: `app/auth/callback/route.ts`
Responsibility: Exchanges OTP `code` query param for a session
Invokes: createServerClient → auth.exchangeCodeForSession

### Sign-out
Path: `app/auth/signout/route.ts`
Responsibility: Clears Supabase session, redirects home

## Account Route

Path: `app/account/page.tsx`
Responsibility: Lists current user's RSVPs; sign-out button
Invokes: lib/auth.ts → getCurrentUser; createServerClient

## Admin Routes (admin role required)

### Layout
Path: `app/admin/layout.tsx`
Responsibility: Gate via lib/auth.ts `getCurrentRole` → redirect non-admins to /account; sidebar nav
Invokes: lib/auth.ts

### Dashboard
Path: `app/admin/page.tsx`
Invokes: createAdminClient (head counts on 5 tables)

### List Views
Paths: `app/admin/{bookings,subscribers,vendors,messages}/page.tsx`
Invokes: createAdminClient (full reads, paginated to 200)

## API Routes

### Newsletter confirm
Path: `app/api/newsletter/confirm/route.ts`
Responsibility: Looks up `confirmation_token`, flips subscriber status from `pending` to `active`, redirects home with status flag
Invokes: createAdminClient

## Server Actions (not URLs but execution boundaries)

- `app/login/actions.ts` → sendMagicLink
- `app/events/[slug]/actions.ts` → createBooking
- `app/actions/newsletter.ts` → subscribeToNewsletter
- `app/vendors/apply/actions.ts` → submitVendorApplication
- `app/contact/actions.ts` → sendContactMessage

All validate input with zod, persist via createAdminClient (service-role bypass for guest input), and fire side-effect emails via lib/resend.ts.
