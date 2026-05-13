import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CalendarDays, Clock, MapPin, Users } from "lucide-react";
import {
  events,
  getEvent,
  formatEventDate,
  formatTimeRange,
} from "@/content/events";

type Params = { slug: string };

export function generateStaticParams() {
  return events.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) return { title: "Not found" };
  return {
    title: event.title,
    description: event.summary,
    openGraph: {
      title: event.title,
      description: event.summary,
      images: event.flyer ? [event.flyer] : undefined,
    },
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) notFound();

  const mapsHref = `https://www.google.com/maps?q=${encodeURIComponent(event.location)}`;

  return (
    <article className="mx-auto max-w-4xl px-6 py-16">
      <Link
        href="/events"
        className="text-sm text-ink-muted hover:text-primary"
      >
        ← All events
      </Link>

      <header className="mt-6">
        <h1 className="font-display text-5xl text-primary">{event.title}</h1>
        <div className="mt-5 grid sm:grid-cols-3 gap-3 text-sm text-ink-muted">
          <p className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary" aria-hidden />
            {formatEventDate(event.date)}
          </p>
          {event.start && (
            <p className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" aria-hidden />
              {formatTimeRange(event.start, event.end)}
            </p>
          )}
          <a
            href={mapsHref}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 hover:text-primary"
          >
            <MapPin className="h-4 w-4 text-primary" aria-hidden />
            {event.location}
          </a>
        </div>
      </header>

      {event.flyer && (
        <div className="relative my-10 rounded-2xl overflow-hidden border border-line bg-bg-elev">
          <Image
            src={event.flyer}
            alt={`${event.title} flyer`}
            width={1200}
            height={1500}
            className="w-full h-auto object-contain"
            priority
          />
        </div>
      )}

      <p className="text-lg text-ink leading-relaxed">{event.summary}</p>

      {event.highlights && event.highlights.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-2xl text-cream mb-4">What to expect</h2>
          <ul className="grid sm:grid-cols-2 gap-2 text-ink">
            {event.highlights.map((h) => (
              <li
                key={h}
                className="rounded-xl border border-line bg-bg-elev px-4 py-2"
              >
                {h}
              </li>
            ))}
          </ul>
        </section>
      )}

      {event.partners && event.partners.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-2xl text-cream mb-3 flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" aria-hidden />
            In partnership with
          </h2>
          <p className="text-ink-muted">{event.partners.join(", ")}</p>
        </section>
      )}

      <div className="mt-12 flex flex-wrap gap-3">
        <a
          href={mapsHref}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center px-5 py-3 rounded-2xl bg-primary text-bg font-medium hover:bg-cream transition-colors"
        >
          Get directions
        </a>
        {event.externalUrl && (
          <a
            href={event.externalUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center px-5 py-3 rounded-2xl border border-line text-ink hover:border-primary/40"
          >
            Partner site →
          </a>
        )}
        {event.donateUrl && (
          <a
            href={event.donateUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center px-5 py-3 rounded-2xl border border-line text-ink hover:border-primary/40"
          >
            Donate
          </a>
        )}
      </div>
    </article>
  );
}
