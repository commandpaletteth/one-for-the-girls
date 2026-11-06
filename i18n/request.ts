import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  return {
    locale,
    // A key saved as empty (e.g. by a CMS) shows nothing in production instead of "Home.hero_intro".
    getMessageFallback: ({ namespace, key }) => (process.env.NODE_ENV === "production" ? "" : `${namespace}.${key}`),
    onError: (error) => {
      if (error.code !== "MISSING_MESSAGE") console.error(error);
    },
    messages: {
      // messages/ = UI text (nav, buttons, form labels). content/ = site content, editable later in a CMS.
      ...(await import(`../messages/${locale}.json`)).default,
      ...(await import(`../content/${locale}.json`)).default,
    },
  };
});
