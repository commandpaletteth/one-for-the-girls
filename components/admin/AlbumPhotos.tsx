"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2, Play, Star, Trash2 } from "lucide-react";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { MEDIA_BUCKET, mediaUrl } from "@/lib/supabase/env";
import { newFileName, toWebp } from "@/lib/image";
import { addAlbumItems, deleteAlbumItem, setAlbumCover, type NewItem } from "@/app/admin/(panel)/actions";
import { btn, btnGhost, card, input } from "@/lib/admin-ui";
import ConfirmButton from "./ConfirmButton";

export type AlbumItem = { id: string; kind: string; path: string | null; video_url: string; caption: string };

export default function AlbumPhotos({
  albumId,
  items,
  coverPath,
  preview,
}: {
  albumId: string;
  items: AlbumItem[];
  coverPath: string | null;
  preview: boolean;
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const [video, setVideo] = useState("");
  const [pending, start] = useTransition();

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setError("");
    const supabase = createBrowserSupabase();
    const added: NewItem[] = [];
    const list = Array.from(files).slice(0, 50);
    for (let i = 0; i < list.length; i++) {
      setProgress(`Uploading ${i + 1} of ${list.length}…`);
      try {
        const { blob, width, height } = await toWebp(list[i], 1600);
        const path = newFileName("albums");
        const { error } = await supabase.storage
          .from(MEDIA_BUCKET)
          .upload(path, blob, { contentType: "image/webp", cacheControl: "31536000" });
        if (error) throw new Error(error.message);
        added.push({ path, width, height });
      } catch {
        setError(`Skipped “${list[i].name}” (could not read or upload it).`);
      }
    }
    setProgress("");
    if (fileRef.current) fileRef.current.value = "";
    if (added.length) {
      const res = await addAlbumItems(albumId, added);
      if (res.error) setError(res.error);
      router.refresh();
    }
  }

  function addVideo() {
    if (!video.trim()) return;
    start(async () => {
      const res = await addAlbumItems(albumId, [{ video_url: video.trim() }]);
      if (res.error) setError(res.error);
      else setVideo("");
      router.refresh();
    });
  }

  return (
    <section className={card}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl">Photos & videos</h2>
          <p className="mt-1 text-sm text-muted">
            Photos are resized and location data is removed before upload. You can pick several at once.
          </p>
        </div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={preview || !!progress}
          className={btn}
        >
          {progress ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
          {progress || "Add photos"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => onFiles(e.target.files)}
        />
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <input
          value={video}
          onChange={(e) => setVideo(e.target.value)}
          placeholder="Paste an Instagram reel or YouTube link"
          className={input}
          disabled={preview}
        />
        <button type="button" onClick={addVideo} disabled={preview || pending || !video.trim()} className={btnGhost}>
          <Play size={16} /> Add video
        </button>
      </div>

      {preview && <p className="mt-3 text-xs text-muted">Adding photos works once Supabase is connected.</p>}
      {error && <p className="mt-3 text-sm text-primary">{error}</p>}

      {items.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted">
          No photos yet.
        </p>
      ) : (
        <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((it) => {
            const isCover = !!it.path && it.path === coverPath;
            return (
              <li key={it.id} className="overflow-hidden rounded-2xl border border-border/50 bg-background">
                <div className="relative aspect-square">
                  {it.kind === "photo" && it.path ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={mediaUrl(it.path)} alt="" loading="lazy" className="h-full w-full object-cover" />
                  ) : (
                    <a
                      href={it.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-full flex-col items-center justify-center gap-2 p-3 text-center text-xs text-primary"
                    >
                      <Play size={22} /> <span className="line-clamp-2 break-all">{it.video_url}</span>
                    </a>
                  )}
                  {isCover && (
                    <span className="absolute left-2 top-2 rounded-full bg-white px-2 py-0.5 text-[10px] font-bold uppercase text-primary shadow">
                      Cover
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between gap-1 p-1">
                  {it.kind === "photo" && it.path && !isCover ? (
                    <button
                      type="button"
                      onClick={() => start(() => setAlbumCover(albumId, it.path!))}
                      className="inline-flex h-9 items-center gap-1 rounded-full px-3 text-xs text-muted hover:bg-blush hover:text-primary"
                    >
                      <Star size={14} /> Cover
                    </button>
                  ) : (
                    <span />
                  )}
                  <ConfirmButton action={() => deleteAlbumItem(albumId, it.id)} confirmText="Delete">
                    <Trash2 size={14} />
                  </ConfirmButton>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
