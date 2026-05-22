import { z } from "zod";

export const newsletterSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  source: z.string().max(80).optional(),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
