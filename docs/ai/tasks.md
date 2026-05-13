# Tasks

Active work. Update as items are completed and new work is identified.

## Sprint / Iteration

**Range:** 2026-05-11 to 2026-05-17
**Goal:** Ship mobile-responsive v1 to production, decide on the next feature

## In Progress

- [ ] Merge `feat/mobile-responsive` → `main` and verify Vercel deploy on a phone — Nicholas — PR open

## Up Next

- [ ] Rotate the OpenWeather API key currently in `.env.local` (it's in chat history) — small
- [ ] Decide the next feature: Classes vs. Donations vs. second History article — small (decision only)
- [ ] Delete or repurpose stale `develop` branch — trivial

## Blocked

- _none_

## Recently Completed

- [x] Full mobile-responsive pass (hamburger menu, weather 5-day grid, stacked CTAs) — 2026-05-13
- [x] Set `OPENWEATHER_API_KEY` in Vercel project env vars — 2026-05-13
- [x] Add Open-Meteo provider, then revert to OpenWeather only — 2026-05-12
- [x] Add OpenWeather integration (`/weather` + home widget) — 2026-05-12
- [x] Build `/events` index + 3 detail pages from flyer set — 2026-05-12
- [x] Write "Black History in Farming" MDX article — 2026-05-12
- [x] Scaffold Next.js 15 + Tailwind v4 foundation — 2026-05-11

## Bugs

- _none open_

## Tech Debt

- [ ] `develop` branch never caught up to `main`; workflow has shifted to PRs straight into `main`. Either delete `develop` or fast-forward it. — Low impact
- [ ] No automated tests (unit, e2e, or visual). For v1 marketing surface this is fine; revisit before adding interactive features (registration, checkout). — Medium impact when dynamic features land
- [ ] Brand tokens are referenced as Tailwind utility strings repo-wide; a rename requires text-wide find/replace. Could be partly mitigated by Tailwind's semantic `@theme` aliases. — Low impact
- [ ] FEATURE_SPEC.md predates the events/weather build and reads as forward-looking; rewrite or split into "what shipped" vs "what's planned" (overlap with roadmap.md). — Low impact
