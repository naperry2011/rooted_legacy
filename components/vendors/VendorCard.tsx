import Image from "next/image";
import Link from "next/link";
import { AtSign, Mail, Phone, Sprout } from "lucide-react";
import type { Vendor } from "@/content/vendors";

export function VendorCard({ vendor }: { vendor: Vendor }) {
  const hasContact =
    vendor.website || vendor.instagram || vendor.phone || vendor.email;

  return (
    <article className="flex flex-col rounded-2xl border border-line bg-bg-elev overflow-hidden hover:border-primary/40 transition-colors">
      <div className="relative aspect-[4/3] bg-bg">
        {vendor.photo ? (
          <Image
            src={vendor.photo}
            alt={vendor.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-primary-deep">
            <Sprout className="h-12 w-12" aria-hidden />
          </div>
        )}
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="font-display text-2xl text-cream">{vendor.name}</h3>
        <p className="mt-2 text-sm text-ink-muted">{vendor.blurb}</p>

        {vendor.services.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {vendor.services.map((s) => (
              <li
                key={s}
                className="rounded-full border border-line bg-bg px-3 py-1 text-xs text-ink-muted"
              >
                {s}
              </li>
            ))}
          </ul>
        )}

        {vendor.eventSlugs && vendor.eventSlugs.length > 0 && (
          <p className="mt-4 text-xs text-ink-muted/70">
            Seen on the farm at{" "}
            {vendor.eventSlugs.map((slug, i) => (
              <span key={slug}>
                <Link
                  href={`/events/${slug}`}
                  className="text-primary hover:underline"
                >
                  this event
                </Link>
                {i < (vendor.eventSlugs?.length ?? 0) - 1 && ", "}
              </span>
            ))}
            .
          </p>
        )}

        {hasContact && (
          <div className="mt-auto flex flex-wrap items-center gap-4 pt-5 text-sm">
            {vendor.website && (
              <a
                href={vendor.website}
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:text-cream"
              >
                Visit site →
              </a>
            )}
            {vendor.instagram && (
              <a
                href={`https://www.instagram.com/${vendor.instagram}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-ink-muted hover:text-primary"
                aria-label={`${vendor.name} on Instagram`}
              >
                <AtSign className="h-4 w-4" aria-hidden />
                {vendor.instagram}
              </a>
            )}
            {vendor.phone && (
              <a
                href={`tel:${vendor.phone.replace(/[^+\d]/g, "")}`}
                className="inline-flex items-center gap-1.5 text-ink-muted hover:text-primary"
              >
                <Phone className="h-4 w-4" aria-hidden />
                {vendor.phone}
              </a>
            )}
            {vendor.email && (
              <a
                href={`mailto:${vendor.email}`}
                className="inline-flex items-center gap-1.5 text-ink-muted hover:text-primary"
              >
                <Mail className="h-4 w-4" aria-hidden />
                {vendor.email}
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
