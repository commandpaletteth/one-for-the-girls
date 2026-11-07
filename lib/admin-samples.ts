import "server-only";
import content from "@/content/en.json";

// Preview mode only (npm run dev, Supabase not connected): rows shaped like the database, built from content/en.json.
export type Row = Record<string, unknown> & { id: string };

const withIds = (prefix: string, rows: Record<string, unknown>[]): Row[] =>
  rows.map((r, i) => ({ id: `${prefix}-${i}`, ...r }));

export function sampleRows(table: string): Row[] {
  switch (table) {
    case "events":
      return withIds("event", [
        ...content.Events.upcoming.map((e, i) => ({
          title: e.title,
          category: e.category,
          status: "upcoming",
          event_date: null,
          end_date: null,
          date_text: e.date,
          time_text: e.time,
          location: e.location,
          summary: e.summary,
          booking_url: e.booking_url,
          cover_path: null,
          recap: "",
          video_url: "",
          published: true,
          sort: i,
        })),
        ...content.WhatsOn.recaps.map((r, i) => ({
          title: r.title,
          category: r.category,
          status: "past",
          event_date: null,
          end_date: null,
          date_text: "",
          time_text: "",
          location: "Bangkok",
          summary: "",
          booking_url: "",
          cover_path: null,
          recap: r.summary,
          video_url: "",
          published: true,
          sort: i,
        })),
      ]);
    case "albums":
      return withIds(
        "album",
        content.Gallery.albums.map((a, i) => ({
          title: a.title,
          type: a.type,
          category: a.category,
          event_date: null,
          date_text: "",
          cover_path: null,
          published: true,
          sort: i,
        })),
      );
    case "articles":
      return withIds(
        "article",
        content.GirlTalk.articles.map((a) => ({
          slug: a.slug,
          title: a.title,
          topic: a.topic,
          published_on: null,
          date_text: "",
          excerpt: a.excerpt,
          body: a.body.join("\n\n"),
          cover_path: null,
          published: a.published,
        })),
      );
    case "partners":
      return withIds(
        "partner",
        content.Circle.partners.map((p, i) => ({ name: p.name, logo_path: null, website_url: "", published: true, sort: i })),
      );
    case "testimonials":
      return withIds(
        "testimonial",
        content.Circle.testimonials.map((t, i) => ({ ...t, published: true, sort: i })),
      );
    case "stats":
      return withIds("stat", [
        ...content.Circle.stats.map((s, i) => ({ group: "headline", value: s.value, label: s.label, note: s.note, sort: i })),
        ...content.Circle.audience.map((s, i) => ({ group: "audience", value: s.value, label: s.label, note: "", sort: i })),
      ]);
    case "updates":
      return withIds(
        "update",
        content.Home.updates.map((u, i) => ({
          tag: u.tag,
          title: u.title,
          text: u.text,
          date_text: "",
          published: true,
          sort: i,
        })),
      );
    case "faqs":
      return withIds(
        "faq",
        content.Hello.faqs.map((f, i) => ({ question: f.q, answer: f.a, published: true, sort: i })),
      );
    case "album_items":
      return [];
    case "contact_messages":
      return withIds("msg", [
        {
          name: "Sample: Anna",
          email: "anna@example.com",
          enquiry_type: "events",
          message: "Hi! Is the padel event OK for complete beginners? (sample message, preview only)",
          is_read: false,
          created_at: new Date().toISOString(),
        },
        {
          name: "Sample: Brand Co.",
          email: "hello@example.com",
          enquiry_type: "partnerships",
          message: "We'd love to sponsor a wellness morning. (sample message, preview only)",
          is_read: true,
          created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
        },
      ]);
    case "subscribers":
      return withIds("sub", [
        { email: "sample1@example.com", source: "home", created_at: new Date().toISOString() },
        { email: "sample2@example.com", source: "home", created_at: new Date(Date.now() - 86400000).toISOString() },
      ]);
    default:
      return [];
  }
}
