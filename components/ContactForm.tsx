"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Send } from "lucide-react";
import { btnPrimary } from "@/lib/utils";

type Props = {
  types: { id: string; title: string }[];
  email: string; // Site.email in content. Empty = form not connected yet.
  labels: { name: string; email: string; type: string; message: string; submit: string; notConnected: string };
};

const field =
  "w-full rounded-2xl border border-border bg-white px-4 py-3 text-foreground outline-none transition-colors placeholder:text-muted/50 focus:border-primary";

// No backend yet: opens the visitor's mail app when Site.email is set, otherwise shows a note.
export default function ContactForm({ types, email, labels }: Props) {
  const params = useSearchParams();
  const initial = types.some((t) => t.id === params.get("type")) ? params.get("type")! : types[0]?.id;
  const [note, setNote] = useState("");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (!email) {
      setNote(labels.notConnected);
      return;
    }
    const typeTitle = types.find((t) => t.id === data.get("type"))?.title ?? "";
    const subject = `${typeTitle}: ${data.get("name")}`;
    const body = `${data.get("message")}\n\n${data.get("name")} (${data.get("email")})`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-foreground">{labels.name}</span>
          <input name="name" required autoComplete="name" className={field} />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-foreground">{labels.email}</span>
          <input name="email" type="email" required autoComplete="email" className={field} />
        </label>
      </div>
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-foreground">{labels.type}</span>
        <select name="type" defaultValue={initial} key={initial} className={field}>
          {types.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-foreground">{labels.message}</span>
        <textarea name="message" required rows={5} className={field} />
      </label>
      <button type="submit" className={btnPrimary}>
        {labels.submit} <Send size={16} />
      </button>
      {note && (
        <p role="status" className="rounded-2xl bg-blush px-4 py-3 text-sm text-primary-dark">
          {note}
        </p>
      )}
    </form>
  );
}
