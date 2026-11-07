import "server-only";
import { siteUrl } from "@/lib/site";

const esc = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * Emails Jessica when someone uses the Say Hello form. Optional: does nothing unless
 * RESEND_API_KEY and NOTIFY_EMAIL are set. Never throws: the message is already saved in the admin.
 * Note: with the default sender (onboarding@resend.dev) Resend only delivers to the email that owns
 * the Resend account. To send from your own address, verify the domain in Resend and set NOTIFY_FROM.
 */
export async function notifyNewMessage(m: { name: string; email: string; type: string; message: string }) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL?.split(",").map((s) => s.trim()).filter(Boolean);
  if (!key || !to?.length) return;

  const inbox = `${siteUrl()}/admin/messages`;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.NOTIFY_FROM || "One For The Girls website <onboarding@resend.dev>",
        to,
        reply_to: m.email, // "Reply" in the email app answers the sender directly
        subject: `New message: ${m.type} from ${m.name}`.slice(0, 200),
        text: `${m.name} <${m.email}>\nType: ${m.type}\n\n${m.message}\n\nAll messages: ${inbox}`,
        html: `<p><strong>${esc(m.name)}</strong> &lt;${esc(m.email)}&gt;<br/>Type: ${esc(m.type)}</p>
<blockquote style="border-left:4px solid #B85C5C;margin:0;padding:8px 12px;background:#FAF7F5;white-space:pre-wrap">${esc(m.message)}</blockquote>
<p><a href="${esc(inbox)}">Open Messages in your admin</a> · or just hit Reply.</p>`,
      }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) console.error("notify email failed:", res.status);
  } catch (e) {
    console.error("notify email failed:", e instanceof Error ? e.name : "unknown");
  }
}
