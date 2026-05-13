import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 pt-16 pb-24 grid md:grid-cols-2 gap-12 items-center bg-grain">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-primary-deep mb-4">
            Indianapolis Urban Farm
          </p>
          <h1 className="font-display text-5xl md:text-6xl leading-[1.05] text-primary">
            Roots run deep.
            <br />
            <span className="text-cream">So does the harvest.</span>
          </h1>
          <p className="mt-6 text-lg text-ink-muted max-w-prose">
            {site.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/history"
              className="inline-flex items-center px-5 py-3 rounded-2xl bg-primary text-bg font-medium hover:bg-cream transition-colors"
            >
              Read our story
            </Link>
            <span
              className="inline-flex items-center px-5 py-3 rounded-2xl border border-line text-ink-muted"
              title="Coming soon"
            >
              Classes coming soon
            </span>
          </div>
        </div>

        <div className="relative aspect-square w-full max-w-md mx-auto">
          <div className="absolute inset-0 rounded-full bg-primary/10 blur-3xl" />
          <Image
            src="/brand/rooted_legacy_logo.jpg"
            alt="Rooted Legacy logo"
            width={640}
            height={640}
            priority
            className="relative rounded-full ring-1 ring-primary/30 shadow-[0_30px_80px_-20px_rgba(217,164,65,0.45)]"
          />
        </div>
      </div>
    </section>
  );
}
