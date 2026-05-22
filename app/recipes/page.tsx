import Link from "next/link";
import type { Metadata } from "next";
import { ChefHat } from "lucide-react";
import { listRecipes } from "@/lib/recipes";

export const metadata: Metadata = {
  title: "Recipes",
  description:
    "What to cook with the produce from Rooted Legacy. Recipes rooted in Black culinary heritage and what's growing in the field.",
};

export default async function RecipesPage() {
  const recipes = await listRecipes();

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16">
      <header className="mb-10 sm:mb-12">
        <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-primary-deep mb-3">
          From the kitchen
        </p>
        <h1 className="font-display text-4xl sm:text-5xl text-primary">
          Recipes
        </h1>
        <p className="mt-4 text-ink-muted max-w-2xl">
          What to cook with the produce from our fields. Rooted in Black
          culinary heritage; written for any cook.
        </p>
      </header>

      {recipes.length === 0 ? (
        <p className="text-ink-muted">Recipes are coming. Check back soon.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {recipes.map((r) => (
            <Link
              key={r.slug}
              href={`/recipes/${r.slug}`}
              className="rounded-2xl border border-line bg-bg-elev p-6 hover:border-primary/40 transition-colors group"
            >
              <ChefHat className="h-6 w-6 text-primary" aria-hidden />
              <p className="font-display text-2xl text-cream mt-4 group-hover:text-primary transition-colors">
                {r.title}
              </p>
              {r.excerpt && (
                <p className="mt-2 text-sm text-ink-muted">{r.excerpt}</p>
              )}
              <p className="mt-4 text-xs text-ink-muted/70 capitalize">
                {r.season} · {r.prep_time}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
