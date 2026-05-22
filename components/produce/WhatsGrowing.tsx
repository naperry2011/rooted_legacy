import Link from "next/link";
import { Sprout } from "lucide-react";
import { listInSeason, sheetsConfigured } from "@/lib/sheets";

export async function WhatsGrowing() {
  if (!sheetsConfigured()) {
    return process.env.NODE_ENV === "production" ? null : (
      <div className="rounded-2xl border border-line bg-bg-elev p-5 text-sm text-ink-muted flex items-center gap-3">
        <Sprout className="h-5 w-5 text-primary-deep" aria-hidden />
        <span>
          Produce widget inactive — set <code>GOOGLE_SHEETS_ID</code> and{" "}
          <code>GOOGLE_SERVICE_ACCOUNT_JSON</code> in <code>.env.local</code>.
        </span>
      </div>
    );
  }

  const items = await listInSeason();
  if (items.length === 0) return null;

  const preview = items.slice(0, 6);
  const more = items.length - preview.length;

  return (
    <Link
      href="/shop"
      className="group block rounded-2xl border border-line bg-bg-elev p-5 sm:p-6 hover:border-primary/40 transition-colors"
    >
      <div className="flex items-start gap-4">
        <div className="rounded-full bg-leaf/15 p-3 text-leaf shrink-0">
          <Sprout className="h-5 w-5" aria-hidden />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs uppercase tracking-[0.25em] text-primary-deep">
            Growing right now
          </p>
          <p className="mt-1 font-display text-2xl text-cream group-hover:text-primary transition-colors">
            {preview.map((p) => p.name).join(" · ")}
            {more > 0 && (
              <span className="text-ink-muted"> · +{more} more</span>
            )}
          </p>
          <p className="mt-2 text-sm text-ink-muted">
            See the full farm stand →
          </p>
        </div>
      </div>
    </Link>
  );
}
