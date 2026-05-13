# IMPORT_GRAPH_SUMMARY

## Core Dependency Nodes

- content/site.ts — imported by app/layout.tsx, components/layout/Header.tsx, components/layout/Footer.tsx, components/marketing/Hero.tsx, components/marketing/LocationCard.tsx, components/marketing/PartnerStrip.tsx
- app/globals.css — imported once by app/layout.tsx; defines all brand tokens consumed via Tailwind utility classes across every component
- lib/mdx.ts — imported by both history routes (index + [slug])
- components/brand/Logo.tsx — imported by Header and Hero
- next-mdx-remote/rsc — sole MDX renderer; only consumer is app/history/[slug]/page.tsx

## Path Alias

- `@/*` (tsconfig.json) → repo root; used by every component/route import

## Potential Refactor Risk Areas

- content/site.ts (high fan-in; any breaking shape change ripples through layout + marketing components)
- app/globals.css (token names hard-coded into Tailwind class strings repo-wide; renaming a token requires text-wide updates)
- lib/mdx.ts (single source of truth for content/history I/O; schema of HistoryFrontmatter is implicit contract with all .mdx files)
- app/history/[slug]/page.tsx (couples MDX rendering, metadata, SSG params, and styling overrides in one file)

## Notes

- No circular dependencies detected.
- No barrel files; each component imported from its own path.
- Pure tree: pages → components → content/lib; no upward imports.
