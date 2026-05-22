import Image from "next/image";
import Link from "next/link";
import { Sprout } from "lucide-react";
import { formatPrice, type ProduceItem } from "@/lib/sheets";

export function ShopCard({ item }: { item: ProduceItem }) {
  return (
    <Link
      href={`/shop/${encodeURIComponent(item.sku)}`}
      className="group block rounded-2xl border border-line bg-bg-elev overflow-hidden hover:border-primary/40 transition-colors"
    >
      <div className="relative aspect-square bg-bg">
        {item.photoUrl ? (
          <Image
            src={item.photoUrl}
            alt={item.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-bg-elev text-primary-deep">
            <Sprout className="h-12 w-12" aria-hidden />
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="font-display text-xl text-cream group-hover:text-primary transition-colors leading-tight">
          {item.name}
        </p>
        <p className="mt-1 text-xs text-ink-muted/70 capitalize">
          {item.category || "Produce"} · {item.unit}
        </p>
        <p className="mt-3 font-display text-lg text-primary">
          {formatPrice(item.priceRetailCents)}
        </p>
        {item.qtyAvailable > 0 && (
          <p className="mt-1 text-xs text-leaf">
            {Math.floor(item.qtyAvailable)} available
          </p>
        )}
      </div>
    </Link>
  );
}
