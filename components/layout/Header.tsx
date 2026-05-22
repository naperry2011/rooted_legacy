"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { site } from "@/content/site";

export function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  // Lock body scroll when menu open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-bg/80 border-b border-line">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3 flex items-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-3 group min-w-0"
          aria-label="Rooted Legacy home"
        >
          <Logo size={40} priority className="shrink-0" />
          <span className="font-display text-xl sm:text-2xl text-primary group-hover:text-cream transition-colors truncate">
            Rooted Legacy
          </span>
        </Link>

        {/* Desktop nav (primary items only; the rest live in the footer + mobile menu) */}
        <nav className="ml-auto hidden md:flex items-center gap-1 text-sm">
          {site.nav
            .filter((i) => i.primary && i.live)
            .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 rounded-md text-ink-muted hover:text-primary hover:bg-bg-elev transition-colors"
              >
                {item.label}
              </Link>
            ))}
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
          className="ml-auto md:hidden inline-flex items-center justify-center h-10 w-10 rounded-md text-ink hover:bg-bg-elev hover:text-primary transition-colors"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile nav panel */}
      <div
        id="mobile-nav"
        className={
          "md:hidden border-t border-line overflow-hidden transition-[max-height,opacity] duration-300 ease-out " +
          (open ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0")
        }
      >
        <nav className="px-4 py-3 flex flex-col">
          {site.nav.map((item) =>
            item.live ? (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                className="px-3 py-3 rounded-md text-ink hover:text-primary hover:bg-bg-elev transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span
                key={item.href}
                aria-disabled
                className="px-3 py-3 rounded-md text-ink-muted/40 flex items-center justify-between"
              >
                <span>{item.label}</span>
                <span className="text-[10px] uppercase tracking-widest">
                  Soon
                </span>
              </span>
            ),
          )}
        </nav>
      </div>
    </header>
  );
}
