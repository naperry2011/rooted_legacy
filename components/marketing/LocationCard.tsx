import { MapPin } from "lucide-react";
import { site } from "@/content/site";

export function LocationCard() {
  const q = encodeURIComponent(site.address.full);
  const mapsUrl = `https://www.google.com/maps?q=${q}`;
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="rounded-2xl border border-line bg-bg-elev p-8 md:p-10 bg-grain">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-primary/15 p-3 text-primary">
            <MapPin className="h-6 w-6" aria-hidden />
          </div>
          <div className="flex-1">
            <h2 className="font-display text-3xl text-primary">
              Visit the farm
            </h2>
            <p className="mt-2 text-ink-muted">{site.address.full}</p>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center text-primary hover:text-cream underline-offset-4 hover:underline"
            >
              Open in Google Maps →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
