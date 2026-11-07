"use client";

import { useActionState, useRef } from "react";
import { Loader2, UserPlus } from "lucide-react";
import { addAdmin, type TeamState } from "./actions";
import { btn, help, input, label } from "@/lib/admin-ui";

export default function AddAdminForm({ preview }: { preview: boolean }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState<TeamState, FormData>(async (prev, form) => {
    const r = await addAdmin(prev, form);
    if (r?.ok) formRef.current?.reset();
    return r;
  }, undefined);

  return (
    <form ref={formRef} action={action} className="grid gap-4 sm:grid-cols-2">
      <label className="block">
        <span className={label}>Name</span>
        <input name="name" maxLength={80} className={input} placeholder="e.g. Anna (events helper)" />
      </label>
      <label className="block">
        <span className={label}>
          Email <span className="text-primary">*</span>
        </span>
        <input name="email" type="email" required autoComplete="off" className={input} />
      </label>
      <label className="block">
        <span className={label}>
          Temporary password <span className="text-primary">*</span>
        </span>
        <input name="password" type="text" minLength={10} required autoComplete="off" className={input} />
        <span className={help}>At least 10 characters. They change it in Account after logging in.</span>
      </label>
      <div className="flex items-end">
        <button type="submit" disabled={pending || preview} className={btn}>
          {pending ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />} Add admin
        </button>
      </div>
      {state && (
        <p role="status" className="text-sm text-primary sm:col-span-2">
          {state.error ?? state.ok}
        </p>
      )}
    </form>
  );
}
