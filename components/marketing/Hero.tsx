import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-10 sm:pt-16 pb-16 sm:pb-24 grid md:grid-cols-2 gap-10 md:gap-12 items-center bg-grain">
        <div className="order-2 md:order-1">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-primary-deep mb-3 sm:mb-4">
            Indianapolis Urban Farm
          </p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl leading-[1.05] text-primary">
            Roots run deep.
            <br />
            <span className="text-cream">So does the harvest.</span>
          </h1>
          <p className="mt-5 sm:mt-6 text-base sm:text-lg text-ink-muted max-w-prose">
            {site.description}
          </p>
          <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row sm:flex-wrap gap-3">
            <Link
              href="/history"
              className="inline-flex items-center justify-center px-5 py-3 rounded-2xl bg-primary text-bg font-medium hover:bg-cream transition-colors"
            >
              Read our story
            </Link>
            <span
              className="inline-flex items-center justify-center px-5 py-3 rounded-2xl border border-line text-ink-muted text-center"
              title="Coming soon"
            >
              Classes coming soon
            </span>
          </div>
        </div>

        <div className="order-1 md:order-2 relative aspect-square w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto">
          <div className="absolute inset-0 rounded-full bg-primary/10 blur-3xl" />
          <Image
            src="/brand/rooted_legacy_logo.jpg"
            alt="Rooted Legacy logo"
            width={640}
            height={640}
            priority
            sizes="(min-width: 1024px) 420px, (min-width: 640px) 384px, 280px"
            className="relative rounded-full ring-1 ring-primary/30 shadow-[0_30px_80px_-20px_rgba(217,164,65,0.45)]"
          />
        </div>
      </div>
    </section>
  );
}
