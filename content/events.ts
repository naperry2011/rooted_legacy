export type Event = {
  slug: string;
  title: string;
  date: string; // ISO YYYY-MM-DD
  start?: string; // HH:mm 24h
  end?: string;
  location: string;
  summary: string;
  highlights?: string[];
  partners?: string[];
  flyer?: string; // path under /public
  donateUrl?: string;
  externalUrl?: string;
};

export const events: Event[] = [
  {
    slug: "urban-farm-grand-opening",
    title: "Urban Farm Grand Opening",
    date: "2026-05-16",
    start: "10:00",
    end: "16:00",
    location: "865 N German Church Rd, Indianapolis, IN",
    summary:
      "A day on the land — wellness vendors, starter plants, gardening classes, yoga & fitness, live entertainment, and a keynote speaker. Come help us open the farm.",
    highlights: [
      "Wellness vendors",
      "A1C + BP checks",
      "Gardening classes",
      "Art & crafts",
      "Live entertainment",
      "Starter plants",
      "Yoga + fitness class",
      "Keynote speaker",
    ],
    partners: ["Bodi Buzz"],
    flyer: "/brand/flyer_grand_opening.jpg",
    donateUrl: "",
  },
  {
    slug: "earth-day-everyday",
    title: "Earth Day Everyday — Free Gardening Class",
    date: "2026-04-25",
    start: "11:00",
    end: "14:00",
    location: "865 N German Church Rd, Indianapolis, IN",
    summary:
      "A free, hands-on gardening class at the farm. Bring questions, leave with seedlings.",
    partners: ["Bodi Buzz"],
    flyer: "/brand/flyer_earth_day.jpg",
  },
  {
    slug: "values-and-ethics",
    title: "Values and Ethics — 7 Pillars of a Healthy Culture (Pillar 1)",
    date: "2026-05-09",
    start: "17:30",
    end: "19:30",
    location: "Polk Stables",
    summary:
      "Trust is built through agreement. Pillar 1 of the 7 Pillars of a Healthy Culture series — defines the standards that guide behavior and decision making.",
    partners: ["Cre8tive Alignment Network"],
    flyer: "/brand/partner_cre8tive.jpg",
    externalUrl: "https://cre8tivealignmentnetwork.org",
  },
];

export function partitionEvents(
  today = new Date(),
): { upcoming: Event[]; past: Event[] } {
  const todayKey = today.toISOString().slice(0, 10);
  const upcoming: Event[] = [];
  const past: Event[] = [];
  for (const e of events) {
    (e.date >= todayKey ? upcoming : past).push(e);
  }
  upcoming.sort((a, b) => a.date.localeCompare(b.date));
  past.sort((a, b) => b.date.localeCompare(a.date));
  return { upcoming, past };
}

export function getEvent(slug: string): Event | undefined {
  return events.find((e) => e.slug === slug);
}

export function formatEventDate(iso: string): string {
  // Parse as local date to avoid UTC shifting the day
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatTimeRange(start?: string, end?: string): string {
  if (!start) return "";
  const fmt = (hm: string) => {
    const [h, m] = hm.split(":").map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: m === 0 ? undefined : "2-digit",
    });
  };
  return end ? `${fmt(start)} – ${fmt(end)}` : fmt(start);
}
