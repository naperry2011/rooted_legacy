import { createAdminClient } from "@/lib/supabase/admin";
import {
  DataTable,
  StatusBadge,
  formatDateTime,
} from "@/components/admin/DataTable";

export default async function AdminVendors() {
  const admin = createAdminClient();
  const { data } = await admin
    .from("vendor_applications")
    .select(
      "id, business_name, contact_name, contact_email, category, status, created_at, blurb",
    )
    .order("created_at", { ascending: false })
    .limit(200);

  const rows = (data ?? []).map((r) => [
    <div key="business">
      <p className="text-cream">{r.business_name}</p>
      <p className="text-xs text-ink-muted/70">{r.category ?? ""}</p>
    </div>,
    <div key="contact">
      <p>{r.contact_name ?? "—"}</p>
      <p className="text-xs text-ink-muted/70 break-all">{r.contact_email}</p>
    </div>,
    <StatusBadge key="status" status={r.status} />,
    formatDateTime(r.created_at),
    <p
      key="blurb"
      className="text-sm text-ink-muted line-clamp-3 max-w-md"
    >
      {r.blurb}
    </p>,
  ]);

  return (
    <div>
      <h1 className="font-display text-3xl sm:text-4xl text-primary mb-6">
        Vendor applications
      </h1>
      <DataTable
        columns={["Business", "Contact", "Status", "Applied", "About"]}
        rows={rows}
        emptyLabel="No applications yet."
      />
    </div>
  );
}
