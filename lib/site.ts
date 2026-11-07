/**
 * Public address of the site, used for absolute links (sitemap, social share images).
 * Set NEXT_PUBLIC_SITE_URL once the domain is connected (e.g. https://oneforthegirls.com).
 * Until then Vercel's production address is used, or localhost when developing.
 */
export function siteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

/** Only the real website should be indexed by Google, not Vercel preview links. */
export const isIndexable = () => !process.env.VERCEL_ENV || process.env.VERCEL_ENV === "production";
