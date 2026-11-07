import type { MetadataRoute } from "next";
import { isIndexable, siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Preview links (Vercel "Preview" deployments) are never indexed.
  if (!isIndexable()) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
