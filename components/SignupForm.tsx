"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { subscribe } from "@/app/[locale]/form-actions";

// Mailing club sign-up → saved in the database (Admin → Mailing Club).
export default function SignupForm({
  labels,
}: {
  labels: { placeholder: string; button: string; note: string; done: string; invalid: string; error: string; notConnected: string };
}) {
  const [message, setMessage] = useState(labels.note);
  const [pending, start] = useTransition();

  return (
    <div className="mx-auto max-w-md">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formEl = e.currentTarget;
          const data = new FormData(formEl);
          start(async () => {
            const res = await subscribe(data);
            if (res.ok) formEl.reset();
            setMessage(
              res.ok
                ? labels.done
                : res.reason === "invalid"
                  ? labels.invalid
                  : res.reason === "not_connected"
                    ? labels.notConnected
                    : labels.error,
            );
          });
        }}
        className="flex flex-col gap-3 sm:flex-row"
      >
        <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
        <input
          type="email"
          name="email"
          required
          maxLength={320}
          autoComplete="email"
          placeholder={labels.placeholder}
          aria-label={labels.placeholder}
          className="h-12 flex-1 rounded-full border border-white/40 bg-white px-5 text-foreground outline-none placeholder:text-muted/60 focus:border-secondary"
        />
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-7 font-medium text-white transition-colors hover:bg-black disabled:opacity-60"
        >
          {pending && <Loader2 size={16} className="animate-spin" />} {labels.button}
        </button>
      </form>
      <p role="status" className="mt-3 text-sm text-white/80">
        {message}
      </p>
    </div>
  );
}
