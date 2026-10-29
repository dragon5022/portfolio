-- Guestbook table for the portfolio. Run this in Supabase: SQL Editor → New query → paste → Run.
-- Visitors can read and add rows with the public anon key; only you (dashboard) can edit or delete.
-- Safe to run again (e.g. after updating this file).

create table if not exists public.guestbook (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 1 and 40),
  rating      int  not null check (rating between 1 and 5),
  message     text not null check (char_length(message) between 3 and 500),
  created_at  timestamptz not null default now()
);

create index if not exists guestbook_created_at_idx on public.guestbook (created_at desc);

alter table public.guestbook enable row level security;

drop policy if exists "guestbook public read" on public.guestbook;
create policy "guestbook public read"
  on public.guestbook for select
  to anon
  using (true);

drop policy if exists "guestbook public insert" on public.guestbook;
create policy "guestbook public insert"
  on public.guestbook for insert
  to anon
  with check (true);

-- Visitors may only write name, rating and message: id and created_at always come from the defaults,
-- so nobody can backdate a message or pin it to the top with a future date.
-- No update/delete rights: the anon key cannot change or remove messages.
revoke all on public.guestbook from anon, authenticated;
grant select on public.guestbook to anon;
grant insert (name, rating, message) on public.guestbook to anon;

-- Flood guard: at most 5 new messages per minute and 30 per hour across the whole site.
-- PostgREST turns SQLSTATE PT429 into HTTP 429, which the site shows as "Too many messages".
create or replace function public.guestbook_throttle()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if (select count(*) from public.guestbook where created_at > now() - interval '1 minute') >= 5
     or (select count(*) from public.guestbook where created_at > now() - interval '1 hour') >= 30 then
    raise exception 'Too many messages right now' using errcode = 'PT429';
  end if;
  return new;
end;
$$;

drop trigger if exists guestbook_throttle on public.guestbook;
create trigger guestbook_throttle
  before insert on public.guestbook
  for each row execute function public.guestbook_throttle();
