# One For The Girls — website + admin

Next.js 16 · Tailwind 3 · next-intl (English only) · Supabase (database, login, image storage).

- Public site: `app/[locale]/…` — page texts in `content/en.json`, UI labels in `messages/en.json`.
- Admin (for Jessica): `/admin` — events, gallery, Girl Talk, partners, stats, updates, FAQs, messages, mailing club.
- Lists the admin edits are read in `lib/data.ts`. **Before Supabase is connected** the site shows the sample
  lists from `content/en.json` and `/admin` is locked. After connecting, those JSON lists are only a fallback.

## Connect Supabase (one time)

1. Project owned by Jessica's Supabase account; Bobby invited as **Developer**. Region: Singapore.
2. Authentication → Sign In / Providers → Email → turn **off** "Allow new users to sign up".
3. SQL Editor → run in order: `supabase/01-schema.sql`, `02-security.sql`, `03-seed.sql` (seed = optional sample content).
4. Authentication → Users → **Add user** for each admin (Jessica, Bobby). That is the only way to get an account.
5. Copy `.env.example` → `.env.local` and fill in (Project Settings → API). Add the same vars on Vercel
   (Production + Preview), then redeploy. Run the SQL **before** adding the env vars (pages read the tables at build).
6. Password reset emails (owner setting, Jessica): Authentication → URL Configuration → Site URL = the live site,
   and add `https://<site>/admin/auth/callback` (and the preview URL while testing) to Redirect URLs.
   Supabase's built-in email only delivers to members of the Supabase organisation, which is fine for admins.
7. Remove `ADMIN_DEMO` from Vercel once Supabase is connected.

## Optional

- `RESEND_API_KEY` + `NOTIFY_EMAIL`: email alert for each new Say Hello message (resend.com free plan).
- `NEXT_PUBLIC_SITE_URL`: the real domain once connected (sitemap, share images).

## Free-plan notes

- Supabase pauses after 7 days without activity → Vercel Cron calls `/api/keepalive` daily (`vercel.json`, needs `CRON_SECRET`).
  **Vercel runs crons on Production only**, so while the site lives on a preview branch, open the site/admin at least weekly.
  The same cron deletes uploaded photos that were never saved (older than 24h, see `lib/storage-cleanup.ts`).
- Storage 1 GB / egress 5 GB a month: images are resized to WebP and stripped of EXIF in the browser before upload.
- Free plan has no automatic backups.
