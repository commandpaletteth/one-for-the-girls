import { Instagram, Link2, Mail } from "lucide-react";

function TikTok({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 1 1-2.59-2.59c.27 0 .53.04.77.12V9.77a5.68 5.68 0 1 0 4.91 5.63V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3a4.3 4.3 0 0 1-3.24-1.48Z" />
    </svg>
  );
}

/** Icon for a Site.socials entry ("instagram" | "tiktok" | "email"; anything else shows a link icon). */
export default function SocialIcon({ icon, size = 18 }: { icon: string; size?: number }) {
  if (icon === "instagram") return <Instagram size={size} />;
  if (icon === "tiktok") return <TikTok size={size} />;
  if (icon === "email") return <Mail size={size} />;
  return <Link2 size={size} />;
}
