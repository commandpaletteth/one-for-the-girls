-- One For The Girls — STEP 2: RLS + storage (run after 01-schema.sql)
--
-- BEFORE RUNNING: Supabase → Authentication → Sign In / Providers → Email
--   → turn OFF "Allow new users to sign up". Otherwise anyone could create an account and
--   become "authenticated" (= admin). Admins are added by hand: Authentication → Users → Add user.
--
-- Result:
--   visitors (anon)      → read published content only. Cannot read the inbox or subscribers.
--   logged-in (admins)   → read/write everything.
--   server (service role)→ saves contact messages / sign-ups after validating them, and runs the keepalive cron.

-- Table privileges (explicit, so it works whether "auto-expose new tables" was on or off) ---
grant usage on schema public to anon, authenticated, service_role;
revoke all on all tables in schema public from anon;
grant select, insert, update, delete on all tables in schema public to authenticated, service_role;
grant select on public.albums, public.album_items, public.articles, public.partners,
  public.testimonials, public.stats, public.updates, public.faqs, public.settings to anon;
-- Events: visitors may read every column EXCEPT the private results (tickets, attendees, capacity, revenue).
grant select (id, title, category, status, event_date, end_date, date_text, time_text, location, summary,
  booking_url, sold_out, cover_path, recap, video_url, published, sort, created_at, updated_at) on public.events to anon;

-- Admins: full access on every table ----------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'events','albums','album_items','articles','partners','testimonials','stats',
    'updates','faqs','settings','contact_messages','subscribers'
  ]
  loop
    execute format('alter table public.%I enable row level security;', t);
    execute format(
      'create policy "Admins full access" on public.%I for all to authenticated using (true) with check (true);', t);
  end loop;
end $$;

-- Visitors: published rows only ---------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['events','albums','articles','partners','testimonials','updates','faqs']
  loop
    execute format(
      'create policy "Public read published" on public.%I for select to anon using (published);', t);
  end loop;
end $$;

create policy "Public read items of published albums" on public.album_items for select to anon
  using (exists (select 1 from public.albums a where a.id = album_id and a.published));
create policy "Public read stats" on public.stats for select to anon using (true);
create policy "Public read settings" on public.settings for select to anon using (true);
-- contact_messages / subscribers: no anon policy at all = invisible to visitors.

-- Storage: public bucket for site images (anyone can view a file by URL, only admins upload) --
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('oftg-media', 'oftg-media', true, 5242880, array['image/webp','image/jpeg','image/png'])
on conflict (id) do update
  set public = true,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

create policy "Admins upload media" on storage.objects for insert to authenticated with check (bucket_id = 'oftg-media');
create policy "Admins update media" on storage.objects for update to authenticated using (bucket_id = 'oftg-media');
create policy "Admins delete media" on storage.objects for delete to authenticated using (bucket_id = 'oftg-media');
create policy "Admins list media"   on storage.objects for select to authenticated using (bucket_id = 'oftg-media');
