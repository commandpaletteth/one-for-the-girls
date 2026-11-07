import { ArrowUpRight, Calendar, Clock, MapPin } from "lucide-react";
import Media from "./Media";
import type { EventItem } from "@/lib/content";
import { withUtm } from "@/lib/booking";

export type EventCardLabels = { photos: string; book: string; bookingSoon: string; soldOut: string };

export default function EventCard({
  event,
  categoryName,
  labels,
}: {
  event: EventItem;
  categoryName?: string;
  labels: EventCardLabels;
}) {
  const hasBooking = !!event.booking_url?.trim() && !event.sold_out;
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-border/50 bg-white shadow-sm">
      <Media src={event.image} alt={event.title} label={labels.photos} className="aspect-[4/3] rounded-none border-0 border-b-2">
        {event.sold_out && (
          <span className="absolute right-4 top-4 rounded-full bg-foreground px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
            {labels.soldOut}
          </span>
        )}
        {categoryName && (
          <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary shadow-sm">
            {categoryName}
          </span>
        )}
      </Media>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-serif text-xl text-foreground">{event.title}</h3>
        <ul className="mt-3 space-y-1.5 text-sm text-muted">
          <li className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" /> {event.date}
          </li>
          <li className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" /> {event.time}
          </li>
          <li className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" /> {event.location}
          </li>
        </ul>
        <p className="mt-4 flex-1 text-sm font-light leading-relaxed text-muted">{event.summary}</p>
        {hasBooking ? (
          <a
            href={withUtm(event.booking_url)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
          >
            {labels.book} <ArrowUpRight className="h-4 w-4" />
          </a>
        ) : (
          <span className="mt-6 inline-flex h-11 items-center justify-center rounded-full border border-border bg-background px-6 text-sm font-medium text-muted">
            {event.sold_out ? labels.soldOut : labels.bookingSoon}
          </span>
        )}
      </div>
    </article>
  );
}
