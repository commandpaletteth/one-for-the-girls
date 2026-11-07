// One config per admin section. Drives the form, the list and the server-side validation,
// so a field is added in ONE place. Plain data only (it is also sent to the browser for the form).
import content from "@/content/en.json";

export type FieldType = "text" | "textarea" | "longtext" | "select" | "checkbox" | "url" | "date" | "number" | "image";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  help?: string;
  options?: { value: string; label: string }[];
  default?: string | number | boolean;
  /** image fields: storage folder + max width in px */
  folder?: string;
  maxWidth?: number;
  /** only show when another field has this value (e.g. recap fields when status = past) */
  showWhen?: { field: string; value: string };
};

export type Resource = {
  slug: string; // URL: /admin/<slug>
  table: string;
  label: string; // plural, menu
  singular: string;
  intro: string;
  titleField: string;
  /** small grey labels on each row in the list */
  metaFields: string[];
  order: { column: string; ascending: boolean }[];
  fields: Field[];
};

const categories = content.Categories.items.map((c) => ({ value: c.id, label: c.name }));
const albumTypes = content.Gallery.types.map((t) => ({ value: t.id, label: t.name }));
const topics = content.GirlTalk.topics.map((t) => ({ value: t.id, label: t.name }));

const published = (help: string, def = true): Field => ({
  name: "published",
  label: "Show on website",
  type: "checkbox",
  default: def,
  help,
});
const sort: Field = {
  name: "sort",
  label: "Order",
  type: "number",
  default: 0,
  help: "Lower numbers show first.",
};

