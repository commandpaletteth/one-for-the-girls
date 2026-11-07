import type { Metadata } from "next";
import content from "@/content/en.json";
import { Download } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { sampleRows } from "@/lib/admin-samples";
import { computeEventStats, type EventResultRow } from "@/lib/event-stats";
import { todayInBangkok } from "@/lib/events";
import EventCharts from "@/components/admin/EventCharts";
import { btnGhost } from "@/lib/admin-ui";

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

  let resultRows: EventResultRow[] = [];
  if (session.preview) {
    ({ counts, unread } = sampleCounts());
    resultRows = sampleRows("events") as unknown as EventResultRow[];
  } else {
    const { supabase } = session;
    const results = await Promise.all(
      COUNTS.map(({ table }) => supabase.from(table).select("*", { count: "exact", head: true })),
    );
    counts = results.map((r) => ({ count: r.count, error: !!r.error }));
    const u = await supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("is_read", false);
    unread = u.count ?? 0;
    const ev = await supabase
      .from("events")
      .select("id, title, category, status, event_date, end_date, tickets_sold, attendees, capacity, revenue_gross, revenue_net");
    resultRows = (ev.data ?? []) as EventResultRow[];
  }
  const stats = computeEventStats(resultRows, todayInBangkok());

  return (
    <div className="max-w-5xl">
      <h1 className="font-serif text-3xl md:text-4xl">Welcome back</h1>
      <p className="mt-2 text-muted">Everything you change here shows on the website within a few seconds.</p>

      <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {COUNTS.map((c, i) => (
          <div key={c.table} className="rounded-3xl border border-border/50 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm text-muted">{c.label}</p>
            <p className="mt-1 font-serif text-4xl text-primary">{counts[i].error ? "–" : (counts[i].count ?? 0)}</p>
            {c.table === "contact_messages" && unread > 0 && (
              <p className="mt-1 text-xs font-medium text-primary">{unread} unread</p>
            )}
          </div>
        ))}
      </div>
      <div className="mt-12">
        <EventCharts stats={stats} categories={content.Categories.items} />
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-dashed border-border bg-white p-6">
        <div>
          <p className="font-medium">Backup</p>
          <p className="mt-1 text-sm text-muted">
            The free database has no automatic backups. Download one about once a month and keep it in Google Drive.
          </p>
        </div>
        <a href="/admin/backup" download className={btnGhost}>
          <Download size={16} /> Download backup
        </a>
      </div>

      {counts.some((c) => c.error) && (
        <p className="mt-6 rounded-2xl bg-blush px-4 py-3 text-sm text-primary-dark">
          Some numbers could not be loaded. Check that the SQL files in /supabase have been run.
        </p>
      )}
    </div>
  );
}
