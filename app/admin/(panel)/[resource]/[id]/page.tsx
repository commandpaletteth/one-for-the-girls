import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Trash2 } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { getResource } from "@/lib/admin-resources";
import { getRow } from "@/lib/admin-data";
import ResourceForm from "@/components/admin/ResourceForm";
import ConfirmButton from "@/components/admin/ConfirmButton";
import AlbumPhotos, { type AlbumItem } from "@/components/admin/AlbumPhotos";
import { card } from "@/lib/admin-ui";
import { deleteRow, saveRow } from "../../actions";

type Props = { params: Promise<{ resource: string; id: string }> };

export const metadata: Metadata = { title: "Edit" };

// Where each section shows on the public site (for the "View on website" link).
const PUBLIC_PATH: Record<string, string> = {
  events: "/whats-on",
  gallery: "/gallery",
  "girl-talk": "/girl-talk",
  partners: "/our-circle",
  testimonials: "/our-circle",
  stats: "/our-circle",
  updates: "/",
  faqs: "/say-hello",
};

export default async function EditRow({ params }: Props) {
  const { resource: slug, id } = await params;
  const resource = getResource(slug);
  if (!resource) notFound();
  const session = await requireAdmin();
  const row = await getRow(session, resource.table, id);
  if (!row) notFound();

  let items: AlbumItem[] = [];
  if (resource.table === "albums" && !session.preview) {
    const { data } = await session.supabase
      .from("album_items")
      .select("id, kind, path, video_url, caption")
      .eq("album_id", id)
      .order("sort");
    items = (data ?? []) as AlbumItem[];
  }

  const publicHref =
    resource.slug === "girl-talk" && row.published ? `/girl-talk/${row.slug}` : PUBLIC_PATH[resource.slug];

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <Link href={`/admin/${slug}`} className="mb-6 inline-flex items-center gap-2 text-sm text-muted hover:text-primary">
          <ArrowLeft size={16} /> {resource.label}
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-serif text-3xl">{String(row[resource.titleField] ?? `Edit ${resource.singular}`)}</h1>
          <div className="flex items-center gap-1">
            {publicHref && (
              <a
                href={publicHref}
                target="_blank"
                className="inline-flex h-9 items-center gap-2 rounded-full px-4 text-sm text-muted hover:bg-blush hover:text-primary"
              >
                <ExternalLink size={14} /> View on website
              </a>
            )}
            <ConfirmButton action={deleteRow.bind(null, slug, id)} disabled={session.preview}>
              <Trash2 size={14} /> Delete
            </ConfirmButton>
          </div>
        </div>
      </div>

      <div className={card}>
        <ResourceForm
          fields={resource.fields}
          values={row}
          action={saveRow.bind(null, slug, id)}
          cancelHref={`/admin/${slug}`}
          preview={session.preview}
        />
      </div>

      {resource.table === "albums" && (
        <AlbumPhotos
          albumId={id}
          items={items}
          coverPath={(row.cover_path as string | null) ?? null}
          preview={session.preview}
        />
      )}
    </div>
  );
}
