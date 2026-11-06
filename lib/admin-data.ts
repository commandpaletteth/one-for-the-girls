import "server-only";
import type { AdminSession } from "@/lib/auth";
import type { Resource } from "@/lib/admin-resources";
import { sampleRows, type Row } from "@/lib/admin-samples";

export type { Row };

/** All rows of a section, for the admin list (drafts included). */
export async function listRows(session: AdminSession, resource: Resource): Promise<Row[]> {
  if (session.preview) return sampleRows(resource.table);
  let q = session.supabase.from(resource.table).select("*");
  for (const o of resource.order) q = q.order(o.column, { ascending: o.ascending, nullsFirst: false });
  const { data, error } = await q;
  if (error) throw new Error(`Could not load ${resource.label}: ${error.message}`);
  return data as Row[];
}

export async function getRow(session: AdminSession, table: string, id: string): Promise<Row | null> {
  if (session.preview) return sampleRows(table).find((r) => r.id === id) ?? null;
  const { data, error } = await session.supabase.from(table).select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(`Could not load: ${error.message}`);
  return (data as Row) ?? null;
}
