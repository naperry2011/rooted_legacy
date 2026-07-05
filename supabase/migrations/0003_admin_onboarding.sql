-- 0003_admin_onboarding.sql
-- Support invite-only admin onboarding:
--   (1) Close a privilege-escalation hole so users can't self-promote to admin.
--   (2) Store email on profiles so the admin Team list can display it.

-- ----------------------------------------------------------------------------
-- 1. Role lockdown
-- ----------------------------------------------------------------------------
-- profiles_self_update lets a user update their own row, but with table-level
-- UPDATE that includes the `role` column — so a signed-in user could set their
-- own role to 'admin'. Replace the blanket UPDATE with a column-scoped grant:
-- authenticated users may edit only their own full_name. Role changes now
-- require the service-role admin client (createAdminClient), which bypasses RLS
-- and column grants. The updated_at trigger still works (trigger-set columns
-- don't need a column privilege from the invoking user).
revoke update on public.profiles from authenticated, anon;
grant update (full_name) on public.profiles to authenticated;

-- ----------------------------------------------------------------------------
-- 2. Email on profiles
-- ----------------------------------------------------------------------------
alter table public.profiles add column if not exists email text;

-- Populate email for users created from here on.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', null),
    new.email
  );
  return new;
end;
$$;

-- Backfill existing rows.
update public.profiles p
set email = u.email
from auth.users u
where u.id = p.id
  and p.email is null;
