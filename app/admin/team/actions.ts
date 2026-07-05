"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

const schema = z.object({
  full_name: z.string().trim().min(1, "Enter their name.").max(120),
  email: z.string().email("Enter a valid email address."),
  password: z
    .string()
    .min(8, "Use at least 8 characters.")
    .max(72, "Keep it under 72 characters."),
});

export type TeamState =
  | undefined
  | { ok?: false; error?: string; fieldErrors?: Partial<Record<string, string>> }
  | { ok: true; email: string };

export async function createTeamMember(
  _prev: TeamState,
  formData: FormData,
): Promise<TeamState> {
  await requireAdmin();

  const parsed = schema.safeParse({
    full_name: formData.get("full_name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const k = issue.path[0];
      if (typeof k === "string" && !fieldErrors[k]) fieldErrors[k] = issue.message;
    }
    return { ok: false, fieldErrors };
  }

  const admin = createAdminClient();

  // Create the auth user (email pre-confirmed — no verification email).
  const { data, error } = await admin.auth.admin.createUser({
    email: parsed.data.email,
    password: parsed.data.password,
    email_confirm: true,
    user_metadata: { full_name: parsed.data.full_name },
  });
  if (error || !data.user) {
    const msg = /already|registered|exists/i.test(error?.message ?? "")
      ? "That email already has an account."
      : "Couldn't create the account. Try again?";
    return { ok: false, error: msg };
  }

  // Promote to admin (the signup trigger created a 'visitor' profile).
  const { error: roleError } = await admin
    .from("profiles")
    .update({
      role: "admin",
      full_name: parsed.data.full_name,
      email: parsed.data.email,
    })
    .eq("id", data.user.id);
  if (roleError) {
    return {
      ok: false,
      error:
        "Account created, but granting admin failed. Set their role in the Team list.",
    };
  }

  revalidatePath("/admin/team");
  return { ok: true, email: parsed.data.email };
}

export async function revokeMember(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const admin = createAdminClient();
  await admin.from("profiles").update({ role: "visitor" }).eq("id", id);

  revalidatePath("/admin/team");
}
