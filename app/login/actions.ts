"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createServerClient } from "@/lib/supabase/server";

const schema = z.object({
  email: z.string().email("Enter a valid email address."),
  next: z.string().optional(),
});

export type LoginState = { error?: string } | undefined;

export async function sendMagicLink(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = schema.safeParse({
    email: formData.get("email"),
    next: formData.get("next") ?? undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const supabase = await createServerClient();
  const hdrs = await headers();
  const origin =
    hdrs.get("origin") ??
    `https://${hdrs.get("host") ?? "rooted-legacy-phi.vercel.app"}`;

  const callback = new URL("/auth/callback", origin);
  if (parsed.data.next) callback.searchParams.set("next", parsed.data.next);

  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: {
      emailRedirectTo: callback.toString(),
      shouldCreateUser: true,
    },
  });
  if (error) {
    return { error: error.message };
  }

  redirect(
    `/login?sent=1${parsed.data.next ? `&next=${encodeURIComponent(parsed.data.next)}` : ""}`,
  );
}
