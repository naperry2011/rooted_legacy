# Tasks

Active work. Update as items are completed and new work is identified.

## Sprint / Iteration

**Range:** 2026-05-22 to 2026-05-29
**Goal:** Wrap Phase 1 MVP, get image assets in, walk client through demo, line up Phase 2.

## In Progress

- [ ] User saves the 5 image files + commits — Nicholas
  - `public/brand/flyer_soothing_sundays.jpg`
  - `public/gallery/grand-opening-class.jpg`
  - `public/gallery/grand-opening-vendors-tents.jpg`
  - `public/gallery/grand-opening-vendors-row.jpg`
  - `public/gallery/grand-opening-pure-trition.jpg`

## Up Next

- [ ] Verify Vercel deploy renders fully once images land (Soothing Sundays flair, "From the day" gallery, /about hero, Pure-trition card, default OG) — Claude
- [ ] Open PR `perry-v2 → main` and merge — small
- [ ] Rotate Supabase publishable + secret keys + OpenWeather key in Vercel after merge — small
- [ ] Client demo walk-through — small
- [ ] Decide Phase 2 ticket model (free RSVP vs paid vs tiered vs pay-what-you-can) — decision only
- [ ] Decide refund policy — decision only
- [ ] Decide CSA pricing + cadence — decision only
- [ ] Decide day-of-ops scope — decision only

## Blocked

- [ ] Resend confirmation emails — blocked on `RESEND_API_KEY`
- [ ] Google Sheets produce strand — blocked on `GOOGLE_SHEETS_ID` + `GOOGLE_SERVICE_ACCOUNT_JSON`
- [ ] Stripe ticketing — blocked on client ticket-model decisions

## Recently Completed

- [x] About page with class-photo hero + 3-value strip — 2026-05-22
- [x] /vendors directory + Pure-trition card — 2026-05-22
- [x] Default OG image switched to community photo + Twitter card — 2026-05-22
- [x] Soothing Sundays event + featured-event flair (schema + detail page) — 2026-05-22
- [x] Event photos linked via event_id; "From the day" grid on event detail — 2026-05-22
- [x] Bodi Buzz partner enrichment (services, tagline, IG, email) — 2026-05-22
- [x] Plan revised to MVP-first / process delivery — 2026-05-22
- [x] Phase 1 MVP shipped on `perry-v2` (63 files, +4,418 lines) — 2026-05-22
- [x] Branch consolidation — 2026-05-22

## Bugs

- _none open_

## Tech Debt

- [ ] `lib/supabase/types.ts` hand-maintained — drifts every migration. Switch to `supabase gen types typescript` once Phase 2 schema stabilizes. Medium impact.
- [ ] No automated tests yet. Add Vitest unit tests for `lib/sheets.ts` parsing + Playwright e2e for the RSVP flow before launch. Medium impact.
- [ ] Dev keys (Supabase, OpenWeather) in chat history. Rotate before public launch. Medium / security.
- [ ] `FEATURE_SPEC.md` is stale; consider folding into `docs/ai/roadmap.md` or deleting. Low impact.
- [ ] `content/vendors.ts` is a typed array MVP placeholder; in Phase 2 promote to DB-backed `vendor_profiles` so admin can approve applications → directory. Low impact for now.
- [ ] `gallery_photos.path` column overloads `/public/...` and Supabase Storage paths. Add a `source` enum in Phase 2 or normalize via a stricter resolver. Low.
- [ ] "Tickets opening soon" CTA on Soothing Sundays is a placeholder until Stripe ships. Make sure it doesn't ship to prod without a real flow if the event date approaches. Medium / time-sensitive.
- [ ] Brand tokens hard-coded as Tailwind class strings repo-wide. Low.
