import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { SITE_IMAGE_GROUPS, SITE_IMAGE_KEYS, settingKey } from "@/lib/site-images";
import SiteImagesForm from "@/components/admin/SiteImagesForm";
import { saveSiteImages } from "../actions";

export const metadata: Metadata = { title: "Site Photos" };

export default async function SitePhotosPage() {
  const session = await requireAdmin();
  let values: Record<string, string | null> = {};
  if (!session.preview) {
    const { data } = await session.supabase
      .from("settings")
      .select("key, value")
      .in("key", SITE_IMAGE_KEYS.map(settingKey));
    values = Object.fromEntries(SITE_IMAGE_KEYS.map((k) => [k, data?.find((r) => r.key === settingKey(k))?.value || null]));
  }

  return (
    <div className="max-w-4xl">
      <h1 className="font-serif text-3xl md:text-4xl">Site Photos</h1>
      <p className="mt-2 mb-8 max-w-2xl text-muted">
        The fixed photos around the website. Event, album and article photos are added in their own sections. Empty
        spots show a dashed “Photos” box.
      </p>
      <SiteImagesForm groups={SITE_IMAGE_GROUPS} values={values} action={saveSiteImages} preview={session.preview} />
    </div>
  );
}
