"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createServiceSupabase } from "@/lib/supabase/admin";

export type TeamState = { ok?: string; error?: string } | undefined;

const PREVIEW_MSG = "Preview mode: nothing is saved until Supabase is connected.";
const MIN_PASSWORD = 10;
const isUuid = (s: string) => /^[0-9a-f-]{36}$/i.test(s);

/**
 * Every action checks the caller is a logged-in admin BEFORE touching the service-role client
 * (which can create/delete accounts). Public sign-ups are off, so this page is the only way in.
 */
async function guard() {
  const session = await requireAdmin();
  if (session.preview) return { error: PREVIEW_MSG } as const;
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return { error: "SUPABASE_SERVICE_ROLE_KEY is not set." } as const;
  return { me: session.user, admin: createServiceSupabase() } as const;
}

export async function addAdmin(_prev: TeamState, form: FormData): Promise<TeamState> {
  const g = await guard();
  if ("error" in g) return { error: g.error };
  const email = String(form.get("email") ?? "").trim().toLowerCase().slice(0, 320);
  const name = String(form.get("name") ?? "").trim().slice(0, 80);
  const password = String(form.get("password") ?? "");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return { error: "Please enter a valid email address." };
  if (password.length < MIN_PASSWORD) return { error: `The temporary password needs at least ${MIN_PASSWORD} characters.` };

  const { error } = await g.admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // they can log in straight away; no confirmation email needed
    user_metadata: { name },
  });
  if (error) {
    return { error: /already|registered|exists/i.test(error.message) ? "This email already has an account." : "Could not add this person." };
  }
  revalidatePath("/admin/team");
  return { ok: `Added ${email}. Send them the temporary password privately and ask them to change it in Account.` };
}

export async function removeAdmin(id: string): Promise<TeamState> {
  const g = await guard();
  if ("error" in g) return { error: g.error };
  if (!isUuid(id)) return { error: "Unknown account." };
  if (id === g.me.id) return { error: "You can't remove yourself." };
  const { data, error: listError } = await g.admin.auth.admin.listUsers({ perPage: 200 });
  if (listError) return { error: "Could not check the team." };
  if (data.users.length <= 1) return { error: "There must always be at least one admin." };

  const { error } = await g.admin.auth.admin.deleteUser(id);
  if (error) return { error: "Could not remove this person." };
  revalidatePath("/admin/team");
  return { ok: "Removed." };
}

export async function setTemporaryPassword(id: string, _prev: TeamState, form: FormData): Promise<TeamState> {
  const g = await guard();
  if ("error" in g) return { error: g.error };
  if (!isUuid(id)) return { error: "Unknown account." };
  const password = String(form.get("password") ?? "");
  if (password.length < MIN_PASSWORD) return { error: `Use at least ${MIN_PASSWORD} characters.` };
  const { error } = await g.admin.auth.admin.updateUserById(id, { password });
  if (error) return { error: "Could not change the password." };
  return { ok: "Password changed. Send it to them privately." };
}

export async function renameAdmin(id: string, _prev: TeamState, form: FormData): Promise<TeamState> {
  const g = await guard();
  if ("error" in g) return { error: g.error };
  if (!isUuid(id)) return { error: "Unknown account." };
  const name = String(form.get("name") ?? "").trim().slice(0, 80);
  if (!name) return { error: "Enter a name." };
  const { error } = await g.admin.auth.admin.updateUserById(id, { user_metadata: { name } });
  if (error) return { error: "Could not save the name." };
  revalidatePath("/admin/team");
  return { ok: "Saved." };
}
