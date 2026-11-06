"use client";

import { useState } from "react";
import FilterTabs from "./FilterTabs";
import EventCard, { type EventCardLabels } from "./EventCard";
import PhotoBox from "./PhotoBox";
import Media from "./Media";
import { SectionHeading } from "./Section";
import { isSet, type Category, type EventItem, type Recap } from "@/lib/content";

type Props = {
  categories: Category[];
  events: EventItem[];
  recaps: Recap[];
  labels: EventCardLabels & {
    all: string;
    video: string;
    upcomingTitle: string;
    recapsTitle: string;
    recapsIntro: string;
    empty: string;
  };
};

export default function EventsBrowser({ categories, events, recaps, labels }: Props) {
  const [filter, setFilter] = useState("all");
  const nameOf = (id: string) => categories.find((c) => c.id === id)?.name;
  const match = (cat: string) => filter === "all" || cat === filter;
  const shownEvents = events.filter((e) => match(e.category));
  const shownRecaps = recaps.filter((r) => match(r.category));
  const options = [{ id: "all", name: labels.all }, ...categories];

  return (
    <>
      <div className="mb-14">
        <FilterTabs options={options} value={filter} onChange={setFilter} />
      </div>

      <h2 className="mb-8 font-serif text-2xl text-foreground md:text-3xl">{labels.upcomingTitle}</h2>
      {shownEvents.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shownEvents.map((e, i) => (
            <EventCard key={`${e.title}-${i}`} event={e} categoryName={nameOf(e.category)} labels={labels} />
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-border p-8 text-center text-muted">{labels.empty}</p>
      )}

      <div className="mt-24">
        <SectionHeading title={labels.recapsTitle} intro={labels.recapsIntro} center={false} />
        {shownRecaps.length ? (
          <div className="grid gap-8 md:grid-cols-2">
            {shownRecaps.map((r, i) => (
              <article key={`${r.title}-${i}`} className="grid gap-4 sm:grid-cols-[1fr_1fr]">
                <div className="grid grid-cols-2 gap-2">
                  <Media src={r.image} alt={r.title} label={labels.photos} className="col-span-2 aspect-[4/3]" />
                  <PhotoBox label={labels.photos} className="aspect-square" />
                  <PhotoBox
                    label={r.has_video ? labels.video : labels.photos}
                    kind={r.has_video ? "video" : "photo"}
                    className="aspect-square"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
                    {nameOf(r.category)}
                    {isSet(r.date) && <span className="text-muted"> · {r.date}</span>}
                  </p>
                  <h3 className="mt-2 font-serif text-2xl text-foreground">{r.title}</h3>
                  <p className="mt-3 text-sm font-light leading-relaxed text-muted">{r.summary}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-border p-8 text-center text-muted">{labels.empty}</p>
        )}
      </div>
    </>
  );
}
