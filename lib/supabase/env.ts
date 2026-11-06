/** True once the Supabase env vars are set. Until then the site reads the sample lists in content/en.json. */
export function hasSupabase() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export const MEDIA_BUCKET = "oftg-media";

/** Public URL of a file in the media bucket (the bucket is public-read). */
export function mediaUrl(path?: string | null) {
  if (!path) return undefined;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${MEDIA_BUCKET}/${path}`;
}

/**
 * Admin preview: open /admin without logging in, with the sample data from content/en.json. Nothing can be saved.
 * Only while Supabase is NOT connected (turns itself off once the keys are added), and only:
 *  - in `npm run dev` on your machine, or
 *  - on a Vercel *Preview* deployment with ADMIN_DEMO=1 (so Jessica can try it). Never on Production.
 */
export function isAdminPreview() {
  if (hasSupabase()) return false;
  if (process.env.NODE_ENV === "development") return true;
  return process.env.ADMIN_DEMO === "1" && process.env.VERCEL_ENV === "preview";
}
