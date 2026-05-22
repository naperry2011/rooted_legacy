# IMPORT_GRAPH_SUMMARY

## Core Dependency Nodes

- `content/site.ts` — Layout, Header, Footer, marketing components
- `lib/auth.ts` — every protected route (account, admin/*) and middleware-adjacent paths
- `lib/supabase/server.ts` — RSC + route handlers needing user context
- `lib/supabase/public.ts` — every public read (events, gallery); safe at build
- `lib/supabase/admin.ts` — all server actions, all /admin pages, all webhook handlers
- `lib/supabase/types.ts` — typed Database for all four clients (single source of truth)
- `lib/sheets.ts` — /shop, /shop/[sku], components/produce/WhatsGrowing
- `lib/recipes.ts` — /recipes, /recipes/[slug], /shop/[sku] cross-link
- `lib/events.ts` — /events, /events/[slug]
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

`lib/recipes.ts` uses Node fs at build time (no explicit server-only marker but effectively the same).

## Client Components (use client)

- `components/layout/Header.tsx` — mobile menu state
- `components/events/BookingForm.tsx` — useActionState
- `components/marketing/NewsletterSignup.tsx` — useActionState
- `app/login/LoginForm.tsx` — useActionState
- `app/vendors/apply/VendorForm.tsx` — useActionState
- `app/contact/ContactForm.tsx` — useActionState
- `lib/supabase/browser.ts` — exposed for any future client-side Supabase use

`components/forms/fields.tsx` is intentionally NOT marked `use client` so it can be used from both server and client components.

## Path Alias

- `@/*` (tsconfig.json) → repo root

## Potential Refactor Risk Areas

- `lib/supabase/types.ts` — hand-maintained Database type; schema drift between SQL migration and this file would surface as confusing TypeScript errors. Long-term fix: run `supabase gen types typescript` and check generated file in.
- `content/site.ts` — `nav[].primary` flag interpreted by Header (desktop slice) and Footer/mobile (full list). Shape changes ripple.
- `app/globals.css` — brand tokens hard-coded as Tailwind utility class names repo-wide (`bg-bg-elev`, `text-cream`, etc.). Renaming requires global find/replace.
- `lib/sheets.ts` — the Google Sheet header-row contract (`sku, name, ...`) is implicit. Schema change requires coordinated update of the sheet + this file.
- `lib/resend.ts` — every form action silently no-ops when `RESEND_API_KEY` is missing. Good for graceful degradation; bad if you assume an email was sent during smoke tests.
- `app/admin/*` — admin reads use service-role; any logic bug that mis-checks the role boundary would expose data. Currently gated by both middleware redirect and `requireAdmin`/`getCurrentRole` in layout.

## Notes

- No circular dependencies detected.
- No barrel files; each component imported by its own path.
- Layered: pages → components → lib/content; no upward imports.
- The four Supabase clients (server/browser/admin/public) are not redundant — each has a different cookie/auth profile. Choose deliberately per usage:
  - server: needs user context, has cookies
  - browser: client component, can mutate session
  - admin: bypasses RLS, server-only, used for writes that accept guest input + all admin reads
  - public: no cookies, no privilege; safe at build + for unauthenticated public reads
