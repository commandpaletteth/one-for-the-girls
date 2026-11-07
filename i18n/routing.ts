import { defineRouting } from "next-intl/routing";

// English only for now. To add a language: add it here + content/<locale>.json + messages/<locale>.json.
export const routing = defineRouting({
  locales: ["en"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  // One language only: no need for next-intl's NEXT_LOCALE cookie, so the public site sets no cookies at all.
  localeCookie: false,
  localeDetection: false,
});
