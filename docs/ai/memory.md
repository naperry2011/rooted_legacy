# Project Memory

Running history of what's been built and current state. Update after major changes.

## Current State

**Status:** Active Development
**Last Updated:** 2026-05-13
**Version:** main @ `27152ca` (feat/mobile-responsive @ `87495dc` pending PR)

### What's Working
- Marketing home with hero, "What we do", farm location, partners
- Events: index at `/events` + 3 SSG detail pages (Grand Opening, Earth Day, Values & Ethics) with flyer imagery, partition into upcoming/past
- History: MDX-driven articles at `/history` and `/history/[slug]` — currently 2 articles (welcome, Black history in farming)
- Weather: full forecast at `/weather` (current + 24h + 5-day) and home widget, both via OpenWeather with 30-minute ISR
- Mobile responsive across all pages (hamburger menu, stacked hero, weather 5-day grid template, stacked CTAs)
- Deployed at https://rooted-legacy-phi.vercel.app/, auto-deploys from `main`

### Known Issues
- `feat/mobile-responsive` not yet merged into `main` — PR open at https://github.com/naperry2011/rooted_legacy/pull/new/feat/mobile-responsive
- `develop` branch is stale (still at "the foundation" commit) — the working flow has shifted to feature-branch → PR → `main`
- The OpenWeather API key currently in use was shared in chat history; should be rotated

### In Progress
- Mobile responsive PR awaiting merge

## Implementation History

### 2026-05-11 — Foundation
**What was built:** Next.js 15 + Tailwind v4 + TypeScript scaffold; brand tokens from logo; home (Hero / WhatWeDo / LocationCard / PartnerStrip); MDX-driven history at `/history`; site shell (Header, Footer, Logo)
**Why:** v1 marketing surface for an Indianapolis urban farm
**Files affected:** app/**, components/**, content/site.ts, content/history/welcome.mdx, public/brand/*

### 2026-05-12 — Events, Black-history article, Weather
**What was built:** `/events` index + 3 detail pages (typed list in `content/events.ts`); MDX article "Black History in Farming"; OpenWeather integration (`lib/weather.ts`, `/weather` page, home widget); Open-Meteo provider added as a temporary no-key fallback then removed once OpenWeather key activated; nav exposed Events / History / Weather as live
**Why:** Build out the three core content surfaces and add a useful real-time data widget
**Files affected:** app/events/**, app/weather/**, components/{events,weather}/*, lib/weather.ts, content/events.ts, content/history/black-history-in-farming.mdx, .env.example, .gitignore

### 2026-05-13 — Mobile responsive pass
**What was built:** Hamburger menu under `md`; viewport meta + theme color; weather 5-day list refactored from fixed-width flex to a grid template to prevent overflow; stacked CTAs and tightened typography on small screens across hero, events, history, weather; `overflow-x: hidden` safety net on html/body
**Why:** Initial deploy didn't fit phone screens cleanly
**Files affected:** app/layout.tsx, app/globals.css, app/{events,history,weather}/**, components/{layout,marketing,events,weather}/*

## Architecture Evolution

Static-first Next.js App Router app. Most routes are prerendered at build time; `/` and `/weather` carry a 30-minute revalidate because they hit OpenWeather server-side. Content is split by type: typed TypeScript constants (`content/site.ts`, `content/events.ts`) for structured data, MDX files (`content/history/*.mdx`) for long-form prose. No database, no auth, no admin UI by design — single dev maintains. Hosted on Vercel; secrets live in Vercel env vars (gitignored `.env.local` for dev). See architecture.md for detail.

## Lessons Learned

- OpenWeather keys take "up to a couple hours" to activate after signup, independent of email verification — both keys generated under a new account stayed 401 until the account-side timer flipped. Don't waste time generating new keys; just wait.
- Vercel never sees `.env.local`. Setting `OPENWEATHER_API_KEY` in the Vercel dashboard is a separate, mandatory step after `.env.local` works locally.
- React 19 / Next 16 lint flags `setState` calls in `useEffect` bodies — replace pathname-watching close-on-route-change with `onClick` handlers on the Links themselves.
- Tailwind utility classes referencing fixed widths (`w-16`, `w-12`) in a flex row will quietly overflow on phones — a `grid-template-columns` recipe is more predictable.
