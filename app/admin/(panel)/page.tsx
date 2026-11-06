import type { Metadata } from "next";
import content from "@/content/en.json";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Overview" };

const COUNTS = [
  { table: "events", label: "Events" },
  { table: "albums", label: "Albums" },
  { table: "articles", label: "Articles" },
  { table: "partners", label: "Partners" },
  { table: "contact_messages", label: "Messages" },
  { table: "subscribers", label: "Mailing Club" },
] as const;

type Count = { count: number | null; error: boolean };

/** Preview mode: count the sample lists in content/en.json instead. */
function sampleCounts(): { counts: Count[]; unread: number } {
  const n: Record<(typeof COUNTS)[number]["table"], number> = {
    events: content.Events.upcoming.length + content.WhatsOn.recaps.length,
    albums: content.Gallery.albums.length,
    articles: content.GirlTalk.articles.length,
    partners: content.Circle.partners.length,
    contact_messages: 0,
    subscribers: 0,
  };
  return { counts: COUNTS.map((c) => ({ count: n[c.table], error: false })), unread: 0 };
}

export default async function AdminOverview() {
  const session = await requireAdmin();
  let counts: Count[];
  let unread = 0;

  if (session.preview) {
    ({ counts, unread } = sampleCounts());
  } else {
    const { supabase } = session;
    const results = await Promise.all(
      COUNTS.map(({ table }) => supabase.from(table).select("*", { count: "exact", head: true })),
    );
    counts = results.map((r) => ({ count: r.count, error: !!r.error }));
    const u = await supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("is_read", false);
    unread = u.count ?? 0;
  }

  return (
    <div className="max-w-5xl">
      <h1 className="font-serif text-3xl md:text-4xl">Welcome back</h1>
      <p className="mt-2 text-muted">Everything you change here shows on the website within a few seconds.</p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {COUNTS.map((c, i) => (
          <div key={c.table} className="rounded-3xl border border-border/50 bg-white p-6 shadow-sm">
            <p className="text-sm text-muted">{c.label}</p>
            <p className="mt-1 font-serif text-4xl text-primary">{counts[i].error ? "–" : (counts[i].count ?? 0)}</p>
            {c.table === "contact_messages" && unread > 0 && (
              <p className="mt-1 text-xs font-medium text-primary">{unread} unread</p>
            )}
          </div>
        ))}
      </div>
      {counts.some((c) => c.error) && (
        <p className="mt-6 rounded-2xl bg-blush px-4 py-3 text-sm text-primary-dark">
          Some numbers could not be loaded. Check that the SQL files in /supabase have been run.
        </p>
      )}
    </div>
  );
}
