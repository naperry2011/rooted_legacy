# ENTRY_POINTS

## Next.js Dev Server

Path: `package.json` script `dev` → `next dev`
Responsibility: Local development server with HMR
Invokes: app/layout.tsx → all app/** routes
Depends On: next, react, react-dom, tailwindcss

## Next.js Production Build

Path: `package.json` script `build` → `next build`
Responsibility: Produces optimized output (.next/), prerenders static routes and SSG slugs
Invokes: app/**, lib/mdx.ts, content/**
Depends On: TypeScript, Tailwind v4, next-mdx-remote, gray-matter

## Next.js Production Server

Path: `package.json` script `start` → `next start`
Responsibility: Serves built output
Invokes: .next/ artifacts
Depends On: build output

## Lint

Path: `package.json` script `lint` → `eslint`
Responsibility: Static analysis
Invokes: eslint.config.mjs
Depends On: eslint-config-next

## Root Layout (Implicit Entry per Request)

Path: app/layout.tsx
Responsibility: HTML shell, font loading, brand chrome (Header, Footer), metadata
Invokes: components/layout/Header.tsx, components/layout/Footer.tsx, app/globals.css
Depends On: content/site.ts, next/font/google

## Home Route

Path: app/page.tsx
Responsibility: Marketing landing page composition
Invokes: components/marketing/{Hero,WhatWeDo,LocationCard,PartnerStrip}.tsx
Depends On: content/site.ts

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
