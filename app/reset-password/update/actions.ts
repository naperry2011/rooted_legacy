"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { z } from "zod";
import { createServerClient } from "@/lib/supabase/server";
import { PW_RESET_COOKIE } from "@/lib/auth";

const schema = z
  .object({
    password: z
      .string()
      .min(8, "Use at least 8 characters.")
      .max(72, "Keep it under 72 characters."),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, {
    message: "Passwords don't match.",
    path: ["confirm"],
  });

export type ResetUpdateState =
  | undefined
  | { error?: string; fieldErrors?: Partial<Record<string, string>> };

export async function resetPassword(
  _prev: ResetUpdateState,
  formData: FormData,
): Promise<ResetUpdateState> {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Your reset link expired. Request a new one from Sign in." };
  }

  const parsed = schema.safeParse({
    password: formData.get("password"),
    confirm: formData.get("confirm"),
  });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const k = issue.path[0];
      if (typeof k === "string" && !fieldErrors[k]) fieldErrors[k] = issue.message;
    }
    return { fieldErrors };
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });
  if (error) {
    return { error: "Couldn't update your password. Try again?" };
  }

  // Clear the must-reset marker and sign out every session on every device,
  // then send them to log in fresh with the new password.
  const cookieStore = await cookies();
  cookieStore.delete(PW_RESET_COOKIE);
  await supabase.auth.signOut({ scope: "global" });

  redirect("/login?reset=done");
}
