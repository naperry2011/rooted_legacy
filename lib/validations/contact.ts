import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1, "Please share your name.").max(120),
  email: z.string().email("Enter a valid email address."),
  body: z.string().min(10, "Add a few more words.").max(2000),
});

export type ContactInput = z.infer<typeof contactSchema>;
