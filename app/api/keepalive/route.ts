import { NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/admin";
import { hasSupabase } from "@/lib/supabase/env";

// Vercel Cron calls this once a day so the free Supabase project is never paused for inactivity (7 days).
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new NextResponse("unauthorized", { status: 401 });
  }
  if (!hasSupabase() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ ok: false, reason: "not configured" }, { status: 500 });
  }
  // A real query (not just a ping) so it counts as database activity.
  const { error } = await createServiceSupabase().from("settings").select("key").limit(1);
  if (error) {
    console.error("keepalive failed:", error.code, error.message);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
