"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import type { SaveState } from "@/app/admin/(panel)/actions";
import { btn, help, input, label } from "@/lib/admin-ui";

export default function SettingForm({
  title,
  hint,
  defaultValue,
  action,
}: {
  title: string;
  hint?: string;
  defaultValue: string;
  action: (prev: SaveState, form: FormData) => Promise<SaveState>;
}) {
  const [state, formAction, pending] = useActionState<SaveState, FormData>(action, undefined);
  return (
    <form action={formAction} className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <label className="block flex-1">
        <span className={label}>{title}</span>
        <input name="value" defaultValue={defaultValue} className={input} />
        {hint && <span className={help}>{hint}</span>}
      </label>
      <button type="submit" disabled={pending} className={btn}>
        {pending && <Loader2 size={16} className="animate-spin" />} Save
      </button>
      {state?.error && <p className="text-sm text-primary sm:basis-full">{state.error}</p>}
      {state?.saved && <p className="text-sm text-primary sm:basis-full">Saved.</p>}
    </form>
  );
}
