# Rooted Legacy

Web app for **Rooted Legacy** — an Indianapolis urban farm at 865 N German Church Rd.

## Stack

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS v4** with brand tokens derived from the logo
- **MDX** content (`content/history/*.mdx`) via `next-mdx-remote`
- **lucide-react** icons
- Hosted on **Vercel** (recommended)

## v1 Scope

Only the brand surface ships in v1:

- `/` — hero, what-we-do, location, partners
- `/history` and `/history/[slug]` — MDX-driven history articles

Everything else (classes, events, shop, weather, accounts) is intentionally out
of scope; see [`FEATURE_SPEC.md`](FEATURE_SPEC.md) for the full feature map.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint
```

## Repo Layout

```
app/                  # Next.js routes
  layout.tsx          # root layout (fonts, header, footer)
  page.tsx            # home
  history/            # MDX-driven history section
components/
  brand/              # Logo
  layout/             # Header, Footer
  marketing/          # Hero, WhatWeDo, LocationCard, PartnerStrip
content/
  site.ts             # site-wide copy (address, partners, nav)
  history/*.mdx       # history articles
lib/
  mdx.ts              # MDX loader (frontmatter + content)
public/brand/         # logo + reference images
```

## Brand

Derived from `public/brand/rooted_legacy_logo.jpg`:

| Token | Value |
|---|---|
| `--bg` | `#0b0b0a` (near-black) |
| `--primary` | `#d9a441` (ochre) |
| `--accent` | `#b5651d` (orange-brown) |
| `--leaf` | `#3f6e3a` (foliage green) |
| `--cream` | `#f2e6cf` (parchment) |

Display font: **Cormorant Garamond** (weathered serif feel).
Body font: **Inter**.

## Adding a history article

1. Create `content/history/your-slug.mdx`.
2. Frontmatter:

   ```mdx
   ---
   title: "Your title"
   date: "2026-06-01"
   excerpt: "One-line summary."
   author: "Optional"
   ---
   ```

3. Write MDX. It will appear at `/history/your-slug` and on the index.
