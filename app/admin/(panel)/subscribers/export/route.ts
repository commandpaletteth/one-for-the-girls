import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { sampleRows } from "@/lib/admin-samples";

// CSV download of the mailing club (admins only; proxy.ts and requireAdmin both check).
export async function GET() {
  const session = await requireAdmin();
  let rows: { email: string; source: string; created_at: string }[];
  if (session.preview) rows = sampleRows("subscribers") as unknown as typeof rows;
  else {
    const { data, error } = await session.supabase
      .from("subscribers")
      .select("email, source, created_at")
      .order("created_at", { ascending: true });
    if (error) return new NextResponse("Could not load the list.", { status: 500 });
    rows = data;
  }
  // Quote every cell; a leading = + - @ is neutralised so spreadsheets don't run it as a formula.
  const cell = (v: string) => `"${String(v ?? "").replace(/"/g, '""').replace(/^([=+\-@])/, "'$1")}"`;
  const csv = ["email,source,signed_up", ...rows.map((r) => [r.email, r.source, r.created_at].map(cell).join(","))].join("\n");
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="oftg-mailing-club-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
