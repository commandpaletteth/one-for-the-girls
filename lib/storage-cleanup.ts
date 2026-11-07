import type { SupabaseClient } from "@supabase/supabase-js";
import { MEDIA_BUCKET } from "@/lib/supabase/env";

// Photos are uploaded the moment they're picked, before "Save". If the form is then cancelled, the file
// is never used. Once a day (keepalive cron) we delete such files. Safety rules:
//  - only inside our own folders, only files older than 24 hours (someone may be mid-edit),
//  - if ANY reference lookup fails, delete nothing,
//  - at most 200 files per run.
const FOLDERS = ["events", "albums", "articles", "partners", "site"];
const REFERENCES: { table: string; column: string }[] = [
  { table: "events", column: "cover_path" },
  { table: "albums", column: "cover_path" },
  { table: "album_items", column: "path" },
  { table: "articles", column: "cover_path" },
  { table: "partners", column: "logo_path" },
];
const MIN_AGE_MS = 24 * 60 * 60 * 1000;
const MAX_DELETE = 200;

export async function cleanupUnusedMedia(supabase: SupabaseClient, now = Date.now()) {
  const used = new Set<string>();
  for (const { table, column } of REFERENCES) {
    const { data, error } = await supabase.from(table).select(column).not(column, "is", null);
    if (error) return { deleted: 0, skipped: `could not read ${table}` };
    for (const row of data as unknown as Record<string, string>[]) used.add(row[column]);
  }
  const settings = await supabase.from("settings").select("value").like("key", "img_%");
  if (settings.error) return { deleted: 0, skipped: "could not read settings" };
  settings.data.forEach((r) => r.value && used.add(r.value));

  const unused: string[] = [];
  for (const folder of FOLDERS) {
    for (let offset = 0; ; offset += 1000) {
      const { data, error } = await supabase.storage.from(MEDIA_BUCKET).list(folder, { limit: 1000, offset });
      if (error) return { deleted: 0, skipped: `could not list ${folder}` };
      for (const f of data) {
        if (!f.id) continue; // sub-folder, not a file
        const path = `${folder}/${f.name}`;
        const created = f.created_at ? Date.parse(f.created_at) : now;
        if (!used.has(path) && now - created > MIN_AGE_MS) unused.push(path);
      }
      if (data.length < 1000) break;
    }
  }

  const batch = unused.slice(0, MAX_DELETE);
  if (batch.length) {
    const { error } = await supabase.storage.from(MEDIA_BUCKET).remove(batch);
    if (error) return { deleted: 0, skipped: "remove failed" };
  }
  return { deleted: batch.length, remaining: unused.length - batch.length };
}
