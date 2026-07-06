# ENTRY_POINTS

## npm Scripts

### dev / build / start / lint

Path: `package.json`
Responsibility: Next.js dev server, prod build, prod server, ESLint
Depends On: next, tsconfig, ESLint config (incl. react-hooks rules)

## Middleware

Path: `middleware.ts`
Responsibility: Refreshes Supabase session cookies; redirects unauthenticated users from `/admin/*` and `/account/*` to `/login?next=…`
Depends On: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY

## Root Layout

Path: `app/layout.tsx`
Responsibility: HTML shell, fonts, viewport + theme color, Header + Footer, default Open Graph + Twitter card
Invokes: components/layout/{Header,Footer}.tsx, app/globals.css
Depends On: content/site.ts, next/font/google, public/gallery/grand-opening-vendors-tents.jpg (default OG image)

## Marketing Routes

### Home
Path: `app/page.tsx` (ISR 30 min)
Invokes: Hero, WhatWeDo, WhatsGrowing, WeatherWidget, LocationCard, PartnerStrip

### About / Our Story
Path: `app/about/page.tsx` (static)
Responsibility: Photo hero + mission + 3 values + CTA card linking to history article + contact
Depends On: public/gallery/grand-opening-class.jpg, content/site.ts

### Events Index
Path: `app/events/page.tsx` (ISR 5 min)
Invokes: lib/events.ts → listPublishedEvents, partitionEvents

### Event Detail
Path: `app/events/[slug]/page.tsx` (SSG when Supabase configured; dynamic otherwise; ISR 5 min)
Responsibility: Featured-event treatment when `is_featured=true` (radial glow, tagline, themes pillars, price + perks card). "From the day" photo grid pulled from `listPhotosForEvent(event.id)`. Ticketed events show a "Tickets opening soon" CTA.
Invokes: lib/events.ts (getEventBySlug, listPublishedEventSlugsForBuild, formatPriceCents); lib/gallery.ts (listPhotosForEvent); lib/auth.ts; BookingForm
Depends On: content/site.ts (partner link lookups)

### History Index / Detail
Path: `app/history/page.tsx`, `app/history/[slug]/page.tsx` (SSG)
Invokes: lib/mdx.ts; next-mdx-remote/rsc

### Recipes Index / Detail
Path: `app/recipes/page.tsx`, `app/recipes/[slug]/page.tsx` (SSG)
Invokes: lib/recipes.ts; next-mdx-remote/rsc

### Shop Index / Detail
Path: `app/shop/page.tsx` (ISR 15 min), `app/shop/[sku]/page.tsx` (dynamic)
Invokes: lib/sheets.ts; lib/recipes.ts (cross-link)

### Gallery
Path: `app/gallery/page.tsx` (ISR 5 min)
Invokes: lib/gallery.ts → listGalleryPhotos

### Weather
Path: `app/weather/page.tsx` (ISR 30 min)
Invokes: lib/weather.ts

### Contact
Path: `app/contact/page.tsx`
Invokes: ContactForm → app/contact/actions.ts → createAdminClient + sendEmail

### Vendor Directory
Path: `app/vendors/page.tsx` (static)
Responsibility: Renders long-term partners (from `site.partners`) + featured vendors (from `content/vendors.ts`) + apply CTA
Depends On: content/site.ts, content/vendors.ts, public/gallery/grand-opening-pure-trition.jpg

### Vendor Application
Path: `app/vendors/apply/page.tsx`
Invokes: VendorForm → app/vendors/apply/actions.ts → createAdminClient + sendEmail

## Auth Routes

### Login
Path: `app/login/page.tsx`
Invokes: LoginForm → app/login/actions.ts → supabase.auth.signInWithPassword (admins redirect to /admin)

### Password reset (request + confirm + update)
Paths: `app/reset-password/page.tsx` (request → resetPasswordForEmail), `app/auth/confirm/route.ts` (token_hash → verifyOtp), `app/reset-password/update/*` (isolated set-new-password → global sign-out)

### Confirm / Callback
Path: `app/auth/confirm/route.ts` (server-side verifyOtp for email links). `app/auth/callback/route.ts` is the legacy magic-link code exchange (now unused).

### Sign-out
Path: `app/auth/signout/route.ts` (303 redirect to `/`)

## Account Route

Path: `app/account/page.tsx`
Responsibility: Lists current user's RSVPs; sign-out button

## Admin Routes (admin role required)

### Layout
Path: `app/admin/layout.tsx`
Responsibility: Gate via lib/auth.ts; redirect to /reset-password/update if `pw_reset_pending`; sidebar nav

### Dashboard + read-only list views
Paths: `app/admin/page.tsx`, `app/admin/{bookings,subscribers,vendors,messages}/page.tsx`
Invokes: createAdminClient

### CRUD pages
Paths: `app/admin/events/{page,new,[id]}`, `app/admin/team/page.tsx`, `app/admin/password/page.tsx`
Invokes: createAdminClient; server actions guarded by requireAdmin

## API Routes

### Newsletter confirm
Path: `app/api/newsletter/confirm/route.ts`

## Server Actions

- `app/login/actions.ts` → signIn (email+password)
- `app/reset-password/actions.ts` → requestReset; `app/reset-password/update/actions.ts` → resetPassword
- `app/admin/events/actions.ts` → upsertEvent / deleteEvent / cancelBooking
- `app/admin/team/actions.ts` → createTeamMember / revokeMember
- `app/admin/password/actions.ts` → updatePassword
- `app/events/[slug]/actions.ts` → createBooking
- `app/actions/newsletter.ts` → subscribeToNewsletter
- `app/vendors/apply/actions.ts` → submitVendorApplication
- `app/contact/actions.ts` → sendContactMessage

All validate input with zod, persist via createAdminClient (service-role bypass for guest input), and fire side-effect emails via lib/resend.ts.
