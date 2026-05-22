import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  CalendarDays,
  Check,
  Clock,
  Flower2,
  Heart,
  MapPin,
  Sparkles,
  Ticket,
  Users,
} from "lucide-react";
import { formatEventDate, formatTimeRange } from "@/content/events";
import {
  formatPriceCents,
  getEventBySlug,
  listPublishedEventSlugsForBuild,
} from "@/lib/events";
import { getCurrentUser } from "@/lib/auth";
import { BookingForm } from "@/components/events/BookingForm";
import { site } from "@/content/site";

type Params = { slug: string };

export const revalidate = 300;

export async function generateStaticParams() {
  return listPublishedEventSlugsForBuild();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return { title: "Not found" };
  return {
    title: event.title,
    description: event.tagline ?? event.summary,
    openGraph: {
      title: event.title,
      description: event.tagline ?? event.summary,
      images: event.flyer_path ? [event.flyer_path] : undefined,
    },
  };
}

// One icon per theme, in order. Falls back to Sparkles for any extras.
const themeIcons = [Flower2, Heart, Users];

export default async function EventDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  const user = await getCurrentUser().catch(() => null);
  const mapsHref = `https://www.google.com/maps?q=${encodeURIComponent(event.location)}`;
  const time = event.start_time
    ? formatTimeRange(
        event.start_time.slice(0, 5),
        event.end_time?.slice(0, 5),
      )
    : "";

  const todayKey = new Date().toISOString().slice(0, 10);
  const isUpcoming = event.date >= todayKey;
  const canRsvp = event.kind === "free_rsvp" && isUpcoming;
  const isTicketed = event.kind === "ticketed" && isUpcoming;

  return (
    <article
      className={
        "mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-16 " +
        (event.is_featured ? "relative" : "")
      }
    >
      {/* Featured: warm radial glow behind everything */}
      {event.is_featured && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-10 h-[420px] -z-10 opacity-60"
          style={{
            background:
              "radial-gradient(ellipse at center top, rgba(217,164,65,0.18), transparent 65%)",
          }}
        />
      )}

      <Link
        href="/events"
        className="text-sm text-ink-muted hover:text-primary"
      >
        ← All events
      </Link>

      <header className="mt-6">
        {event.is_featured && (
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-primary-deep mb-3 inline-flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5" aria-hidden /> Featured event
          </p>
        )}
        <h1
          className={
            "font-display text-3xl sm:text-5xl text-primary leading-[1.05] " +
            (event.is_featured ? "sm:text-6xl" : "")
          }
        >
          {event.title}
        </h1>
        {event.tagline && (
          <p className="mt-3 font-display text-xl sm:text-2xl italic text-leaf">
            {event.tagline}
          </p>
        )}

        <div className="mt-5 grid sm:grid-cols-3 gap-2 sm:gap-3 text-sm text-ink-muted">
          <p className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary" aria-hidden />
            {formatEventDate(event.date)}
          </p>
          {time && (
            <p className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" aria-hidden />
              {time}
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

      {event.flyer_path && (
        <div
          className={
            "relative my-8 sm:my-10 rounded-2xl overflow-hidden border border-line bg-bg-elev mx-auto " +
            (event.is_featured
              ? "max-w-md sm:max-w-2xl shadow-[0_30px_80px_-20px_rgba(217,164,65,0.35)] ring-1 ring-primary/30"
              : "max-w-md sm:max-w-full")
          }
        >
          <Image
            src={event.flyer_path}
            alt={`${event.title} flyer`}
            width={1200}
            height={1500}
            sizes="(min-width: 1024px) 768px, 100vw"
            className="w-full h-auto object-contain"
            priority
          />
        </div>
      )}

      <p className="text-base sm:text-lg text-ink leading-relaxed">
        {event.summary}
      </p>

      {/* Themes pillar row — the "flair" centerpiece */}
      {event.themes.length > 0 && (
        <section className="mt-12">
          <div className="grid sm:grid-cols-3 gap-4 sm:gap-5">
            {event.themes.map((t, i) => {
              const Icon = themeIcons[i] ?? Sparkles;
              return (
                <div
                  key={t}
                  className="rounded-2xl border border-line bg-bg-elev p-5 sm:p-6 bg-grain text-center"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-leaf/15 text-leaf mb-3">
                    <Icon className="h-6 w-6" aria-hidden />
                  </div>
                  <p className="font-display text-lg sm:text-xl text-cream leading-tight">
                    {t}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Price + included perks card */}
      {(event.price_cents != null || event.included_perks.length > 0) && (
        <section className="mt-10 rounded-2xl border border-primary/40 bg-gradient-to-br from-bg-elev to-bg p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            {event.price_cents != null && (
              <div>
                <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-primary-deep mb-2 inline-flex items-center gap-2">
                  <Ticket className="h-3.5 w-3.5" aria-hidden /> Ticket
                </p>
                <p className="font-display text-5xl sm:text-6xl text-primary leading-none">
                  {formatPriceCents(event.price_cents)}
                </p>
              </div>
            )}
            {event.included_perks.length > 0 && (
              <div className="flex-1 sm:max-w-sm">
                <p className="text-xs uppercase tracking-[0.25em] text-primary-deep mb-3">
                  Included with your ticket
                </p>
                <ul className="space-y-2">
                  {event.included_perks.map((perk) => (
                    <li
                      key={perk}
                      className="flex items-start gap-2 text-ink"
                    >
                      <Check
                        className="h-4 w-4 mt-1 text-leaf shrink-0"
                        aria-hidden
                      />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {event.highlights.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-2xl text-cream mb-4">
            On the schedule
          </h2>
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

      {event.partners.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-2xl text-cream mb-3 flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" aria-hidden />
            In partnership with
          </h2>
          <p className="text-ink-muted flex flex-wrap gap-x-1">
            {event.partners.map((name, i) => {
              const partner = site.partners.find((p) => p.name === name);
              const trailing = i < event.partners.length - 1 ? "," : "";
              return partner?.url ? (
                <a
                  key={name}
                  href={partner.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary hover:text-cream underline-offset-4 hover:underline"
                >
                  {name}
                  {trailing}
                </a>
              ) : (
                <span key={name}>
                  {name}
                  {trailing}
                </span>
              );
            })}
          </p>
        </section>
      )}

      {canRsvp && (
        <section className="mt-12 rounded-2xl border border-line bg-bg-elev p-6 sm:p-8">
          <h2 className="font-display text-2xl text-cream mb-4">RSVP</h2>
          <BookingForm eventId={event.id} defaultEmail={user?.email} />
        </section>
      )}

      {isTicketed && (
        <section className="mt-12 rounded-2xl border border-primary/30 bg-bg-elev p-6 sm:p-8 text-center">
          <p className="font-display text-2xl text-cream mb-2">
            Tickets opening soon
          </p>
          <p className="text-sm text-ink-muted">
            We&apos;re lining up payments. In the meantime,{" "}
            <Link
              href="/contact"
              className="text-primary hover:text-cream underline-offset-4 hover:underline"
            >
              get in touch
            </Link>{" "}
            to hold a spot.
          </p>
        </section>
      )}

      <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row sm:flex-wrap gap-3">
        <a
          href={mapsHref}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center px-5 py-3 rounded-2xl bg-primary text-bg font-medium hover:bg-cream transition-colors"
        >
          Get directions
        </a>
        {event.external_url && (
          <a
            href={event.external_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center px-5 py-3 rounded-2xl border border-line text-ink hover:border-primary/40"
          >
            Partner site →
          </a>
        )}
      </div>
    </article>
  );
}
