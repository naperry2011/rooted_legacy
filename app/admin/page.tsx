import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";

async function counts() {
  const admin = createAdminClient();
  const [bookings, subs, vendors, messages, events] = await Promise.all([
    admin.from("bookings").select("id", { count: "exact", head: true }),
    admin
      .from("subscribers")
      .select("id", { count: "exact", head: true })
      .eq("status", "active"),
    admin
      .from("vendor_applications")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    admin.from("contact_messages").select("id", { count: "exact", head: true }),
    admin
      .from("events")
      .select("id", { count: "exact", head: true })
      .eq("status", "published"),
  ]);
  return {
    bookings: bookings.count ?? 0,
    subscribers: subs.count ?? 0,
    pendingVendors: vendors.count ?? 0,
    messages: messages.count ?? 0,
    publishedEvents: events.count ?? 0,
  };
}

function Stat({
  label,
  value,
  href,
}: {
  label: string;
  value: number;
  href?: string;
}) {
  const card = (
    <div className="rounded-2xl border border-line bg-bg-elev p-5 hover:border-primary/40 transition-colors">
      <p className="text-xs uppercase tracking-[0.25em] text-primary-deep">
        {label}
      </p>
      <p className="font-display text-4xl text-cream mt-2">{value}</p>
    </div>
  );
  return href ? <Link href={href}>{card}</Link> : card;
}

export default async function AdminDashboard() {
  const c = await counts();

  return (
    <div>
      <h1 className="font-display text-4xl text-primary mb-2">Dashboard</h1>
      <p className="text-ink-muted mb-8">
        Read-only for the MVP. Use Supabase Studio for inserts and edits until
        Phase 2 admin tools land.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Stat label="RSVPs" value={c.bookings} href="/admin/bookings" />
        <Stat
          label="Subscribers"
          value={c.subscribers}
          href="/admin/subscribers"
        />
        <Stat
          label="Pending vendors"
          value={c.pendingVendors}
          href="/admin/vendors"
        />
        <Stat
          label="Contact messages"
          value={c.messages}
          href="/admin/messages"
        />
        <Stat label="Published events" value={c.publishedEvents} />
      </div>
    </div>
  );
}
