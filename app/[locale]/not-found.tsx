import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { btnPrimary } from "@/lib/utils";

export default async function NotFound() {
  const t = await getTranslations("NotFound");
  return (
    <section className="px-4 pb-24 pt-44 text-center">
      <h1 className="font-serif text-4xl text-foreground md:text-5xl">{t("title")}</h1>
      <p className="mt-4 text-muted">{t("text")}</p>
      <Link href="/" className={`${btnPrimary} mt-8`}>
        {t("back")}
      </Link>
    </section>
  );
}
