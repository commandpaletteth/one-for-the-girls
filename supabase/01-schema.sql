-- One For The Girls — STEP 1: tables (run first, in Supabase → SQL Editor)
--
-- What lives here = what Jessica edits in /admin. Page texts (hero, headings) stay in content/en.json.
-- Images are files in the "oftg-media" storage bucket; tables keep only their path.


-- updated_at helper --------------------------------------------------------
create or replace function public.set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- Events -------------------------------------------------------------------------------
-- An event shows as a recap ("past") when status = 'past' OR its last day (end_date, else event_date)
-- is before today in Bangkok. That rule lives in lib/events.ts (used by the site and the admin).
create table public.events (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  category     text not null check (category in ('wellness','creative','sports','social')),
  status       text not null default 'upcoming' check (status in ('upcoming','past')),
  event_date   date,                         -- the day of the event (sorting + moves to past the day after)
  end_date     date,                         -- optional, last day of a multi-day event
  date_text    text not null default 'Date TBC',
  time_text    text not null default 'Time TBC',
  location     text not null default 'Bangkok',
  summary      text not null default '',
  booking_url  text not null default '',     -- empty = "Booking opens soon"
  cover_path   text,                         -- storage path in oftg-media
  recap        text not null default '',     -- shown when status = past
  video_url    text not null default '',     -- Instagram reel / YouTube link for the recap
  published    boolean not null default true,
  sort         int not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  constraint events_end_after_start check (end_date is null or (event_date is not null and end_date >= event_date))
);

-- Gallery ------------------------------------------------------------------
create table public.albums (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  type        text not null check (type in ('highlights','bts','community','videos','albums')),
  category    text not null check (category in ('wellness','creative','sports','social')),
  event_date  date,
  date_text   text not null default '',
  cover_path  text,
  published   boolean not null default true,
  sort        int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table public.album_items (
  id          uuid primary key default gen_random_uuid(),
  album_id    uuid not null references public.albums(id) on delete cascade,
  kind        text not null default 'photo' check (kind in ('photo','video')),
  path        text,                          -- photo: storage path
  video_url   text not null default '',      -- video: Instagram / YouTube link
  caption     text not null default '',
  width       int,
  height      int,
  sort        int not null default 0,
  created_at  timestamptz not null default now()
);
create index album_items_album_idx on public.album_items (album_id, sort);

-- Girl Talk ----------------------------------------------------------------
create table public.articles (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title         text not null,
  topic         text not null check (topic in ('life','empowerment','wellness','career','lifestyle','stories')),
  published_on  date,
  date_text     text not null default '',
  excerpt       text not null default '',
  body          text not null default '',    -- paragraphs separated by a blank line
  cover_path    text,
  published     boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Our Circle ---------------------------------------------------------------
create table public.partners (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  logo_path   text,
  website_url text not null default '',
  published   boolean not null default true,
  sort        int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table public.testimonials (
  id          uuid primary key default gen_random_uuid(),
  quote       text not null,
  name        text not null,
  role        text not null default '',
  published   boolean not null default true,
  sort        int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- headline = big numbers (3k+ followers), audience = where our girls are (60% ...)
create table public.stats (
  id          uuid primary key default gen_random_uuid(),
  "group"     text not null check ("group" in ('headline','audience')),
  value       text not null,
  label       text not null,
  note        text not null default '',
  sort        int not null default 0,
  updated_at  timestamptz not null default now()
);

-- Home + Say Hello ---------------------------------------------------------
create table public.updates (
  id          uuid primary key default gen_random_uuid(),
  tag         text not null default '',
  title       text not null,
  text        text not null default '',
  date_text   text not null default '',
  published   boolean not null default true,
  sort        int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table public.faqs (
  id          uuid primary key default gen_random_uuid(),
  question    text not null,
  answer      text not null,
  published   boolean not null default true,
  sort        int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Small editable values (e.g. stats_note). key/value so new ones need no migration.
create table public.settings (
  key         text primary key,
  value       text not null default '',
  updated_at  timestamptz not null default now()
);

-- Inbox: written only by the server (service role), read by admins ------------
create table public.contact_messages (
  id            uuid primary key default gen_random_uuid(),
  name          text not null check (char_length(name) <= 200),
  email         text not null check (char_length(email) <= 320),
  enquiry_type  text not null default 'general',
  message       text not null check (char_length(message) <= 5000),
  is_read       boolean not null default false,
  created_at    timestamptz not null default now()
);

create table public.subscribers (
  id          uuid primary key default gen_random_uuid(),
  email       text not null check (char_length(email) <= 320),
  source      text not null default 'home',
  created_at  timestamptz not null default now()
);
create unique index subscribers_email_key on public.subscribers (lower(email));

-- updated_at triggers -------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['events','albums','articles','partners','testimonials','stats','updates','faqs','settings']
  loop
    execute format(
      'create trigger %I before update on public.%I for each row execute function public.set_updated_at();',
      t || '_updated_at', t);
  end loop;
end $$;
