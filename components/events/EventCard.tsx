import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import {
  formatEventDate,
  formatTimeRange,
  type Event,
} from "@/content/events";

export function EventCard({
  event,
  past = false,
}: {
  event: Event;
  past?: boolean;
}) {
  return (
    <article
      className={
        "group rounded-2xl border border-line bg-bg-elev overflow-hidden hover:border-primary/40 transition-colors " +
        (past ? "opacity-90" : "")
      }
    >
      <Link href={`/events/${event.slug}`} className="block">
        {event.flyer && (
          <div className="relative aspect-[4/5] sm:aspect-[16/10] bg-bg">
            <Image
              src={event.flyer}
              alt={`${event.title} flyer`}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        )}
        <div className="p-6">
          {past && (
            <p className="text-xs uppercase tracking-[0.25em] text-ink-muted/70 mb-2">
              Past event
            </p>
          )}
          <h3 className="font-display text-2xl text-cream group-hover:text-primary transition-colors">
            {event.title}
          </h3>
          <div className="mt-3 space-y-1 text-sm text-ink-muted">
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
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" aria-hidden />
              {event.location}
            </p>
          </div>
          <p className="mt-4 text-sm text-ink line-clamp-3">{event.summary}</p>
        </div>
      </Link>
    </article>
  );
}
