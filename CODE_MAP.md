# CODE_MAP

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
- public/brand/rooted_legacy_logo.jpg

External Integrations:
- Google Maps (link-out only)

Entry Points:
- `/` (Next.js App Router static route)

## History (MDX Content)

Category: UI

Primary Files:
- app/history/page.tsx
- app/history/[slug]/page.tsx
- lib/mdx.ts
- content/history/welcome.mdx

Supporting Files:
- content/site.ts

External Integrations:
- None

Entry Points:
- `/history`
- `/history/[slug]` (SSG via `generateStaticParams`)

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
- .gitignore

External Integrations:
- Vercel (deploy target; not yet wired)

Entry Points:
- `npm run dev` / `npm run build` / `npm run start` / `npm run lint`

## Documentation

Category: Other

Primary Files:
- README.md
- FEATURE_SPEC.md

Supporting Files:
- SuperGarden.txt (original brainstorm)

External Integrations:
- None

Entry Points:
- None
