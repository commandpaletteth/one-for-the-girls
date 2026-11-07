"use client";

import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, Send } from "lucide-react";
import { btnPrimary, cn } from "@/lib/utils";
import { submitContact } from "@/app/[locale]/form-actions";
import { Link } from "@/i18n/navigation";

type Props = {
  types: { id: string; title: string }[];
  email: string; // Site.email: used as a fallback (opens the mail app) while the database is not connected.
  labels: {
    name: string;
    email: string;
    type: string;
    message: string;
    submit: string;
    sending: string;
    sent: string;
    error: string;
    invalid: string;
    notConnected: string;
    consent: string;
    privacy: string;
  };
};

const field =
  "w-full rounded-2xl border border-border bg-white px-4 py-3 text-foreground outline-none transition-colors placeholder:text-muted/50 focus:border-primary";

export default function ContactForm({ types, email, labels }: Props) {
  const params = useSearchParams();
  const initial = types.some((t) => t.id === params.get("type")) ? params.get("type")! : types[0]?.id;
  const [note, setNote] = useState<{ text: string; ok: boolean } | null>(null);
  const [pending, start] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const data = new FormData(formEl);
    start(async () => {
      const res = await submitContact(data);
      if (res.ok) {
        formEl.reset();
        setNote({ text: labels.sent, ok: true });
      } else if (res.reason === "not_connected" && email) {
        // Not connected yet: open the visitor's mail app instead.
        const typeTitle = types.find((t) => t.id === data.get("type"))?.title ?? "";
        const subject = `${typeTitle}: ${data.get("name")}`;
        const body = `${data.get("message")}\n\n${data.get("name")} (${data.get("email")})`;
        window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      } else {
        const text = res.reason === "invalid" ? labels.invalid : res.reason === "not_connected" ? labels.notConnected : labels.error;
        setNote({ text, ok: false });
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Honeypot for spam bots: hidden from people and screen readers. */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-foreground">{labels.name}</span>
          <input name="name" required maxLength={200} autoComplete="name" className={field} />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-foreground">{labels.email}</span>
          <input name="email" type="email" required maxLength={320} autoComplete="email" className={field} />
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
        <textarea name="message" required maxLength={5000} rows={5} className={field} />
      </label>
      <button type="submit" disabled={pending} className={cn(btnPrimary, "disabled:opacity-60")}>
        {pending ? (
          <>
            {labels.sending} <Loader2 size={16} className="animate-spin" />
          </>
        ) : (
          <>
            {labels.submit} <Send size={16} />
          </>
        )}
      </button>
      <p className="text-xs text-muted">
        {labels.consent}{" "}
        <Link href="/privacy" className="underline hover:text-primary">
          {labels.privacy}
        </Link>
      </p>
      {note && (
        <p
          role="status"
          className={cn("rounded-2xl px-4 py-3 text-sm", note.ok ? "bg-blush text-primary-dark" : "bg-blush text-primary")}
        >
          {note.text}
        </p>
      )}
    </form>
  );
}
