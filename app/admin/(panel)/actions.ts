"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin, requireWritableAdmin } from "@/lib/auth";
import { getResource, imageFields } from "@/lib/admin-resources";
import { parseForm, type FieldErrors } from "@/lib/admin-validate";
import { MEDIA_BUCKET } from "@/lib/supabase/env";
import { SITE_IMAGE_KEYS, settingKey } from "@/lib/site-images";

export type SaveState = { error?: string; fieldErrors?: FieldErrors; saved?: boolean } | undefined;

const PREVIEW_MSG = "Preview mode: nothing is saved until Supabase is connected.";

/** Every public page reads from the database, so refresh them all after a change. */
function refreshSite(slug?: string) {
  revalidatePath("/", "layout");
  if (slug) revalidatePath(`/admin/${slug}`);
}

const isUuid = (s: string) => /^[0-9a-f-]{36}$/i.test(s);

// Create / update ------------------------------------------------------------------------
export async function saveRow(slug: string, id: string | null, _prev: SaveState, form: FormData): Promise<SaveState> {
  const resource = getResource(slug);
  if (!resource) return { error: "Unknown section." };
  const session = await requireAdmin();
  if (session.preview) return { error: PREVIEW_MSG };

  const { values, errors } = parseForm(resource, form);
  if (Object.keys(errors).length) return { error: "Please fix the highlighted fields.", fieldErrors: errors };

  const { supabase } = session;
  const imgs = imageFields(resource);
  let oldImages: string[] = [];

  if (id) {
    if (!isUuid(id)) return { error: "Unknown item." };
    if (imgs.length) {
      const { data } = await supabase.from(resource.table).select(imgs.join(",")).eq("id", id).maybeSingle();
      const old = (data ?? {}) as unknown as Record<string, string | null>;
      oldImages = imgs.map((f) => old[f]).filter((p, i): p is string => !!p && p !== values[imgs[i]]);
    }
    const { error } = await supabase.from(resource.table).update(values).eq("id", id);
    if (error) return { error: friendly(error.message) };
  } else {
    const { data, error } = await supabase.from(resource.table).insert(values).select("id").single();
    if (error) return { error: friendly(error.message) };
    id = data.id as string;
  }

  // Replaced images: remove the old files so storage doesn't fill up. (Except a cover that is also an album photo.)
  if (oldImages.length) await removeFiles(supabase, oldImages, resource.table === "albums");

  refreshSite(slug);
  redirect(`/admin/${slug}?saved=1`);
}

// Delete ---------------------------------------------------------------------------------
export async function deleteRow(slug: string, id: string) {
  const resource = getResource(slug);
  if (!resource || !isUuid(id)) return;
  const { supabase } = await requireWritableAdmin();

  const files: string[] = [];
  const imgs = imageFields(resource);
  if (imgs.length) {
    const { data } = await supabase.from(resource.table).select(imgs.join(",")).eq("id", id).maybeSingle();
    const row = (data ?? {}) as unknown as Record<string, string | null>;
    imgs.forEach((f) => row[f] && files.push(row[f]!));
  }
  if (resource.table === "albums") {
    const { data } = await supabase.from("album_items").select("path").eq("album_id", id);
    (data ?? []).forEach((r) => r.path && files.push(r.path));
  }

  const { error } = await supabase.from(resource.table).delete().eq("id", id);
  if (error) throw new Error(friendly(error.message));
  if (files.length) await supabase.storage.from(MEDIA_BUCKET).remove([...new Set(files)]);

  refreshSite(slug);
  redirect(`/admin/${slug}?deleted=1`);
}

// Album photos ---------------------------------------------------------------------------
export type NewItem = { path?: string; video_url?: string; width?: number; height?: number };

export async function addAlbumItems(albumId: string, items: NewItem[]): Promise<{ error?: string }> {
  const session = await requireAdmin();
  if (session.preview) return { error: PREVIEW_MSG };
  if (!isUuid(albumId) || !Array.isArray(items) || items.length === 0 || items.length > 100) return { error: "Nothing to add." };

  const rows = [];
  for (const it of items) {
    if (it.path) {
      if (!/^albums\/[A-Za-z0-9._-]+$/.test(it.path)) return { error: "Invalid file." };
      rows.push({ album_id: albumId, kind: "photo", path: it.path, width: it.width ?? null, height: it.height ?? null });
    } else if (it.video_url) {
      if (!/^https?:\/\/\S+$/i.test(it.video_url)) return { error: "Video link must start with https://" };
      rows.push({ album_id: albumId, kind: "video", video_url: it.video_url.trim() });
    }
  }
  const { supabase } = session;
  const { count } = await supabase.from("album_items").select("*", { count: "exact", head: true }).eq("album_id", albumId);
  const start = count ?? 0;
  const { error } = await supabase.from("album_items").insert(rows.map((r, i) => ({ ...r, sort: start + i })));
  if (error) return { error: friendly(error.message) };

  refreshSite("gallery");
  revalidatePath(`/admin/gallery/${albumId}`);
  return {};
}

