-- Rooted Legacy — MVP schema
-- Phase 1: profiles, events, bookings, vendor_applications,
-- subscribers, gallery_photos, contact_messages

-- ---------- helpers ----------

create extension if not exists "uuid-ossp";

create or replace function public.set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ---------- profiles ----------

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'visitor' check (role in ('visitor', 'staff', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;

create policy "profiles_self_read" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_self_update" on public.profiles
  for update using (auth.uid() = id);

-- Auto-create a profile row when a new auth user signs up.
-- Admin role is conferred at sign-in time via a server-side check
-- against ADMIN_EMAIL_ALLOWLIST (see lib/auth.ts); the DB default is visitor.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', null));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- events ----------

create table if not exists public.events (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  title text not null,
  summary text not null,
  body_md text,
  date date not null,
  start_time time,
  end_time time,
  location text not null,
  flyer_path text,
  capacity integer,
  status text not null default 'draft' check (status in ('draft', 'published', 'cancelled')),
  kind text not null default 'free_rsvp' check (kind in ('free_rsvp', 'ticketed', 'external')),
  external_url text,
  highlights jsonb not null default '[]'::jsonb,
  partners jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists events_date_idx on public.events (date);
create index if not exists events_status_idx on public.events (status);

create trigger events_set_updated_at
  before update on public.events
  for each row execute function public.set_updated_at();

alter table public.events enable row level security;

create policy "events_public_read" on public.events
  for select using (status = 'published');

-- (admin writes go through the service-role key on the server)

-- ---------- bookings ----------

create table if not exists public.bookings (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  attendee_name text not null,
  attendee_email text not null,
  party_size integer not null default 1 check (party_size > 0 and party_size <= 20),
  status text not null default 'confirmed' check (status in ('confirmed', 'cancelled')),
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists bookings_event_idx on public.bookings (event_id);
create index if not exists bookings_user_idx on public.bookings (user_id);
create index if not exists bookings_email_idx on public.bookings (attendee_email);

alter table public.bookings enable row level security;

-- Anyone can RSVP (guest checkout allowed). Writes are handled server-side
-- via the service-role key to enforce shape + run side effects, so we don't
-- expose a public insert policy here.
create policy "bookings_owner_read" on public.bookings
  for select using (
    auth.uid() is not null and (
      user_id = auth.uid()
      or attendee_email = (select email from auth.users where id = auth.uid())
    )
  );

-- ---------- vendor_applications ----------

create table if not exists public.vendor_applications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete set null,
  business_name text not null,
  contact_name text,
  contact_email text not null,
  phone text,
  category text,
  website text,
  instagram text,
  blurb text,
  booth_needs text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

alter table public.vendor_applications enable row level security;
-- No public read policy. Admin reads via service-role key.

-- ---------- subscribers ----------

create table if not exists public.subscribers (
  id uuid primary key default uuid_generate_v4(),
  email text not null unique,
  status text not null default 'pending' check (status in ('pending', 'active', 'unsubscribed', 'bounced')),
  source text,
  confirmation_token uuid not null default uuid_generate_v4(),
  confirmed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists subscribers_status_idx on public.subscribers (status);

alter table public.subscribers enable row level security;
-- All operations server-side via service role.

-- ---------- gallery_photos ----------

create table if not exists public.gallery_photos (
  id uuid primary key default uuid_generate_v4(),
  path text not null,                 -- Supabase Storage path inside `gallery` bucket
  alt text not null,
  caption text,
  event_id uuid references public.events(id) on delete set null,
  taken_at date,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists gallery_sort_idx on public.gallery_photos (sort_order);

alter table public.gallery_photos enable row level security;

create policy "gallery_public_read" on public.gallery_photos
  for select using (true);

-- ---------- contact_messages ----------

create table if not exists public.contact_messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  body text not null,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;
-- Writes happen server-side; no public read.
