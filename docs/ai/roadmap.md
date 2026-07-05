# Roadmap

Forward-looking direction. Pair with tasks.md (active work) and memory.md (history).

## Vision

Rooted Legacy is the digital home of an Indianapolis urban farm at 865 N German Church Rd. The platform should make it natural for neighbors to find classes, RSVP to events, learn the history behind the work, get produce — and easy for staff to run the operation without manual spreadsheets, paper RSVPs, or scattered tools. Black-led, neighborhood-first, every feature in service of food sovereignty.

## Current Focus

**Theme:** Wrap Phase 1 MVP, get image assets on disk, walk the client through the demo, kick off Phase 2.
**Goals:**
1. Get the 5 missing image files saved + committed; verify Vercel deploy renders fully
2. Client demo walk-through; capture feedback on ticket model, refund policy, day-of-ops scope, CSA pricing
3. Begin Phase 2 (Stripe + paid tickets + farm-stand checkout + CSA + admin CRUD) once decisions are firm

## Now

- User saves grand-opening-*.jpg (4 files) to `public/gallery/` and `flyer_soothing_sundays.jpg` to `public/brand/`, commits + pushes
- Verify deploy: Soothing Sundays detail page renders flair, Grand Opening shows "From the day" gallery, /about hero shows the class photo, /vendors shows Pure-trition truck
- Merge `perry-v2 → main`
- Rotate Supabase + OpenWeather dev keys after merge
- Client walk-through; capture feedback

## Next

- **Phase 2 — Payments + write paths:**
  - Stripe (test mode → live) with Checkout Sessions for tickets + farm-stand orders, Subscriptions for CSA
  - Promote `is_featured`/`price_cents` into actual paid-ticket flow for Soothing Sundays (currently shows "Tickets opening soon" placeholder)
  - Migrations for ticket_types, orders, tickets, shop_orders + items, csa_plans + memberships + pickups, wholesale_buyers + orders + items
  - QR-coded ticket emails on `checkout.session.completed` webhook
  - Full admin CRUD: event editor, vendor approval (promotes from vendor_applications → DB-backed vendor_profiles, retiring content/vendors.ts), refund flow, gallery photo uploads
  - File uploads for vendor logos + gallery photos via Supabase Storage signed URLs

## Later

- **Phase 3 — Day-of operations** (scope picked by client):
  - QR check-in (`/admin/scan`) — camera + `qr-scanner` lib
  - Live attendance dashboard via Supabase Realtime
  - Vendor day-of list with booth assignments
  - Run-of-show schedule view
- Wholesale order portal for partner stores/restaurants
- Photo essays per past event (deeper "From the day" treatment)
- Membership / supporter wall with public list of monthly donors
- Seed library + produce share calendar
- Press / media kit at `/press`
- Newsletter broadcast composer in admin (currently sent manually via Resend dashboard)

## Recently Completed

- Soothing Sundays event + featured-event flair (event schema + detail page treatment) — 2026-05-22
- Event photo linkage ("From the day" on event detail) — 2026-05-22
- `/about` page with photo hero + values + history CTA — 2026-05-22
- `/vendors` directory featuring Pure-trition — 2026-05-22
- Default OG image (community photo) + Twitter card — 2026-05-22
- Bodi Buzz partner enrichment (tagline, services, IG, email) — 2026-05-22
- Phase 1 MVP — Supabase + auth + RSVP + produce + recipes + newsletter + gallery + vendor + contact + admin — 2026-05-22
- Mobile-responsive pass — 2026-05-13
- Events page + Black History in Farming + OpenWeather — 2026-05-12
- v1 foundation — 2026-05-11

## Deferred / Cancelled

- **Open-Meteo provider abstraction** — built then reverted once OpenWeather went live.
- **`develop` long-lived branch + `feat/*` branches** — deleted in favor of a single `perry-v2` working branch.
- **Home-page "From the land" photo strip** — user passed on this one in favor of the About page hero and vendor directory.
