import { createAdminClient } from "@/lib/supabase/admin";
import {
  DataTable,
  StatusBadge,
  formatDateTime,
} from "@/components/admin/DataTable";

export default async function AdminSubscribers() {
  const admin = createAdminClient();
  const { data } = await admin
    .from("subscribers")
    .select("id, email, status, source, confirmed_at, created_at")
    .order("created_at", { ascending: false })
    .limit(500);

  const rows = (data ?? []).map((r) => [
    r.email,
    <StatusBadge key="status" status={r.status} />,
    r.source ?? "—",
    r.confirmed_at ? formatDateTime(r.confirmed_at) : "—",
    formatDateTime(r.created_at),
  ]);

  return (
    <div>
      <h1 className="font-display text-3xl sm:text-4xl text-primary mb-6">
        Subscribers
      </h1>
      <DataTable
        columns={["Email", "Status", "Source", "Confirmed", "Signed up"]}
        rows={rows}
        emptyLabel="No subscribers yet."
      />
    </div>
  );
}
