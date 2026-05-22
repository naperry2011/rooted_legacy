"use server";

import { contactSchema } from "@/lib/validations/contact";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail, wrapHtml } from "@/lib/resend";

export type ContactState =
  | undefined
  | { ok?: false; error?: string; fieldErrors?: Partial<Record<string, string>> }
  | { ok: true };

export async function sendContactMessage(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    body: formData.get("body"),
  });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const k = issue.path[0];
      if (typeof k === "string") fieldErrors[k] = issue.message;
    }
    return { ok: false, fieldErrors };
  }

  const admin = createAdminClient();
  const { error } = await admin.from("contact_messages").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    body: parsed.data.body,
  });
  if (error) {
    return { ok: false, error: "Couldn't send your message. Try again?" };
  }

  const to = process.env.CONTACT_TO_EMAIL;
  if (to) {
    await sendEmail({
      to,
      subject: `Contact: ${parsed.data.name}`,
      html: wrapHtml({
        heading: "New message",
        intro: `${parsed.data.name} (${parsed.data.email}) wrote in.`,
        body: `<p>${parsed.data.body.replace(/\n/g, "<br/>")}</p>`,
      }),
      replyTo: parsed.data.email,
    });
  }

  return { ok: true };
}
