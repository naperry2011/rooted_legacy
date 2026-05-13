# DATA_FLOW

## Home Page Render

Source: Request to `/`
Transport: Next.js App Router (RSC) with ISR (30 min)
Processor: app/page.tsx → marketing components + WeatherWidget
Storage: content/site.ts (constants); OpenWeather API (live)
Downstream Consumers: Prerendered HTML response

## Events Index Render

Source: Static request to `/events`
Transport: Next.js App Router (RSC), prerendered at build
Processor: app/events/page.tsx → content/events.ts `partitionEvents(today)`
Storage: content/events.ts (TypeScript array)
Downstream Consumers: HTML grid of EventCard components

## Event Detail Render (SSG)

Source: Request to `/events/[slug]`
Transport: Next.js App Router (RSC), prerendered via `generateStaticParams`
Processor: content/events.ts `getEvent(slug)`
Storage: content/events.ts
Downstream Consumers: HTML article page with flyer image, meta row, highlights, CTAs

## History Index Render

Source: Static request to `/history`
Transport: Next.js App Router (RSC), prerendered at build
Processor: app/history/page.tsx → lib/mdx.ts → fs.readdir(content/history)
Storage: content/history/*.mdx (frontmatter parsed by gray-matter)
Downstream Consumers: HTML list of article links

## History Article Render (SSG)

Source: Request to `/history/[slug]`
Transport: Next.js App Router (RSC), prerendered via `generateStaticParams`
Processor: lib/mdx.ts → fs.readFile → gray-matter → next-mdx-remote/rsc MDXRemote
Storage: content/history/<slug>.mdx
Downstream Consumers: HTML article page

## Weather Render

Source: Request to `/weather` or home page
Transport: Next.js App Router (RSC) with ISR (30 min) + fetch cache tag `weather`
Processor: lib/weather.ts → fetch OpenWeather → mapping to `CurrentWeather` / `ForecastSlot` / `DailyForecast`
Storage: OpenWeather `/data/2.5/weather`, `/data/2.5/forecast` (remote)
Downstream Consumers: app/weather/page.tsx (full forecast); components/weather/WeatherWidget.tsx (home)

## Site-Wide Copy / Nav

Source: content/site.ts
Transport: ES module import
Processor: Header, Footer, marketing components, layout metadata
Storage: TypeScript constants
Downstream Consumers: All routes

## Brand Assets

Source: public/brand/*
Transport: Next.js static asset pipeline (next/image for logo; `unoptimized` for OpenWeather icons)
Processor: components/brand/Logo.tsx, Hero, layout metadata, event detail
Storage: public/ directory
Downstream Consumers: Browser

## Fonts

Source: Google Fonts (Cormorant Garamond, Inter)
Transport: next/font/google (build-time fetch + self-hosted at build)
Processor: app/layout.tsx
Storage: .next/static/media
Downstream Consumers: All routes via CSS variables `--font-display`, `--font-sans`

## Environment / Secrets

Source: Vercel project env vars (production) / `.env.local` (dev)
Transport: process.env
Processor: lib/weather.ts (`OPENWEATHER_API_KEY`, optional `WEATHER_LAT` / `WEATHER_LON` / `WEATHER_UNITS`)
Storage: Vercel-managed; `.env.local` gitignored
Downstream Consumers: Server-side fetches in lib/weather.ts only
