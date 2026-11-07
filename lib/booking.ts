/**
 * Adds "came from our website" tags (UTM) to booking links, so ticket sales from the website can be told apart
 * from Instagram etc. in Ticketmelon's traffic report (if it reads UTM tags). Leaves links that already have them.
 */
export function withUtm(url: string) {
  try {
    const u = new URL(url);
    if (!/^https?:$/.test(u.protocol) || u.searchParams.has("utm_source")) return url;
    u.searchParams.set("utm_source", "oneforthegirls-website");
    u.searchParams.set("utm_medium", "referral");
    u.searchParams.set("utm_campaign", "events");
    return u.toString();
  } catch {
    return url;
  }
}
