-- Rooted Legacy — local + initial Supabase seed
-- Run after migrations. Safe to re-run (uses on conflict).

-- ---------- events ----------

insert into public.events
  (slug, title, summary, date, start_time, end_time, location, flyer_path,
   status, kind, highlights, partners)
values
  (
    'urban-farm-grand-opening',
    'Urban Farm Grand Opening',
    'A day on the land — wellness vendors, starter plants, gardening classes, yoga & fitness, live entertainment, and a keynote speaker. Come help us open the farm.',
    '2026-05-16',
    '10:00',
    '16:00',
    '865 N German Church Rd, Indianapolis, IN',
    '/brand/flyer_grand_opening.jpg',
    'published',
    'free_rsvp',
    '["Wellness vendors","A1C + BP checks","Gardening classes","Art & crafts","Live entertainment","Starter plants","Yoga + fitness class","Keynote speaker"]'::jsonb,
    '["Bodi Buzz"]'::jsonb
  ),
  (
    'earth-day-everyday',
    'Earth Day Everyday — Free Gardening Class',
    'A free, hands-on gardening class at the farm. Bring questions, leave with seedlings.',
    '2026-04-25',
    '11:00',
    '14:00',
    '865 N German Church Rd, Indianapolis, IN',
    '/brand/flyer_earth_day.jpg',
    'published',
    'free_rsvp',
    '[]'::jsonb,
    '["Bodi Buzz"]'::jsonb
  ),
  (
    'values-and-ethics',
    'Values and Ethics — 7 Pillars of a Healthy Culture (Pillar 1)',
    'Trust is built through agreement. Pillar 1 of the 7 Pillars of a Healthy Culture series — defines the standards that guide behavior and decision making.',
    '2026-05-09',
    '17:30',
    '19:30',
    'Polk Stables',
    '/brand/partner_cre8tive.jpg',
    'published',
    'external',
    '[]'::jsonb,
    '["Cre8tive Alignment Network"]'::jsonb
  )
on conflict (slug) do update set
  title       = excluded.title,
  summary     = excluded.summary,
  date        = excluded.date,
  start_time  = excluded.start_time,
  end_time    = excluded.end_time,
  location    = excluded.location,
  flyer_path  = excluded.flyer_path,
  status      = excluded.status,
  kind        = excluded.kind,
  highlights  = excluded.highlights,
  partners    = excluded.partners,
  updated_at  = now();

-- external_url for the Cre8tive event
update public.events
   set external_url = 'https://cre8tivealignmentnetwork.org'
 where slug = 'values-and-ethics';

-- ---------- gallery_photos ----------
-- Paths assume files are uploaded to the `gallery` Supabase Storage bucket.
-- The four client photos go to gallery/client_*.jpg; existing flyers/logo
-- can stay under public/brand/ and we render them via local /brand paths.
-- For simplicity, we point gallery rows at the existing public/brand/ files
-- the MVP can render without requiring uploads yet. Migrate later.

insert into public.gallery_photos (path, alt, caption, sort_order)
values
  ('/brand/rooted_legacy_logo.jpg',     'Rooted Legacy logo',                         'The Rooted Legacy mark', 1),
  ('/brand/flyer_grand_opening.jpg',    'Urban Farm Grand Opening flyer',             'Grand Opening — May 16', 2),
  ('/brand/flyer_earth_day.jpg',        'Earth Day Everyday flyer',                   'Earth Day Everyday — April 25', 3),
  ('/brand/partner_cre8tive.jpg',       'Cre8tive Alignment Network — Values & Ethics','Partner programming', 4)
on conflict do nothing;
