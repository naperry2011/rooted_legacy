# Roadmap

Forward-looking direction. Pair with tasks.md (active work) and memory.md (history).

## Vision

Rooted Legacy is the digital home of an Indianapolis urban farm at 865 N German Church Rd. The site should make it easy for neighbors to find classes, attend events, learn the history behind the work, and eventually buy produce — while honoring the Black agricultural lineage the farm sits in.

## Current Focus

**Theme:** v1 brand + content surface online, mobile-first
**Goals:**
1. Ship a polished, mobile-responsive marketing surface (home, events, history, weather) — done
2. Get production deploy stable and fully configured on Vercel — in progress (mobile PR pending merge, env vars set)
3. Decide what feature ships next based on real visitor / partner needs

## Now

- Merge `feat/mobile-responsive` → `main`; verify Vercel preview on a real phone
- Rotate the shared OpenWeather API key

## Next

- **Classes**: dedicated `/classes` route — schedule + registration. Currently a "coming soon" item in nav.
- **Donations**: simple Stripe-hosted donate flow surfaced on event detail pages and a `/support` route. The Grand Opening flyer already had a "DONATE" CTA, so visitor expectation exists.
- **Second history article**: profile of a local grower or technique (composting, season extension, native plantings).

## Later

- **Shop / produce ordering**: real checkout. Probably Stripe + a thin product list in TypeScript first, headless commerce only if catalog grows.
- **Email capture / newsletter**: low-effort mailing list before a full subscription model.
- **Headless CMS**: only if a non-technical editor joins the project. MDX-in-repo is fine until then.
- **Class registration**: integrates with `/classes`; needs accounts or magic links.
- **Photo essays / gallery**: visual story of events on the land.

## Recently Completed

- Mobile-responsive pass across all routes — 2026-05-13
- OpenWeather production env var set; live weather rendering on prod — 2026-05-13
- Events page with three seed events (Grand Opening, Earth Day, Values & Ethics) — 2026-05-12
- "Black History in Farming" article — 2026-05-12
- OpenWeather integration (current + hourly + daily) with home widget — 2026-05-12
- v1 foundation (home, history, brand chrome) — 2026-05-11

## Deferred / Cancelled

- **Open-Meteo provider abstraction in `lib/weather.ts`** — built and merged as a stopgap while the OpenWeather key activated, then reverted to single-provider OpenWeather to keep the lib simple. Could be reintroduced if API reliability becomes an issue.
- **`develop` long-lived branch** — created in the original git workflow but in practice every feature has gone through PRs straight into `main`. Will likely be deleted or repurposed.
