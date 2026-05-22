import type { Metadata } from "next";
import { Sprout } from "lucide-react";
import { listFarmStand, sheetsConfigured } from "@/lib/sheets";
import { ShopCard } from "@/components/produce/ShopCard";

export const metadata: Metadata = {
  title: "Farm stand",
  description:
    "What we're harvesting this week at Rooted Legacy. Online ordering coming soon.",
};

export const revalidate = 900;

export default async function ShopPage() {
  const configured = sheetsConfigured();
  const items = configured ? await listFarmStand() : [];

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
      <header className="mb-8 sm:mb-10">
        <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-primary-deep mb-3">
          What we&apos;re harvesting
        </p>
        <h1 className="font-display text-4xl sm:text-5xl text-primary">
          Farm stand
        </h1>
        <p className="mt-4 text-ink-muted max-w-2xl">
          Fresh produce grown on the farm at 865 N German Church Rd. Pickup at
          the farm during open hours.
        </p>
      </header>

      <div className="mb-8 rounded-2xl border border-primary/30 bg-primary/5 px-5 py-4 text-sm text-cream">
        🌱 <strong className="text-primary">Online ordering coming soon.</strong>{" "}
        For now, come visit us on event days or{" "}
        <a href="/contact" className="text-primary hover:underline">
          reach out
        </a>{" "}
        to ask about what&apos;s available.
      </div>

      {!configured ? (
        <div className="rounded-2xl border border-line bg-bg-elev p-8 flex items-start gap-4">
          <Sprout className="h-6 w-6 text-primary-deep mt-1" aria-hidden />
          <div>
            <p className="font-display text-xl text-cream">Not configured</p>
            <p className="mt-2 text-ink-muted">
              Set <code className="text-primary">GOOGLE_SHEETS_ID</code> and{" "}
              <code className="text-primary">GOOGLE_SERVICE_ACCOUNT_JSON</code>{" "}
              in <code className="text-primary">.env.local</code> to read the
              produce sheet.
            </p>
          </div>
        </div>
      ) : items.length === 0 ? (
        <p className="text-ink-muted">
          Nothing in the field right now — check back in a couple weeks.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {items.map((item) => (
            <ShopCard key={item.sku} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
