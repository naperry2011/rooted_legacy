import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EventForm } from "../EventForm";

export default function NewEventPage() {
  return (
    <div>
      <Link
        href="/admin/events"
        className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-primary mb-4"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        All events
      </Link>
      <h1 className="font-display text-3xl sm:text-4xl text-primary mb-6">
        New event
      </h1>
      <EventForm />
    </div>
  );
}
