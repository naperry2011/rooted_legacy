"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  eventSchema,
  slugify,
  splitLines,
} from "@/lib/validations/event";

export type EventFormState =
  | undefined
  | {
      ok?: false;
      error?: string;
      fieldErrors?: Partial<Record<string, string>>;
    }
  | { ok: true; slug: string };

/** Refresh every surface an event change can touch. */
function revalidateEvent(slug?: string) {
  revalidatePath("/admin/events");
  revalidatePath("/admin");
  revalidatePath("/events");
  if (slug) revalidatePath(`/events/${slug}`);
}

export async function upsertEvent(
  _prev: EventFormState,
  formData: FormData,
): Promise<EventFormState> {
  await requireAdmin();

  const parsed = eventSchema.safeParse({
    id: formData.get("id") || "",
    title: formData.get("title"),
    slug: formData.get("slug") || "",
    summary: formData.get("summary"),
    body_md: formData.get("body_md") || "",
    date: formData.get("date"),
    start_time: formData.get("start_time"),
    end_time: formData.get("end_time"),
    location: formData.get("location"),
    tagline: formData.get("tagline") || "",
    status: formData.get("status"),
    kind: formData.get("kind"),
    external_url: formData.get("external_url"),
    capacity: formData.get("capacity"),
    is_featured: formData.get("is_featured") === "on",
    highlights: formData.get("highlights") || "",
    partners: formData.get("partners") || "",
    themes: formData.get("themes") || "",
    included_perks: formData.get("included_perks") || "",
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const k = issue.path[0];
      if (typeof k === "string" && !fieldErrors[k]) fieldErrors[k] = issue.message;
    }
    return { ok: false, fieldErrors };
  }

  const v = parsed.data;
  const slug = slugify(v.slug || v.title);
  if (!slug) {
    return { ok: false, fieldErrors: { slug: "Couldn't build a slug — add one." } };
  }

  const admin = createAdminClient();

  // Guard against slug collisions with a *different* event.
  const { data: clash } = await admin
    .from("events")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (clash && clash.id !== v.id) {
    return {
      ok: false,
      fieldErrors: { slug: "That slug is already used by another event." },
    };
  }

  const payload = {
    slug,
    title: v.title,
    summary: v.summary,
    body_md: v.body_md ? v.body_md : null,
    date: v.date,
    start_time: v.start_time ?? null,
    end_time: v.end_time ?? null,
    location: v.location,
    tagline: v.tagline ? v.tagline : null,
    status: v.status,
    kind: v.kind,
    external_url: v.external_url ?? null,
    capacity: v.capacity ?? null,
    is_featured: v.is_featured ?? false,
    highlights: splitLines(v.highlights),
    partners: splitLines(v.partners),
    themes: splitLines(v.themes),
    included_perks: splitLines(v.included_perks),
  };

  if (v.id) {
    const { error } = await admin.from("events").update(payload).eq("id", v.id);
    if (error) {
      return { ok: false, error: "Couldn't save changes. Try again?" };
    }
  } else {
    const { error } = await admin.from("events").insert(payload);
    if (error) {
      return { ok: false, error: "Couldn't create the event. Try again?" };
    }
  }

  revalidateEvent(slug);
  return { ok: true, slug };
}

export async function deleteEvent(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const admin = createAdminClient();
  // bookings.event_id is ON DELETE CASCADE, so RSVPs are removed automatically.
  await admin.from("events").delete().eq("id", id);

  revalidateEvent();
  redirect("/admin/events");
}

export async function cancelBooking(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const admin = createAdminClient();
  await admin.from("bookings").update({ status: "cancelled" }).eq("id", id);

  revalidatePath("/admin/events");
  revalidatePath("/admin/bookings");
}
