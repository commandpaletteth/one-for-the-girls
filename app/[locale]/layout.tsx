import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { NAV } from "@/lib/content";
import { isIndexable, siteUrl } from "@/lib/site";
import { Analytics } from "@vercel/analytics/next";
// Self-hosted fonts (no request to Google at build or page load).
import "@fontsource-variable/inter";
import "@fontsource-variable/playfair-display";
import "@fontsource-variable/playfair-display/wght-italic.css";
import "../globals.css";

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> };

// Content from Supabase is re-checked at most once an hour; saving in /admin refreshes pages immediately.
export const revalidate = 3600;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Omit<Props, "children">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Site" });
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: `${t("name")} | ${t("slogan")}`, template: `%s | ${t("name")}` },
    description: t("description"),
    // app/opengraph-image.tsx lives outside [locale], so it is linked here explicitly.
    openGraph: {
      siteName: t("name"),
      type: "website",
      locale: "en_GB",
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: `${t("name")}: ${t("slogan")}` }],
    },
    twitter: { card: "summary_large_image" },
    robots: isIndexable() ? undefined : { index: false, follow: false },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const site = await getTranslations("Site");
  const nav = await getTranslations("Nav");

  return (
    <html lang={locale}>
      <body className="font-sans antialiased selection:bg-primary/20 selection:text-primary">
        {/* Client components get their text as props, so no messages are sent to the browser. */}
        <NextIntlClientProvider messages={null}>
          <Navbar
            siteName={site("name")}
            items={NAV.map((item) => ({ label: nav(item.key), href: item.href }))}
            cta={{ label: nav("cta"), href: site("instagram_url") }}
            labels={{ open: nav("open_menu"), close: nav("close_menu") }}
          />
          <main>{children}</main>
          <Footer />
        </NextIntlClientProvider>
        {/* Cookieless visit counts (Vercel Web Analytics). Public pages only; turn it on in Vercel → Analytics. */}
        <Analytics />
      </body>
    </html>
  );
}
