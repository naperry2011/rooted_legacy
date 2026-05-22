import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(new URL("/?subscribed=invalid", url.origin));
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("subscribers")
    .update({ status: "active", confirmed_at: new Date().toISOString() })
    .eq("confirmation_token", token)
    .eq("status", "pending")
    .select("id")
    .maybeSingle();

  if (error || !data) {
    return NextResponse.redirect(new URL("/?subscribed=already", url.origin));
  }

  return NextResponse.redirect(new URL("/?subscribed=ok", url.origin));
}
