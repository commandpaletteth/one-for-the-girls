"use server";

import { revalidatePath } from "next/cache";
import { createServiceSupabase } from "@/lib/supabase/admin";
import { hasSupabase } from "@/lib/supabase/env";
import content from "@/content/en.json";
import { notifyNewMessage } from "@/lib/notify";

export type FormResult = { ok: true } | { ok: false; reason: "invalid" | "not_connected" | "error" };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ENQUIRY_TYPES = content.Hello.types.map((t) => t.id);
const connected = () => hasSupabase() && !!process.env.SUPABASE_SERVICE_ROLE_KEY;

// Say Hello form → contact_messages (read in /admin/messages).
export async function submitContact(form: FormData): Promise<FormResult> {
  // Honeypot: real people never see/fill this field. Pretend it worked so bots don't retry.
  if (String(form.get("company") ?? "")) return { ok: true };
  const name = String(form.get("name") ?? "").trim().slice(0, 200);
  const email = String(form.get("email") ?? "").trim().slice(0, 320);
  const message = String(form.get("message") ?? "").trim().slice(0, 5000);
  const type = String(form.get("type") ?? "");
  if (!name || !EMAIL.test(email) || !message) return { ok: false, reason: "invalid" };
  if (!connected()) return { ok: false, reason: "not_connected" };

  const enquiryType = ENQUIRY_TYPES.includes(type) ? type : "general";
  const { error } = await createServiceSupabase()
    .from("contact_messages")
    .insert({ name, email, message, enquiry_type: enquiryType });
  if (error) {
    console.error("contact insert failed:", error.code);
    return { ok: false, reason: "error" };
  }
  const typeTitle = content.Hello.types.find((t) => t.id === enquiryType)?.title ?? enquiryType;
  await notifyNewMessage({ name, email, type: typeTitle, message });
  revalidatePath("/admin/messages");
  return { ok: true };
}

// Mailing club sign-up → subscribers (read in /admin/subscribers).
export async function subscribe(form: FormData): Promise<FormResult> {
  if (String(form.get("company") ?? "")) return { ok: true };
  const email = String(form.get("email") ?? "").trim().slice(0, 320);
  if (!EMAIL.test(email)) return { ok: false, reason: "invalid" };
  if (!connected()) return { ok: false, reason: "not_connected" };

  const { error } = await createServiceSupabase().from("subscribers").insert({ email, source: "home" });
  // 23505 = already signed up: same friendly answer (don't reveal who is on the list).
  if (error && error.code !== "23505") {
    console.error("subscribe failed:", error.code);
    return { ok: false, reason: "error" };
  }
  return { ok: true };
}
