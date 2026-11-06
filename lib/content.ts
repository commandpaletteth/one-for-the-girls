// Shapes of the lists in content/en.json. Text values are read with t("key"), lists with t.raw("key").

export type Category = { id: string; name: string; desc: string };

export type EventItem = {
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  summary: string;
  booking_url: string;
};

export type Recap = { title: string; category: string; date: string; summary: string; has_video: boolean };

export type Album = { title: string; type: string; category: string; date: string; count: number };

export type Topic = { id: string; name: string; desc: string };

export type Article = {
  slug: string;
  title: string;
  topic: string;
  date: string;
  excerpt: string;
  published: boolean;
  body: string[];
};

export type Social = { label: string; url: string };

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
