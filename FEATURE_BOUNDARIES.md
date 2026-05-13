# FEATURE_BOUNDARIES

## Site Shell (app/layout.tsx + components/layout/*)

Owns: HTML document, font variables, header (desktop + mobile menu), footer, root metadata, viewport + theme color
Does NOT Own: Page bodies, MDX rendering, route-specific metadata, weather/event data
Communicates With: content/site.ts (nav, partners, address); app/globals.css (tokens)
Isolation Level: Strong

## Marketing Home (app/page.tsx + components/marketing/*)

Owns: Hero, WhatWeDo, LocationCard, PartnerStrip composition for `/`
Does NOT Own: Weather data (uses WeatherWidget but doesn't fetch), history content, layout chrome, persistence
Communicates With: content/site.ts; public/brand/*; components/weather/WeatherWidget.tsx (embed)
Isolation Level: Strong

## Events (app/events/* + components/events/* + content/events.ts)

Owns: Typed event list, upcoming/past partitioning, formatting helpers, EventCard, index + detail rendering, SSG slug generation
Does NOT Own: Calendar persistence, RSVP, ticketing (no CMS or DB yet)
Communicates With: public/brand/flyer_*.jpg; Google Maps (directions link)
Isolation Level: Strong

## History (app/history/* + lib/mdx.ts + content/history/*)

Owns: MDX discovery, frontmatter parsing, article listing, article rendering, SSG slug generation, article-page typography overrides
Does NOT Own: Layout chrome, runtime content editing (no CMS), events
Communicates With: content/history/*.mdx (filesystem); next-mdx-remote/rsc
Isolation Level: Strong

## Weather (app/weather/* + components/weather/* + lib/weather.ts)

Owns: OpenWeather fetch + mapping, ISR cache (30 min via `next.revalidate`), configured/unreachable fallback states, current + hourly + daily UI, home widget
Does NOT Own: Auth, env-var validation beyond presence check, weather alerts
Communicates With: OpenWeather API; `OPENWEATHER_API_KEY` + optional lat/lon env vars
Isolation Level: Strong (server-only via `import "server-only"` in lib)

## Brand Tokens (app/globals.css)

Owns: CSS custom properties for color, font variables, paper-grain utility, base background gradients, `overflow-x: hidden` safety
Does NOT Own: Component markup, font loading (handled by app/layout.tsx)
Communicates With: Every Tailwind utility class referencing `bg-*`, `text-*`, `border-*` tokens
Isolation Level: Moderate (shared vocabulary across all UI files)

## Site Copy (content/site.ts)

Owns: Org name, tagline, description, URL, address, socials, partners, nav structure (with `live` flag per item)
Does NOT Own: Event data, history articles, weather data, rendered markup, styling
Communicates With: Layout shell + all marketing components + weather page header
Isolation Level: Moderate (broad fan-in)

## MDX Loader (lib/mdx.ts)

Owns: Filesystem access for content/history/, frontmatter typing, slug enumeration
Does NOT Own: MDX→HTML rendering (delegated to next-mdx-remote/rsc), styling, event content
Communicates With: app/history/page.tsx, app/history/[slug]/page.tsx
Isolation Level: Strong

## Brand Assets (public/brand/*)

Owns: Logo, flyer images (Earth Day, Grand Opening, partner Cre8tive)
Does NOT Own: Image rendering logic, alt text (defined in consumers)
Communicates With: components/brand/Logo.tsx, Hero, event detail page, layout metadata
Isolation Level: Strong

## Build / Tooling (package.json, next.config.ts, tsconfig.json, eslint.config.mjs, postcss.config.mjs)

Owns: Dependency graph, scripts, TypeScript config, ESLint (incl. react-hooks rules), PostCSS/Tailwind v4 wiring, path alias `@/*`
Does NOT Own: Runtime behavior, brand tokens, content
Communicates With: All source files (compile-time)
Isolation Level: Strong

## Deployment (Vercel)

Owns: Production hosting, environment variables (`OPENWEATHER_API_KEY` etc.), automatic deploys from `main`
Does NOT Own: Source-of-truth code (lives in GitHub), local secrets (live in `.env.local`)
Communicates With: GitHub repo, OpenWeather API at runtime
Isolation Level: Strong

## Deferred (Scaffolded but Unimplemented)

Owns (placeholder only): Future routes for classes, shop (referenced in content/site.ts nav with `live: false`)
Does NOT Own: Anything yet
Communicates With: N/A
Isolation Level: N/A
