# FEATURE_BOUNDARIES

## Site Shell (app/layout.tsx + components/layout/*)

Owns: HTML document, font variables, header, footer, root metadata, brand chrome
Does NOT Own: Page bodies, MDX rendering, route-specific metadata
Communicates With: content/site.ts (nav, partners, address); app/globals.css (tokens)
Isolation Level: Strong

## Marketing Home (app/page.tsx + components/marketing/*)

Owns: Hero, WhatWeDo, LocationCard, PartnerStrip composition for `/`
Does NOT Own: History content, layout chrome, MDX, any persistence
Communicates With: content/site.ts; public/brand/* (logo, future imagery)
Isolation Level: Strong

## History (app/history/* + lib/mdx.ts + content/history/*)

Owns: MDX discovery, frontmatter parsing, article listing, article rendering, SSG slug generation, article-page typography overrides
Does NOT Own: Layout chrome, home page composition, runtime content editing (no CMS)
Communicates With: content/history/*.mdx (filesystem); next-mdx-remote/rsc
Isolation Level: Strong

## Brand Tokens (app/globals.css)

Owns: CSS custom properties for color, font variables, paper-grain utility, base background gradients
Does NOT Own: Component markup, font loading (handled by app/layout.tsx)
Communicates With: Every Tailwind utility class referencing `bg-*`, `text-*`, `border-*` tokens
Isolation Level: Moderate (shared vocabulary across all UI files)

## Site Copy (content/site.ts)

Owns: Org name, tagline, description, URL, address, socials, partners, nav structure
Does NOT Own: History articles, rendered markup, styling
Communicates With: Layout shell + all marketing components
Isolation Level: Moderate (broad fan-in)

## MDX Loader (lib/mdx.ts)

Owns: Filesystem access for content/history/, frontmatter typing, slug enumeration
Does NOT Own: MDX→HTML rendering (delegated to next-mdx-remote/rsc), styling
Communicates With: app/history/page.tsx, app/history/[slug]/page.tsx
Isolation Level: Strong

## Brand Assets (public/brand/*)

Owns: Logo and reference imagery files
Does NOT Own: Image rendering logic, alt text (defined in consumers)
Communicates With: components/brand/Logo.tsx, Hero, layout metadata
Isolation Level: Strong

## Build / Tooling (package.json, next.config.ts, tsconfig.json, eslint.config.mjs, postcss.config.mjs)

Owns: Dependency graph, scripts, TypeScript config, ESLint config, PostCSS/Tailwind v4 wiring, path alias `@/*`
Does NOT Own: Runtime behavior, brand tokens, content
Communicates With: All source files (compile-time)
Isolation Level: Strong

## Deferred (Scaffolded but Unimplemented)

Owns (placeholder only): Future routes for classes, events, shop, weather, account (referenced in content/site.ts nav with `live: false`)
Does NOT Own: Anything in v1
Communicates With: N/A
Isolation Level: N/A (no code yet)
