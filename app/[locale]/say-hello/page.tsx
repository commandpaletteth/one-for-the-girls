import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CalendarHeart, Handshake, Instagram, MessageCircle, Sparkles, ChevronDown } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import { Container, PageHeader, SectionHeading } from "@/components/Section";
import type { Social } from "@/lib/content";

type Props = { params: Promise<{ locale: string }> };
type EnquiryType = { id: string; title: string; desc: string };
type Faq = { q: string; a: string };

const ICONS: Record<string, typeof Sparkles> = {
  general: MessageCircle,
  events: CalendarHeart,
  partnerships: Handshake,
  collab: Sparkles,
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Hello" });
  return { title: t("meta_title"), description: t("meta_description") };
}

export default async function SayHelloPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Hello");
  const site = await getTranslations("Site");
  const f = await getTranslations("Form");
  const types = t.raw("types") as EnquiryType[];
  const faqs = t.raw("faqs") as Faq[];
  const socials = site.raw("socials") as Social[];

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />

      <section className="pb-20">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {types.map((ty) => {
              const Icon = ICONS[ty.id] ?? Sparkles;
              return (
                <div key={ty.id} className="rounded-3xl border border-border/50 bg-white p-6 shadow-sm">
                  <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-blush text-primary">
                    <Icon size={18} />
                  </span>
                  <h2 className="font-serif text-lg text-foreground">{ty.title}</h2>
                  <p className="mt-1 text-sm font-light text-muted">{ty.desc}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="bg-white py-24">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <h2 className="mb-8 font-serif text-3xl text-foreground">{t("form_title")}</h2>
              <Suspense>
                <ContactForm
                  types={types}
                  email={site("email")}
                  labels={{
                    name: f("name"),
                    email: f("email"),
                    type: f("type"),
                    message: f("message"),
                    submit: f("submit"),
                    notConnected: f("not_connected"),
                  }}
                />
              </Suspense>
            </div>
            <aside className="space-y-6">
              <div className="rounded-3xl bg-background p-8">
                <h2 className="font-serif text-2xl text-foreground">{t("social_title")}</h2>
                <ul className="mt-5 space-y-3">
                  {socials.map((s) => (
                    <li key={s.url}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 font-medium text-primary hover:text-primary-dark"
                      >
                        <Instagram size={18} /> {s.label}
                        {s.label === "Instagram" && <span className="font-light text-muted">{site("instagram_handle")}</span>}
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-sm text-muted">{site("location")}</p>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      <section className="py-24">
        <Container className="max-w-3xl">
          <SectionHeading title={t("faq_title")} />
          <div className="divide-y divide-border/60 rounded-3xl border border-border/50 bg-white">
            {faqs.map((q, i) => (
              <details key={i} className="group px-6 py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-foreground">
                  {q.q}
                  <ChevronDown className="h-5 w-5 shrink-0 text-primary transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 font-light leading-relaxed text-muted">{q.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
