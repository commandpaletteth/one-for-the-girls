import type { computeEventStats } from "@/lib/event-stats";
import { card } from "@/lib/admin-ui";

type Stats = ReturnType<typeof computeEventStats>;
type Cat = { id: string; name: string };

// Full class names (Tailwind only keeps classes it can see written out).
const CAT_BG: Record<string, string> = {
  wellness: "bg-cat-wellness",
  creative: "bg-cat-creative",
  sports: "bg-cat-sports",
  social: "bg-cat-social",
};

const thb = (n: number) => `฿${Math.round(n).toLocaleString("en-US")}`;
const shortDate = (d: string | null) =>
  d ? new Date(`${d}T00:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "";

export default function EventCharts({ stats, categories }: { stats: Stats; categories: Cat[] }) {
  const { totals, recent, byCategory, year } = stats;
  const catName = (id: string) => categories.find((c) => c.id === id)?.name ?? id;

  if (recent.length === 0) {
    return (
      <section className={card}>
        <h2 className="font-serif text-2xl">Event results</h2>
        <p className="mt-2 text-sm text-muted">
          After an event, open it in Events and fill in the <strong>Results</strong> (tickets, people who came, sales).
          Charts appear here.
        </p>
      </section>
    );
  }

  const maxPeople = Math.max(1, ...recent.map((r) => Math.max(r.attendees ?? 0, r.capacity ?? 0, r.ticketsSold ?? 0)));
  const maxMoney = Math.max(1, ...recent.map((r) => r.gross ?? r.net ?? 0));
  const kpis = [
    { label: `Events with results (${year})`, value: String(totals.events) },
    { label: "People who came", value: totals.attendees.toLocaleString("en-US") },
    { label: "Average per event", value: totals.avgAttendees != null ? String(totals.avgAttendees) : "–" },
    { label: "Average full", value: totals.avgFill != null ? `${totals.avgFill}%` : "–" },
    ...(totals.hasMoney
      ? [
          { label: "Ticket sales", value: thb(totals.gross) },
          { label: "Payout received", value: thb(totals.net) },
        ]
      : []),
  ];

  return (
    <section className="space-y-6">
      <h2 className="font-serif text-2xl">Event results</h2>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-3xl bg-blush p-5">
            <p className="text-xs text-muted">{k.label}</p>
            <p className="mt-1 font-serif text-3xl text-primary">{k.value}</p>
          </div>
        ))}
      </div>

      {/* Attendance per event: dark bar = came, light bar = capacity */}
      <div className={card}>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-medium">People per event (last {recent.length})</h3>
          <div className="flex flex-wrap gap-3 text-xs text-muted">
            {categories.map((c) => (
              <span key={c.id} className="inline-flex items-center gap-1.5">
                <span className={`h-2.5 w-2.5 rounded-full ${CAT_BG[c.id] ?? "bg-primary"}`} /> {c.name}
              </span>
            ))}
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-4 rounded-full bg-border/60" /> Capacity
            </span>
          </div>
        </div>
        <ul className="space-y-3">
          {recent.map((r) => (
            <li key={r.id} className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1.5 text-sm sm:grid-cols-[minmax(0,14rem)_1fr_auto]">
              <span className="col-span-2 min-w-0 sm:col-span-1">
                <span className="block truncate" title={r.title}>
                  {r.title}
                </span>
                <span className="block text-xs text-muted">
                  {shortDate(r.date)} · {catName(r.category)}
                </span>
              </span>
              <span className="relative h-5 overflow-hidden rounded-full bg-background">
                {r.capacity != null && (
                  <span className="absolute inset-y-0 left-0 rounded-full bg-border/60" style={{ width: `${(r.capacity / maxPeople) * 100}%` }} />
                )}
                <span
                  className={`absolute inset-y-0 left-0 rounded-full ${CAT_BG[r.category] ?? "bg-primary"}`}
                  style={{ width: `${((r.attendees ?? r.ticketsSold ?? 0) / maxPeople) * 100}%` }}
                />
              </span>
              <span className="w-16 text-right tabular-nums text-muted">
                {r.attendees ?? r.ticketsSold ?? "–"}
                {r.capacity != null && <span className="text-xs">/{r.capacity}</span>}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {totals.hasMoney && (
        <div className={card}>
          <h3 className="mb-5 font-medium">Ticket sales per event (THB)</h3>
          <ul className="space-y-3">
            {recent
              .filter((r) => r.gross != null || r.net != null)
              .map((r) => (
                <li key={r.id} className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1.5 text-sm sm:grid-cols-[minmax(0,14rem)_1fr_auto]">
                  <span className="col-span-2 truncate sm:col-span-1" title={r.title}>
                    {r.title}
                  </span>
                  <span className="relative h-5 overflow-hidden rounded-full bg-background">
                    <span className="absolute inset-y-0 left-0 rounded-full bg-secondary/40" style={{ width: `${((r.gross ?? 0) / maxMoney) * 100}%` }} />
                    <span className="absolute inset-y-0 left-0 rounded-full bg-secondary" style={{ width: `${((r.net ?? 0) / maxMoney) * 100}%` }} />
                  </span>
                  <span className="w-24 text-right tabular-nums text-muted">{thb(r.gross ?? r.net ?? 0)}</span>
                </li>
              ))}
          </ul>
          <p className="mt-4 text-xs text-muted">Light = ticket sales before fees · Dark = payout received</p>
        </div>
      )}

      {byCategory.size > 0 && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {categories
            .filter((c) => byCategory.has(c.id))
            .map((c) => {
              const v = byCategory.get(c.id)!;
              return (
                <div key={c.id} className="rounded-3xl border border-border/50 bg-white p-5">
                  <p className="flex items-center gap-2 text-xs text-muted">
                    <span className={`h-2.5 w-2.5 rounded-full ${CAT_BG[c.id] ?? "bg-primary"}`} /> {c.name} · {year}
                  </p>
                  <p className="mt-2 font-serif text-2xl">{v.attendees.toLocaleString("en-US")}</p>
                  <p className="text-xs text-muted">
                    people · {v.events} event{v.events === 1 ? "" : "s"}
                    {v.gross > 0 && ` · ${thb(v.gross)}`}
                  </p>
                </div>
              );
            })}
        </div>
      )}
    </section>
  );
}
