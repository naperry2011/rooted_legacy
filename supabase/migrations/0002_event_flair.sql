-- Adds optional "flair" fields to events for featured/curated event pages.
-- Safe to run on top of 0001_init.sql; columns are additive and nullable
-- so existing rows are unaffected.

alter table public.events
  add column if not exists tagline text,
  add column if not exists price_cents integer,
  add column if not exists themes jsonb not null default '[]'::jsonb,
  add column if not exists included_perks jsonb not null default '[]'::jsonb,
  add column if not exists is_featured boolean not null default false;

create index if not exists events_featured_idx
  on public.events (is_featured, date)
  where is_featured = true;
