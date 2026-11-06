import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import PhotoBox from "@/components/PhotoBox";
import { Container, Eyebrow } from "@/components/Section";
import { isSet, type Article, type Topic } from "@/lib/content";

type Props = { params: Promise<{ locale: string; slug: string }> };

async function getArticle(locale: string, slug: string) {
  const t = await getTranslations({ locale, namespace: "GirlTalk" });
  const article = (t.raw("articles") as Article[]).find((a) => a.slug === slug && a.published);
  const topics = t.raw("topics") as Topic[];
  return { article, topic: topics.find((tp) => tp.id === article?.topic)?.name };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const { article } = await getArticle(locale, slug);
  return article ? { title: article.title, description: article.excerpt } : {};
}

export default async function ArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const { article, topic } = await getArticle(locale, slug);
  if (!article) notFound(); // unknown or unpublished
  const c = await getTranslations("Common");

  return (
    <article className="px-4 pb-24 pt-36 md:pt-44">
      <Container className="max-w-3xl">
        <Link href="/girl-talk" className="mb-10 inline-flex items-center gap-2 text-sm text-muted hover:text-primary">
          <ArrowLeft size={16} /> {c("back_to_girl_talk")}
        </Link>
        <Eyebrow>
          {topic}
          {isSet(article.date) && <span className="text-muted"> · {article.date}</span>}
        </Eyebrow>
        <h1 className="font-serif text-4xl leading-tight text-foreground md:text-5xl">{article.title}</h1>
        <p className="mt-5 text-lg font-light text-muted">{article.excerpt}</p>
        <PhotoBox label={c("photos")} className="mt-10 aspect-[16/9] rounded-[2rem]" />
        <div className="mt-10 space-y-6 text-lg font-light leading-relaxed text-foreground/90">
          {article.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </Container>
    </article>
  );
}
