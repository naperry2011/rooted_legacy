import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CalendarCheck,
  Inbox,
  LayoutDashboard,
  Mail,
  Store,
} from "lucide-react";
import { getCurrentRole, getCurrentUser } from "@/lib/auth";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "RSVPs", icon: CalendarCheck },
  { href: "/admin/subscribers", label: "Subscribers", icon: Mail },
  { href: "/admin/vendors", label: "Vendor apps", icon: Store },
  { href: "/admin/messages", label: "Messages", icon: Inbox },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin");
  const role = await getCurrentRole();
  if (role !== "admin") redirect("/account");

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
      <div className="grid lg:grid-cols-[200px_1fr] gap-8">
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <p className="font-display text-2xl text-primary mb-4">Admin</p>
          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible">
            {nav.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-ink-muted hover:text-primary hover:bg-bg-elev transition-colors whitespace-nowrap"
              >
                <Icon className="h-4 w-4" aria-hidden />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
