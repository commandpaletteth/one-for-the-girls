import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import PhotoBox from "@/components/PhotoBox";
import { Container, PageHeader, SectionHeading } from "@/components/Section";
import { isSet, type Article, type Topic } from "@/lib/content";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "GirlTalk" });
  return { title: t("meta_title"), description: t("meta_description") };
}

export default async function GirlTalkPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("GirlTalk");
  const c = await getTranslations("Common");
  const topics = t.raw("topics") as Topic[];
  const articles = t.raw("articles") as Article[];
  const topicName = (id: string) => topics.find((tp) => tp.id === id)?.name;

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />

      <section className="pb-20">
        <Container>
          <SectionHeading title={t("topics_title")} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topics.map((tp) => (
              <div key={tp.id} className="rounded-3xl border border-border/50 bg-white p-6 shadow-sm">
                <h3 className="font-serif text-xl text-foreground">{tp.name}</h3>
                <p className="mt-2 text-sm font-light text-muted">{tp.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-white py-24">
        <Container>
          <SectionHeading title={t("articles_title")} />
          <div className="grid gap-8 md:grid-cols-3">
            {articles.map((a) => {
              const card = (
                <>
                  <PhotoBox label={c("photos")} className="aspect-[4/3]" />
                  <p className="mt-4 text-[11px] font-bold uppercase tracking-wider text-primary">
                    {topicName(a.topic)}
                    {isSet(a.date) && <span className="text-muted"> · {a.date}</span>}
                  </p>
                  <h3 className="mt-2 font-serif text-xl text-foreground">{a.title}</h3>
                  <p className="mt-2 text-sm font-light leading-relaxed text-muted">{a.excerpt}</p>
                  {a.published ? (
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary">
                      {c("read_more")} <ArrowRight size={14} />
                    </span>
                  ) : (
                    <span className="mt-4 inline-block rounded-full bg-blush px-3 py-1 text-xs font-medium text-primary-dark">
                      {c("coming_soon")}
                    </span>
                  )}
                </>
              );
              return a.published ? (
                <Link key={a.slug} href={`/girl-talk/${a.slug}`} className="group block">
                  {card}
                </Link>
              ) : (
                <article key={a.slug}>{card}</article>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}
