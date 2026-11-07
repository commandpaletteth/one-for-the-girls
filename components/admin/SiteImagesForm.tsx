"use client";

import { useActionState } from "react";
import { ExternalLink, Loader2 } from "lucide-react";
import type { SaveState } from "@/app/admin/(panel)/actions";
import type { SiteImageGroup } from "@/lib/site-images";
import ImageField from "./ImageField";
import { btn, card } from "@/lib/admin-ui";

export default function SiteImagesForm({
  groups,
  values,
  action,
  preview,
}: {
  groups: SiteImageGroup[];
  values: Record<string, string | null>;
  action: (prev: SaveState, form: FormData) => Promise<SaveState>;
  preview: boolean;
}) {
  const [state, formAction, pending] = useActionState<SaveState, FormData>(action, undefined);
  return (
    <form action={formAction} className="space-y-6">
      {groups.map((g) => (
        <section key={g.title} className={card}>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-serif text-2xl">{g.title}</h2>
            <a href={g.page} target="_blank" className="inline-flex items-center gap-1 text-sm text-muted hover:text-primary">
              <ExternalLink size={14} /> View page
            </a>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {g.slots.map((s) => (
              <div key={s.key}>
                <p className="mb-2 text-sm font-medium">{s.label}</p>
                <ImageField
                  name={s.key}
                  defaultValue={values[s.key] ?? null}
                  folder="site"
                  maxWidth={s.wide ? 2000 : 1600}
                  disabled={preview}
                />
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Sticky save bar so it is reachable after scrolling through all the photos. */}
      <div className="sticky bottom-4 z-10 flex flex-wrap items-center gap-3 rounded-3xl border border-border/50 bg-white/95 p-4 shadow-lg backdrop-blur">
        <button type="submit" disabled={pending} className={btn}>
          {pending && <Loader2 size={16} className="animate-spin" />} Save all photos
        </button>
        {state?.error && <p className="text-sm text-primary">{state.error}</p>}
        {state?.saved && <p className="text-sm text-primary">Saved. The website is updated.</p>}
        {!state && <p className="text-xs text-muted">Upload or replace photos, then save once at the end.</p>}
      </div>
    </form>
  );
}
