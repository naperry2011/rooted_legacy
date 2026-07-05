# DATA_FLOW

## Authenticated Request Lifecycle

Source: Browser request with auth cookies
Transport: middleware.ts → `@supabase/ssr` cookie refresh → response
Processor: Next.js App Router dispatches to RSC
Storage: Supabase auth.users
Downstream Consumers: RSC reads via createServerClient (cookies); writes via createAdminClient (service role)

## Magic-link Sign-in

Source: `/login` form submit
Transport: Server action `sendMagicLink` → `supabase.auth.signInWithOtp`
Processor: Supabase Auth sends email
Storage: auth.users (created on first sign-in)
Downstream Consumers: User clicks email link → `/auth/callback?code=…` → cookie set → redirect to `next` or `/account`. Trigger `handle_new_user` creates a `profiles` row.

## Event Listing / Detail Render

Source: `/events` or `/events/[slug]`
Transport: Public Supabase client (anon key, no cookies)
Processor: lib/events.ts → SELECT from `events` WHERE status='published'; columns now include `tagline`, `price_cents`, `themes`, `included_perks`, `is_featured`
Storage: Supabase `events` table
Downstream Consumers: EventCard grid (Featured pill + tagline + price chip when applicable); detail page renders the flair treatment when `is_featured=true`

## Event Photo Linkage

Source: `/events/[slug]` request
Transport: Public Supabase client
Processor: lib/gallery.ts `listPhotosForEvent(event.id)` → SELECT from `gallery_photos` WHERE event_id = ?
Storage: gallery_photos (rows can reference /public paths or Supabase Storage paths)
Downstream Consumers: Event detail page renders a hover-captioned grid below the event body ("From the day" if past, "From past events" if upcoming)

## RSVP Booking

Source: BookingForm on event detail page (free_rsvp upcoming events only)
Transport: Server action `createBooking` (zod-validated)
Processor: Verify event published → createAdminClient INSERT into `bookings` → Resend confirmation → revalidatePath
Storage: bookings; Resend
Downstream Consumers: /account, /admin/bookings

## Newsletter Signup (double opt-in)

Source: NewsletterSignup form (footer + hero variants)
Transport: Server action `subscribeToNewsletter`
Processor: createAdminClient UPSERT subscribers (status=pending) → sendEmail with confirm link
Storage: subscribers
Downstream Consumers: `/api/newsletter/confirm?token=…` flips status to `active`

## Vendor Application

Source: VendorForm at `/vendors/apply`
Transport: Server action `submitVendorApplication`
Processor: createAdminClient INSERT vendor_applications (pending) → sendEmail to CONTACT_TO_EMAIL + applicant ack
Storage: vendor_applications
Downstream Consumers: /admin/vendors

## Vendor Directory Render

Source: `/vendors` request (static)
Transport: ES module imports
Processor: app/vendors/page.tsx pulls `site.partners` (long-term partners from content/site.ts) + `featuredVendors` from content/vendors.ts
Storage: TypeScript constants
Downstream Consumers: Two-section HTML (partners + vendors) + apply CTA

## Contact Message

Source: ContactForm
Transport: Server action `sendContactMessage`
Processor: INSERT contact_messages → forward email to CONTACT_TO_EMAIL
Storage: contact_messages; Resend
Downstream Consumers: /admin/messages

## Produce Catalog (Google Sheets)

Source: Spreadsheet maintained by staff
Transport: lib/sheets.ts → googleapis JWT auth
Processor: Header-row mapping → ProduceItem[]; `unstable_cache` revalidate=900s, tag="produce"
Storage: Google Sheets (remote); Next.js fetch cache
Downstream Consumers: /shop, /shop/[sku], home WhatsGrowing widget

## Recipe Cross-Reference

Source: content/recipes/*.mdx frontmatter `ingredients`
Transport: lib/recipes.ts → fs.readFile + gray-matter
Processor: listRecipesByIngredient substring-matches ingredient against recipe ingredients
Storage: Filesystem
Downstream Consumers: /shop/[sku] "Cook with this" section

## Gallery Render

Source: `/gallery` request
Transport: Public Supabase client SELECT from `gallery_photos`
Processor: lib/gallery.ts resolves each `path` (http URL / local /public / Supabase Storage bucket)
Storage: Supabase Postgres + Storage; legacy /public paths
Downstream Consumers: HTML masonry grid

## Admin Reads

Source: /admin/* (admin role enforced in layout)
Transport: createAdminClient (service role)
Processor: SELECT … ORDER BY created_at DESC LIMIT 200
Storage: Supabase Postgres
Downstream Consumers: DataTable rendering

## Open Graph / Social Sharing

Source: Any page request from a crawler / share preview
Transport: Static HTML head tags emitted by Next.js metadata API
Processor: Root layout sets default OG (vendor-tents photo) + Twitter card; per-page Metadata overrides (event flyer, about hero, vendors row, recipe none → falls back to default)
Storage: public/* assets
Downstream Consumers: Social platforms (FB, X, iMessage, Slack)

## Email Sending (universal)

Source: Any server action's email step
Transport: lib/resend.ts → @resend SDK
Processor: Wraps body in branded HTML shell; soft no-op when RESEND_API_KEY unset
Downstream Consumers: Recipient inbox

## Weather Render

Source: `/` or `/weather`
Transport: lib/weather.ts → fetch OpenWeather with `next.revalidate: 1800`
Storage: Remote OpenWeather; Next.js fetch cache
Downstream Consumers: WeatherWidget on home; full /weather page

## Environment / Secrets Flow

Source: Vercel project env vars (prod) / `.env.local` (dev — gitignored)
Transport: process.env at server boundary
Processor: Every lib/* file gates on its required vars and degrades gracefully when missing
Downstream Consumers: Supabase, Resend, Google Sheets, OpenWeather, Stripe (Phase 2)
