import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, Dumbbell, Heart, Instagram, Palette, Sparkles, Users } from "lucide-react";
import { Link } from "@/i18n/navigation";
import PhotoBox from "@/components/PhotoBox";
import EventCard from "@/components/EventCard";
import SignupForm from "@/components/SignupForm";
import { Container, Eyebrow, SectionHeading } from "@/components/Section";
import { btnPrimary, btnSecondary } from "@/lib/utils";
import { isSet, type Category } from "@/lib/content";
import { getUpcomingEvents, getUpdates } from "@/lib/data";

type Props = { params: Promise<{ locale: string }> };
type Value = { title: string; desc: string };

const CATEGORY_ICONS: Record<string, typeof Heart> = {
  wellness: Heart,
  creative: Palette,
  sports: Dumbbell,
  social: Users,
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Home" });
  return { title: { absolute: t("meta_title") }, description: t("meta_description") };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Home");
  const site = await getTranslations("Site");
  const c = await getTranslations("Common");
  const f = await getTranslations("Form");
  const categories = (await getTranslations("Categories")).raw("items") as Category[];
  const [events, updates] = await Promise.all([getUpcomingEvents(3), getUpdates(3)]);
  const values = t.raw("values") as Value[];
  const eventLabels = { photos: c("photos"), book: c("book"), bookingSoon: c("booking_soon") };

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-20 pt-32 md:pb-28 md:pt-44">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="z-10 text-center lg:text-left">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1 shadow-sm">
                <Sparkles className="h-3 w-3 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary md:text-xs">
                  {t("hero_eyebrow")}
                </span>
              </div>
              <h1 className="mb-6 font-serif text-5xl leading-[1.1] tracking-tight text-foreground md:text-7xl">
                {t("hero_title_1")}
                <span className="italic text-primary">{t("hero_title_highlight")}</span>
              </h1>
              <p className="mx-auto mb-8 max-w-lg text-lg font-light leading-relaxed text-muted lg:mx-0">
                {t("hero_intro")}
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
                <Link href="/whats-on" className={btnPrimary}>
                  {t("cta_primary")} <ArrowRight size={16} />
                </Link>
                <a href="#join" className={btnSecondary}>
                  {t("cta_secondary")}
                </a>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-md">
              <PhotoBox
                label={c("photos")}
                className="aspect-[4/5] rotate-2 rounded-[2.5rem] border-[3px] md:aspect-square"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* What we stand for */}
      <section className="bg-white py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:items-center">
            <div>
              <Eyebrow>{t("about_eyebrow")}</Eyebrow>
              <h2 className="font-serif text-3xl leading-tight text-foreground md:text-4xl">{t("about_title")}</h2>
              <p className="mt-5 font-light leading-relaxed text-muted">{t("about_text")}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {values.map((v, i) => (
                <div key={i} className="rounded-3xl border border-border/50 bg-background p-6">
                  <p className="font-serif text-4xl text-primary/30">0{i + 1}</p>
                  <h3 className="mt-2 font-serif text-xl text-foreground">{v.title}</h3>
                  <p className="mt-2 text-sm font-light leading-relaxed text-muted">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* What we do */}
      <section className="py-24">
        <Container>
          <SectionHeading eyebrow={t("what_eyebrow")} title={t("what_title")} intro={t("what_intro")} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.id] ?? Sparkles;
              return (
                <div key={cat.id} className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm">
                  <PhotoBox label={c("photos")} className="aspect-[4/3] rounded-none border-0 border-b-2" />
                  <div className="p-6">
                    <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-blush text-primary">
                      <Icon size={18} />
                    </span>
                    <h3 className="font-serif text-xl text-foreground">{cat.name}</h3>
                    <p className="mt-2 text-sm font-light leading-relaxed text-muted">{cat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Upcoming events */}
      <section className="bg-white py-24">
        <Container>
          <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              eyebrow={t("events_eyebrow")}
              title={t("events_title")}
              intro={t("events_intro")}
              center={false}
              className="mb-0"
            />
            <Link href="/whats-on" className="inline-flex items-center gap-2 font-medium text-primary hover:text-primary-dark">
              {t("events_link")} <ArrowRight size={16} />
            </Link>
          </div>
          {events.length === 0 && (
            <p className="rounded-3xl border border-dashed border-border p-8 text-center text-muted">{c("no_events")}</p>
          )}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((e, i) => (
              <EventCard
                key={i}
                event={e}
                categoryName={categories.find((cat) => cat.id === e.category)?.name}
                labels={eventLabels}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* Join our community */}
      <section id="join" className="scroll-mt-24 px-4 py-24">
        <div className="mx-auto max-w-5xl rounded-[2.5rem] bg-primary px-6 py-16 text-center text-white shadow-xl shadow-primary/20 md:px-16">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.25em] text-white/80">{t("join_eyebrow")}</p>
          <h2 className="font-serif text-3xl md:text-5xl">{t("join_club_name")}</h2>
          <p className="mx-auto mb-8 mt-4 max-w-xl font-light leading-relaxed text-white/90">{t("join_text")}</p>
          <SignupForm
            labels={{
              placeholder: t("join_placeholder"),
              button: t("join_button"),
              note: t("join_note"),
              done: f("signup_done"),
              invalid: f("signup_invalid"),
              error: f("error"),
              notConnected: f("signup_not_connected"),
            }}
          />
        </div>
      </section>

      {/* Latest updates */}
      <section className="pb-24">
        <Container>
          <SectionHeading eyebrow={t("updates_eyebrow")} title={t("updates_title")} />
          <div className="grid gap-6 md:grid-cols-3">
            {updates.map((u, i) => (
              <article key={i} className="rounded-3xl border border-border/50 bg-white p-7 shadow-sm">
                <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
                  {u.tag}
                  {isSet(u.date) && <span className="text-muted"> · {u.date}</span>}
                </p>
                <h3 className="mt-3 font-serif text-xl text-foreground">{u.title}</h3>
                <p className="mt-2 text-sm font-light leading-relaxed text-muted">{u.text}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* Instagram feed */}
      <section className="bg-white py-24">
        <Container>
          <SectionHeading eyebrow={t("instagram_eyebrow")} title={t("instagram_title")} intro={t("instagram_text")} />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <PhotoBox key={i} label={c("photos")} className="aspect-square" />
            ))}
          </div>
          <div className="mt-10 text-center">
            <a href={site("instagram_url")} target="_blank" rel="noopener noreferrer" className={btnPrimary}>
              <Instagram size={16} /> {site("instagram_handle")}
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
