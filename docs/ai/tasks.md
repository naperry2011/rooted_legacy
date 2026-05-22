# Tasks

Active work. Update as items are completed and new work is identified.

## Sprint / Iteration

**Range:** 2026-05-22 to 2026-05-29
**Goal:** Ship Phase 1 MVP to production; gather client feedback; line up Phase 2.

## In Progress

- [ ] User provisions external services + sets Vercel env vars — Nicholas — waiting on Supabase SQL run, Auth redirect URLs, then Resend + Google Sheets when ready
- [ ] Smoke-test live deploy end-to-end once env vars are set — Claude (verify) — blocked on above

## Up Next

- [ ] Open PR `perry-v2 → main` and merge after local smoke test passes — small
- [ ] Rotate shared dev secrets after merge: OpenWeather, Supabase publishable + secret keys — small
- [ ] Client demo walk-through; capture feedback on ticket model + day-of-ops scope — small
- [ ] Start Phase 2 migration draft (`0002_payments.sql`) — medium
- [ ] Wire Stripe Checkout server action for ticketed events — medium
- [ ] Public vendor directory at `/vendors` (read from `vendor_profiles` after first admin approval) — small

## Blocked

- [ ] Resend confirmation emails — blocked on `RESEND_API_KEY` being provisioned
- [ ] Google Sheets produce strand — blocked on `GOOGLE_SHEETS_ID` + `GOOGLE_SERVICE_ACCOUNT_JSON` being provisioned
- [ ] Stripe ticketing — blocked on client decisions: ticket tiers, refund policy, pay-what-you-can vs fixed

## Recently Completed

- [x] Phase 1 MVP shipped on `perry-v2` (63 files, +4,418 lines) — 2026-05-22
- [x] Plan revised to MVP-first / process delivery — 2026-05-22
- [x] Branch consolidation: deleted `develop` + all `feat/*` in favor of `perry-v2` — 2026-05-22
- [x] All AI docs scaffolded — 2026-05-13

## Bugs

- _none open_

## Tech Debt

- [ ] `lib/supabase/types.ts` is hand-maintained. Switch to `supabase gen types typescript` once schema stabilizes. — Low impact until Phase 2 schema lands
- [ ] No automated tests yet. Add Vitest unit tests for `lib/sheets.ts` parsing + Playwright e2e for the RSVP flow before launch. — Medium impact
- [ ] `OPENWEATHER_API_KEY` + Supabase dev keys are in chat history. Rotate before public launch. — Medium / security
- [ ] `FEATURE_SPEC.md` is stale; consider folding into `docs/ai/roadmap.md` or deleting. — Low
- [ ] Brand tokens hard-coded as Tailwind class strings repo-wide; renaming requires text-wide find/replace. Mitigate with Tailwind `@theme` aliases if it ever becomes painful. — Low
