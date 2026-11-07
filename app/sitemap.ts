import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { getAlbums, getArticles } from "@/lib/data";
import { NAV } from "@/lib/content";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const [articles, albums] = await Promise.all([getArticles(), getAlbums()]);
  return [
    ...NAV.map((n) => ({ url: `${base}${n.href === "/" ? "" : n.href}`, changeFrequency: "weekly" as const, priority: n.href === "/" ? 1 : 0.7 })),
    { url: `${base}/privacy`, changeFrequency: "yearly" as const, priority: 0.2 },
    ...articles.filter((a) => a.published).map((a) => ({ url: `${base}/girl-talk/${a.slug}`, priority: 0.6 })),
    ...albums.filter((a) => !a.id.startsWith("sample-")).map((a) => ({ url: `${base}/gallery/${a.id}`, priority: 0.5 })),
  ];
}
