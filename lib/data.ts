import "server-only";
import content from "@/content/en.json";
import { createPublicSupabase } from "@/lib/supabase/public";
import { hasSupabase, mediaUrl } from "@/lib/supabase/env";
import { isPastEvent, lastDay, todayInBangkok } from "@/lib/events";
import { SITE_IMAGE_KEYS, settingKey } from "@/lib/site-images";
import type { Album, AlbumItem, Article, EventItem, Faq, Partner, Recap, Stat, Testimonial, Update } from "@/lib/content";

/**
 * Everything Jessica edits in /admin is read here.
 * - Supabase connected → published rows from the database.
 * - Not connected yet (no env vars) → the sample lists in content/en.json, so the site still builds.
 * On a database error we throw: a static page then keeps its last good version instead of going blank.
 */

function fail(what: string, error: { message: string }): never {
  throw new Error(`Supabase: could not load ${what}: ${error.message}`);
}

const db = () => createPublicSupabase();

// Events -----------------------------------------------------------------------------
type EventRow = {
  title: string;
  category: string;
  status: string;
  event_date: string | null;
  end_date: string | null;
  date_text: string;
  time_text: string;
  location: string;
  summary: string;
  booking_url: string;
  cover_path: string | null;
  recap: string;
  video_url: string;
  sort: number;
};

/** All published events, split into upcoming / past with the date rule in lib/events.ts. */
async function loadEvents() {
  const { data, error } = await db()
    .from("events")
    .select(
      "title, category, status, event_date, end_date, date_text, time_text, location, summary, booking_url, cover_path, recap, video_url, sort",
    );
  if (error) fail("events", error);
  const today = todayInBangkok();
  const rows = data as EventRow[];
  const byDate = (a: EventRow, b: EventRow) =>
    (a.event_date ?? "9999").localeCompare(b.event_date ?? "9999") || a.sort - b.sort;
  return {
    upcoming: rows.filter((e) => !isPastEvent(e, today)).sort(byDate),
    // Most recent first; undated past events go last.
    past: rows
      .filter((e) => isPastEvent(e, today))
      .sort((a, b) => (lastDay(b) ?? "0000").localeCompare(lastDay(a) ?? "0000") || a.sort - b.sort),
  };
}

export async function getUpcomingEvents(limit?: number): Promise<EventItem[]> {
  if (!hasSupabase()) return content.Events.upcoming.slice(0, limit);
  const { upcoming } = await loadEvents();
  return upcoming.slice(0, limit).map((e) => ({
    title: e.title,
    category: e.category,
    date: e.date_text,
    time: e.time_text,
    location: e.location,
    summary: e.summary,
    booking_url: e.booking_url,
    image: mediaUrl(e.cover_path),
  }));
}

export async function getRecaps(): Promise<Recap[]> {
  if (!hasSupabase()) return content.WhatsOn.recaps;
  const { past } = await loadEvents();
  return past.map((e) => ({
    title: e.title,
    category: e.category,
    date: e.date_text,
    // Moved to past automatically but no recap written yet: show the event description instead.
    summary: e.recap || e.summary,
    has_video: !!e.video_url,
    video_url: e.video_url || undefined,
    image: mediaUrl(e.cover_path),
  }));
}

// Gallery ----------------------------------------------------------------------------
const isUuid = (s: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);

export async function getAlbums(): Promise<Album[]> {
  if (!hasSupabase()) return content.Gallery.albums.map((a, i) => ({ id: `sample-${i}`, ...a }));
  const { data, error } = await db()
    .from("albums")
    .select("id, title, type, category, date_text, cover_path, album_items(count)")
    .order("event_date", { ascending: false, nullsFirst: false })
    .order("sort");
  if (error) fail("albums", error);
  return data.map((a) => ({
    id: a.id,
    title: a.title,
    type: a.type,
    category: a.category,
    date: a.date_text,
    count: (a.album_items as unknown as { count: number }[])[0]?.count ?? 0,
    image: mediaUrl(a.cover_path),
  }));
}

/** One album with its photos/videos, or undefined if it doesn't exist / is hidden. */
export async function getAlbum(id: string): Promise<{ album: Album; items: AlbumItem[] } | undefined> {
  if (!hasSupabase()) {
    const album = (await getAlbums()).find((a) => a.id === id);
    return album ? { album, items: [] } : undefined;
  }
  if (!isUuid(id)) return undefined;
  const [albumRes, itemsRes] = await Promise.all([
    db().from("albums").select("id, title, type, category, date_text, cover_path").eq("id", id).maybeSingle(),
    db()
      .from("album_items")
      .select("kind, path, video_url, caption, width, height")
      .eq("album_id", id)
      .order("sort")
      .order("created_at"),
  ]);
  if (albumRes.error) fail("album", albumRes.error);
  if (itemsRes.error) fail("album photos", itemsRes.error);
  const a = albumRes.data;
  if (!a) return undefined;
  const items: AlbumItem[] = itemsRes.data.map((it) => ({
    kind: it.kind === "video" ? "video" : "photo",
    src: mediaUrl(it.path),
    videoUrl: it.video_url || undefined,
    caption: it.caption,
    width: it.width ?? undefined,
    height: it.height ?? undefined,
  }));
  return {
    album: {
      id: a.id,
      title: a.title,
      type: a.type,
      category: a.category,
      date: a.date_text,
      count: items.length,
      image: mediaUrl(a.cover_path),
    },
    items,
  };
}

