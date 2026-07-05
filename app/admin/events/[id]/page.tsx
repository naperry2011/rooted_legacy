import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  DataTable,
  StatusBadge,
  formatDateTime,
} from "@/components/admin/DataTable";
import type { EventRow } from "@/lib/events";
import { EventForm } from "../EventForm";
import { cancelBooking } from "../actions";
import { ExportCsvButton, type AttendeeCsvRow } from "./ExportCsvButton";

type Params = { id: string };

type Booking = {
  id: string;
  attendee_name: string;
  attendee_email: string;
  party_size: number;
  status: string;
  created_at: string;
};

export default async function EditEventPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const admin = createAdminClient();

  const [{ data: event }, { data: bookings }] = await Promise.all([
    admin
      .from("events")
      .select("*")
      .eq("id", id)
      .maybeSingle<EventRow>(),
    admin
      .from("bookings")
      .select(
        "id, attendee_name, attendee_email, party_size, status, created_at",
      )
      .eq("event_id", id)
      .order("created_at", { ascending: false })
      .returns<Booking[]>(),
  ]);

  if (!event) notFound();

  const confirmed = (bookings ?? []).filter((b) => b.status === "confirmed");
  const totalGuests = confirmed.reduce((n, b) => n + (b.party_size ?? 1), 0);

  const csvRows: AttendeeCsvRow[] = (bookings ?? []).map((b) => ({
    name: b.attendee_name,
    email: b.attendee_email,
    party_size: b.party_size,
    status: b.status,
    created_at: b.created_at,
  }));

  const attendeeRows = (bookings ?? []).map((b) => [
    <div key="who">
      <p className="text-cream">{b.attendee_name}</p>
      <p className="text-xs text-ink-muted/70 break-all">{b.attendee_email}</p>
    </div>,
    b.party_size,
    <StatusBadge key="status" status={b.status} />,
    formatDateTime(b.created_at),
    b.status === "confirmed" ? (
      <form key="cancel" action={cancelBooking}>
        <input type="hidden" name="id" value={b.id} />
        <button type="submit" className="text-xs text-tomato hover:underline">
          Cancel
        </button>
      </form>
    ) : (
      <span key="cancel" className="text-xs text-ink-muted/50">
        —
      </span>
    ),
  ]);

  return (
    <div>
      <Link
        href="/admin/events"
        className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-primary mb-4"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        All events
      </Link>
      <h1 className="font-display text-3xl sm:text-4xl text-primary mb-6">
        Edit event
      </h1>

      <EventForm event={event} />

      <section className="mt-12 pt-8 border-t border-line">
        <div className="flex items-center justify-between gap-4 mb-2">
          <h2 className="font-display text-2xl text-primary">Attendees</h2>
          <ExportCsvButton
            rows={csvRows}
            filename={`${event.slug}-rsvps.csv`}
          />
        </div>
        <p className="text-ink-muted mb-6 text-sm">
          {confirmed.length} confirmed RSVP{confirmed.length === 1 ? "" : "s"} ·{" "}
          {totalGuests} guest{totalGuests === 1 ? "" : "s"} total
          {event.capacity ? ` · capacity ${event.capacity}` : ""}
        </p>

        <DataTable
          columns={["Attendee", "Party", "Status", "RSVP'd", ""]}
          rows={attendeeRows}
          emptyLabel="No RSVPs yet."
        />
      </section>
    </div>
  );
}
