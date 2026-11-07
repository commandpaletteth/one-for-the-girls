"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import type { Field } from "@/lib/admin-resources";
import type { SaveState } from "@/app/admin/(panel)/actions";
import ImageField from "./ImageField";
import { btn, btnGhost, help, input, label } from "@/lib/admin-ui";
import { cn } from "@/lib/utils";

type Props = {
  fields: Field[];
  values: Record<string, unknown> | null; // null = new item
  action: (prev: SaveState, form: FormData) => Promise<SaveState>;
  cancelHref: string;
  preview: boolean;
};

const str = (v: unknown) => (v == null ? "" : String(v));

export default function ResourceForm({ fields, values, action, cancelHref, preview }: Props) {
  const [state, formAction, pending] = useActionState<SaveState, FormData>(action, undefined);
  const initial = (f: Field) => (values ? values[f.name] : f.default);

  // Fields that other fields depend on (showWhen) are tracked so the form updates while typing.
  const watched = [...new Set(fields.map((f) => f.showWhen?.field).filter(Boolean))] as string[];
  const [watch, setWatch] = useState<Record<string, string>>(() =>
    Object.fromEntries(watched.map((w) => [w, str(initial(fields.find((f) => f.name === w)!))])),
  );

  const err = (name: string) => state?.fieldErrors?.[name];

  return (
    <form action={formAction} className="space-y-6">
      {fields.map((f) => {
        const hidden = f.showWhen && watch[f.showWhen.field] !== f.showWhen.value;
        const v = initial(f);
        const id = `f-${f.name}`;
        const onWatch = watched.includes(f.name)
          ? (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) =>
              setWatch((w) => ({ ...w, [f.name]: e.target.value }))
          : undefined;

        let control: React.ReactNode;
        switch (f.type) {
          case "textarea":
          case "longtext":
            control = (
              <textarea id={id} name={f.name} required={f.required} defaultValue={str(v)} rows={f.type === "longtext" ? 16 : 4} className={input} />
            );
            break;
          case "select":
            control = (
              <select id={id} name={f.name} defaultValue={str(v) || f.options?.[0]?.value} onChange={onWatch} className={input}>
                {f.options?.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            );
            break;
          case "checkbox":
            control = (
              <label className="inline-flex cursor-pointer items-center gap-3 text-sm">
                <input type="checkbox" name={f.name} defaultChecked={Boolean(v)} className="h-5 w-5 accent-primary" />
                {f.label}
              </label>
            );
            break;
          case "image":
            control = (
              <ImageField
                name={f.name}
                defaultValue={(v as string) ?? null}
                folder={f.folder ?? "misc"}
                maxWidth={f.maxWidth ?? 1600}
                disabled={preview}
              />
            );
            break;
          default:
            control = (
              <input
                id={id}
                name={f.name}
                required={f.required}
                type={f.type === "url" ? "url" : f.type === "date" ? "date" : f.type === "number" ? "number" : "text"}
                inputMode={f.type === "money" ? "decimal" : undefined}
                min={f.nullable && f.type === "number" ? 0 : undefined}
                defaultValue={str(v)}
                placeholder={f.type === "url" ? "https://" : undefined}
                onChange={onWatch}
                className={cn(input, (f.type === "number" || f.type === "money") && "max-w-48")}
              />
            );
        }

        return (
          // Hidden fields stay in the form so their values are kept.
          <div key={f.name} className={hidden ? "hidden" : undefined}>
            {f.section && (
              <h3 className="mb-4 border-t border-border/50 pt-6 text-sm font-bold uppercase tracking-wider text-primary">
                {f.section}
              </h3>
            )}
            {f.type !== "checkbox" && (
              <label htmlFor={id} className={label}>
                {f.label}
                {f.required && <span className="text-primary"> *</span>}
              </label>
            )}
            {control}
            {f.help && <p className={help}>{f.help}</p>}
            {err(f.name) && <p className="mt-1 text-xs font-medium text-primary">{err(f.name)}</p>}
          </div>
        );
      })}

      {state?.error && (
        <p role="alert" className="rounded-2xl bg-blush px-4 py-3 text-sm text-primary-dark">
          {state.error}
        </p>
      )}
      <div className="flex flex-wrap gap-3 border-t border-border/50 pt-6">
        <button type="submit" disabled={pending} className={btn}>
          {pending && <Loader2 size={16} className="animate-spin" />} Save
        </button>
        <Link href={cancelHref} className={btnGhost}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
