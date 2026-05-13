import { site } from "@/content/site";

export function PartnerStrip() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
      <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-primary-deep mb-5 sm:mb-6">
        In partnership with
      </p>
      <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
        {site.partners.map((p) => (
          <div
            key={p.name}
            className="rounded-2xl border border-line bg-bg-elev p-6 hover:border-primary/40 transition-colors"
          >
            <h3 className="font-display text-2xl text-cream">{p.name}</h3>
            <p className="mt-2 text-sm text-ink-muted">{p.blurb}</p>
            {p.url && (
              <a
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-sm text-primary hover:text-cream"
              >
                Visit site →
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
