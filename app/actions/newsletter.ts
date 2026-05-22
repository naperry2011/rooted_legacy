"use server";

import { headers } from "next/headers";
import { newsletterSchema } from "@/lib/validations/newsletter";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail, wrapHtml } from "@/lib/resend";

export type NewsletterState =
  | undefined
  | { ok?: false; error?: string }
  | { ok: true; email: string };

export async function subscribeToNewsletter(
  _prev: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  const parsed = newsletterSchema.safeParse({
    email: formData.get("email"),
    source: formData.get("source") || undefined,
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message };
  }

  const email = parsed.data.email.toLowerCase().trim();
  const admin = createAdminClient();

  // Upsert subscriber. If they already exist and are active, we re-send
  // confirmation only if they're still pending; otherwise we no-op.
  const { data: existing } = await admin
    .from("subscribers")
    .select("id, status, confirmation_token")
    .eq("email", email)
    .maybeSingle<{ id: string; status: string; confirmation_token: string }>();

  let token: string;
  if (existing) {
    if (existing.status === "active") {
      return { ok: true, email };
    }
    token = existing.confirmation_token;
  } else {
    const { data: inserted, error } = await admin
      .from("subscribers")
      .insert({ email, source: parsed.data.source ?? null })
      .select("confirmation_token")
      .single<{ confirmation_token: string }>();
    if (error || !inserted) {
      return {
        ok: false,
        error: "Couldn't save your subscription. Try again?",
      };
    }
    token = inserted.confirmation_token;
  }

  const hdrs = await headers();
  const origin =
    hdrs.get("origin") ??
    `https://${hdrs.get("host") ?? "rooted-legacy-phi.vercel.app"}`;
  const confirmUrl = `${origin}/api/newsletter/confirm?token=${token}`;

  await sendEmail({
    to: email,
    subject: "Confirm your subscription to Rooted Legacy",
    html: wrapHtml({
      heading: "Almost there",
      intro:
        "Confirm your email and we'll add you to the Rooted Legacy newsletter — news from the farm, classes, harvest updates.",
      ctaLabel: "Confirm subscription",
      ctaUrl: confirmUrl,
      footer:
        "If you didn't sign up for this, you can ignore this email. We won't add you without confirmation.",
    }),
  });

  return { ok: true, email };
}
