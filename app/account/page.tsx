import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarDays, MapPin } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { createServerClient } from "@/lib/supabase/server";
import { formatEventDate } from "@/content/events";

export const metadata: Metadata = {
  title: "My account",
};

type BookingRow = {
  id: string;
  party_size: number;
  status: string;
  created_at: string;
  event: {
    slug: string;
    title: string;
    date: string;
    location: string;
  } | null;
};

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account");

  const supabase = await createServerClient();
  const { data: bookings } = await supabase
    .from("bookings")
    .select(
      "id, party_size, status, created_at, event:events(slug, title, date, location)",
    )
    .or(`user_id.eq.${user.id},attendee_email.eq.${user.email ?? ""}`)
    .order("created_at", { ascending: false })
    .returns<BookingRow[]>();

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-primary-deep mb-3">
            Welcome back
          </p>
          <h1 className="font-display text-4xl sm:text-5xl text-primary">
            My account
          </h1>
          <p className="mt-3 text-ink-muted break-words">{user.email}</p>
        </div>

        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="text-sm text-ink-muted hover:text-primary px-3 py-2 rounded-md hover:bg-bg-elev transition-colors"
          >
            Sign out
          </button>
        </form>
      </header>

      <section>
        <h2 className="font-display text-2xl text-cream mb-4">My RSVPs</h2>
        {!bookings || bookings.length === 0 ? (
          <p className="text-ink-muted">
            You haven&apos;t RSVP&apos;d to anything yet. Browse{" "}
            <Link className="text-primary hover:underline" href="/events">
              upcoming events
            </Link>
            .
          </p>
        ) : (
          <ul className="space-y-4">
            {bookings.map((b) => (
              <li
                key={b.id}
                className="rounded-2xl border border-line bg-bg-elev p-5"
              >
                <p className="font-display text-xl text-cream">
                  {b.event?.title ?? "Event"}
                </p>
                <div className="mt-2 grid sm:grid-cols-2 gap-1 text-sm text-ink-muted">
                  {b.event?.date && (
                    <p className="flex items-center gap-2">
                      <CalendarDays
                        className="h-4 w-4 text-primary"
                        aria-hidden
                      />
                      {formatEventDate(b.event.date)}
                    </p>
                  )}
                  {b.event?.location && (
                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" aria-hidden />
                      {b.event.location}
                    </p>
                  )}
                </div>
                <p className="mt-2 text-xs text-ink-muted/70">
                  Party of {b.party_size} · {b.status}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
