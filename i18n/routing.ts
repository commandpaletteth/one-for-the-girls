import { defineRouting } from "next-intl/routing";

// English only for now. To add a language: add it here + content/<locale>.json + messages/<locale>.json.
export const routing = defineRouting({
  locales: ["en"],
  defaultLocale: "en",
  localePrefix: "as-needed",
});
