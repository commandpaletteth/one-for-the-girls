import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const btnPrimary =
  "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-8 font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary-dark";
export const btnSecondary =
  "inline-flex h-12 items-center justify-center gap-2 rounded-full border border-secondary/40 bg-white/60 px-8 font-medium text-secondary-dark transition-colors hover:bg-white";
