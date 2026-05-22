# DATA_FLOW

## Authenticated Request Lifecycle

Source: Browser request with auth cookies
Transport: middleware.ts → `@supabase/ssr` cookie refresh → response
Processor: Next.js App Router dispatches to RSC
Storage: Supabase auth.users (managed by Supabase Auth)
Downstream Consumers: RSC reads via createServerClient (cookies); writes via createAdminClient (service role)

## Magic-link Sign-in

Source: `/login` form submit
Transport: Server action `sendMagicLink` → `supabase.auth.signInWithOtp({ email, emailRedirectTo: /auth/callback })`
Processor: Supabase Auth sends email
Storage: auth.users (created on first sign-in)
Downstream Consumers: User clicks email link → `/auth/callback?code=…` → `exchangeCodeForSession` → cookie set → redirect to `next` or `/account`. Trigger `handle_new_user` creates a `profiles` row.

## Event Listing / Detail Render

Source: `/events` or `/events/[slug]`
Transport: Public Supabase client (anon key, no cookies) — safe for build + RSC
Processor: lib/events.ts → SELECT from `events` WHERE status='published'
Storage: Supabase Postgres `events` table
Downstream Consumers: EventCard grid; BookingForm gated by `kind='free_rsvp'` and date >= today

## RSVP Booking

Source: BookingForm submit on event detail page
Transport: Server action `createBooking` (zod-validated)
Processor:
  1. Verify event exists + published
  2. createAdminClient INSERT into `bookings`
  3. lib/resend.ts → sendEmail confirmation
  4. revalidatePath(/events/[slug], /account)
Storage: Supabase `bookings`; Resend (email)
Downstream Consumers: /account (user's own); /admin/bookings (admin)

## Newsletter Signup (double opt-in)

Source: NewsletterSignup form
Transport: Server action `subscribeToNewsletter`
Processor:
  1. createAdminClient UPSERT into `subscribers` (status=pending, generates `confirmation_token`)
  2. sendEmail with confirm link
Storage: Supabase `subscribers`
Downstream Consumers: `/api/newsletter/confirm?token=…` route handler flips status to `active` and sets `confirmed_at`

## Vendor Application

Source: VendorForm submit at `/vendors/apply`
Transport: Server action `submitVendorApplication`
Processor:
  1. createAdminClient INSERT into `vendor_applications` (status=pending)
  2. sendEmail to CONTACT_TO_EMAIL (admin notify, replyTo=applicant)
  3. sendEmail acknowledgement to applicant
Storage: Supabase `vendor_applications`; Resend
Downstream Consumers: /admin/vendors

## Contact Message

Source: ContactForm submit at `/contact`
Transport: Server action `sendContactMessage`
Processor:
  1. createAdminClient INSERT into `contact_messages`
  2. sendEmail to CONTACT_TO_EMAIL (replyTo=sender)
Storage: Supabase `contact_messages`; Resend
Downstream Consumers: /admin/messages

## Produce Catalog (Google Sheets)

Source: Spreadsheet maintained by farm staff
Transport: lib/sheets.ts → googleapis JWT auth → spreadsheets.values.get
Processor: Header-row mapping → ProduceItem[]; cached via `unstable_cache` with revalidate=900s, tag="produce"
Storage: Google Sheets (remote); Next.js fetch cache (in-memory)
Downstream Consumers: /shop catalog (`farmstand=Y && in_season=Y && qty>0`); /shop/[sku] detail (full list); home WhatsGrowing widget (`in_season=Y`)

## Recipe Cross-Reference

Source: content/recipes/*.mdx frontmatter `ingredients`
Transport: lib/recipes.ts → fs.readFile + gray-matter
Processor: listRecipesByIngredient does substring match on ingredient name vs each recipe's ingredients array
Storage: Filesystem at build
Downstream Consumers: /shop/[sku] "Cook with this" section

## Gallery Render

Source: `/gallery` request
Transport: Public Supabase client SELECT from `gallery_photos`
Processor: lib/gallery.ts resolves each `path`:
  - http(s):// → use as-is
  - /...       → local /public asset
  - else       → Supabase Storage `gallery` bucket getPublicUrl
Storage: Supabase Postgres + Storage; or /public for legacy seed rows
Downstream Consumers: HTML masonry grid

## Admin Reads

Source: /admin/* page request (admin role enforced in layout)
Transport: createAdminClient (service role)
Processor: SELECT … ORDER BY created_at DESC LIMIT 200
Storage: Supabase Postgres
Downstream Consumers: DataTable rendering

## Email Sending (universal)

Source: Any server action's email step
Transport: lib/resend.ts → @resend SDK
Processor: Wraps body in branded HTML shell; soft no-op + warning log when RESEND_API_KEY unset
Storage: Resend (sent log); recipient inbox
Downstream Consumers: End user

## Weather Render

Source: `/` or `/weather`
Transport: lib/weather.ts → fetch OpenWeather with `next.revalidate: 1800` + tag "weather"
Storage: Remote OpenWeather; Next.js fetch cache
Downstream Consumers: WeatherWidget on home; full /weather page

## Environment / Secrets Flow

Source: Vercel project env vars (prod / preview); `.env.local` (dev — gitignored)
Transport: process.env at server boundary
Processor: Every lib/* file gates on its required vars and degrades gracefully when missing
Downstream Consumers: Supabase, Stripe (Phase 2), Resend, Google Sheets, OpenWeather
