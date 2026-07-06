"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { z } from "zod";
import { createServerClient } from "@/lib/supabase/server";
import { PW_RESET_COOKIE, getCurrentRole } from "@/lib/auth";

const schema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
  next: z.string().optional(),
});

export type LoginState = { error?: string } | undefined;

export async function signIn(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = schema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    next: formData.get("next") ?? undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const supabase = await createServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });
  if (error) {
    return { error: "Incorrect email or password." };
  }

  // Clear any stale must-reset marker from an abandoned reset attempt.
  const cookieStore = await cookies();
  cookieStore.delete(PW_RESET_COOKIE);

  // Honor an explicit local ?next=, else send admins to the dashboard and
  // everyone else to their account.
  const next = parsed.data.next;
  let dest: string;
  if (next && next.startsWith("/") && !next.startsWith("//")) {
    dest = next;
  } else {
    const role = await getCurrentRole();
    dest = role === "admin" ? "/admin" : "/account";
  }
  redirect(dest);
}
