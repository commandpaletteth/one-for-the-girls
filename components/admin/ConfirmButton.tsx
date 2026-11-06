"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/** Two-step button (click, then “Confirm”) instead of a browser pop-up. */
export default function ConfirmButton({
  action,
  children,
  confirmText = "Confirm delete",
  disabled,
  className,
}: {
  action: () => Promise<void>;
  children: React.ReactNode;
  confirmText?: string;
  disabled?: boolean;
  className?: string;
}) {
  const [asking, setAsking] = useState(false);
  const [pending, start] = useTransition();
  const base =
    "inline-flex h-9 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors disabled:opacity-40";

  if (!asking) {
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={() => setAsking(true)}
        className={cn(base, "text-muted hover:bg-blush hover:text-primary", className)}
        title={disabled ? "Available once Supabase is connected" : undefined}
      >
        {children}
      </button>
    );
  }
  return (
    <span className="inline-flex gap-1">
      <button
        type="button"
        disabled={pending}
        onClick={() => start(() => action())}
        className={cn(base, "bg-primary text-white hover:bg-primary-dark")}
      >
        {pending && <Loader2 size={14} className="animate-spin" />} {confirmText}
      </button>
      <button type="button" onClick={() => setAsking(false)} className={cn(base, "text-muted hover:bg-blush")}>
        Cancel
      </button>
    </span>
  );
}
