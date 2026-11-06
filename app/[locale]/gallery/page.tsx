import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import GalleryBrowser from "@/components/GalleryBrowser";
import { Container, PageHeader } from "@/components/Section";
import type { Category } from "@/lib/content";
import { getAlbums } from "@/lib/data";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Gallery" });
  return { title: t("meta_title"), description: t("meta_description") };
}

export default async function GalleryPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Gallery");
  const c = await getTranslations("Common");
  const categories = (await getTranslations("Categories")).raw("items") as Category[];
  const albums = (await getAlbums()).map((a) => ({
    ...a,
    countLabel: a.type === "videos" ? c("video") : c("photo_count", { count: a.count }),
  }));

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />
      <section className="pb-24">
        <Container>
          <GalleryBrowser
            types={t.raw("types") as { id: string; name: string }[]}
            categories={categories}
            albums={albums}
            labels={{ all: c("all"), photos: c("photos"), video: c("video") }}
          />
        </Container>
      </section>
    </>
  );
}
