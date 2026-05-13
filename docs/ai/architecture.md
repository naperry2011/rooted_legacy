# Architecture

System design at a glance. Pair with CODE_MAP.md (file map) and DATA_FLOW.md (system flows).

## System Overview

Rooted Legacy is a content-driven marketing site for an Indianapolis urban farm. It serves a handful of mostly-static pages (home, events, history) and one live-data page (weather) backed by OpenWeather. Traffic is single-digit-to-low-double-digit visitors per day; no database, no auth.

**Style:** Static + ISR (Next.js App Router, RSC)
**Hosting:** Vercel (production: https://rooted-legacy-phi.vercel.app)

## Core Components

### Site Shell
- **Responsibility:** HTML document, fonts, brand chrome (header w/ mobile menu, footer), viewport metadata
- **Tech:** Next.js App Router, server components except Header (client for mobile toggle)
- **Key files:** `app/layout.tsx`, `components/layout/{Header,Footer}.tsx`, `components/brand/Logo.tsx`, `app/globals.css`
- **Depends on:** `content/site.ts`, Google Fonts

### Marketing Home
- **Responsibility:** Landing page composition — hero, what we do, weather widget, location, partners
- **Tech:** Server components only; revalidates every 30 min via the weather widget's fetch
- **Key files:** `app/page.tsx`, `components/marketing/*`, `components/weather/WeatherWidget.tsx`
- **Depends on:** `content/site.ts`, `lib/weather.ts` (transitively)

### Events
- **Responsibility:** Upcoming/past event list, per-event detail page with flyer, meta, highlights, CTAs
- **Tech:** Server components; SSG via `generateStaticParams`; data is a typed TypeScript array
- **Key files:** `app/events/page.tsx`, `app/events/[slug]/page.tsx`, `components/events/EventCard.tsx`, `content/events.ts`
- **Depends on:** `public/brand/flyer_*.jpg`, Google Maps (link-out)

### History
- **Responsibility:** MDX-driven long-form articles, index + per-article rendering with custom typography
- **Tech:** `next-mdx-remote/rsc`, `gray-matter` for frontmatter, filesystem at build
- **Key files:** `app/history/page.tsx`, `app/history/[slug]/page.tsx`, `lib/mdx.ts`, `content/history/*.mdx`
- **Depends on:** Build-time filesystem; no runtime I/O

### Weather
- **Responsibility:** Current conditions + 24h hourly + 5-day forecast for the farm coordinates, plus a small home widget
- **Tech:** Server-only fetch (`import "server-only"`), Next.js fetch cache with 30-minute revalidate and `weather` tag; graceful "Not configured" + service-error states
- **Key files:** `lib/weather.ts`, `app/weather/page.tsx`, `components/weather/WeatherWidget.tsx`
- **Depends on:** OpenWeather `/data/2.5/weather` and `/data/2.5/forecast`; `OPENWEATHER_API_KEY` env var

### Brand Tokens
- **Responsibility:** Color palette derived from the logo, font CSS variables, paper-grain utility, `overflow-x: hidden` safety
- **Tech:** Tailwind v4 `@theme` block in `app/globals.css`
- **Key files:** `app/globals.css`
- **Depends on:** Nothing; consumed everywhere via utility classes

## Data Flow (Critical Path)

1. **Request** hits Vercel edge
2. **Next.js App Router** dispatches to the matching route segment
3. For data-driven segments:
   - `/` and `/weather` → `lib/weather.ts` → `fetch(OpenWeather)` with `next.revalidate: 1800` and `tags: ["weather"]`
   - `/events*` → in-memory read of `content/events.ts`
   - `/history*` → `lib/mdx.ts` → `fs.readFile` + `gray-matter` (build-time only — these are SSG)
4. **RSC** renders the React tree (server) and streams HTML
5. **Client hydration** — only `Header` ships interactive JS

## Data Stores

- **None local.** All "data" is either typed TypeScript constants in `content/` or MDX files in `content/history/`.
- **Remote:** OpenWeather API for live conditions and forecast.

## External Integrations

- **OpenWeather** — weather data (current + forecast), free tier
- **Vercel** — hosting and CI/CD
- **GitHub** — source-of-truth code repo at https://github.com/naperry2011/rooted_legacy
- **Google Fonts** — Cormorant Garamond (display), Inter (body); self-hosted at build via `next/font/google`
- **Google Maps** — directions link-outs only (no embed key)

## Security Boundaries

- **Server-only weather fetch:** `lib/weather.ts` carries `import "server-only"` so the API key cannot leak into a client bundle by accident.
- **Secrets:** `OPENWEATHER_API_KEY` lives in Vercel project env vars (production) and `.env.local` (dev). `.env*` is gitignored except for `.env.example` which is allowlisted and has no values.
- **No user input** anywhere yet — no forms, no auth, no DB. When that changes, this section needs an update (CSRF, rate-limit, etc.).

## Known Constraints / Trade-offs

- **No CMS** — content is edited via PRs. Fine for one dev; will require a CMS or admin UI when an editorial team joins.
- **Free-tier OpenWeather** — rate-limited to 60 calls/min, 1M/month. With 30-minute revalidate we use < 50 calls/day per cache shard — way under the cap.
- **Single revalidate strategy (30 min)** — fresh enough for a marketing site; not suitable for severe-weather alerts. Add `on-demand revalidation` if real-time matters.
- **No tests yet** — acceptable for static marketing; introduce Vitest + Playwright before any interactive feature ships.
- **`overflow-x: hidden`** on html/body hides horizontal scroll *and* hides any genuine overflow bug. Re-evaluate if we need horizontal scroll patterns.
