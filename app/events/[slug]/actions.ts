"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { bookingSchema } from "@/lib/validations/booking";
import { createAdminClient } from "@/lib/supabase/admin";
import { createServerClient } from "@/lib/supabase/server";
import { sendEmail, wrapHtml } from "@/lib/resend";
import { formatEventDate, formatTimeRange } from "@/content/events";

export type BookingState =
  | undefined
  | {
      ok?: false;
      error?: string;
      fieldErrors?: Partial<Record<string, string>>;
    }
  | { ok: true; email: string };

export async function createBooking(
  _prev: BookingState,
  formData: FormData,
): Promise<BookingState> {
  const parsed = bookingSchema.safeParse({
    event_id: formData.get("event_id"),
    attendee_name: formData.get("attendee_name"),
    attendee_email: formData.get("attendee_email"),
    party_size: formData.get("party_size"),
    notes: formData.get("notes") || undefined,
  });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const k = issue.path[0];
      if (typeof k === "string") fieldErrors[k] = issue.message;
    }
    return { ok: false, fieldErrors };
  }

  // Pull the event so we can attach details to the confirmation email.
  const supabase = await createServerClient();
  const { data: event } = await supabase
    .from("events")
    .select("slug, title, date, start_time, end_time, location")
    .eq("id", parsed.data.event_id)
    .eq("status", "published")
    .maybeSingle<{
      slug: string;
      title: string;
      date: string;
      start_time: string | null;
      end_time: string | null;
      location: string;
    }>();
  if (!event) {
    return { ok: false, error: "That event is no longer available." };
  }

  // Best-effort: link to logged-in user if their email matches.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId =
    user && user.email?.toLowerCase() === parsed.data.attendee_email.toLowerCase()
      ? user.id
      : null;

  const admin = createAdminClient();
  const { error } = await admin.from("bookings").insert({
    event_id: parsed.data.event_id,
    user_id: userId,
    attendee_name: parsed.data.attendee_name,
    attendee_email: parsed.data.attendee_email,
    party_size: parsed.data.party_size,
    notes: parsed.data.notes ?? null,
  });
  if (error) {
    return { ok: false, error: "Couldn't save your RSVP. Try again?" };
  }

  // Send confirmation (best-effort; not blocking the response).
  const hdrs = await headers();
  const origin =
    hdrs.get("origin") ??
    `https://${hdrs.get("host") ?? "rooted-legacy-phi.vercel.app"}`;
  const eventUrl = `${origin}/events/${event.slug}`;
  const time = event.start_time
    ? formatTimeRange(
        event.start_time.slice(0, 5),
        event.end_time?.slice(0, 5),
      )
    : "";

  await sendEmail({
    to: parsed.data.attendee_email,
    subject: `You're in: ${event.title}`,
    html: wrapHtml({
      heading: "You're on the list",
      intro: `Thanks for RSVP'ing, ${parsed.data.attendee_name}. We'll see you on the farm.`,
      body: `
        <p style="margin:0 0 8px"><strong>${event.title}</strong></p>
        <p style="margin:0;color:#3a3a36">${formatEventDate(event.date)}${time ? ` · ${time}` : ""}</p>
        <p style="margin:8px 0 0;color:#3a3a36">${event.location}</p>
        <p style="margin:16px 0 0;color:#3a3a36">Party of ${parsed.data.party_size}.</p>
      `,
      ctaLabel: "Event details",
      ctaUrl: eventUrl,
    }),
  });

  revalidatePath(`/events/${event.slug}`);
  revalidatePath("/account");
  return { ok: true, email: parsed.data.attendee_email };
}
