import { createAdminClient } from "@/lib/supabase/admin";
import { DataTable, formatDateTime } from "@/components/admin/DataTable";

export default async function AdminMessages() {
  const admin = createAdminClient();
  const { data } = await admin
    .from("contact_messages")
    .select("id, name, email, body, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  const rows = (data ?? []).map((r) => [
    <div key="from">
      <p className="text-cream">{r.name}</p>
      <p className="text-xs text-ink-muted/70 break-all">{r.email}</p>
    </div>,
    <p
      key="body"
      className="text-sm text-ink whitespace-pre-wrap max-w-prose"
    >
      {r.body}
    </p>,
    formatDateTime(r.created_at),
  ]);

  return (
    <div>
      <h1 className="font-display text-3xl sm:text-4xl text-primary mb-6">
        Contact messages
      </h1>
      <DataTable
        columns={["From", "Message", "Received"]}
        rows={rows}
        emptyLabel="No messages yet."
      />
    </div>
  );
}
