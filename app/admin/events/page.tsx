import Link from "next/link";
import { Plus } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { DataTable, StatusBadge } from "@/components/admin/DataTable";
import { formatEventDate } from "@/content/events";
import { DeleteEventButton } from "./DeleteEventButton";

type Row = {
  id: string;
  slug: string;
  title: string;
  date: string;
  location: string;
  status: string;
};

export default async function AdminEvents() {
  const admin = createAdminClient();

  const [{ data: events }, { data: bookings }] = await Promise.all([
    admin
      .from("events")
      .select("id, slug, title, date, location, status")
      .order("date", { ascending: false })
      .returns<Row[]>(),
    admin
      .from("bookings")
      .select("event_id, party_size, status")
      .eq("status", "confirmed")
      .returns<{ event_id: string; party_size: number; status: string }[]>(),
  ]);

  // Tally confirmed attendees per event (sum of party sizes).
  const counts = new Map<string, number>();
  for (const b of bookings ?? []) {
    counts.set(b.event_id, (counts.get(b.event_id) ?? 0) + (b.party_size ?? 1));
  }

  const rows = (events ?? []).map((r) => [
    <span key="date" className="whitespace-nowrap text-ink-muted">
      {formatEventDate(r.date)}
    </span>,
    <div key="title">
      <p className="text-cream">{r.title}</p>
      <p className="text-xs text-ink-muted/70">/events/{r.slug}</p>
    </div>,
    <span key="loc" className="text-ink-muted">
      {r.location}
    </span>,
    <StatusBadge key="status" status={r.status} />,
    <span key="rsvps">{counts.get(r.id) ?? 0}</span>,
    <div key="actions" className="flex items-center gap-3 whitespace-nowrap">
      <Link
        href={`/admin/events/${r.id}`}
        className="text-xs text-primary hover:underline"
      >
        Edit
      </Link>
      <DeleteEventButton id={r.id} title={r.title} />
    </div>,
  ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4">
        <h1 className="font-display text-3xl sm:text-4xl text-primary">
          Events
        </h1>
        <Link
          href="/admin/events/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary text-bg font-medium hover:bg-cream transition-colors whitespace-nowrap"
        >
          <Plus className="h-4 w-4" aria-hidden />
          New event
        </Link>
      </div>

      <DataTable
        columns={["Date", "Event", "Location", "Status", "RSVPs", ""]}
        rows={rows}
        emptyLabel="No events yet. Create your first one."
      />
    </div>
  );
}
