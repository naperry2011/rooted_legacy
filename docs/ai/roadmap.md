# Roadmap

Forward-looking direction. Pair with tasks.md (active work) and memory.md (history).

## Vision

Rooted Legacy is the digital home of an Indianapolis urban farm at 865 N German Church Rd. The platform should make it natural for neighbors to find classes, RSVP to events, learn the history behind the work, get produce — and easy for staff to run the operation without manual spreadsheets, paper RSVPs, or scattered tools. Black-led, neighborhood-first, every feature in service of food sovereignty.

## Current Focus

**Theme:** Demo Phase 1 MVP to the client; gather feedback; start Phase 2 payments work in parallel where decisions are unblocked.
**Goals:**
1. Get Phase 1 MVP merged + deployed on Vercel with Supabase + auth working end-to-end
2. Walk the client through the demo and capture feedback on ticket model, refund policy, day-of-ops scope, and CSA pricing
3. Begin Phase 2 (Stripe + paid tickets + farm-stand checkout + CSA) once those decisions are firm

## Now

- Merge `perry-v2 → main` after the client provisions Supabase/Resend and verifies the live deploy
- Resend account + domain verification — currently blocking confirmation emails
- Google Sheets + service account — currently blocking the produce strand
- Rotate the dev Supabase + OpenWeather keys that have appeared in chat
- Client walk-through of the deployed site

## Next

- **Phase 2 — Payments + Write paths:**
  - Stripe (test mode → live) with Checkout Sessions for tickets and one-time farm-stand orders, Subscriptions for CSA
  - Migrations for ticket_types, orders, tickets, shop_orders, shop_order_items, csa_plans, csa_memberships, csa_pickups, wholesale_buyers, wholesale_orders, wholesale_order_items
  - QR-coded ticket emails on `checkout.session.completed` webhook
  - Full admin CRUD: event editor, vendor approval action that creates a `vendor_profiles` row + lights up the public directory at `/vendors`, refund flow
  - File uploads for vendor logos + gallery photos via Supabase Storage signed URLs

## Later

- **Phase 3 — Day-of operations** (scope chosen by client):
  - QR check-in (`/admin/scan`) — camera + `qr-scanner` lib
  - Live attendance dashboard via Supabase Realtime
  - Vendor day-of list with booth assignments
  - Run-of-show schedule view
- Wholesale order portal for partner stores/restaurants
- Photo essays per past event (extend gallery with `event_id`)
- Membership / supporter wall with public list of monthly donors
- Seed library + produce share calendar
- Press / media kit at `/press`

## Recently Completed

- Phase 1 MVP — Supabase + auth + RSVP + produce + recipes + newsletter + gallery + vendor + contact + admin — 2026-05-22
- Mobile-responsive pass — 2026-05-13
- OpenWeather production env var set; live weather on prod — 2026-05-13
- Events page with 3 seed events from the flyers — 2026-05-12
- Black History in Farming article — 2026-05-12
- OpenWeather integration (current + hourly + daily) — 2026-05-12
- v1 foundation (home, history, brand chrome) — 2026-05-11

## Deferred / Cancelled

- **Open-Meteo provider abstraction in `lib/weather.ts`** — built as a stopgap during OpenWeather key activation; reverted to single-provider once OpenWeather went live.
- **`develop` long-lived branch** — deleted; the workflow consolidated to a single `perry-v2` working branch off `main`.
- **`feat/*` historical branches** — deleted after merge; single working branch model adopted.
