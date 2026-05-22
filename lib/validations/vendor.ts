import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .max(200)
  .refine(
    (v) => !v || /^https?:\/\//i.test(v) || /^[\w.-]+\.[a-z]{2,}/i.test(v),
    "Use a full URL like https://example.com",
  )
  .optional()
  .or(z.literal(""));

export const vendorApplicationSchema = z.object({
  business_name: z.string().min(1, "Business name is required.").max(160),
  contact_name: z.string().max(160).optional().or(z.literal("")),
  contact_email: z.string().email("Enter a valid email address."),
  phone: z.string().max(40).optional().or(z.literal("")),
  category: z.string().max(80).optional().or(z.literal("")),
  website: optionalUrl,
  instagram: z.string().max(80).optional().or(z.literal("")),
  blurb: z
    .string()
    .min(20, "Tell us a little about your business (20+ characters).")
    .max(1000),
  booth_needs: z.string().max(500).optional().or(z.literal("")),
});

export type VendorApplicationInput = z.infer<typeof vendorApplicationSchema>;
