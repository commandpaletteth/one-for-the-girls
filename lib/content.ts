// Shapes used by the public pages. Lists come from lib/data.ts (Supabase, or content/en.json before it is connected).

export type Category = { id: string; name: string; desc: string };

export type EventItem = {
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  summary: string;
  booking_url: string;
  sold_out?: boolean;
  image?: string;
};

export type Recap = {
  title: string;
  category: string;
  date: string;
  summary: string;
  has_video: boolean;
  video_url?: string;
  image?: string;
};

export type Album = {
  id: string;
  title: string;
  type: string;
  category: string;
  date: string;
  count: number;
  image?: string;
};

export type AlbumItem = { kind: "photo" | "video"; src?: string; videoUrl?: string; caption: string; width?: number; height?: number };

export type Topic = { id: string; name: string; desc: string };

export type Article = {
  slug: string;
  title: string;
  topic: string;
  date: string;
  excerpt: string;
  published: boolean;
  body: string; // formatted text, see lib/rich-text.ts
  image?: string;
};

export type Partner = { name: string; logo?: string; url?: string };
export type Testimonial = { quote: string; name: string; role: string };
export type Stat = { value: string; label: string; note?: string };
export type Update = { tag: string; date: string; title: string; text: string };
export type Faq = { q: string; a: string };

export type Social = { icon: "instagram" | "tiktok" | "email" | string; label: string; handle: string; url: string };

export const NAV = [
  { key: "home", href: "/" },
  { key: "story", href: "/our-story" },
  { key: "whats_on", href: "/whats-on" },
  { key: "gallery", href: "/gallery" },
  { key: "circle", href: "/our-circle" },
  { key: "girl_talk", href: "/girl-talk" },
  { key: "hello", href: "/say-hello" },
] as const;

export type NavItem = { label: string; href: string };

/** "TBC" or an empty value means "not set yet": hide it. */
export const isSet = (v?: string) => !!v && v.trim() !== "" && v.trim().toUpperCase() !== "TBC";
