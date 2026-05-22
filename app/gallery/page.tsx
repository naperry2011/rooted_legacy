import Image from "next/image";
import type { Metadata } from "next";
import { listGalleryPhotos } from "@/lib/gallery";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos from the land at Rooted Legacy.",
};

export const revalidate = 300;

export default async function GalleryPage() {
  const photos = await listGalleryPhotos();

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
      <header className="mb-10 sm:mb-12">
        <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-primary-deep mb-3">
          From the farm
        </p>
        <h1 className="font-display text-4xl sm:text-5xl text-primary">
          Gallery
        </h1>
        <p className="mt-4 text-ink-muted max-w-2xl">
          The land, the people, the work. Photos from events at 865 N German
          Church Rd.
        </p>
      </header>

      {photos.length === 0 ? (
        <p className="text-ink-muted">No photos yet — check back soon.</p>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-5 [column-fill:_balance]">
          {photos.map((p) => (
            <figure
              key={p.id}
              className="mb-4 sm:mb-5 break-inside-avoid rounded-2xl overflow-hidden border border-line bg-bg-elev"
            >
              <Image
                src={p.src}
                alt={p.alt}
                width={1200}
                height={1500}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="w-full h-auto object-cover"
                unoptimized={p.src.startsWith("http")}
              />
              {p.caption && (
                <figcaption className="px-4 py-3 text-sm text-ink-muted">
                  {p.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}
