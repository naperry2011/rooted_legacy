import type { Metadata } from "next";
import { partitionEvents } from "@/content/events";
import { EventCard } from "@/components/events/EventCard";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Classes, wellness pop-ups, and community gatherings at the Rooted Legacy farm and with our partners.",
};

export default function EventsPage() {
  const { upcoming, past } = partitionEvents();

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
      <header className="mb-10 sm:mb-12">
        <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-primary-deep mb-3">
          On the farm
        </p>
        <h1 className="font-display text-4xl sm:text-5xl text-primary">Events</h1>
        <p className="mt-4 text-ink-muted max-w-2xl">
          Free and low-cost classes, wellness pop-ups, and community gatherings
          at the farm and with our partners.
        </p>
      </header>

      <section className="mb-16">
        <h2 className="font-display text-3xl text-cream mb-6">Upcoming</h2>
        {upcoming.length === 0 ? (
          <p className="text-ink-muted">
            Nothing on the calendar yet — check back soon.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((e) => (
              <EventCard key={e.slug} event={e} />
            ))}
          </div>
        )}
      </section>

      {past.length > 0 && (
        <section>
          <h2 className="font-display text-3xl text-cream mb-6">Past events</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {past.map((e) => (
              <EventCard key={e.slug} event={e} past />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
