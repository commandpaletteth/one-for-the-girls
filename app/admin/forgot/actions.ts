"use server";

import { headers } from "next/headers";
import { createServerSupabase } from "@/lib/supabase/server";
import { hasSupabase } from "@/lib/supabase/env";

export type ForgotState = { sent?: boolean; error?: string } | undefined;

/** Emails a reset link. Always answers the same way, so nobody can test which emails have an account. */
export async function requestReset(_prev: ForgotState, form: FormData): Promise<ForgotState> {
  if (!hasSupabase()) return { error: "The admin isn't connected to the database yet." };
  const email = String(form.get("email") ?? "").trim().slice(0, 320);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return { error: "Please enter a valid email address." };

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${proto}://${host}/admin/auth/callback?next=/admin/account`,
  });
  if (error) console.error("reset email failed:", error.status, error.code);
  return { sent: true };
}
