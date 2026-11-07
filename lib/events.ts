// When does an event count as "past"? Used by the public pages AND the admin list, so both always agree.

/** Today's date in Bangkok as YYYY-MM-DD (the server runs in UTC). */
export function todayInBangkok(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Bangkok" }).format(now);
}

type Dated = { status: string; event_date?: string | null; end_date?: string | null };

/** The last day of the event: end date for multi-day events, otherwise the date. Null = no date set. */
export const lastDay = (e: Dated) => e.end_date || e.event_date || null;

/**
 * Past = ticked as Past by hand, OR its last day is before today (Bangkok time).
 * An event moves to Past the day AFTER it happens, so it still shows as upcoming on the day itself.
 * Events without a date only move when switched by hand.
 */
export function isPastEvent(e: Dated, today = todayInBangkok()) {
  if (e.status === "past") return true;
  const last = lastDay(e);
  return !!last && last < today;
}
