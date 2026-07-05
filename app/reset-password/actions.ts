"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { createServerClient } from "@/lib/supabase/server";

const schema = z.object({
  email: z.string().email("Enter a valid email address."),
});

export type ResetState = { ok?: boolean; error?: string } | undefined;

export async function requestReset(
  _prev: ResetState,
  formData: FormData,
): Promise<ResetState> {
  const parsed = schema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const hdrs = await headers();
  const origin =
    hdrs.get("origin") ??
    `https://${hdrs.get("host") ?? "rooted-legacy-phi.vercel.app"}`;
  const redirectTo = `${origin}/auth/callback?next=/admin/password`;

  const supabase = await createServerClient();
  // Fire the recovery email. We intentionally ignore the result below so the
  // response never reveals whether an account exists for this address.
  await supabase.auth.resetPasswordForEmail(parsed.data.email, { redirectTo });

  return { ok: true };
}
