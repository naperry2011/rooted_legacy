# DATA_FLOW

## Home Page Render

Source: Static request to `/`
Transport: Next.js App Router (RSC)
Processor: app/page.tsx → marketing components
Storage: content/site.ts (in-repo constants)
Downstream Consumers: HTML response (prerendered at build)

## History Index Render

Source: Static request to `/history`
Transport: Next.js App Router (RSC)
Processor: app/history/page.tsx → lib/mdx.ts → fs.readdir(content/history)
Storage: content/history/*.mdx (frontmatter parsed by gray-matter)
Downstream Consumers: HTML list of article links (prerendered at build)

## History Article Render (SSG)

Source: Request to `/history/[slug]`
Transport: Next.js App Router (RSC), prerendered via generateStaticParams
Processor: lib/mdx.ts → fs.readFile → gray-matter → next-mdx-remote/rsc MDXRemote
Storage: content/history/<slug>.mdx
Downstream Consumers: HTML article page

## Site-Wide Copy / Nav

Source: content/site.ts
Transport: ES module import
Processor: Header, Footer, marketing components, layout metadata
Storage: TypeScript constants
Downstream Consumers: All routes

## Brand Assets

Source: public/brand/*
Transport: Next.js static asset pipeline (next/image for logo)
Processor: components/brand/Logo.tsx, Hero, layout metadata icons
Storage: public/ directory
Downstream Consumers: Browser

## Fonts

Source: Google Fonts (Cormorant Garamond, Inter)
Transport: next/font/google (build-time fetch + self-hosted at build)
Processor: app/layout.tsx
Storage: .next/static/media
Downstream Consumers: All routes via CSS variables `--font-display`, `--font-sans`

## Build-Time MDX Discovery

Source: content/history/*.mdx
Transport: fs (node:fs/promises) inside lib/mdx.ts at build
Processor: gray-matter → frontmatter + body
Storage: None (in-memory during build)
Downstream Consumers: generateStaticParams, history index, article pages
