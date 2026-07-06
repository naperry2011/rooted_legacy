import "server-only";

import { createServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type Role = "visitor" | "staff" | "admin";

/**
 * Cookie set after a password-recovery link is verified. While present, the
 * admin area redirects to /reset-password/update, forcing the user to set a new
 * password before doing anything else. Cleared on save or normal login.
 */
export const PW_RESET_COOKIE = "pw_reset_pending";

export async function getCurrentUser() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Returns the effective role for the current user. The DB default is
 * `visitor`. Admin is conferred by ADMIN_EMAIL_ALLOWLIST — if the user's
 * email matches, we treat them as admin regardless of the DB row, and we
 * also sync the row to keep things consistent.
 */
export async function getCurrentRole(): Promise<Role | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const allowlist = (process.env.ADMIN_EMAIL_ALLOWLIST ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  if (user.email && allowlist.includes(user.email.toLowerCase())) {
    // Best-effort sync; ignore failures (RLS can't read profiles for other users,
    // but admin client bypasses it).
    try {
      const admin = createAdminClient();
      await admin
        .from("profiles")
        .update({ role: "admin" })
        .eq("id", user.id)
        .neq("role", "admin");
    } catch {
      // No-op
    }
    return "admin";
  }

  // Fall back to the DB row.
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  return ((data?.role as Role | undefined) ?? "visitor") as Role;
}

export async function requireAdmin(): Promise<void> {
  const role = await getCurrentRole();
  if (role !== "admin") {
    throw new Error("Forbidden: admin role required");
  }
}
