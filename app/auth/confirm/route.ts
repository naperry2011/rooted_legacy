import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createServerClient } from "@/lib/supabase/server";

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
  const next = url.searchParams.get("next") ?? "/admin/password";

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

  // Only allow local redirects.
  const dest =
    next.startsWith("/") && !next.startsWith("//") ? next : "/admin/password";
  return NextResponse.redirect(new URL(dest, url.origin));
}
