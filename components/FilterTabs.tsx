"use client";

import { cn } from "@/lib/utils";

export default function FilterTabs({
  options,
  value,
  onChange,
  size = "md",
}: {
  options: { id: string; name: string }[];
  value: string;
  onChange: (id: string) => void;
  size?: "md" | "sm";
}) {
  return (
    <div className="-mx-5 overflow-x-auto px-5 pb-2 md:mx-0 md:px-0">
      <div className="flex w-max gap-2 md:mx-auto md:w-auto md:flex-wrap md:justify-center">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            aria-pressed={value === o.id}
            className={cn(
              "whitespace-nowrap rounded-full border font-medium transition-colors",
              size === "md" ? "px-5 py-2 text-sm" : "px-4 py-1.5 text-xs",
              value === o.id
                ? "border-primary bg-primary text-white"
                : "border-border bg-white text-muted hover:border-primary/50 hover:text-primary",
            )}
          >
            {o.name}
          </button>
        ))}
      </div>
    </div>
  );
}
