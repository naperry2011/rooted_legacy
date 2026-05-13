import { MapPin } from "lucide-react";
import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-line mt-16 sm:mt-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-10 flex flex-col md:flex-row gap-5 sm:gap-6 items-start md:items-center justify-between">
        <div className="min-w-0">
          <p className="font-display text-2xl text-primary">{site.name}</p>
          <p className="text-sm text-ink-muted mt-1 flex items-start gap-2 break-words">
            <MapPin className="h-4 w-4 mt-1 shrink-0" aria-hidden />
            <span>{site.address.full}</span>
          </p>
        </div>
        <p className="text-xs text-ink-muted/70">
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
