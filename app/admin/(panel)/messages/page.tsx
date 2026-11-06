import type { Metadata } from "next";
import { Mail, MailOpen, Reply, Trash2 } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { sampleRows } from "@/lib/admin-samples";
import ConfirmButton from "@/components/admin/ConfirmButton";
import content from "@/content/en.json";
import { cn } from "@/lib/utils";
import { deleteMessage, setMessageRead } from "../actions";

export const metadata: Metadata = { title: "Messages" };

type Message = {
  id: string;
  name: string;
  email: string;
  enquiry_type: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

const typeLabel = (id: string) => content.Hello.types.find((t) => t.id === id)?.title ?? id;
const when = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Bangkok" });

export default async function MessagesPage() {
  const session = await requireAdmin();
  let messages: Message[];
  if (session.preview) messages = sampleRows("contact_messages") as unknown as Message[];
  else {
    const { data, error } = await session.supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    messages = data as Message[];
  }

  return (
    <div className="max-w-4xl">
      <h1 className="font-serif text-3xl md:text-4xl">Messages</h1>
      <p className="mt-2 text-muted">Everything sent through the Say Hello form. Reply opens your email app.</p>

      {messages.length === 0 ? (
        <p className="mt-8 rounded-3xl border border-dashed border-border p-10 text-center text-muted">No messages yet.</p>
      ) : (
        <ul className="mt-8 space-y-4">
          {messages.map((m) => (
            <li
              key={m.id}
              className={cn(
                "rounded-3xl border bg-white p-6 shadow-sm",
                m.is_read ? "border-border/50" : "border-primary/40",
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium">
                    {!m.is_read && <span className="mr-2 inline-block h-2 w-2 rounded-full bg-primary align-middle" />}
                    {m.name} <span className="font-normal text-muted">· {m.email}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-muted">
                    {typeLabel(m.enquiry_type)} · {when(m.created_at)}
                  </p>
                </div>
              </div>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed">{m.message}</p>
              <div className="mt-4 flex flex-wrap gap-1 border-t border-border/50 pt-3">
                <a
                  href={`mailto:${m.email}?subject=${encodeURIComponent("Re: your message to One For The Girls")}`}
                  className="inline-flex h-9 items-center gap-2 rounded-full px-4 text-sm font-medium text-primary hover:bg-blush"
                >
                  <Reply size={14} /> Reply
                </a>
                <form action={setMessageRead.bind(null, m.id, !m.is_read)}>
                  <button
                    type="submit"
                    disabled={session.preview}
                    className="inline-flex h-9 items-center gap-2 rounded-full px-4 text-sm text-muted hover:bg-blush hover:text-primary disabled:opacity-40"
                  >
                    {m.is_read ? <Mail size={14} /> : <MailOpen size={14} />}
                    {m.is_read ? "Mark unread" : "Mark read"}
                  </button>
                </form>
                <ConfirmButton action={deleteMessage.bind(null, m.id)} disabled={session.preview}>
                  <Trash2 size={14} /> Delete
                </ConfirmButton>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
