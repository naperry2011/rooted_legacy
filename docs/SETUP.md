# Rooted Legacy — Setup Guide (Phase 1 MVP)

This walks you through provisioning the external services the demo MVP
needs: **Supabase**, **Resend**, and **Google Sheets**. Plus OpenWeather
if not already done.

Take it one section at a time. After each section, copy the value into
`.env.local` locally and into the Vercel project's Environment Variables
for production.

---

## 1. Supabase (database + auth + storage)

1. Go to <https://supabase.com> and create a project.
   - Region: pick one near Indianapolis (e.g. `us-east-1`).
   - Save the database password somewhere safe.
2. In **Project Settings → API**, copy:
   - `NEXT_PUBLIC_SUPABASE_URL` ← *Project URL*
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` ← *anon public*
   - `SUPABASE_SERVICE_ROLE_KEY` ← *service_role* (keep secret)
3. **Apply the migration.** Open *SQL Editor* and paste the contents of
   `supabase/migrations/0001_init.sql`, then *Run*.
4. **Seed initial data.** Run `supabase/seed.sql` the same way.
5. **Auth → URL Configuration**: add `http://localhost:3000` and your
   Vercel preview/production URLs to *Site URL* and *Redirect URLs*.
   Specifically allow `/auth/callback` on each.
6. **(Optional) Storage**: create a public bucket named `gallery` if you
   plan to upload photos directly. For MVP, gallery rows can point at
   `/brand/*.jpg` (already in `/public`) — no upload needed.

### Grant yourself admin

In `.env.local` (and Vercel) set:

```
ADMIN_EMAIL_ALLOWLIST=you@example.com
```

Comma-separated for multiple admins. The role is conferred at sign-in.

---

## 2. Resend (transactional + newsletter email)

1. Sign up at <https://resend.com>.
2. **API Keys** → create one with the default scope. Copy as
   `RESEND_API_KEY`.
3. For development, the default `onboarding@resend.dev` sender works
   without domain verification. For production, **verify your domain**
   under *Domains* and set:
   ```
   RESEND_FROM="Rooted Legacy <hello@rootedlegacy.org>"
   ```
4. Set `CONTACT_TO_EMAIL` to the address where contact-form + vendor
   notifications should land.

---

## 3. Google Sheets (produce inventory)

1. **Create a sheet** with this header row in row 1 (case-insensitive):

   ```
   sku | name | category | unit | qty_available | price_retail | price_wholesale | csa_eligible | farmstand | wholesale | in_season | photo_url | notes
   ```

   Seed a few rows — staff edits this weekly. Example:

   ```
   tom-cherry | Cherry tomatoes | vegetable | pint | 24 | 5.00 | 3.50 | Y | Y | Y | Y | https://… | sun-gold
   kale-lac   | Lacinato kale   | green     | bunch | 18 | 4.00 | 2.50 | Y | Y | Y | Y |          |
   ```

2. **Create a Google Cloud project**: <https://console.cloud.google.com>.
3. **Enable the Sheets API** for that project.
4. **Create a service account**: *IAM & Admin → Service Accounts → Create*.
   - Skip role assignments.
   - Click into the account → *Keys → Add Key → Create new key → JSON*.
   - A `*.json` file downloads.
5. **Share your Google Sheet** with the service account's
   `client_email` (found in the JSON), as *Viewer*.
6. Copy the Sheet ID from its URL
   (`https://docs.google.com/spreadsheets/d/<THIS_PART>/edit`):
   ```
   GOOGLE_SHEETS_ID=<sheet-id>
   ```
7. Encode the JSON key. On Windows PowerShell:
   ```powershell
   [Convert]::ToBase64String([IO.File]::ReadAllBytes("C:\path\to\key.json"))
   ```
   On macOS/Linux:
   ```bash
   base64 -w0 < key.json
   ```
   Paste the output as:
   ```
   GOOGLE_SERVICE_ACCOUNT_JSON=<base64-blob>
   ```
   (Raw JSON also works if your env-var store can handle multi-line
   values; base64 is safer.)

---

## 4. OpenWeather (already wired in v1)

Already in `.env.local` from the previous milestone. If you ever need
to re-key it:

1. Sign up at <https://openweathermap.org/api>.
2. Create a key (no credit card required for the `/data/2.5/*` endpoints).
3. Set `OPENWEATHER_API_KEY`.
4. New keys take up to 2 hours to activate after signup.

---

## 5. Vercel environment

Mirror every variable from `.env.local` into the Vercel project under
*Settings → Environment Variables*. Check **Production**, **Preview**,
and **Development** scopes for everything except secrets you only want
in production.

Redeploy after adding new variables — Vercel doesn't pick them up on
existing deployments.

---

## Verifying it all works

```bash
npm install
npm run dev
```

Open <http://localhost:3000> and check:

1. Home loads with weather + What's Growing widgets.
2. `/shop` lists items from the Google Sheet.
3. `/events` reads from Supabase; click into an event and RSVP — you
   should receive a confirmation email.
4. Newsletter signup in the footer triggers a double-opt-in email.
5. `/login` → magic link → `/account` shows your RSVPs.
6. With your email in `ADMIN_EMAIL_ALLOWLIST`, `/admin` is reachable and
   shows counts for all the entities.
