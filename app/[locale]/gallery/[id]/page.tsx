import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import AlbumGrid from "@/components/AlbumGrid";
import PhotoBox from "@/components/PhotoBox";
import { Container, Eyebrow } from "@/components/Section";
import { getAlbum } from "@/lib/data";
import { isSet, type Category } from "@/lib/content";

type Props = { params: Promise<{ locale: string; id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const data = await getAlbum(id);
  if (!data) return {};
  // Only override the share image when the album has a cover; otherwise the site default is used.
  return data.album.image
    ? { title: data.album.title, openGraph: { title: data.album.title, images: [data.album.image] } }
    : { title: data.album.title };
}

export default async function AlbumPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const data = await getAlbum(id);
  if (!data) notFound();
  const { album, items } = data;

  const t = await getTranslations("Gallery");
  const c = await getTranslations("Common");
  const types = t.raw("types") as { id: string; name: string }[];
  const categories = (await getTranslations("Categories")).raw("items") as Category[];
  const hasMedia = items.some((i) => i.src || i.videoUrl);

  return (
    <section className="px-4 pb-24 pt-36 md:pt-44">
      <Container>
        <Link href="/gallery" className="mb-8 inline-flex items-center gap-2 text-sm text-muted hover:text-primary">
          <ArrowLeft size={16} /> {c("back_to_gallery")}
        </Link>
        <Eyebrow>
          {types.find((x) => x.id === album.type)?.name} · {categories.find((x) => x.id === album.category)?.name}
          {isSet(album.date) && <span className="text-muted"> · {album.date}</span>}
        </Eyebrow>
        <h1 className="mb-10 font-serif text-4xl leading-tight text-foreground md:text-5xl">{album.title}</h1>

        {hasMedia ? (
          <AlbumGrid
            items={items}
            title={album.title}
            labels={{
              close: c("close"),
              prev: c("previous"),
              next: c("next"),
              watch: c("watch_video"),
              photoOf: c("photo_of"),
            }}
          />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <PhotoBox key={i} label={c("photos")} className={i % 3 === 1 ? "aspect-[4/5]" : "aspect-[4/3]"} />
              ))}
            </div>
            <p className="mt-8 text-center text-muted">{c("photos_soon")}</p>
          </>
        )}
      </Container>
    </section>
  );
}
