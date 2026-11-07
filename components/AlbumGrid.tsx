"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import type { AlbumItem } from "@/lib/content";

type Labels = { close: string; prev: string; next: string; watch: string; photoOf: string };

/** Photo grid + full-screen viewer (arrows, Esc, swipe). Videos open on Instagram/YouTube. */
export default function AlbumGrid({ items, title, labels }: { items: AlbumItem[]; title: string; labels: Labels }) {
  const photos = items.filter((i) => i.kind === "photo" && i.src);
  const videos = items.filter((i) => i.kind === "video" && i.videoUrl);
  const [open, setOpen] = useState<number | null>(null);
  const touchX = useRef<number | null>(null);

  const total = photos.length;
  const go = (dir: 1 | -1) => setOpen((i) => (i === null ? i : (i + dir + total) % total));

  const isOpen = open !== null;
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i === null ? i : (i + 1) % total));
      if (e.key === "ArrowLeft") setOpen((i) => (i === null ? i : (i - 1 + total) % total));
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, total]);

  const current = open !== null ? photos[open] : null;

  return (
    <>
      {videos.length > 0 && (
        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((v, i) => (
            <a
              key={i}
              href={v.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-w-0 items-center gap-4 overflow-hidden rounded-3xl border border-border/50 bg-white p-5 shadow-sm transition-colors hover:border-primary/40"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                <Play size={18} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-medium text-foreground group-hover:text-primary">{v.caption || labels.watch}</span>
                <span className="block truncate text-xs text-muted">{v.videoUrl}</span>
              </span>
            </a>
          ))}
        </div>
      )}

      {/* Masonry-style columns keep each photo's own shape. */}
      <div className="columns-2 gap-3 md:columns-3 md:gap-4">
        {photos.map((p, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setOpen(i)}
            className="mb-3 block w-full overflow-hidden rounded-2xl bg-blush focus:outline-none focus-visible:ring-2 focus-visible:ring-primary md:mb-4"
            style={p.width && p.height ? { aspectRatio: `${p.width} / ${p.height}` } : undefined}
            aria-label={labels.photoOf.replace("{n}", String(i + 1)).replace("{total}", String(photos.length))}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.src} alt={p.caption || title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]" />
          </button>
        ))}
      </div>

      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90"
          onClick={() => setOpen(null)}
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
            touchX.current = null;
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current.src}
            alt={current.caption || title}
            className="max-h-[85vh] max-w-[92vw] rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <p className="absolute bottom-5 left-0 right-0 text-center text-sm text-white/80">
            {current.caption && <span className="mr-2">{current.caption} ·</span>}
            {(open ?? 0) + 1} / {photos.length}
          </p>
          <button
            type="button"
            aria-label={labels.close}
            onClick={() => setOpen(null)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <X size={22} />
          </button>
          {photos.length > 1 && (
            <>
              <button
                type="button"
                aria-label={labels.prev}
                onClick={(e) => {
                  e.stopPropagation();
                  go(-1);
                }}
                className="absolute left-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 sm:block"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                type="button"
                aria-label={labels.next}
                onClick={(e) => {
                  e.stopPropagation();
                  go(1);
                }}
                className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 sm:block"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
