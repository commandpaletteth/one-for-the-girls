import { ImageIcon, Play } from "lucide-react";
import { cn } from "@/lib/utils";

/** Empty dashed box that marks where a photo / video / logo will go. */
export default function PhotoBox({
  label,
  kind = "photo",
  className,
  children,
}: {
  label: string;
  kind?: "photo" | "video" | "logo";
  className?: string;
  children?: React.ReactNode;
}) {
  const Icon = kind === "video" ? Play : ImageIcon;
  return (
    <div
      role="img"
      aria-label={`${label} placeholder`}
      className={cn(
        "relative flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary/30 bg-white/70 text-primary/60",
        className,
      )}
    >
      {kind !== "logo" && <Icon className="h-6 w-6" strokeWidth={1.5} />}
      <span className="text-[11px] font-semibold uppercase tracking-[0.2em]">{label}</span>
      {children}
    </div>
  );
}
