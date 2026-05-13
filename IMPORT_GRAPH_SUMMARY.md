# IMPORT_GRAPH_SUMMARY

## Core Dependency Nodes

- content/site.ts — imported by app/layout.tsx, components/layout/{Header,Footer}.tsx, components/marketing/*, app/weather/page.tsx
- content/events.ts — imported by app/events/page.tsx, app/events/[slug]/page.tsx, components/events/EventCard.tsx
- lib/mdx.ts — imported by both history routes (index + [slug])
- lib/weather.ts — imported by app/weather/page.tsx and components/weather/WeatherWidget.tsx
- app/globals.css — imported once by app/layout.tsx; defines brand tokens consumed via Tailwind utility classes across every component
- components/brand/Logo.tsx — imported by Header and Hero
- next-mdx-remote/rsc — sole MDX renderer; only consumer is app/history/[slug]/page.tsx

## Path Alias

- `@/*` (tsconfig.json) → repo root; used by every component/route import

## Server-Only Boundaries

- lib/weather.ts uses `import "server-only"` — must never be imported from a `"use client"` module
- components/weather/WeatherWidget.tsx is a server component; safe consumer of lib/weather.ts

## Client Components

- components/layout/Header.tsx (`"use client"`) — holds the mobile menu state

## Potential Refactor Risk Areas

- content/site.ts (high fan-in; nav shape changes ripple into Header desktop + mobile branches)
- content/events.ts (typed Event shape used by index, detail, card, and partition function — schema change touches 4 files)
- app/globals.css (token names hard-coded into Tailwind class strings repo-wide; renaming a token requires text-wide updates)
- lib/weather.ts (single source of truth for OpenWeather mapping; CurrentWeather/ForecastSlot/DailyForecast shapes are consumed by both home widget and `/weather`)
- app/history/[slug]/page.tsx (couples MDX rendering, metadata, SSG params, and typography overrides in one file)

## Notes

- No circular dependencies detected.
- No barrel files; each component imported from its own path.
- Pure tree: pages → components → content/lib; no upward imports.
