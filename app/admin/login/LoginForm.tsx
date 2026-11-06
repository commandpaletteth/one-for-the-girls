"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";
import { btnPrimary, cn } from "@/lib/utils";

const field =
  "w-full rounded-2xl border border-border bg-white px-4 py-3 text-foreground outline-none transition-colors focus:border-primary";

export default function LoginForm({ disabled }: { disabled?: boolean }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, undefined);
  return (
    <form action={action} className="space-y-4">
      <label className="block">
        <span className="mb-2 block text-sm font-medium">Email</span>
        <input name="email" type="email" autoComplete="username" required className={field} disabled={disabled} />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-medium">Password</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={field}
          disabled={disabled}
        />
      </label>
      {state?.error && (
        <p role="alert" className="rounded-2xl bg-blush px-4 py-3 text-sm text-primary-dark">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending || disabled} className={cn(btnPrimary, "w-full disabled:opacity-60")}>
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
