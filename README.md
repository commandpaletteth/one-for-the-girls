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
5. Copy `.env.example` → `.env.local` and fill in (Project Settings → API). Add the same 4 vars on Vercel
   (Production + Preview), then redeploy.

## Free-plan notes

- Supabase pauses after 7 days without activity → Vercel Cron calls `/api/keepalive` daily (`vercel.json`, needs `CRON_SECRET`).
- Storage 1 GB / egress 5 GB a month: images are resized to WebP and stripped of EXIF in the browser before upload.
- Free plan has no automatic backups.
