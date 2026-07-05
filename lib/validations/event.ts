import { z } from "zod";

/** Turn a title (or hand-typed slug) into a URL-safe slug. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Split a comma/newline-separated textarea into a clean string[]. */
export function splitLines(input: string | null | undefined): string[] {
  if (!input) return [];
  return input
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

const optionalText = z.string().trim().optional().or(z.literal(""));

// Empty string -> undefined, so optional times/urls aren't stored as "".
const blankToUndefined = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? undefined : v;

export const eventSchema = z
  .object({
    id: z.string().uuid().optional().or(z.literal("")),
    title: z.string().trim().min(1, "Give the event a title.").max(160),
    slug: optionalText, // auto-derived from title when blank
    summary: z
      .string()
      .trim()
      .min(1, "Add a short summary.")
      .max(500, "Keep the summary under 500 characters."),
    body_md: optionalText,
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a date."),
    start_time: z.preprocess(
      blankToUndefined,
      z
        .string()
        .regex(/^\d{2}:\d{2}$/, "Use a time like 14:30.")
        .optional(),
    ),
    end_time: z.preprocess(
      blankToUndefined,
      z
        .string()
        .regex(/^\d{2}:\d{2}$/, "Use a time like 16:00.")
        .optional(),
    ),
    location: z.string().trim().min(1, "Where is it?").max(200),
    tagline: optionalText,
    status: z.enum(["draft", "published", "cancelled"]),
    kind: z.enum(["free_rsvp", "ticketed", "external"]),
    external_url: z.preprocess(
      blankToUndefined,
      z.string().url("Use a full URL like https://example.com").optional(),
    ),
    capacity: z.preprocess(
      blankToUndefined,
      z.coerce
        .number()
        .int()
        .min(1, "Capacity must be at least 1.")
        .max(100000)
        .optional(),
    ),
    is_featured: z.coerce.boolean().optional().default(false),
    // Raw textarea text; transformed to string[] by the action via splitLines.
    highlights: optionalText,
    partners: optionalText,
    themes: optionalText,
    included_perks: optionalText,
  })
  .refine(
    (v) => v.kind !== "external" || Boolean(v.external_url),
    {
      message: "External events need a link.",
      path: ["external_url"],
    },
  );

export type EventInput = z.infer<typeof eventSchema>;
