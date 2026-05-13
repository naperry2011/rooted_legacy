# ENTRY_POINTS

## Next.js Dev Server

Path: `package.json` script `dev` → `next dev`
Responsibility: Local development server with HMR
Invokes: app/layout.tsx → all app/** routes
Depends On: next, react, react-dom, tailwindcss

## Next.js Production Build

Path: `package.json` script `build` → `next build`
Responsibility: Produces optimized output (.next/), prerenders static routes and SSG slugs
Invokes: app/**, lib/mdx.ts, lib/weather.ts, content/**
Depends On: TypeScript, Tailwind v4, next-mdx-remote, gray-matter

## Next.js Production Server

Path: `package.json` script `start` → `next start`
Responsibility: Serves built output
Invokes: .next/ artifacts
Depends On: build output

## Lint

Path: `package.json` script `lint` → `eslint`
Responsibility: Static analysis (includes react-hooks rules)
Invokes: eslint.config.mjs
Depends On: eslint-config-next

## Root Layout (Implicit Entry per Request)

Path: app/layout.tsx
Responsibility: HTML shell, fonts, viewport + theme metadata, brand chrome (Header, Footer)
Invokes: components/layout/Header.tsx, components/layout/Footer.tsx, app/globals.css
Depends On: content/site.ts, next/font/google

## Home Route

Path: app/page.tsx
Responsibility: Marketing landing page composition with embedded WeatherWidget
Invokes: components/marketing/{Hero,WhatWeDo,LocationCard,PartnerStrip}.tsx, components/weather/WeatherWidget.tsx
Depends On: content/site.ts, lib/weather.ts (transitively)
Revalidate: 1800s (inherited via WeatherWidget fetch)

## Events Index Route

Path: app/events/page.tsx
Responsibility: Lists upcoming and past events from `content/events.ts`
Invokes: content/events.ts → `partitionEvents()`; components/events/EventCard.tsx
Depends On: TypeScript event data only (no I/O)

## Event Detail Route (SSG)

Path: app/events/[slug]/page.tsx
Responsibility: Renders a single event with flyer, meta, highlights, partners, directions
Invokes: content/events.ts → `getEvent()`, `events` (for `generateStaticParams`)
Depends On: public/brand/flyer_*.jpg

## History Index Route

Path: app/history/page.tsx
Responsibility: Lists MDX articles
Invokes: lib/mdx.ts → listHistoryArticles()
Depends On: content/history/*.mdx

## History Article Route (SSG)

Path: app/history/[slug]/page.tsx
Responsibility: Renders a single MDX article; supplies generateStaticParams + generateMetadata
Invokes: lib/mdx.ts → historySlugs(), getHistoryArticle(); next-mdx-remote/rsc MDXRemote
Depends On: content/history/*.mdx, gray-matter

## Weather Route

Path: app/weather/page.tsx
Responsibility: Renders current conditions, 24h hourly, and 5-day outlook; graceful "Not configured" / service-error states
Invokes: lib/weather.ts → getCurrent(), getHourly(), getDaily(), weatherConfigured()
Depends On: OPENWEATHER_API_KEY env var; OpenWeather `/data/2.5/*` endpoints
Revalidate: 1800s
