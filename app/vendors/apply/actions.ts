"use server";

import { vendorApplicationSchema } from "@/lib/validations/vendor";
import { createAdminClient } from "@/lib/supabase/admin";
import { createServerClient } from "@/lib/supabase/server";
import { sendEmail, wrapHtml } from "@/lib/resend";

export type VendorState =
  | undefined
  | { ok?: false; error?: string; fieldErrors?: Partial<Record<string, string>> }
  | { ok: true };

export async function submitVendorApplication(
  _prev: VendorState,
  formData: FormData,
): Promise<VendorState> {
  const parsed = vendorApplicationSchema.safeParse({
    business_name: formData.get("business_name"),
    contact_name: formData.get("contact_name") ?? "",
    contact_email: formData.get("contact_email"),
    phone: formData.get("phone") ?? "",
    category: formData.get("category") ?? "",
    website: formData.get("website") ?? "",
    instagram: formData.get("instagram") ?? "",
    blurb: formData.get("blurb"),
    booth_needs: formData.get("booth_needs") ?? "",
  });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const k = issue.path[0];
      if (typeof k === "string") fieldErrors[k] = issue.message;
    }
    return { ok: false, fieldErrors };
  }

  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const admin = createAdminClient();
  const { error } = await admin.from("vendor_applications").insert({
    user_id: user?.id ?? null,
    business_name: parsed.data.business_name,
    contact_name: parsed.data.contact_name || null,
    contact_email: parsed.data.contact_email,
    phone: parsed.data.phone || null,
    category: parsed.data.category || null,
    website: parsed.data.website || null,
    instagram: parsed.data.instagram || null,
    blurb: parsed.data.blurb,
    booth_needs: parsed.data.booth_needs || null,
  });
  if (error) {
    return { ok: false, error: "Couldn't save your application. Try again?" };
  }

  // Notify admin email if configured.
  const adminEmail = process.env.CONTACT_TO_EMAIL;
  if (adminEmail) {
    await sendEmail({
      to: adminEmail,
      subject: `New vendor application: ${parsed.data.business_name}`,
      html: wrapHtml({
        heading: "New vendor application",
        intro: `${parsed.data.business_name} just applied to be a vendor.`,
        body: `
          <p><strong>Contact:</strong> ${parsed.data.contact_name ?? "—"} (${parsed.data.contact_email})</p>
          <p><strong>Category:</strong> ${parsed.data.category || "—"}</p>
          <p><strong>About:</strong></p>
          <p>${parsed.data.blurb.replace(/\n/g, "<br/>")}</p>
        `,
      }),
      replyTo: parsed.data.contact_email,
    });
  }

  // Acknowledgement to applicant.
  await sendEmail({
    to: parsed.data.contact_email,
    subject: "We got your vendor application",
    html: wrapHtml({
      heading: "Thanks for applying",
      intro: `We received your application for ${parsed.data.business_name}. We'll be in touch within a week about upcoming events.`,
    }),
  });

  return { ok: true };
}
