import { isPastEvent, lastDay } from "@/lib/events";

// Numbers for the Overview charts, from the private "Results" fields of past events.
export type EventResultRow = {
  id: string;
  title: string;
  category: string;
  status: string;
  event_date: string | null;
  end_date: string | null;
  tickets_sold: number | null;
  attendees: number | null;
  capacity: number | null;
  revenue_gross: number | string | null; // numeric comes back from Postgres as a string
  revenue_net: number | string | null;
};

export type EventResult = {
  id: string;
  title: string;
  category: string;
  date: string | null;
  attendees: number | null;
  capacity: number | null;
  ticketsSold: number | null;
  gross: number | null;
  net: number | null;
};

const num = (v: number | string | null) => (v == null || v === "" ? null : Number(v));

export function computeEventStats(rows: EventResultRow[], today: string) {
  const year = today.slice(0, 4);
  const results: EventResult[] = rows
    .filter((r) => isPastEvent(r, today))
    .map((r) => ({
      id: r.id,
      title: r.title,
      category: r.category,
      date: lastDay(r),
      attendees: r.attendees,
      capacity: r.capacity,
      ticketsSold: r.tickets_sold,
      gross: num(r.revenue_gross),
      net: num(r.revenue_net),
    }))
    .filter((r) => r.attendees != null || r.ticketsSold != null || r.gross != null || r.net != null)
    .sort((a, b) => (a.date ?? "0000").localeCompare(b.date ?? "0000"));

  const thisYear = results.filter((r) => r.date?.startsWith(year));
  const sum = (list: EventResult[], k: "attendees" | "gross" | "net" | "ticketsSold") =>
    list.reduce((t, r) => t + (r[k] ?? 0), 0);
  const withAtt = thisYear.filter((r) => r.attendees != null);
  const withFill = thisYear.filter((r) => r.attendees != null && r.capacity);

  const byCategory = new Map<string, { events: number; attendees: number; gross: number }>();
  for (const r of thisYear) {
    const c = byCategory.get(r.category) ?? { events: 0, attendees: 0, gross: 0 };
    c.events += 1;
    c.attendees += r.attendees ?? 0;
    c.gross += r.gross ?? 0;
    byCategory.set(r.category, c);
  }

  return {
    year,
    totals: {
      events: thisYear.length,
      attendees: sum(thisYear, "attendees"),
      avgAttendees: withAtt.length ? Math.round(sum(withAtt, "attendees") / withAtt.length) : null,
      avgFill: withFill.length
        ? Math.round((withFill.reduce((t, r) => t + r.attendees! / r.capacity!, 0) / withFill.length) * 100)
        : null,
      gross: sum(thisYear, "gross"),
      net: sum(thisYear, "net"),
      hasMoney: thisYear.some((r) => r.gross != null || r.net != null),
    },
    recent: results.slice(-12), // last 12 events with results, oldest first
    byCategory,
  };
}
