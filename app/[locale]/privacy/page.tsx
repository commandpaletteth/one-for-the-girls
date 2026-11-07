import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container, PageHeader } from "@/components/Section";

type Props = { params: Promise<{ locale: string }> };
type Section = { heading: string; paragraphs: string[] };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Privacy" });
  return { title: t("meta_title"), description: t("meta_description") };
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Privacy");
  const sections = t.raw("sections") as Section[];

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />
      <section className="pb-24">
        <Container className="max-w-3xl">
          <p className="mb-10 text-sm text-muted">{t("updated")}</p>
          <div className="space-y-10">
            {sections.map((s) => (
              <div key={s.heading}>
                <h2 className="font-serif text-2xl text-foreground">{s.heading}</h2>
                <div className="mt-3 space-y-3 font-light leading-relaxed text-muted">
                  {s.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
