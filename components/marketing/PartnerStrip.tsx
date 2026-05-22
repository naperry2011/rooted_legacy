import { AtSign, Mail } from "lucide-react";
import { site } from "@/content/site";

export function PartnerStrip() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
      <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-primary-deep mb-5 sm:mb-6">
        In partnership with
      </p>
      <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
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
  );
}
