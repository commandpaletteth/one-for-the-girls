"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { MEDIA_BUCKET, mediaUrl } from "@/lib/supabase/env";
import { newFileName, toWebp } from "@/lib/image";
import { btnGhost } from "@/lib/admin-ui";

/** Uploads straight to storage (resized, EXIF removed) and keeps the file path in a hidden input. */
export default function ImageField({
  name,
  defaultValue,
  folder,
  maxWidth,
  disabled,
}: {
  name: string;
  defaultValue: string | null;
  folder: string;
  maxWidth: number;
  disabled?: boolean;
}) {
  const [path, setPath] = useState(defaultValue ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function onFile(file?: File) {
    if (!file) return;
    setError("");
    setBusy(true);
    try {
      const { blob } = await toWebp(file, maxWidth);
      const target = newFileName(folder);
      const { error } = await createBrowserSupabase()
        .storage.from(MEDIA_BUCKET)
        .upload(target, blob, { contentType: "image/webp", cacheControl: "31536000" });
      if (error) throw new Error("Upload failed. Please try again.");
      setPath(target);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div>
      <input type="hidden" name={name} value={path} />
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex h-28 w-40 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-primary/30 bg-background">
          {path ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={mediaUrl(path)} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary/50">No photo</span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={disabled || busy}
            className={btnGhost}
          >
            {busy ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
            {path ? "Replace" : "Upload"}
          </button>
          {path && (
            <button type="button" onClick={() => setPath("")} disabled={disabled || busy} className={btnGhost}>
              <Trash2 size={16} /> Remove
            </button>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
      </div>
      {disabled && <p className="mt-2 text-xs text-muted">Uploading works once Supabase is connected.</p>}
      {error && <p className="mt-2 text-xs text-primary">{error}</p>}
    </div>
  );
}
