import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Sprout } from "lucide-react";
import { formatPrice, listProduce } from "@/lib/sheets";
import { listRecipesByIngredient } from "@/lib/recipes";

type Params = { sku: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { sku } = await params;
  const all = await listProduce();
  const item = all.find((p) => p.sku === decodeURIComponent(sku));
  if (!item) return { title: "Not found" };
  return {
    title: `${item.name} — Farm stand`,
    description: `Fresh ${item.name} from Rooted Legacy.`,
  };
}

export default async function ShopItemPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { sku } = await params;
  const all = await listProduce();
  const item = all.find((p) => p.sku === decodeURIComponent(sku));
  if (!item) notFound();

  const recipes = await listRecipesByIngredient(item.name);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16">
      <Link
        href="/shop"
        className="text-sm text-ink-muted hover:text-primary"
      >
        ← Farm stand
      </Link>

      <div className="mt-6 grid sm:grid-cols-2 gap-8 sm:gap-10 items-start">
        <div className="relative aspect-square rounded-2xl overflow-hidden border border-line bg-bg-elev">
          {item.photoUrl ? (
            <Image
              src={item.photoUrl}
              alt={item.name}
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover"
              unoptimized
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-primary-deep">
              <Sprout className="h-16 w-16" aria-hidden />
            </div>
          )}
        </div>

        <div>
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-primary-deep mb-3">
            {item.category || "Produce"}
          </p>
          <h1 className="font-display text-3xl sm:text-5xl text-primary">
            {item.name}
          </h1>
          <p className="mt-4 font-display text-3xl text-cream">
            {formatPrice(item.priceRetailCents)}
            <span className="text-base text-ink-muted ml-2">
              · per {item.unit}
            </span>
          </p>
          {item.notes && (
            <p className="mt-4 text-ink-muted">{item.notes}</p>
          )}
          <p className="mt-6 text-xs text-ink-muted/70">
            {item.qtyAvailable > 0
              ? `${Math.floor(item.qtyAvailable)} ${item.unit}(s) available this week.`
              : "Currently sold out for the week."}
          </p>

          <div className="mt-8 rounded-2xl border border-primary/30 bg-primary/5 p-5 text-sm text-cream">
            🌱 Online ordering coming soon. Visit us on event days or{" "}
            <Link href="/contact" className="text-primary hover:underline">
              reach out
            </Link>
            .
          </div>
        </div>
      </div>

      {recipes.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl sm:text-3xl text-cream mb-6">
            Cook with this
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {recipes.map((r) => (
              <Link
                key={r.slug}
                href={`/recipes/${r.slug}`}
                className="rounded-2xl border border-line bg-bg-elev p-5 hover:border-primary/40 transition-colors"
              >
                <p className="font-display text-xl text-cream">{r.title}</p>
                {r.excerpt && (
                  <p className="mt-2 text-sm text-ink-muted">{r.excerpt}</p>
                )}
                <p className="mt-3 text-xs text-ink-muted/70 capitalize">
                  {r.season} · {r.prep_time}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
