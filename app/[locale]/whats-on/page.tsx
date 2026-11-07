import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import EventsBrowser from "@/components/EventsBrowser";
import { Container, PageHeader } from "@/components/Section";
import type { Category } from "@/lib/content";
import { getRecaps, getUpcomingEvents } from "@/lib/data";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "WhatsOn" });
  return { title: t("meta_title"), description: t("meta_description") };
}

export default async function WhatsOnPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("WhatsOn");
  const c = await getTranslations("Common");
  const categories = (await getTranslations("Categories")).raw("items") as Category[];
  const [events, recaps] = await Promise.all([getUpcomingEvents(), getRecaps()]);

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />
      <section className="pb-24">
        <Container>
          <EventsBrowser
            categories={categories}
            events={events}
            recaps={recaps}
            labels={{
              all: c("all"),
              photos: c("photos"),
              video: c("video"),
              book: c("book"),
              bookingSoon: c("booking_soon"),
              soldOut: c("sold_out"),
              upcomingTitle: t("upcoming_title"),
              recapsTitle: t("recaps_title"),
              recapsIntro: t("recaps_intro"),
              empty: t("empty"),
              watch: c("watch_video"),
            }}
          />
        </Container>
      </section>
    </>
  );
}
