"use client";

import { useState } from "react";

// Mailing club sign-up. Not connected to a mailing service yet: shows a note on submit.
export default function SignupForm({
  labels,
}: {
  labels: { placeholder: string; button: string; note: string; notConnected: string };
}) {
  const [done, setDone] = useState(false);

  return (
    <div className="mx-auto max-w-md">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setDone(true);
        }}
        className="flex flex-col gap-3 sm:flex-row"
      >
        <input
          type="email"
          required
          autoComplete="email"
          placeholder={labels.placeholder}
          aria-label={labels.placeholder}
          className="h-12 flex-1 rounded-full border border-white/40 bg-white px-5 text-foreground outline-none placeholder:text-muted/60 focus:border-secondary"
        />
        <button
          type="submit"
          className="h-12 rounded-full bg-foreground px-7 font-medium text-white transition-colors hover:bg-black"
        >
          {labels.button}
        </button>
      </form>
      <p role="status" className="mt-3 text-sm text-white/80">
        {done ? labels.notConnected : labels.note}
      </p>
    </div>
  );
}
