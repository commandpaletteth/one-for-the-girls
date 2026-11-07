import { NextResponse } from "next/server";
import { strToU8, zipSync } from "fflate";
import { requireAdmin } from "@/lib/auth";
import { sampleRows } from "@/lib/admin-samples";

// Monthly backup (free Supabase has no automatic backups): every table as JSON + messages/mailing club as CSV.
// Photos are NOT inside (they stay in storage); the JSON keeps their file paths.
const TABLES = [
  "events",
  "albums",
  "album_items",
  "articles",
  "partners",
  "testimonials",
  "stats",
  "updates",
  "faqs",
  "settings",
  "contact_messages",
  "subscribers",
] as const;

const csvCell = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""').replace(/^([=+\-@])/, "'$1")}"`;
const toCsv = (rows: Record<string, unknown>[], cols: string[]) =>
  [cols.join(","), ...rows.map((r) => cols.map((c) => csvCell(r[c])).join(","))].join("\n");

export async function GET() {
  const session = await requireAdmin();
  const data: Record<string, Record<string, unknown>[]> = {};

  for (const t of TABLES) {
    if (session.preview) {
      data[t] = sampleRows(t);
      continue;
    }
    const { data: rows, error } = await session.supabase.from(t).select("*").limit(50000);
    if (error) return new NextResponse(`Backup failed while reading ${t}. Nothing was downloaded.`, { status: 500 });
    data[t] = rows as Record<string, unknown>[];
  }

  const stamp = new Date().toISOString().slice(0, 10);
  const files: Record<string, Uint8Array> = {
    "README.txt": strToU8(
      `One For The Girls website backup, ${stamp}${session.preview ? " (PREVIEW: sample data)" : ""}\n\n` +
        "data/*.json  every table, as stored in the database\n" +
        "messages.csv / mailing-club.csv  the same data, easy to open in Google Sheets\n\n" +
        "Photos are not included: they stay in Supabase storage (bucket oftg-media); the JSON keeps their paths.\n",
    ),
    "messages.csv": strToU8(toCsv(data.contact_messages, ["created_at", "name", "email", "enquiry_type", "message", "is_read"])),
    "mailing-club.csv": strToU8(toCsv(data.subscribers, ["email", "source", "created_at"])),
  };
  for (const t of TABLES) files[`data/${t}.json`] = strToU8(JSON.stringify(data[t], null, 2));

  const zip = zipSync(files, { level: 6 });
  return new NextResponse(Buffer.from(zip), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="oftg-backup-${stamp}.zip"`,
      "Cache-Control": "no-store",
    },
  });
}
