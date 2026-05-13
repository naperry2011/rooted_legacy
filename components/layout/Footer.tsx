import { MapPin } from "lucide-react";
import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-line mt-24">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        <div>
          <p className="font-display text-2xl text-primary">{site.name}</p>
          <p className="text-sm text-ink-muted mt-1 flex items-center gap-2">
            <MapPin className="h-4 w-4" aria-hidden />
            {site.address.full}
          </p>
        </div>
        <p className="text-xs text-ink-muted/70">
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
