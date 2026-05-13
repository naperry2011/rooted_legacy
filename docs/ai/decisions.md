# Architecture Decisions

ADR log. Write entries when a decision is hard to reverse, affects multiple components, or future-you will ask "why did we do it this way?"

---

## ADR-001: Next.js 15 App Router + TypeScript + Tailwind v4

**Date:** 2026-05-11
**Status:** Accepted

**Context**
A single developer is maintaining a marketing-plus-content site that may grow into checkout, auth, and live data. We need SSR/SSG for SEO, room to add server actions later, and a styling system flexible enough to match a hand-drawn logo aesthetic.

**Decision**
Use **Next.js 15 App Router with TypeScript**, **Tailwind CSS v4** (config-in-CSS), **shadcn/ui** when component primitives are needed, **lucide-react** for icons. Host on **Vercel**.

**Consequences**
- **Positive:** zero-config deploys, RSC by default keeps client bundles small, room to grow into server actions / auth / commerce
- **Negative:** locks us into the Vercel ecosystem for the easiest path; React 19 / Next 16 lint rules are stricter than older stacks
- **Neutral:** Tailwind v4's CSS-first config differs from older muscle memory

**Alternatives considered**
- Astro — better for purely static content but worse story for future interactivity
- Squarespace / Wix — fastest live but ceiling is low; can't ship a custom weather widget or typed events list cleanly
- Eleventy + Hugo — extra context-switch for the dev; no real upside over Next

---

## ADR-002: MDX-in-repo for history; typed TypeScript for events

**Date:** 2026-05-12
**Status:** Accepted

**Context**
Two different content shapes: long-form prose (history) and structured records (events). Both could be MDX, both could be a CMS, both could be typed TypeScript. With one developer and no editorial team, the cost of a CMS isn't justified yet.

**Decision**
**History** = MDX files in `content/history/*.mdx` parsed by `lib/mdx.ts` and rendered by `next-mdx-remote/rsc`. **Events** = typed `Event[]` in `content/events.ts` with helper functions for partitioning and formatting. Both are git-tracked.

**Consequences**
- **Positive:** edits are PRs; no CMS infra; full type safety on event shape; SSG-friendly
- **Negative:** non-technical editors can't update content; future migration to a CMS will require a one-time backfill
- **Neutral:** MDX gives us React-in-markdown if we want it; the events list grows in code review

**Alternatives considered**
- Sanity / Payload — overkill for current scale
- Notion-as-CMS — fragile and slow at build
- Single MDX file per event — wouldn't capture typed metadata cleanly

---

## ADR-003: OpenWeather over Open-Meteo (and how the toggle behaves)

**Date:** 2026-05-12 (initial), 2026-05-13 (reverted to single-provider)
**Status:** Accepted

**Context**
We wanted real weather data for the farm. Open-Meteo is free and key-less; OpenWeather is free with a key (rate-limited but generous) and has slightly richer current-conditions semantics. During key activation lag we briefly ran a provider-abstraction in `lib/weather.ts` to render Open-Meteo data immediately.

**Decision**
Use **OpenWeather** as the production provider. The provider-abstraction was reverted to keep `lib/weather.ts` simple now that the key is live. `lib/weather.ts` uses `import "server-only"` and gates on `OPENWEATHER_API_KEY` — when unset, `weatherConfigured()` returns false and the UI shows graceful fallbacks instead of crashing.

**Consequences**
- **Positive:** simpler lib; clear error states; existing CurrentWeather/ForecastSlot/DailyForecast shapes can be backed by any provider if we re-add the abstraction
- **Negative:** if OpenWeather has an outage, we don't fall back automatically — we render the service-error state
- **Neutral:** the openweathermap.org icon CDN is the canonical icon source; consumers use `unoptimized` on next/image to bypass image-optimization for those URLs

**Alternatives considered**
- Keep the dual-provider dispatch — adds maintenance surface for a benefit we don't need right now
- NOAA / weather.gov — free, no key, but the API is fussier and less suited to the icon-driven UI
- Display a static climate summary — too low-value

---

## ADR-004: Header is a client component; rest of layout stays server

**Date:** 2026-05-13
**Status:** Accepted

**Context**
The mobile hamburger menu needs `useState` to toggle open/closed. The rest of the layout is happily static.

**Decision**
Mark `components/layout/Header.tsx` as `"use client"`. Footer, Logo, and all marketing components stay server components. Close-on-navigate is handled via `onClick={close}` on the mobile-panel `<Link>`s, not via a `useEffect` watching `usePathname()` — the latter trips the `react-hooks/set-state-in-effect` lint rule.

**Consequences**
- **Positive:** only a tiny client bundle for the header; everything else stays RSC
- **Negative:** any nav state additions (e.g. dropdowns) compound into the same client island
- **Neutral:** body-scroll-lock effect runs only when the menu is open, releases cleanly on close

**Alternatives considered**
- CSS-only `<details>`/checkbox hack — works but harder to a11y-instrument and theme
- Move the entire layout to client — wasteful

---

## ADR-005: Git workflow — feature branch → PR → `main`

**Date:** 2026-05-13
**Status:** Accepted (revised from original plan)

**Context**
Original plan called for a long-lived `develop` branch. In practice every feature has gone straight from a `feat/*` branch to a PR into `main` because there's only one developer and one production environment.

**Decision**
Standardize on **feature branch → PR → `main`**. Vercel auto-deploys `main`. `develop` will be deleted or fast-forwarded once verified.

**Consequences**
- **Positive:** simpler mental model; matches how the project is actually built
- **Negative:** no staging gate between feature and prod — Vercel preview deploys on PRs are the only check
- **Neutral:** can reintroduce `develop` if a second developer joins or release cadence requires it

**Alternatives considered**
- Strict GitFlow with `develop` + release branches — too heavy for one dev
- Trunk-based with no PRs — gives up the Vercel preview safety net
