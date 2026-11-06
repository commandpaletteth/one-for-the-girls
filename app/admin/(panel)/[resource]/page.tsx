import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, EyeOff, Plus } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { getResource, optionLabel, RESOURCES } from "@/lib/admin-resources";
import { listRows } from "@/lib/admin-data";
import { mediaUrl } from "@/lib/supabase/env";
import { btn, card } from "@/lib/admin-ui";
import Notice from "@/components/admin/Notice";
import SettingForm from "@/components/admin/SettingForm";
import { saveSetting } from "../actions";
import content from "@/content/en.json";

type Props = { params: Promise<{ resource: string }>; searchParams: Promise<{ saved?: string; deleted?: string }> };

export function generateStaticParams() {
  return RESOURCES.map((r) => ({ resource: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: getResource((await params).resource)?.label };
}

export default async function ResourceList({ params, searchParams }: Props) {
  const resource = getResource((await params).resource);
  if (!resource) notFound();
  const { saved, deleted } = await searchParams;
  const session = await requireAdmin();
  const rows = await listRows(session, resource);
  const hasPublished = resource.fields.some((f) => f.name === "published");
  const imageField = resource.fields.find((f) => f.type === "image")?.name;

  let statsNote = "";
  if (resource.slug === "stats") {
    if (session.preview) statsNote = content.Circle.stats_note;
    else {
      const { data } = await session.supabase.from("settings").select("value").eq("key", "stats_note").maybeSingle();
      statsNote = data?.value ?? "";
    }
  }

  return (
    <div className="max-w-5xl">
      {saved && <Notice>Saved. The website is updated.</Notice>}
      {deleted && <Notice>Deleted.</Notice>}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl">{resource.label}</h1>
          <p className="mt-2 max-w-2xl text-muted">{resource.intro}</p>
        </div>
        <Link href={`/admin/${resource.slug}/new`} className={btn}>
          <Plus size={16} /> New {resource.singular}
        </Link>
      </div>

      {resource.slug === "stats" && (
        <div className={`${card} mb-6`}>
          <SettingForm
            title="Note under the numbers"
            hint="e.g. Figures as of November 2026. Leave empty to hide."
            defaultValue={statsNote}
            action={saveSetting.bind(null, "stats_note")}
          />
        </div>
      )}

      {rows.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-border p-10 text-center text-muted">
          Nothing here yet. Click “New {resource.singular}” to add one.
        </p>
      ) : (
        <ul className="divide-y divide-border/50 overflow-hidden rounded-3xl border border-border/50 bg-white">
          {rows.map((row) => {
            const img = imageField ? mediaUrl(row[imageField] as string | null) : undefined;
            const meta = resource.metaFields
              .map((m) => optionLabel(resource, m, row[m]))
              .filter((m) => m && m.toUpperCase() !== "TBC");
            return (
              <li key={row.id}>
                <Link
                  href={`/admin/${resource.slug}/${row.id}`}
                  className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-background"
                >
                  {imageField && (
                    <span className="h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-dashed border-primary/30 bg-background">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {img && <img src={img} alt="" className="h-full w-full object-cover" />}
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{String(row[resource.titleField] ?? "")}</span>
                    {meta.length > 0 && <span className="block truncate text-xs text-muted">{meta.join(" · ")}</span>}
                  </span>
                  {hasPublished && !row.published && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blush px-2.5 py-1 text-xs text-primary">
                      <EyeOff size={12} /> Hidden
                    </span>
                  )}
                  <ChevronRight size={18} className="shrink-0 text-muted" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
