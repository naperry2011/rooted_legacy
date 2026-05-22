import { z } from "zod";

export const bookingSchema = z.object({
  event_id: z.string().uuid(),
  attendee_name: z
    .string()
    .min(1, "Please share your name.")
    .max(120, "That name is too long."),
  attendee_email: z.string().email("Enter a valid email address."),
  party_size: z.coerce
    .number()
    .int()
    .min(1, "At least 1 attendee.")
    .max(20, "Max 20 attendees per RSVP."),
  notes: z.string().max(500).optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;
