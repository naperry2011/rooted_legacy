-- Rooted Legacy — local + initial Supabase seed.
-- Run after migrations. Safe to re-run (uses on conflict).

-- ---------- events ----------

insert into public.events
  (slug, title, summary, date, start_time, end_time, location, flyer_path,
   status, kind, highlights, partners,
   tagline, price_cents, themes, included_perks, is_featured)
values
  (
    'soothing-sundays',
    'Soothing Sundays',
    'A day to root, restore, and reconnect on the farm. Yoga, a sound-bowl session, community planting, and a plant sale — all set against an afternoon at 865 N German Church Rd.',
    '2026-05-24',
    '11:00',
    '16:00',
    '865 N German Church Rd, Indianapolis, IN 46229',
    '/brand/flyer_soothing_sundays.jpg',
    'published',
    'ticketed',
    '["Yoga","Sound-bowl session","Community planting","Plant sale"]'::jsonb,
    '["Bodi Buzz"]'::jsonb,
    'Root. Restore. Reconnect.',
    2000,
    '["Nourish your body","Calm your mind","Grow together"]'::jsonb,
    '["Seeded watermelon slices","Beverage"]'::jsonb,
    true
  ),
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
    '["Bodi Buzz"]'::jsonb,
    null,
    null,
    '[]'::jsonb,
    '[]'::jsonb,
    false
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
    '["Bodi Buzz"]'::jsonb,
    null,
    null,
    '[]'::jsonb,
    '[]'::jsonb,
    false
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
    '["Cre8tive Alignment Network"]'::jsonb,
    null,
    null,
    '[]'::jsonb,
    '[]'::jsonb,
    false
  )
on conflict (slug) do update set
  title          = excluded.title,
  summary        = excluded.summary,
  date           = excluded.date,
  start_time     = excluded.start_time,
  end_time       = excluded.end_time,
  location       = excluded.location,
  flyer_path     = excluded.flyer_path,
  status         = excluded.status,
  kind           = excluded.kind,
  highlights     = excluded.highlights,
  partners       = excluded.partners,
  tagline        = excluded.tagline,
  price_cents    = excluded.price_cents,
  themes         = excluded.themes,
  included_perks = excluded.included_perks,
  is_featured    = excluded.is_featured,
  updated_at     = now();

update public.events
   set external_url = 'https://cre8tivealignmentnetwork.org'
 where slug = 'values-and-ethics';

-- ---------- gallery_photos ----------

insert into public.gallery_photos (path, alt, caption, sort_order)
values
  ('/brand/rooted_legacy_logo.jpg',     'Rooted Legacy logo',                         'The Rooted Legacy mark', 1),
  ('/brand/flyer_soothing_sundays.jpg', 'Soothing Sundays flyer',                     'Soothing Sundays — May 24', 2),
  ('/brand/flyer_grand_opening.jpg',    'Urban Farm Grand Opening flyer',             'Grand Opening — May 16', 3),
  ('/brand/flyer_earth_day.jpg',        'Earth Day Everyday flyer',                   'Earth Day Everyday — April 25', 4),
  ('/brand/partner_cre8tive.jpg',       'Cre8tive Alignment Network — Values & Ethics','Partner programming', 5)
on conflict do nothing;
