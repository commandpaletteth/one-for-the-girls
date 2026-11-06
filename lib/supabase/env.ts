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
 * Admin preview: ONLY in `npm run dev` on your machine and ONLY while Supabase is not connected.
 * Lets you open /admin without logging in, showing the sample data from content/en.json. Nothing can be saved.
 * On Vercel NODE_ENV is "production", so this can never turn on there.
 */
export function isAdminPreview() {
  return process.env.NODE_ENV === "development" && !hasSupabase();
}
