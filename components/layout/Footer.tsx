import { MapPin } from "lucide-react";
import Link from "next/link";
import { site } from "@/content/site";
import { NewsletterSignup } from "@/components/marketing/NewsletterSignup";

export function Footer() {
  return (
    <footer className="border-t border-line mt-16 sm:mt-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-12 grid gap-8 md:grid-cols-3">
        <div className="min-w-0">
          <p className="font-display text-2xl text-primary">{site.name}</p>
          <p className="text-sm text-ink-muted mt-2 flex items-start gap-2 break-words">
            <MapPin className="h-4 w-4 mt-1 shrink-0" aria-hidden />
            <span>{site.address.full}</span>
          </p>
        </div>

        <nav className="flex flex-col gap-1 text-sm">
          <p className="text-xs uppercase tracking-[0.25em] text-primary-deep mb-2">
            Visit
          </p>
          <Link
            className="text-ink-muted hover:text-primary transition-colors"
            href="/events"
          >
            Events
          </Link>
          <Link
            className="text-ink-muted hover:text-primary transition-colors"
            href="/shop"
          >
            Farm stand
          </Link>
          <Link
            className="text-ink-muted hover:text-primary transition-colors"
            href="/recipes"
          >
            Recipes
          </Link>
          <Link
            className="text-ink-muted hover:text-primary transition-colors"
            href="/history"
          >
            History
          </Link>
          <Link
            className="text-ink-muted hover:text-primary transition-colors"
            href="/gallery"
          >
            Gallery
          </Link>
          <Link
            className="text-ink-muted hover:text-primary transition-colors"
            href="/vendors/apply"
          >
            Apply as vendor
          </Link>
          <Link
            className="text-ink-muted hover:text-primary transition-colors"
            href="/contact"
          >
            Contact
          </Link>
        </nav>

        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-primary-deep mb-2">
            Newsletter
          </p>
          <p className="text-sm text-ink-muted mb-3">
            One email a month — what&apos;s growing, what&apos;s coming up.
          </p>
          <NewsletterSignup source="footer" variant="compact" />
        </div>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-6xl px-4 sm:px-6 py-4 text-xs text-ink-muted/70">
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