export const RESOURCES: Resource[] = [
  {
    slug: "events",
    table: "events",
    label: "Events",
    singular: "event",
    intro:
      "Events move to Past (recaps) automatically the day after their date. Then add a recap, a video link and photos.",
    titleField: "title",
    metaFields: ["status", "category", "date_text"],
    order: [
      { column: "status", ascending: false },
      { column: "event_date", ascending: true },
      { column: "sort", ascending: true },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "category", label: "Category", type: "select", options: categories, required: true },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: [
          { value: "upcoming", label: "Automatic (by date)" },
          { value: "past", label: "Past now (e.g. cancelled or no date)" },
        ],
        default: "upcoming",
        required: true,
        help: "Leave on Automatic: the event becomes a recap the day after its date.",
      },
      {
        name: "event_date",
        label: "Event date",
        type: "date",
        help: "Needed for the automatic move to Past and for the order of events.",
      },
      {
        name: "end_date",
        label: "End date (optional)",
        type: "date",
        help: "Only for events over several days. The event moves to Past after this day.",
      },
      { name: "date_text", label: "Date as shown", type: "text", default: "Date TBC", help: "e.g. Sat 14 Dec" },
      { name: "time_text", label: "Time as shown", type: "text", default: "Time TBC", help: "e.g. 10:00 – 13:00" },
      { name: "location", label: "Location", type: "text", default: "Bangkok" },
      { name: "summary", label: "Short description", type: "textarea" },
      {
        name: "booking_url",
        label: "Booking link",
        type: "url",
        help: "Your Ticketmelon link. Leave empty to show “Booking opens soon”.",
      },
      { name: "cover_path", label: "Cover photo", type: "image", folder: "events", maxWidth: 1600 },
      {
        name: "recap",
        label: "Recap (after the event)",
        type: "textarea",
        help: "Shown on What's On once the event is past. Empty = the short description is used.",
      },
      { name: "video_url", label: "Recap video link (Instagram reel / YouTube)", type: "url" },
      published("Untick to hide without deleting."),
      sort,
    ],
  },
  {
    slug: "gallery",
    table: "albums",
    label: "Gallery",
    singular: "album",
    intro: "Each album is a card in The Gallery. Open an album to add photos and videos.",
    titleField: "title",
    metaFields: ["type", "category", "date_text"],
    order: [
      { column: "event_date", ascending: false },
      { column: "sort", ascending: true },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "type", label: "Type", type: "select", options: albumTypes, required: true },
      { name: "category", label: "Category", type: "select", options: categories, required: true },
      { name: "event_date", label: "Date (for sorting)", type: "date" },
      { name: "date_text", label: "Date as shown", type: "text", help: "e.g. Nov 2026. Leave empty to hide." },
      {
        name: "cover_path",
        label: "Cover photo",
        type: "image",
        folder: "albums",
        maxWidth: 1600,
        help: "Or pick one of the album photos as the cover below.",
      },
      published("Untick to hide the whole album."),
      sort,
    ],
  },
  {
    slug: "girl-talk",
    table: "articles",
    label: "Girl Talk",
    singular: "article",
    intro: "Articles stay as drafts (“Coming soon”) until you tick “Show on website”.",
    titleField: "title",
    metaFields: ["topic", "date_text"],
    order: [
      { column: "published_on", ascending: false },
      { column: "created_at", ascending: false },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      {
        name: "slug",
        label: "Web address",
        type: "text",
        help: "Lowercase words with dashes, e.g. my-first-padel-game. Leave empty to make one from the title.",
      },
      { name: "topic", label: "Topic", type: "select", options: topics, required: true },
      { name: "published_on", label: "Date (for sorting)", type: "date" },
      { name: "date_text", label: "Date as shown", type: "text", help: "e.g. 6 Nov 2026" },
      { name: "excerpt", label: "Short summary", type: "textarea" },
      { name: "body", label: "Article", type: "longtext", help: "Leave an empty line between paragraphs." },
      { name: "cover_path", label: "Cover photo", type: "image", folder: "articles", maxWidth: 1600 },
      published("Publish the article (otherwise it shows as “Coming soon”).", false),
    ],
  },
  {
    slug: "partners",
    table: "partners",
    label: "Partners",
    singular: "partner",
    intro: "Brand logos on Our Circle.",
    titleField: "name",
    metaFields: ["website_url"],
    order: [{ column: "sort", ascending: true }],
    fields: [
      { name: "name", label: "Brand name", type: "text", required: true },
      {
        name: "logo_path",
        label: "Logo",
        type: "image",
        folder: "partners",
        maxWidth: 600,
        help: "PNG with a transparent background works best.",
      },
      { name: "website_url", label: "Website", type: "url" },
      published("Untick to hide."),
      sort,
    ],
  },
  {
    slug: "testimonials",
    table: "testimonials",
    label: "Testimonials",
    singular: "testimonial",
    intro: "Quotes from partners on Our Circle.",
    titleField: "name",
    metaFields: ["role"],
    order: [{ column: "sort", ascending: true }],
    fields: [
      { name: "quote", label: "Quote", type: "textarea", required: true },
      { name: "name", label: "Name", type: "text", required: true },
      { name: "role", label: "Role, Brand", type: "text" },
      published("Untick to hide."),
      sort,
    ],
  },
  {
    slug: "stats",
    table: "stats",
    label: "Community Stats",
    singular: "number",
    intro: "The numbers on Our Circle. Big numbers = the 4 boxes, Audience = “Where our girls are”.",
    titleField: "label",
    metaFields: ["group", "value"],
    order: [
      { column: "group", ascending: false },
      { column: "sort", ascending: true },
    ],
    fields: [
      {
        name: "group",
        label: "Where it shows",
        type: "select",
        options: [
          { value: "headline", label: "Big numbers" },
          { value: "audience", label: "Audience (where our girls are)" },
        ],
        required: true,
        default: "headline",
      },
      { name: "value", label: "Number", type: "text", required: true, help: "e.g. 3k+ or 60%" },
      { name: "label", label: "Label", type: "text", required: true, help: "e.g. Instagram followers" },
      { name: "note", label: "Small note", type: "text", help: "e.g. 96% women", showWhen: { field: "group", value: "headline" } },
      sort,
    ],
  },
  {
    slug: "updates",
    table: "updates",
    label: "Latest Updates",
    singular: "update",
    intro: "The 3 cards under “What's new” on Home (the first 3 by order).",
    titleField: "title",
    metaFields: ["tag", "date_text"],
    order: [
      { column: "sort", ascending: true },
      { column: "created_at", ascending: false },
    ],
    fields: [
      { name: "tag", label: "Tag", type: "text", help: "e.g. Announcement, Events, Partners" },
      { name: "title", label: "Title", type: "text", required: true },
      { name: "text", label: "Text", type: "textarea" },
      { name: "date_text", label: "Date as shown", type: "text", help: "Optional, e.g. Nov 2026" },
      published("Untick to hide."),
      sort,
    ],
  },
  {
    slug: "faqs",
    table: "faqs",
    label: "FAQs",
    singular: "question",
    intro: "Questions on Say Hello.",
    titleField: "question",
    metaFields: [],
    order: [{ column: "sort", ascending: true }],
    fields: [
      { name: "question", label: "Question", type: "text", required: true },
      { name: "answer", label: "Answer", type: "textarea", required: true },
      published("Untick to hide."),
      sort,
    ],
  },
];

export const getResource = (slug: string) => RESOURCES.find((r) => r.slug === slug);

/** Readable label for a select value (used in lists). */
export function optionLabel(resource: Resource, field: string, value: unknown) {
  const f = resource.fields.find((x) => x.name === field);
  return f?.options?.find((o) => o.value === value)?.label ?? (value == null ? "" : String(value));
}

export const imageFields = (resource: Resource) => resource.fields.filter((f) => f.type === "image").map((f) => f.name);
