"use client";

import { useActionState, useState } from "react";
import { KeyRound, Loader2, Pencil, Trash2 } from "lucide-react";
import { removeAdmin, renameAdmin, setTemporaryPassword, type TeamState } from "./actions";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { btn, btnGhost, input } from "@/lib/admin-ui";

export type Member = { id: string; email: string; name: string; lastSignIn: string; isMe: boolean };

export default function TeamRow({ m, preview, onlyOne }: { m: Member; preview: boolean; onlyOne: boolean }) {
  const [mode, setMode] = useState<"idle" | "name" | "password">("idle");
  const [removeMsg, setRemoveMsg] = useState<TeamState>();
  const [nameState, nameAction, namePending] = useActionState<TeamState, FormData>(
    async (prev, form) => {
      const r = await renameAdmin(m.id, prev, form);
      if (r?.ok) setMode("idle");
      return r;
    },
    undefined,
  );
  const [pwState, pwAction, pwPending] = useActionState<TeamState, FormData>(
    async (prev, form) => {
      const r = await setTemporaryPassword(m.id, prev, form);
      if (r?.ok) setMode("idle");
      return r;
    },
    undefined,
  );
  const msg = removeMsg ?? (mode === "idle" ? (pwState ?? nameState) : undefined);
  const smallGhost = "inline-flex h-9 items-center gap-2 rounded-full px-4 text-sm text-muted hover:bg-blush hover:text-primary disabled:opacity-40";

  return (
    <li className="space-y-3 px-5 py-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-medium">
            {m.name || m.email}
            {m.isMe && <span className="ml-2 rounded-full bg-blush px-2 py-0.5 text-xs text-primary">You</span>}
          </p>
          <p className="truncate text-sm text-muted">{m.email}</p>
          <p className="text-xs text-muted/80">Last signed in: {m.lastSignIn}</p>
        </div>
        {mode === "idle" && (
          <div className="flex flex-wrap gap-1">
            <button type="button" onClick={() => setMode("name")} className={smallGhost} disabled={preview}>
              <Pencil size={14} /> Name
            </button>
            {!m.isMe && (
              <button type="button" onClick={() => setMode("password")} className={smallGhost} disabled={preview}>
                <KeyRound size={14} /> Set password
              </button>
            )}
            {!m.isMe && (
              <ConfirmButton
                action={async () => setRemoveMsg(await removeAdmin(m.id))}
                confirmText="Remove"
                disabled={preview || onlyOne}
              >
                <Trash2 size={14} /> Remove
              </ConfirmButton>
            )}
          </div>
        )}
      </div>

      {mode === "name" && (
        <form action={nameAction} className="flex flex-col gap-2 sm:flex-row">
          <input name="name" defaultValue={m.name} maxLength={80} required className={input} placeholder="Name" />
          <button type="submit" disabled={namePending} className={btn}>
            {namePending && <Loader2 size={16} className="animate-spin" />} Save
          </button>
          <button type="button" onClick={() => setMode("idle")} className={btnGhost}>
            Cancel
          </button>
        </form>
      )}
      {mode === "password" && (
        <form action={pwAction} className="flex flex-col gap-2 sm:flex-row">
          <input name="password" type="text" minLength={10} required autoComplete="off" className={input} placeholder="New temporary password (10+ characters)" />
          <button type="submit" disabled={pwPending} className={btn}>
            {pwPending && <Loader2 size={16} className="animate-spin" />} Set
          </button>
          <button type="button" onClick={() => setMode("idle")} className={btnGhost}>
            Cancel
          </button>
        </form>
      )}
      {mode !== "idle" && (nameState?.error || pwState?.error) && (
        <p role="alert" className="text-sm text-primary">{mode === "name" ? nameState?.error : pwState?.error}</p>
      )}
      {msg && (
        <p role="status" className="text-sm text-primary">
          {msg.error ?? msg.ok}
        </p>
      )}
    </li>
  );
}
