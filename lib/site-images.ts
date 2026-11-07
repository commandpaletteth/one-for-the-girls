// Fixed photo spots on the website (not tied to an event/album). Edited in Admin → Site Photos,
// stored in the settings table as "img_<key>" = storage path.
export type SiteImageSlot = { key: string; label: string; wide?: boolean };
export type SiteImageGroup = { title: string; page: string; slots: SiteImageSlot[] };

export const SITE_IMAGE_GROUPS: SiteImageGroup[] = [
  {
    title: "Home",
    page: "/",
    slots: [
      { key: "hero", label: "Main photo (top of Home)" },
      { key: "category_wellness", label: "What we do: Wellness" },
      { key: "category_creative", label: "What we do: Creative" },
      { key: "category_sports", label: "What we do: Sports & Fitness" },
      { key: "category_social", label: "What we do: Social" },
    ],
  },
  {
    title: "Instagram strip (Home)",
    page: "/",
    slots: Array.from({ length: 6 }, (_, i) => ({ key: `instagram_${i + 1}`, label: `Photo ${i + 1}` })),
  },
  {
    title: "Our Story",
    page: "/our-story",
    slots: [
      { key: "story_main", label: "Wide photo (top)", wide: true },
      { key: "story_1", label: "Small photo 1" },
      { key: "story_2", label: "Small photo 2" },
      { key: "story_3", label: "Small photo 3" },
    ],
  },
  {
    title: "Our Circle: What we can offer",
    page: "/our-circle",
    slots: [
      { key: "offer_1", label: "Events" },
      { key: "offer_2", label: "Social" },
      { key: "offer_3", label: "Content" },
      { key: "offer_4", label: "Community" },
      { key: "offer_5", label: "Word of mouth" },
    ],
  },
];

export const SITE_IMAGE_KEYS = SITE_IMAGE_GROUPS.flatMap((g) => g.slots.map((s) => s.key));
export const settingKey = (slot: string) => `img_${slot}`;
export const SITE_IMAGE_FOLDER = "site";
