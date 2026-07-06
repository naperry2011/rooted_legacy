# Tasks

Active work. Update as items are completed and new work is identified.

## Sprint / Iteration

**Range:** 2026-07-05 to 2026-07-12
**Goal:** Ship the authenticated-admin experience (login, invite-only onboarding, functional reset) and go live on the custom domain. ✅ Done.

## In Progress

- [ ] Refresh AI docs to reflect the auth overhaul — Claude (this task)

## Up Next

- [ ] Decide Phase 2 payment scope (Stripe tickets vs farm-stand vs CSA) — decision only
- [ ] Optionally swap hardcoded `rooted-legacy-phi.vercel.app` fallbacks → `rootedlegacyfarm.com`
- [ ] Optionally also kill other sessions on the logged-in `/admin/password` change
- [ ] Provision Google Sheets (produce) + Supabase Storage `gallery` bucket when ready

## Blocked

- [ ] Stripe ticketing — blocked on client ticket-model decisions

## Recently Completed

- [x] Send admins to `/admin` on login + "Admin" header link — 2026-07-06
- [x] Hardened password reset: `/auth/confirm` token_hash, isolated update page, global sign-out — 2026-07-06
- [x] Custom domain `rootedlegacyfarm.com` + Resend SMTP for auth email — 2026-07-06
- [x] Invite-only admin onboarding (`/admin/team`) + migration 0003 (RLS lockdown + profiles.email) — 2026-07-06
- [x] Password setup/change page + forgot-password flow — 2026-07-05
- [x] Email + password login (replaced magic link) + logout 405 fix — 2026-07-05
- [x] Header Log in / Account / Log out controls — 2026-07-05
- [x] Admin Events manager (CRUD + attendees + CSV) — 2026-07-05
- [x] Deleted the tangled `perry-v2` branch; adopted branch-fresh-off-main workflow — 2026-07-06

## Bugs

- _none open_

## Tech Debt

- [ ] `lib/supabase/types.ts` still hand-maintained (now includes `profiles.email`) — switch to `supabase gen types typescript` once schema stabilizes. Medium.
- [ ] No automated tests. Add Vitest for `lib/sheets.ts` + Playwright e2e for login/reset before wider launch. Medium.
- [ ] Rotate Supabase + OpenWeather dev keys shared early in chat. Medium / security.
- [ ] Hardcoded `rooted-legacy-phi.vercel.app` fallbacks in a few server actions — swap to custom domain. Low.
- [ ] `content/vendors.ts` still a typed-array MVP placeholder — promote to DB `vendor_profiles` in Phase 2. Low.
- [ ] "Tickets opening soon" CTA on featured events is a placeholder until Stripe ships. Medium / time-sensitive.
