import type { Resource } from "@/lib/admin-resources";

export type FieldErrors = Record<string, string>;

const MAX_TEXT = 5000;
const MAX_LONG = 50000;

export function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/**
 * Turns a submitted form into a row for the table, using the resource config as the whitelist:
 * unknown fields are ignored, values are trimmed, types/options/lengths are checked.
 */
export function parseForm(resource: Resource, form: FormData): { values: Record<string, unknown>; errors: FieldErrors } {
  const values: Record<string, unknown> = {};
  const errors: FieldErrors = {};

  for (const f of resource.fields) {
    const raw = form.get(f.name);
    const str = typeof raw === "string" ? raw.trim() : "";

    switch (f.type) {
      case "checkbox":
        values[f.name] = raw === "on" || raw === "true";
        continue;
      case "number": {
        const n = str === "" ? 0 : Number(str);
        if (!Number.isInteger(n) || Math.abs(n) > 100000) errors[f.name] = "Whole number only.";
        values[f.name] = n;
        continue;
      }
      case "date":
        if (str && !/^\d{4}-\d{2}-\d{2}$/.test(str)) errors[f.name] = "Invalid date.";
        values[f.name] = str || null;
        continue;
      case "image":
        // A storage path we uploaded to, or empty. Never a full URL from outside.
        if (str && !/^[a-z-]+\/[A-Za-z0-9._-]+$/.test(str)) errors[f.name] = "Invalid image.";
        values[f.name] = str || null;
        continue;
      case "select":
        if (str && !f.options?.some((o) => o.value === str)) errors[f.name] = "Pick one of the options.";
        values[f.name] = str;
        break;
      case "url":
        if (str && !/^https?:\/\/\S+$/i.test(str)) errors[f.name] = "Must start with https://";
        values[f.name] = str;
        break;
      default:
        if (str.length > (f.type === "longtext" ? MAX_LONG : MAX_TEXT)) errors[f.name] = "Too long.";
        values[f.name] = str;
    }
    if (f.required && !str) errors[f.name] = "Required.";
  }

  // Articles: build the web address from the title when left empty.
  if (resource.table === "articles") {
    const slug = (values.slug as string) || slugify((values.title as string) || "");
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) errors.slug = "Use lowercase letters, numbers and dashes only.";
    values.slug = slug;
  }
  return { values, errors };
}
