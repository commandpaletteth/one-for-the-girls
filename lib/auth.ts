import "server-only";
import { redirect } from "next/navigation";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createServerSupabase } from "@/lib/supabase/server";
import { isAdminPreview } from "@/lib/supabase/env";

export type AdminSession =
  | { preview: false; supabase: SupabaseClient; user: User }
  | { preview: true; supabase: null; user: { email: string } };

/**
 * First line of every /admin page and server action. proxy.ts already blocks logged-out visitors,
 * this is the second lock (server actions can be called directly).
 * In local preview mode (see isAdminPreview) it returns a fake user and no database client.
 */
export async function requireAdmin(): Promise<AdminSession> {
  if (isAdminPreview()) return { preview: true, supabase: null, user: { email: "preview@localhost" } };
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return { preview: false, supabase, user };
}

/** For server actions that write: refuses in preview mode. */
export async function requireWritableAdmin() {
  const session = await requireAdmin();
  if (session.preview) throw new Error("Preview mode: connect Supabase to save changes.");
  return session;
}
