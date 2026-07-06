# Roadmap

Forward-looking direction. Pair with tasks.md (active work) and memory.md (history).

## Vision

Rooted Legacy is the digital home of an Indianapolis urban farm at 865 N German Church Rd. The platform should make it natural for neighbors to find classes, RSVP to events, learn the history behind the work, get produce — and easy for staff to run the operation without manual spreadsheets, paper RSVPs, or scattered tools. Black-led, neighborhood-first, every feature in service of food sovereignty.

## Current Focus

**Theme:** Auth + admin CRUD shipped and live on the custom domain. Next: firm up Phase 2 payment scope.
**Goals:**
1. ✅ Authenticated admin (email+password login, invite-only onboarding, functional hardened reset)
2. ✅ Live on `https://rootedlegacyfarm.com` with branded Resend auth email
3. Decide Phase 2 payment scope (Stripe tickets / farm-stand / CSA), then build

## Now

- Firm up Phase 2 payment decisions (ticket model, refund policy, CSA pricing/cadence)
- Rotate Supabase + OpenWeather dev keys shared early on
- Optional polish: swap hardcoded vercel.app fallbacks → custom domain; kill other sessions on logged-in password change

## Next

- **Phase 2 — Payments + write paths:**
  - Stripe (test mode → live) with Checkout Sessions for tickets + farm-stand orders, Subscriptions for CSA
  - Promote `is_featured`/`price_cents` into actual paid-ticket flow for Soothing Sundays (currently shows "Tickets opening soon" placeholder)
  - Migrations for ticket_types, orders, tickets, shop_orders + items, csa_plans + memberships + pickups, wholesale_buyers + orders + items
  - QR-coded ticket emails on `checkout.session.completed` webhook
  - Remaining admin CRUD: vendor approval (promotes vendor_applications → DB-backed vendor_profiles, retiring content/vendors.ts), refund flow, gallery photo uploads (event editor + team management already shipped 2026-07)
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

- Authenticated admin: email+password login, invite-only onboarding, hardened password reset — 2026-07-05/06
- Admin Events CRUD manager (create/edit/delete + attendees + CSV) — 2026-07-05
- Custom domain `rootedlegacyfarm.com` + Resend SMTP auth email — 2026-07-06
- Profiles RLS lockdown (migration 0003) closing self-promotion — 2026-07-06
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
