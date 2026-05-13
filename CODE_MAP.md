# CODE_MAP

## Site Shell (Layout + Branding)

Category: UI

Primary Files:
- app/layout.tsx
- components/layout/Header.tsx
- components/layout/Footer.tsx
- components/brand/Logo.tsx
- app/globals.css

Supporting Files:
- content/site.ts
- public/brand/* (logo + reference imagery)

External Integrations:
- Google Fonts (Cormorant Garamond, Inter)

Entry Points:
- Wraps every route as Root Layout

Notes:
- Header is a client component with a hamburger menu under `md`.

## Marketing Home

Category: UI

Primary Files:
- app/page.tsx
- components/marketing/Hero.tsx
- components/marketing/WhatWeDo.tsx
- components/marketing/LocationCard.tsx
- components/marketing/PartnerStrip.tsx

Supporting Files:
- content/site.ts
- components/weather/WeatherWidget.tsx (embedded on home)
- public/brand/rooted_legacy_logo.jpg

External Integrations:
- Google Maps (link-out only)
- OpenWeather (via WeatherWidget)

Entry Points:
- `/` (Next.js App Router static route; revalidates every 30 min due to WeatherWidget)

## Events

Category: UI

Primary Files:
- app/events/page.tsx
- app/events/[slug]/page.tsx
- components/events/EventCard.tsx
- content/events.ts

Supporting Files:
- public/brand/flyer_*.jpg
- public/brand/partner_cre8tive.jpg

External Integrations:
- Google Maps (directions link)

Entry Points:
- `/events`
- `/events/[slug]` (SSG via `generateStaticParams`)

## History (MDX Content)

Category: UI

Primary Files:
- app/history/page.tsx
- app/history/[slug]/page.tsx
- lib/mdx.ts
- content/history/*.mdx

Supporting Files:
- content/site.ts

External Integrations:
- None

Entry Points:
- `/history`
- `/history/[slug]` (SSG via `generateStaticParams`)

## Weather

Category: Service + UI

Primary Files:
- app/weather/page.tsx
- components/weather/WeatherWidget.tsx
- lib/weather.ts

Supporting Files:
- content/site.ts (address used in metadata + header)

External Integrations:
- OpenWeather `/data/2.5/weather` and `/data/2.5/forecast` (free tier)

Entry Points:
- `/weather` (revalidates every 30 min)
- Home page widget (server component)

## Build / Tooling

Category: Infra

Primary Files:
- package.json
- tsconfig.json
- next.config.ts
- eslint.config.mjs
- postcss.config.mjs

Supporting Files:
- .env.example
- .gitignore (allowlists `.env.example`, ignores `.env.local`)

External Integrations:
- Vercel (production host — auto-deploys from `main`)

Entry Points:
- `npm run dev` / `npm run build` / `npm run start` / `npm run lint`

## Documentation

Category: Other

Primary Files:
- README.md
- FEATURE_SPEC.md
- CODE_MAP.md, ENTRY_POINTS.md, DATA_FLOW.md, IMPORT_GRAPH_SUMMARY.md, FEATURE_BOUNDARIES.md
- docs/ai/memory.md, roadmap.md, tasks.md, decisions.md, architecture.md
- llms.txt

Supporting Files:
- SuperGarden.txt (original brainstorm — kept as historical artifact)

External Integrations:
- None

Entry Points:
- None