// Girl Talk --------------------------------------------------------------------------
type ArticleRow = {
  slug: string;
  title: string;
  topic: string;
  date_text: string;
  excerpt: string;
  body: string;
  published: boolean;
  cover_path: string | null;
};

const toArticle = (a: ArticleRow): Article => ({
  slug: a.slug,
  title: a.title,
  topic: a.topic,
  date: a.date_text,
  excerpt: a.excerpt,
  published: a.published,
  body: a.body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean),
  image: mediaUrl(a.cover_path),
});

const ARTICLE_COLS = "slug, title, topic, date_text, excerpt, body, published, cover_path";

/** Published articles only (visitors cannot see drafts). */
export async function getArticles(): Promise<Article[]> {
  if (!hasSupabase()) return content.GirlTalk.articles;
  const { data, error } = await db()
    .from("articles")
    .select(ARTICLE_COLS)
    .order("published_on", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });
  if (error) fail("articles", error);
  return (data as ArticleRow[]).map(toArticle);
}

export async function getArticle(slug: string): Promise<Article | undefined> {
  if (!hasSupabase()) return content.GirlTalk.articles.find((a) => a.slug === slug && a.published);
  const { data, error } = await db().from("articles").select(ARTICLE_COLS).eq("slug", slug).maybeSingle();
  if (error) fail("article", error);
  return data ? toArticle(data as ArticleRow) : undefined;
}

// Our Circle -------------------------------------------------------------------------
export async function getPartners(): Promise<Partner[]> {
  if (!hasSupabase()) return content.Circle.partners;
  const { data, error } = await db().from("partners").select("name, logo_path, website_url").order("sort");
  if (error) fail("partners", error);
  return data.map((p) => ({ name: p.name, logo: mediaUrl(p.logo_path), url: p.website_url || undefined }));
}

export async function getTestimonials(): Promise<Testimonial[]> {
  if (!hasSupabase()) return content.Circle.testimonials;
  const { data, error } = await db().from("testimonials").select("quote, name, role").order("sort");
  if (error) fail("testimonials", error);
  return data;
}

export async function getStats(): Promise<{ headline: Stat[]; audience: Stat[]; note: string }> {
  if (!hasSupabase()) {
    return { headline: content.Circle.stats, audience: content.Circle.audience, note: content.Circle.stats_note };
  }
  const [stats, note] = await Promise.all([
    db().from("stats").select("group, value, label, note").order("sort"),
    db().from("settings").select("value").eq("key", "stats_note").maybeSingle(),
  ]);
  if (stats.error) fail("stats", stats.error);
  if (note.error) fail("settings", note.error);
  const pick = (g: string) =>
    stats.data.filter((s) => s.group === g).map((s) => ({ value: s.value, label: s.label, note: s.note }));
  return { headline: pick("headline"), audience: pick("audience"), note: note.data?.value ?? "" };
}

// Home + Say Hello -------------------------------------------------------------------
export async function getUpdates(limit = 3): Promise<Update[]> {
  if (!hasSupabase()) return content.Home.updates.slice(0, limit);
  const { data, error } = await db()
    .from("updates")
    .select("tag, title, text, date_text")
    .order("sort")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) fail("updates", error);
  return data.map((u) => ({ tag: u.tag, title: u.title, text: u.text, date: u.date_text }));
}

export async function getFaqs(): Promise<Faq[]> {
  if (!hasSupabase()) return content.Hello.faqs;
  const { data, error } = await db().from("faqs").select("question, answer").order("sort");
  if (error) fail("FAQs", error);
  return data.map((f) => ({ q: f.question, a: f.answer }));
}

// Site photos (Admin → Site Photos) ----------------------------------------------------
/** Public URL per photo spot, e.g. images.hero. Missing = show the dashed placeholder. */
export async function getSiteImages(): Promise<Record<string, string | undefined>> {
  if (!hasSupabase()) return {};
  const { data, error } = await db()
    .from("settings")
    .select("key, value")
    .in("key", SITE_IMAGE_KEYS.map(settingKey));
  if (error) fail("site photos", error);
  return Object.fromEntries(
    SITE_IMAGE_KEYS.map((k) => [k, mediaUrl(data.find((r) => r.key === settingKey(k))?.value || null)]),
  );
}
