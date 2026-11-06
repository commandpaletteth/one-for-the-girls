import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { getResource } from "@/lib/admin-resources";
import ResourceForm from "@/components/admin/ResourceForm";
import { card } from "@/lib/admin-ui";
import { saveRow } from "../../actions";

type Props = { params: Promise<{ resource: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const r = getResource((await params).resource);
  return { title: r ? `New ${r.singular}` : undefined };
}

export default async function NewRow({ params }: Props) {
  const resource = getResource((await params).resource);
  if (!resource) notFound();
  const { preview } = await requireAdmin();
  return (
    <div className="max-w-3xl">
      <Link href={`/admin/${resource.slug}`} className="mb-6 inline-flex items-center gap-2 text-sm text-muted hover:text-primary">
        <ArrowLeft size={16} /> {resource.label}
      </Link>
      <h1 className="mb-8 font-serif text-3xl">New {resource.singular}</h1>
      <div className={card}>
        <ResourceForm
          fields={resource.fields}
          values={null}
          action={saveRow.bind(null, resource.slug, null)}
          cancelHref={`/admin/${resource.slug}`}
          preview={preview}
        />
      </div>
    </div>
  );
}
