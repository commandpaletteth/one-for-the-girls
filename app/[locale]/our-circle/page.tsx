import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, Check, Quote } from "lucide-react";
import { Link } from "@/i18n/navigation";
import PhotoBox from "@/components/PhotoBox";
import { Container, PageHeader, SectionHeading } from "@/components/Section";
import { btnPrimary } from "@/lib/utils";

type Props = { params: Promise<{ locale: string }> };
type Testimonial = { quote: string; name: string; role: string };
type Option = { title: string; desc: string; points: string[] };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Circle" });
  return { title: t("meta_title"), description: t("meta_description") };
}

export default async function CirclePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Circle");
  const c = await getTranslations("Common");
  const partners = t.raw("partners") as { name: string }[];
  const testimonials = t.raw("testimonials") as Testimonial[];
  const options = t.raw("options") as Option[];

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />

      {/* Brand partners */}
      <section className="pb-24">
        <Container>
          <SectionHeading title={t("partners_title")} intro={t("partners_intro")} />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {partners.map((p, i) => (
              <div key={i} className="text-center">
                <PhotoBox label={c("logo")} kind="logo" className="aspect-[3/2]" />
                <p className="mt-2 text-xs text-muted">{p.name}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-24">
        <Container>
          <SectionHeading title={t("testimonials_title")} />
          <div className="grid gap-6 md:grid-cols-2">
            {testimonials.map((q, i) => (
              <figure key={i} className="rounded-3xl bg-background p-8">
                <Quote className="h-8 w-8 text-primary/40" />
                <blockquote className="mt-4 font-serif text-xl italic leading-snug text-foreground">{q.quote}</blockquote>
                <figcaption className="mt-6 text-sm">
                  <span className="font-semibold text-foreground">{q.name}</span>
                  <span className="text-muted"> · {q.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </section>

      {/* Sponsors / Collabs / Packages */}
      <section className="py-24">
        <Container>
          <SectionHeading title={t("options_title")} />
          <div className="grid gap-6 md:grid-cols-3">
            {options.map((o, i) => (
              <div key={i} className="flex flex-col rounded-3xl border border-border/50 bg-white p-8 shadow-sm">
                <h3 className="font-serif text-2xl text-foreground">{o.title}</h3>
                <p className="mt-3 text-sm font-light leading-relaxed text-muted">{o.desc}</p>
                <ul className="mt-6 space-y-3 text-sm text-foreground">
                  {o.points.map((pt, j) => (
                    <li key={j} className="flex gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {pt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Become a partner */}
      <section className="px-4 pb-24">
        <div className="mx-auto max-w-4xl rounded-[2.5rem] bg-blush px-6 py-16 text-center md:px-16">
          <h2 className="font-serif text-3xl text-foreground md:text-4xl">{t("become_title")}</h2>
          <p className="mx-auto mt-4 max-w-xl font-light leading-relaxed text-muted">{t("become_text")}</p>
          <Link href={{ pathname: "/say-hello", query: { type: "partnerships" } }} className={`${btnPrimary} mt-8`}>
            {t("become_button")} <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
