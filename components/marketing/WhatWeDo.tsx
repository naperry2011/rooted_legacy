import { Sprout, GraduationCap, CalendarDays, ShoppingBasket } from "lucide-react";

const items = [
  {
    icon: GraduationCap,
    title: "Garden classes",
    body: "Free and low-cost classes on growing food, soil health, and seasonal planting.",
  },
  {
    icon: CalendarDays,
    title: "Events on the farm",
    body: "Earth Day, grand openings, wellness pop-ups, and community gatherings.",
  },
  {
    icon: ShoppingBasket,
    title: "Fresh produce",
    body: "Seasonal harvest shared with neighbors, local stores, and partner kitchens.",
  },
  {
    icon: Sprout,
    title: "A growing legacy",
    body: "Telling the story of this land, this neighborhood, and the people who tend it.",
  },
];

export function WhatWeDo() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
      <h2 className="font-display text-3xl sm:text-4xl text-primary mb-8 sm:mb-10">
        What we do
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {items.map(({ icon: Icon, title, body }) => (
          <div
            key={title}
            className="rounded-2xl border border-line bg-bg-elev p-6 hover:border-primary/40 transition-colors"
          >
            <Icon className="h-7 w-7 text-primary" aria-hidden />
            <h3 className="font-display text-xl mt-4 text-cream">{title}</h3>
            <p className="mt-2 text-sm text-ink-muted">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
