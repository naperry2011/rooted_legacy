import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createServerClient } from "@/lib/supabase/server";
import { PW_RESET_COOKIE } from "@/lib/auth";

/**
 * Server-side email link verification (password reset, invites, etc.).
 *
 * Supabase's default email link puts the token in the URL hash (#...), which a
 * server can't read — so /auth/callback (which expects ?code=) fails with
 * "missing_code". The recommended SSR pattern is to point the email template at
 * this route with ?token_hash=...&type=...&next=..., and verify server-side via
 * verifyOtp. This works without PKCE cookies and across devices.
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const token_hash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;
  const next = url.searchParams.get("next") ?? "/reset-password/update";

  if (!token_hash || !type) {
    return NextResponse.redirect(
      new URL("/login?error=invalid_link", url.origin),
    );
  }

  const supabase = await createServerClient();
  const { error } = await supabase.auth.verifyOtp({ type, token_hash });
  if (error) {
    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent(error.message)}`,
        url.origin,
      ),
    );
  }

  // A recovery session must set a new password before it can use anything else.
  // Mark it; the admin layout redirects to the reset page while this is set.
  if (type === "recovery") {
    const cookieStore = await cookies();
    cookieStore.set(PW_RESET_COOKIE, "1", {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge: 60 * 60,
    });
  }

  // Only allow local redirects.
  const dest =
    next.startsWith("/") && !next.startsWith("//")
      ? next
      : "/reset-password/update";
  return NextResponse.redirect(new URL(dest, url.origin));
}
