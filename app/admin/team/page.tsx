import { createAdminClient } from "@/lib/supabase/admin";
import { DataTable, StatusBadge } from "@/components/admin/DataTable";
import { AddMemberForm } from "./AddMemberForm";
import { revokeMember } from "./actions";

type Row = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string;
};

export default async function AdminTeam() {
  const admin = createAdminClient();
  const { data } = await admin
    .from("profiles")
    .select("id, full_name, email, role")
    .in("role", ["admin", "staff"])
    .order("role", { ascending: true })
    .returns<Row[]>();

  const rows = (data ?? []).map((r) => [
    <div key="who">
      <p className="text-cream">{r.full_name ?? "—"}</p>
      <p className="text-xs text-ink-muted/70 break-all">{r.email ?? ""}</p>
    </div>,
    <StatusBadge key="role" status={r.role} />,
    <form key="revoke" action={revokeMember}>
      <input type="hidden" name="id" value={r.id} />
      <button type="submit" className="text-xs text-tomato hover:underline">
        Revoke access
      </button>
    </form>,
  ]);

  return (
    <div>
      <h1 className="font-display text-3xl sm:text-4xl text-primary mb-2">
        Team
      </h1>
      <p className="text-ink-muted mb-8 max-w-md">
        Invite-only. Create an admin account below and share the temporary
        password with them; they change it after logging in. Revoke access
        anytime.
      </p>

      <section className="mb-12">
        <h2 className="font-display text-2xl text-cream mb-4">Add an admin</h2>
        <AddMemberForm />
      </section>

      <section>
        <h2 className="font-display text-2xl text-cream mb-4">Current team</h2>
        <DataTable
          columns={["Member", "Role", ""]}
          rows={rows}
          emptyLabel="No team members yet."
        />
      </section>
    </div>
  );
}
