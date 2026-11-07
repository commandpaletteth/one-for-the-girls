"use server";

import { requireAdmin } from "@/lib/auth";

export type PasswordState = { error?: string; saved?: boolean } | undefined;

export async function changePassword(_prev: PasswordState, form: FormData): Promise<PasswordState> {
  const session = await requireAdmin();
  if (session.preview) return { error: "Preview mode: nothing is saved until Supabase is connected." };
  const password = String(form.get("password") ?? "");
  const confirm = String(form.get("confirm") ?? "");
  if (password.length < 10) return { error: "Use at least 10 characters." };
  if (password !== confirm) return { error: "The two passwords don't match." };
  const { error } = await session.supabase.auth.updateUser({ password });
  if (error) return { error: error.code === "same_password" ? "That's your current password." : "Could not change the password. Please try again." };
  return { saved: true };
}
