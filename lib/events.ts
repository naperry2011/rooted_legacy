import "server-only";

import { createPublicClient } from "@/lib/supabase/public";

export type EventRow = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body_md: string | null;
  date: string; // ISO YYYY-MM-DD
  start_time: string | null;
  end_time: string | null;
  location: string;
  flyer_path: string | null;
  capacity: number | null;
  status: "draft" | "published" | "cancelled";
  kind: "free_rsvp" | "ticketed" | "external";
  external_url: string | null;
  highlights: string[];
  partners: string[];
  tagline: string | null;
  price_cents: number | null;
  themes: string[];
  included_perks: string[];
  is_featured: boolean;
};

const COLUMNS =
  "id, slug, title, summary, body_md, date, start_time, end_time, location, flyer_path, capacity, status, kind, external_url, highlights, partners, tagline, price_cents, themes, included_perks, is_featured";

function hasSupabase(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export async function listPublishedEvents(): Promise<EventRow[]> {
  if (!hasSupabase()) return [];
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("events")
    .select(COLUMNS)
    .eq("status", "published")
    .order("date", { ascending: true })
    .returns<EventRow[]>();
  if (error || !data) return [];
  return data;
}

export async function getEventBySlug(slug: string): Promise<EventRow | null> {
  if (!hasSupabase()) return null;
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("events")
    .select(COLUMNS)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle<EventRow>();
  return data ?? null;
}

export async function listPublishedEventSlugsForBuild(): Promise<
  { slug: string }[]
> {
  if (!hasSupabase()) return [];
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("events")
    .select("slug")
    .eq("status", "published");
  return (data ?? []) as { slug: string }[];
}

export function partitionEvents(
  events: EventRow[],
  today = new Date(),
): { upcoming: EventRow[]; past: EventRow[] } {
  const todayKey = today.toISOString().slice(0, 10);
  const upcoming: EventRow[] = [];
  const past: EventRow[] = [];
  for (const e of events) {
    (e.date >= todayKey ? upcoming : past).push(e);
  }
  upcoming.sort((a, b) => a.date.localeCompare(b.date));
  past.sort((a, b) => b.date.localeCompare(a.date));
  return { upcoming, past };
}

export function formatPriceCents(cents: number | null | undefined): string {
  if (cents == null) return "";
  if (cents === 0) return "Free";
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}
