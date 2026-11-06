import { getTranslations } from "next-intl/server";
import { Instagram } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { NAV, type Social } from "@/lib/content";
import { Container } from "./Section";

export default async function Footer() {
  const site = await getTranslations("Site");
  const nav = await getTranslations("Nav");
  const t = await getTranslations("Footer");
  const socials = site.raw("socials") as Social[];

  return (
    <footer className="border-t border-border/40 bg-blush/50 py-16">
      <Container>
        <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <p className="font-serif text-2xl text-primary">{site("name")}</p>
            <p className="mt-2 font-light italic text-muted">{site("slogan")}</p>
            <p className="mt-4 text-sm text-muted">{site("location")}</p>
          </div>
          <div>
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-foreground">{t("explore")}</p>
            <ul className="space-y-2 text-sm text-muted">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition-colors hover:text-primary">
                    {nav(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-foreground">{t("connect")}</p>
            <ul className="space-y-3 text-sm text-muted">
              {socials.map((s) => (
                <li key={s.url}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 transition-colors hover:text-primary"
                  >
                    <Instagram size={16} /> {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-border/40 pt-6 text-xs text-muted/70 md:flex-row md:justify-between">
          <p>{t("rights", { year: new Date().getFullYear() })}</p>
          <p className="uppercase tracking-widest">{t("crafted")}</p>
        </div>
      </Container>
    </footer>
  );
}
