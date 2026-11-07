"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import FilterTabs from "./FilterTabs";
import Media from "./Media";
import { isSet, type Album, type Category } from "@/lib/content";

type Props = {
  types: { id: string; name: string }[];
  categories: Category[];
  albums: (Album & { countLabel: string })[];
  labels: { all: string; photos: string; video: string };
};

export default function GalleryBrowser({ types, categories, albums, labels }: Props) {
  const [type, setType] = useState("all");
  const [cat, setCat] = useState("all");
  const typeName = (id: string) => types.find((t) => t.id === id)?.name;
  const catName = (id: string) => categories.find((c) => c.id === id)?.name;
  const shown = albums.filter((a) => (type === "all" || a.type === type) && (cat === "all" || a.category === cat));

  return (
    <>
      <div className="mb-4">
        <FilterTabs options={[{ id: "all", name: labels.all }, ...types]} value={type} onChange={setType} />
      </div>
      <div className="mb-12">
        <FilterTabs options={[{ id: "all", name: labels.all }, ...categories]} value={cat} onChange={setCat} size="sm" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((a, i) => {
          const isVideo = a.type === "videos";
          return (
            <Link key={a.id} href={`/gallery/${a.id}`} className="group block">
              <Media
                src={a.image}
                alt={a.title}
                label={isVideo ? labels.video : labels.photos}
                kind={isVideo ? "video" : "photo"}
                className={i % 3 === 1 ? "aspect-[4/5]" : "aspect-[4/3]"}
              >
                <span className="absolute bottom-3 right-3 rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-muted shadow-sm">
                  {a.countLabel}
                </span>
              </Media>
              <p className="mt-4 text-[11px] font-bold uppercase tracking-wider text-primary">
                {typeName(a.type)} · {catName(a.category)}
                {isSet(a.date) && <span className="text-muted"> · {a.date}</span>}
              </p>
              <h2 className="mt-1 font-serif text-xl text-foreground transition-colors group-hover:text-primary">{a.title}</h2>
            </Link>
          );
        })}
      </div>
    </>
  );
}
