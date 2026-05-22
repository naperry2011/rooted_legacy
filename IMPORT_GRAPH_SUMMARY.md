# IMPORT_GRAPH_SUMMARY

## Core Dependency Nodes

- `content/site.ts` — Layout, Header, Footer, marketing components, /vendors directory (partners section), event-detail partner-link lookup
- `content/vendors.ts` — /vendors page; will graduate to a DB-backed table in Phase 2
- `lib/auth.ts` — every protected route (account, admin/*) and middleware-adjacent paths
- `lib/supabase/server.ts` — RSC + route handlers needing user context
- `lib/supabase/public.ts` — every public read (events, gallery, event photos); safe at build
- `lib/supabase/admin.ts` — all server actions, all /admin pages
- `lib/supabase/types.ts` — typed Database (now includes flair columns)
- `lib/sheets.ts` — /shop, /shop/[sku], components/produce/WhatsGrowing
- `lib/recipes.ts` — /recipes, /recipes/[slug], /shop/[sku] cross-link
- `lib/events.ts` — /events, /events/[slug] (now exports formatPriceCents)
- `lib/gallery.ts` — /gallery, event detail "From the day" section
- `lib/resend.ts` — every server action that sends email
- `lib/mdx.ts` — /history routes
- `app/globals.css` — brand tokens, referenced as Tailwind utility classes everywhere
- `components/forms/fields.tsx` — Field/Input/Textarea/SubmitButton/FormAlert reused by 5+ forms

## Server-Only Boundaries

These modules carry `import "server-only"` and must never be imported from a client component:

- `lib/supabase/server.ts`, `lib/supabase/admin.ts`, `lib/supabase/public.ts`
- `lib/auth.ts`
- `lib/events.ts`, `lib/gallery.ts`, `lib/sheets.ts`, `lib/weather.ts`
- `lib/resend.ts`

`lib/recipes.ts` uses Node fs at build time (no explicit marker but effectively the same).

## Client Components (use client)

- `components/layout/Header.tsx`
- `components/events/BookingForm.tsx`
- `components/marketing/NewsletterSignup.tsx`
- `app/login/LoginForm.tsx`
- `app/vendors/apply/VendorForm.tsx`
- `app/contact/ContactForm.tsx`
- `lib/supabase/browser.ts`

`components/forms/fields.tsx`, `components/vendors/VendorCard.tsx`, `components/produce/{ShopCard,WhatsGrowing}.tsx`, `components/events/EventCard.tsx` are intentionally NOT marked `use client` — they render on the server.

## Path Alias

- `@/*` (tsconfig.json) → repo root

## Potential Refactor Risk Areas

- `lib/supabase/types.ts` — hand-maintained Database type; the recent 0002 migration required updating both Row and Insert shapes for `events`. Schema drift between SQL and TS would surface as confusing type errors. Long-term: `supabase gen types typescript`.
- `content/site.ts` — `nav[].primary` flag interpreted by Header (desktop slice) and Footer/mobile (full list). `partners[]` schema (tagline, services, instagram, email) is consumed by both PartnerStrip (home) AND /vendors directory.
- `content/vendors.ts` — `Vendor` shape consumed by /vendors page and VendorCard. Schema change touches 2 files. Once Phase 2 ships vendor_profiles, this becomes a one-time seed.
- `app/globals.css` — brand tokens hard-coded as Tailwind utility class names repo-wide. Renaming requires global find/replace.
- `lib/sheets.ts` — Google Sheet header-row contract is implicit. Schema change requires coordinated update.
- `lib/resend.ts` — every form action silently no-ops when `RESEND_API_KEY` is missing.
- `gallery_photos.path` — overloaded column stores both `/public/...` paths and Storage bucket paths. Resolver in `lib/gallery.ts` handles both, but is brittle if a path starts with neither `/` nor `http`.
- `app/admin/*` — service-role; the role check happens twice (middleware + layout). Don't bypass either.

## Notes

- No circular dependencies.
- Pure tree: pages → components → lib/content; no upward imports.
- 4 Supabase clients (server/browser/admin/public) — choose per usage: server (user context), browser (client), admin (bypass RLS), public (no cookies, safe at build).
