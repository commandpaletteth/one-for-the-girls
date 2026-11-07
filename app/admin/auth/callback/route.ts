import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createServerSupabase } from "@/lib/supabase/server";
import { hasSupabase } from "@/lib/supabase/env";

// Landing page of the "reset password" email link: turns the link into a logged-in session,
// then sends the admin to /admin/account to choose a new password.
export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const nextParam = url.searchParams.get("next") ?? "/admin/account";
  const next = nextParam.startsWith("/admin") ? nextParam : "/admin"; // never redirect off-site
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;
  if (!hasSupabase() || (!code && !(tokenHash && type))) {
    return NextResponse.redirect(new URL("/admin/login?link=expired", request.url));
  }
  const supabase = await createServerSupabase();

  let ok = false;
  if (code) ok = !(await supabase.auth.exchangeCodeForSession(code)).error;
  else if (tokenHash && type) ok = !(await supabase.auth.verifyOtp({ token_hash: tokenHash, type })).error;

  const dest = new URL(ok ? next : "/admin/login?link=expired", request.url);
  if (ok && next === "/admin/account") dest.searchParams.set("reset", "1");
  return NextResponse.redirect(dest);
}
