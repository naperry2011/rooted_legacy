import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { BookOpen, MapPin, Sprout, Users, Heart } from "lucide-react";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Our story",
  description:
    "Rooted Legacy is a Black-led urban farm in Indianapolis growing food, classes, and community on Indianapolis' east side.",
  openGraph: {
    title: "Our story — Rooted Legacy",
    description:
      "A Black-led urban farm in Indianapolis growing food, classes, and community.",
    images: ["/gallery/grand-opening-class.jpg"],
  },
};

const values = [
  {
    icon: Sprout,
    title: "Roots that hold",
    body: "Black agricultural knowledge built American farming. We grow that knowledge forward at 865 N German Church Rd.",
  },
  {
    icon: Heart,
    title: "Care that feeds",
    body: "Food sovereignty isn't charity — it's neighbors growing for neighbors. Free classes, accessible produce, dignity at every step.",
  },
  {
    icon: Users,
    title: "Community that grows",
    body: "Partners, vendors, volunteers, and friends. The farm is the meeting place, not the destination.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative">
        <div className="relative h-[50vh] sm:h-[60vh] min-h-[360px] max-h-[640px] overflow-hidden">
          <Image
            src="/gallery/grand-opening-class.jpg"
            alt="An outdoor class at Rooted Legacy"
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-b from-bg/50 via-bg/30 to-bg"
          />
        </div>
        <div className="mx-auto max-w-4xl px-4 sm:px-6 -mt-32 sm:-mt-40 relative">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-primary-deep mb-3">
            Our story
          </p>
          <h1 className="font-display text-4xl sm:text-6xl text-primary leading-[1.05]">
            We grow food.
            <br />
            <span className="text-cream">We grow each other.</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-ink-muted max-w-2xl">
            {site.description}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="prose-rooted text-ink leading-relaxed space-y-5 text-base sm:text-lg">
          <p>
            Rooted Legacy sits on the east side of Indianapolis, a city shaped
            by the same forces that shaped Black farming across America —
            redlining, displacement, the slow erosion of grocery access, and a
            quiet inheritance of agricultural skill in the families that
            stayed. The farm exists because that history is still live, and
            because the answer to food apartheid is growing your own.
          </p>
          <p>
            We host free gardening classes, a community market with
            Indianapolis-based partners and vendors, wellness events on the
            land, and (soon) a farm stand selling what we harvested that week.
            Every program ties back to the same idea: roots and legacy point
            at the same thing from different sides.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
        <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-primary-deep mb-6">
          What we believe
        </p>
        <div className="grid sm:grid-cols-3 gap-4 sm:gap-5">
          {values.map(({ icon: Icon, title, body }) => (
            <article
              key={title}
              className="rounded-2xl border border-line bg-bg-elev p-6 bg-grain"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-leaf/15 text-leaf mb-4">
                <Icon className="h-6 w-6" aria-hidden />
              </div>
              <h3 className="font-display text-xl text-cream">{title}</h3>
              <p className="mt-2 text-sm text-ink-muted">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="rounded-2xl border border-line bg-bg-elev p-6 sm:p-8 grid sm:grid-cols-2 gap-6 items-center bg-grain">
          <div>
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-primary-deep mb-3 inline-flex items-center gap-2">
              <BookOpen className="h-3.5 w-3.5" aria-hidden /> Read deeper
            </p>
            <h2 className="font-display text-2xl sm:text-3xl text-cream leading-tight">
              Black History in Farming
            </h2>
            <p className="mt-2 text-ink-muted">
              The longer story of why this farm exists — knowledge that crossed
              an ocean, land lost, teachers worth carrying forward, and why
              this work matters in Indianapolis right now.
            </p>
            <Link
              href="/history/black-history-in-farming"
              className="mt-5 inline-flex items-center px-5 py-3 rounded-2xl bg-primary text-bg font-medium hover:bg-cream transition-colors"
            >
              Read the article
            </Link>
          </div>
          <div>
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-primary-deep mb-3 inline-flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5" aria-hidden /> Visit us
            </p>
            <p className="font-display text-2xl text-cream">
              {site.address.full}
            </p>
            <p className="mt-2 text-sm text-ink-muted">
              Come on a class day or event. The best introduction to the farm
              is walking it.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/events"
                className="inline-flex items-center px-4 py-2 rounded-2xl border border-line text-ink hover:border-primary/40"
              >
                See events →
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center px-4 py-2 rounded-2xl border border-line text-ink hover:border-primary/40"
              >
                Get in touch
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
