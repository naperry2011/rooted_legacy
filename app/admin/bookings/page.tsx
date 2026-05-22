import { createAdminClient } from "@/lib/supabase/admin";
import {
  DataTable,
  StatusBadge,
  formatDateTime,
} from "@/components/admin/DataTable";

type Row = {
  id: string;
  attendee_name: string;
  attendee_email: string;
  party_size: number;
  status: string;
  created_at: string;
  notes: string | null;
  event: { title: string; date: string } | null;
};

export default async function AdminBookings() {
  const admin = createAdminClient();
  const { data } = await admin
    .from("bookings")
    .select(
      "id, attendee_name, attendee_email, party_size, status, created_at, notes, event:events(title, date)",
    )
    .order("created_at", { ascending: false })
    .limit(200)
    .returns<Row[]>();

  const rows = (data ?? []).map((r) => [
    <div key="event">
      <p className="text-cream">{r.event?.title ?? "—"}</p>
      <p className="text-xs text-ink-muted/70">{r.event?.date ?? ""}</p>
    </div>,
    <div key="attendee">
      <p>{r.attendee_name}</p>
      <p className="text-xs text-ink-muted/70 break-all">{r.attendee_email}</p>
    </div>,
    r.party_size,
    <StatusBadge key="status" status={r.status} />,
    formatDateTime(r.created_at),
    r.notes ?? "",
  ]);

  return (
    <div>
      <h1 className="font-display text-3xl sm:text-4xl text-primary mb-6">
        RSVPs
      </h1>
      <DataTable
        columns={["Event", "Attendee", "Party", "Status", "Created", "Notes"]}
        rows={rows}
        emptyLabel="No RSVPs yet."
      />
    </div>
  );
}
