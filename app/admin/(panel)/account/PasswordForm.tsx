"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { changePassword, type PasswordState } from "./actions";
import { btn, input, label } from "@/lib/admin-ui";

export default function PasswordForm() {
  const [state, action, pending] = useActionState<PasswordState, FormData>(changePassword, undefined);
  return (
    <form action={action} className="space-y-4">
      <label className="block">
        <span className={label}>New password</span>
        <input name="password" type="password" required minLength={10} autoComplete="new-password" className={input} />
      </label>
      <label className="block">
        <span className={label}>Type it again</span>
        <input name="confirm" type="password" required minLength={10} autoComplete="new-password" className={input} />
      </label>
      {state?.error && <p role="alert" className="text-sm text-primary">{state.error}</p>}
      {state?.saved && <p role="status" className="text-sm text-primary">Password changed.</p>}
      <button type="submit" disabled={pending} className={btn}>
        {pending && <Loader2 size={16} className="animate-spin" />} Change password
      </button>
    </form>
  );
}
