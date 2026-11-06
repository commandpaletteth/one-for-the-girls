import PhotoBox from "./PhotoBox";
import { cn } from "@/lib/utils";

/** Shows the uploaded image when there is one, otherwise the dashed "Photos" placeholder. */
export default function Media({
  src,
  alt,
  label,
  kind = "photo",
  className,
  fit = "cover",
  children,
}: {
  src?: string;
  alt: string;
  label: string;
  kind?: "photo" | "video" | "logo";
  className?: string;
  fit?: "cover" | "contain";
  children?: React.ReactNode;
}) {
  if (!src) {
    return (
      <PhotoBox label={label} kind={kind} className={className}>
        {children}
      </PhotoBox>
    );
  }
  return (
    <div className={cn("relative overflow-hidden rounded-2xl bg-blush", className)}>
      {/* Images are resized + stripped of EXIF on upload, so a plain <img> is enough (no Vercel image quota). */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={cn("h-full w-full", fit === "cover" ? "object-cover" : "object-contain p-4")}
      />
      {children}
    </div>
  );
}
