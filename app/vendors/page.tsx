import Link from "next/link";
import type { Metadata } from "next";
import { AtSign, Mail, Store, ArrowRight } from "lucide-react";
import { site } from "@/content/site";
import { featuredVendors } from "@/content/vendors";
import { VendorCard } from "@/components/vendors/VendorCard";

export const metadata: Metadata = {
  title: "Vendors + partners",
  description:
    "The Indianapolis businesses, growers, and partners who show up on the farm with us.",
  openGraph: {
    title: "Vendors + partners — Rooted Legacy",
    description:
      "The Indianapolis businesses, growers, and partners who show up on the farm with us.",
    images: ["/gallery/grand-opening-vendors-row.jpg"],
  },
};

export default function VendorsIndex() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
      <header className="mb-10 sm:mb-12">
        <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-primary-deep mb-3">
          Who&apos;s on the farm
        </p>
        <h1 className="font-display text-4xl sm:text-5xl text-primary">
          Vendors + partners
        </h1>
        <p className="mt-4 text-ink-muted max-w-2xl">
          The Indianapolis businesses, growers, healers, and educators who
          show up with us. We work hardest with partners aligned around food
          sovereignty and Black community wellness.
        </p>
      </header>

      {/* Long-term partners */}
      <section className="mb-16">
        <h2 className="font-display text-2xl sm:text-3xl text-cream mb-6">
          Long-term partners
        </h2>
        <div className="grid sm:grid-cols-2 gap-5">
          {site.partners.map((p) => (
            <article
              key={p.name}
              className="flex flex-col rounded-2xl border border-line bg-bg-elev p-6 hover:border-primary/40 transition-colors"
            >
              <h3 className="font-display text-2xl text-cream">{p.name}</h3>
              <p className="mt-2 text-sm text-ink-muted">{p.blurb}</p>
              {p.tagline && (
                <blockquote className="mt-4 border-l-2 border-primary/40 pl-3 text-sm italic text-ink/90">
                  &ldquo;{p.tagline}&rdquo;
                </blockquote>
              )}
              {p.services && p.services.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {p.services.map((s) => (
                    <li
                      key={s}
                      className="rounded-full border border-line bg-bg px-3 py-1 text-xs text-ink-muted"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-auto flex flex-wrap items-center gap-4 pt-5 text-sm">
                {p.url && (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:text-cream"
                  >
                    Visit site →
                  </a>
                )}
                {p.instagram && (
                  <a
                    href={`https://www.instagram.com/${p.instagram}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-ink-muted hover:text-primary"
                    aria-label={`${p.name} on Instagram`}
                  >
                    <AtSign className="h-4 w-4" aria-hidden />
                    {p.instagram}
                  </a>
                )}
                {p.email && (
                  <a
                    href={`mailto:${p.email}`}
                    className="inline-flex items-center gap-1.5 text-ink-muted hover:text-primary"
                  >
                    <Mail className="h-4 w-4" aria-hidden />
                    {p.email}
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Featured vendors */}
      {featuredVendors.length > 0 && (
        <section className="mb-16">
          <h2 className="font-display text-2xl sm:text-3xl text-cream mb-6">
            Featured vendors
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredVendors.map((v) => (
              <VendorCard key={v.slug} vendor={v} />
            ))}
          </div>
        </section>
      )}

      {/* Apply CTA */}
      <section className="rounded-2xl border border-primary/40 bg-gradient-to-br from-bg-elev to-bg p-6 sm:p-8 bg-grain">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div className="flex-1">
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-primary-deep mb-2 inline-flex items-center gap-2">
              <Store className="h-3.5 w-3.5" aria-hidden /> For makers + partners
            </p>
            <h2 className="font-display text-2xl sm:text-3xl text-cream leading-tight">
              Want to vend at the farm?
            </h2>
            <p className="mt-2 text-ink-muted max-w-prose">
              We host community markets a few times a year. Food, herbal goods,
              wellness, art, kids&apos; activities — if you bring something
              Indianapolis would love, we want to hear from you.
            </p>
          </div>
          <Link
            href="/vendors/apply"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-primary text-bg font-medium hover:bg-cream transition-colors whitespace-nowrap"
          >
            Apply to vend
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>
    </div>
  );
}
