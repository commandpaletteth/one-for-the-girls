"use client";

import { useActionState } from "react";
import { requestReset, type ForgotState } from "./actions";
import { btnPrimary, cn } from "@/lib/utils";

export default function ForgotForm({ disabled }: { disabled?: boolean }) {
  const [state, action, pending] = useActionState<ForgotState, FormData>(requestReset, undefined);
  if (state?.sent) {
    return (
      <p role="status" className="rounded-2xl bg-blush px-4 py-3 text-sm text-primary-dark">
        If that email has an admin account, a reset link is on its way. Check your inbox (and spam folder).
      </p>
    );
  }
  return (
    <form action={action} className="space-y-4">
      <label className="block">
        <span className="mb-2 block text-sm font-medium">Email</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="username"
          disabled={disabled}
          className="w-full rounded-2xl border border-border bg-white px-4 py-3 outline-none focus:border-primary"
        />
      </label>
      {state?.error && (
        <p role="alert" className="rounded-2xl bg-blush px-4 py-3 text-sm text-primary-dark">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending || disabled} className={cn(btnPrimary, "w-full disabled:opacity-60")}>
        {pending ? "Sending..." : "Send reset link"}
      </button>
    </form>
  );
}
