import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { site } from "@/content/site";

export function Header() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-bg/70 border-b border-line">
      <div className="mx-auto max-w-6xl px-6 py-3 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-3 group">
          <Logo size={44} priority />
          <span className="font-display text-2xl text-primary group-hover:text-cream transition-colors">
            Rooted Legacy
          </span>
        </Link>
        <nav className="ml-auto flex items-center gap-1 text-sm">
          {site.nav.map((item) =>
            item.live ? (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 rounded-md text-ink-muted hover:text-primary hover:bg-bg-elev transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span
                key={item.href}
                aria-disabled
                title="Coming soon"
                className="px-3 py-2 rounded-md text-ink-muted/40 cursor-not-allowed select-none"
              >
                {item.label}
              </span>
            ),
          )}
        </nav>
      </div>
    </header>
  );
}
