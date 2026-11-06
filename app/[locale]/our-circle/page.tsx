import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, CalendarHeart, Camera, Check, Megaphone, Quote, Smartphone, Users } from "lucide-react";
import { Link } from "@/i18n/navigation";
import PhotoBox from "@/components/PhotoBox";
import { Container, Eyebrow, PageHeader, SectionHeading } from "@/components/Section";
import { btnPrimary } from "@/lib/utils";

type Props = { params: Promise<{ locale: string }> };
type Testimonial = { quote: string; name: string; role: string };
type Option = { title: string; desc: string; points: string[] };
type Stat = { value: string; label: string; note?: string };
type Item = { title: string; desc: string };

// Icons for "What we can offer", in the same order as Circle.offer in content/en.json.
const OFFER_ICONS = [CalendarHeart, Smartphone, Camera, Users, Megaphone];

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
  const stats = t.raw("stats") as Stat[];
  const audience = t.raw("audience") as Stat[];
  const traits = t.raw("traits") as string[];
  const why = t.raw("why") as Item[];
  const offer = t.raw("offer") as Item[];

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />

      {/* Community at a glance */}
      <section className="pb-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <Eyebrow>{t("glance_eyebrow")}</Eyebrow>
              <h2 className="font-serif text-3xl leading-tight text-foreground md:text-4xl">{t("glance_title")}</h2>
              <p className="mt-5 font-light leading-relaxed text-muted">{t("glance_text")}</p>
              <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.2em] text-foreground">{t("traits_title")}</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {traits.map((tr) => (
                  <li key={tr} className="rounded-full border border-border bg-white px-4 py-1.5 text-sm text-primary">
                    {tr}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((st) => (
                <div key={st.label} className="rounded-3xl bg-blush p-6 text-center md:p-8">
                  <p className="font-serif text-4xl text-primary md:text-5xl">{st.value}</p>
                  <p className="mt-2 text-sm font-medium text-foreground">{st.label}</p>
                  {st.note && <p className="mt-1 text-xs text-muted">{st.note}</p>}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-14 rounded-3xl border border-border/50 bg-white p-8 shadow-sm">
            <p className="mb-6 text-[11px] font-bold uppercase tracking-[0.2em] text-foreground">{t("audience_title")}</p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {audience.map((a) => (
                <div key={a.label}>
                  <p className="font-serif text-3xl text-primary">{a.value}</p>
                  <p className="mt-1 text-sm font-light leading-relaxed text-muted">{a.label}</p>
                </div>
              ))}
            </div>
          </div>
          {t("stats_note") && <p className="mt-4 text-xs text-muted/70">{t("stats_note")}</p>}
        </Container>
      </section>

      {/* Why partner with us */}
      <section className="bg-white py-24">
        <Container>
          <SectionHeading title={t("why_title")} intro={t("why_intro")} />
          <div className="grid gap-6 sm:grid-cols-2">
            {why.map((w, i) => (
              <div key={i} className="flex gap-5 rounded-3xl bg-background p-7">
                <p className="font-serif text-3xl text-primary/30">0{i + 1}</p>
                <div>
                  <h3 className="font-serif text-xl text-foreground">{w.title}</h3>
                  <p className="mt-2 text-sm font-light leading-relaxed text-muted">{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* What we can offer */}
      <section className="py-24">
        <Container>
          <SectionHeading title={t("offer_title")} intro={t("offer_intro")} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {offer.map((o, i) => {
              const Icon = OFFER_ICONS[i] ?? Check;
              return (
                <div key={i} className="overflow-hidden rounded-3xl bg-white shadow-sm">
                  <PhotoBox label={c("photos")} className="aspect-[4/3] rounded-none border-0 border-b-2" />
                  <div className="p-5">
                    <span className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-blush text-primary">
                      <Icon size={16} />
                    </span>
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground">{o.title}</h3>
                    <p className="mt-2 text-sm font-light leading-relaxed text-muted">{o.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Brand partners */}
      <section className="bg-white py-24">
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
      <section className="py-24">
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
      <section className="bg-white py-24">
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
      <section className="px-4 py-24">
        <div className="mx-auto max-w-4xl rounded-[2.5rem] bg-blush px-6 py-16 text-center md:px-16">
          <h2 className="mx-auto max-w-2xl font-serif text-3xl italic leading-snug text-foreground md:text-4xl">{t("become_title")}</h2>
          <p className="mx-auto mt-4 max-w-xl font-light leading-relaxed text-muted">{t("become_text")}</p>
          <Link href={{ pathname: "/say-hello", query: { type: "partnerships" } }} className={`${btnPrimary} mt-8`}>
            {t("become_button")} <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
