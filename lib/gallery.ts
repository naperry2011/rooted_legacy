import "server-only";

import { createPublicClient } from "@/lib/supabase/public";

export type GalleryPhoto = {
  id: string;
  path: string;
  alt: string;
  caption: string | null;
  src: string; // resolved URL, either local /public or Supabase Storage public URL
};

const STORAGE_BUCKET = "gallery";

function hasSupabase(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export async function listGalleryPhotos(): Promise<GalleryPhoto[]> {
  if (!hasSupabase()) return [];
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("gallery_photos")
    .select("id, path, alt, caption")
    .order("sort_order", { ascending: true })
    .returns<{ id: string; path: string; alt: string; caption: string | null }[]>();
  if (error || !data) return [];

  return data.map((row) => ({
    ...row,
    src: resolveSrc(row.path, supabase),
  }));
}

export async function listPhotosForEvent(
  eventId: string,
): Promise<GalleryPhoto[]> {
  if (!hasSupabase()) return [];
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("gallery_photos")
    .select("id, path, alt, caption")
    .eq("event_id", eventId)
    .order("sort_order", { ascending: true })
    .returns<{ id: string; path: string; alt: string; caption: string | null }[]>();
  if (error || !data) return [];
  return data.map((row) => ({
    ...row,
    src: resolveSrc(row.path, supabase),
  }));
}

function resolveSrc(
  rawPath: string,
  supabase: ReturnType<typeof createPublicClient>,
): string {
  if (/^https?:\/\//i.test(rawPath)) return rawPath;
  if (rawPath.startsWith("/")) return rawPath;
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(rawPath);
  return data.publicUrl;
}
