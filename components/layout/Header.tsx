"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { Logo } from "@/components/brand/Logo";
import { site } from "@/content/site";
import { createBrowserClient } from "@/lib/supabase/browser";

/**
 * Browser-side auth check so the shared header can show Log in / Log out
 * without forcing every page to render dynamically. Returns null until known
 * (avoids a flash of the wrong control), then true/false.
 *
 * Relies on onAuthStateChange, which emits an INITIAL_SESSION event on
 * subscribe — so state settles from an async callback (no sync setState).
 */
function useAuthed(): boolean | null {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    let supabase: ReturnType<typeof createBrowserClient>;
    try {
      supabase = createBrowserClient();
    } catch {
      // Supabase not configured — treat as logged out.
      queueMicrotask(() => setAuthed(false));
      return;
    }
    const { data } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setAuthed(Boolean(session));
      },
    );
    return () => data.subscription.unsubscribe();
  }, []);

  return authed;
}

const linkClass =
  "px-3 py-2 rounded-md text-ink-muted hover:text-primary hover:bg-bg-elev transition-colors";

export function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const authed = useAuthed();

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
              <Link key={item.href} href={item.href} className={linkClass}>
                {item.label}
              </Link>
            ))}

          {/* Auth controls */}
          {authed !== null && (
            <span className="w-px h-5 bg-line mx-1" aria-hidden />
          )}
          {authed === true && (
            <>
              <Link href="/account" className={linkClass}>
                Account
              </Link>
              <form action="/auth/signout" method="post">
                <button type="submit" className={linkClass}>
                  Log out
                </button>
              </form>
            </>
          )}
          {authed === false && (
            <Link
              href="/login"
              className="px-3 py-2 rounded-md text-primary hover:text-cream hover:bg-bg-elev transition-colors"
            >
              Log in
            </Link>
          )}
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
          (open ? "max-h-[720px] opacity-100" : "max-h-0 opacity-0")
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

          {/* Auth controls */}
          {authed !== null && (
            <div className="mt-2 pt-2 border-t border-line flex flex-col">
              {authed ? (
                <>
                  <Link
                    href="/account"
                    onClick={close}
                    className="px-3 py-3 rounded-md text-ink hover:text-primary hover:bg-bg-elev transition-colors"
                  >
                    Account
                  </Link>
                  <form action="/auth/signout" method="post" onSubmit={close}>
                    <button
                      type="submit"
                      className="w-full text-left px-3 py-3 rounded-md text-ink hover:text-primary hover:bg-bg-elev transition-colors"
                    >
                      Log out
                    </button>
                  </form>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={close}
                  className="px-3 py-3 rounded-md text-primary hover:text-cream hover:bg-bg-elev transition-colors"
                >
                  Log in
                </Link>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