export async function deleteAlbumItem(albumId: string, itemId: string) {
  if (!isUuid(albumId) || !isUuid(itemId)) return;
  const { supabase } = await requireWritableAdmin();
  const { data } = await supabase.from("album_items").select("path").eq("id", itemId).maybeSingle();
  await supabase.from("album_items").delete().eq("id", itemId);
  if (data?.path) {
    // Keep the file if it is still the album cover.
    const { data: album } = await supabase.from("albums").select("cover_path").eq("id", albumId).maybeSingle();
    if (album?.cover_path !== data.path) await supabase.storage.from(MEDIA_BUCKET).remove([data.path]);
  }
  refreshSite("gallery");
  revalidatePath(`/admin/gallery/${albumId}`);
}

export async function setAlbumItemCaption(albumId: string, itemId: string, caption: string): Promise<{ error?: string }> {
  const session = await requireAdmin();
  if (session.preview) return { error: PREVIEW_MSG };
  if (!isUuid(albumId) || !isUuid(itemId)) return { error: "Unknown photo." };
  const { error } = await session.supabase
    .from("album_items")
    .update({ caption: caption.trim().slice(0, 200) })
    .eq("id", itemId)
    .eq("album_id", albumId);
  if (error) return { error: "Could not save the caption." };
  refreshSite("gallery");
  return {};
}

export async function setAlbumCover(albumId: string, path: string) {
  if (!isUuid(albumId) || !/^albums\/[A-Za-z0-9._-]+$/.test(path)) return;
  const { supabase } = await requireWritableAdmin();
  await supabase.from("albums").update({ cover_path: path }).eq("id", albumId);
  refreshSite("gallery");
  revalidatePath(`/admin/gallery/${albumId}`);
}

// Settings (small key/value texts) -------------------------------------------------------
const SETTING_KEYS = ["stats_note"];

export async function saveSetting(key: string, _prev: SaveState, form: FormData): Promise<SaveState> {
  if (!SETTING_KEYS.includes(key)) return { error: "Unknown setting." };
  const session = await requireAdmin();
  if (session.preview) return { error: PREVIEW_MSG };
  const value = String(form.get("value") ?? "").trim().slice(0, 500);
  const { error } = await session.supabase.from("settings").upsert({ key, value });
  if (error) return { error: friendly(error.message) };
  refreshSite();
  return { saved: true };
}

// Site photos (fixed photo spots) --------------------------------------------------------
export async function saveSiteImages(_prev: SaveState, form: FormData): Promise<SaveState> {
  const session = await requireAdmin();
  if (session.preview) return { error: PREVIEW_MSG };

  const rows: { key: string; value: string }[] = [];
  for (const slot of SITE_IMAGE_KEYS) {
    const v = String(form.get(slot) ?? "").trim();
    if (v && !/^site\/[A-Za-z0-9._-]+$/.test(v)) return { error: "Invalid image." };
    rows.push({ key: settingKey(slot), value: v });
  }

  const { supabase } = session;
  const { data: old } = await supabase.from("settings").select("value").in("key", rows.map((r) => r.key));
  const { error } = await supabase.from("settings").upsert(rows);
  if (error) return { error: friendly(error.message) };

  // Remove files that were replaced or removed.
  const kept = new Set(rows.map((r) => r.value).filter(Boolean));
  const gone = (old ?? []).map((r) => r.value as string).filter((v) => v && !kept.has(v));
  if (gone.length) await supabase.storage.from(MEDIA_BUCKET).remove(gone);

  refreshSite("site-photos");
  return { saved: true };
}

// Inbox ----------------------------------------------------------------------------------
export async function setMessageRead(id: string, isRead: boolean) {
  if (!isUuid(id)) return;
  const { supabase } = await requireWritableAdmin();
  await supabase.from("contact_messages").update({ is_read: isRead }).eq("id", id);
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

export async function deleteMessage(id: string) {
  if (!isUuid(id)) return;
  const { supabase } = await requireWritableAdmin();
  await supabase.from("contact_messages").delete().eq("id", id);
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

export async function deleteSubscriber(id: string) {
  if (!isUuid(id)) return;
  const { supabase } = await requireWritableAdmin();
  await supabase.from("subscribers").delete().eq("id", id);
  revalidatePath("/admin/subscribers");
  revalidatePath("/admin");
}

// helpers --------------------------------------------------------------------------------
type Sb = Awaited<ReturnType<typeof requireWritableAdmin>>["supabase"];

async function removeFiles(supabase: Sb, paths: string[], keepAlbumPhotos: boolean) {
  let toRemove = paths;
  if (keepAlbumPhotos) {
    const { data } = await supabase.from("album_items").select("path").in("path", paths);
    const used = new Set((data ?? []).map((r) => r.path));
    toRemove = paths.filter((p) => !used.has(p));
  }
  if (toRemove.length) await supabase.storage.from(MEDIA_BUCKET).remove(toRemove);
}

function friendly(msg: string) {
  if (msg.includes("duplicate key") && msg.includes("slug")) return "Another article already uses this web address.";
  if (msg.includes("violates check constraint")) return "One of the values isn't allowed. Please check the form.";
  return "Could not save. Please try again.";
}
