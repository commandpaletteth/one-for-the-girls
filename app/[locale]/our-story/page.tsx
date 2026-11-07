import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import Media from "@/components/Media";
import { getSiteImages } from "@/lib/data";
import { Container, PageHeader } from "@/components/Section";
import { btnPrimary } from "@/lib/utils";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Story" });
  return { title: t("meta_title"), description: t("meta_description") };
}

export default async function StoryPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Story");
  const c = await getTranslations("Common");
  const paragraphs = t.raw("paragraphs") as string[];
  const img = await getSiteImages();

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />

      <section className="pb-24">
        <Container>
          <Media src={img.story_main} alt={t("title")} label={c("photos")} className="aspect-[16/9] rounded-[2rem] md:aspect-[21/9]" />
          <div className="mx-auto mt-16 max-w-2xl space-y-6 text-lg font-light leading-relaxed text-muted">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          {t("quote") && (
            <figure className="mx-auto mt-16 max-w-3xl border-l-4 border-primary pl-6 md:pl-10">
              <blockquote className="font-serif text-2xl italic leading-snug text-foreground md:text-3xl">
                “{t("quote")}”
              </blockquote>
              <figcaption className="mt-4 text-sm font-medium uppercase tracking-wider text-primary">
                {t("quote_author")}
              </figcaption>
            </figure>
          )}
          <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-3">
            <Media src={img.story_1} alt="" label={c("photos")} className="aspect-square" />
            <Media src={img.story_2} alt="" label={c("photos")} className="aspect-square" />
            <Media
              src={img.story_3}
              alt=""
              label={c("photos")}
              className="col-span-2 aspect-[2/1] md:col-span-1 md:aspect-square"
            />
          </div>
        </Container>
      </section>

      <section className="bg-white py-20 text-center">
        <Container>
          <h2 className="mx-auto max-w-xl font-serif text-3xl text-foreground md:text-4xl">{t("cta_title")}</h2>
          <Link href="/whats-on" className={`${btnPrimary} mt-8`}>
            {t("cta_button")} <ArrowRight size={16} />
          </Link>
        </Container>
      </section>
    </>
  );
}
