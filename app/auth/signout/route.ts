import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createServerClient();
  await supabase.auth.signOut();
  // 303 See Other so the browser follows with GET / (not another POST,
  // which the home route rejects with 405).
  return NextResponse.redirect(new URL("/", request.url), { status: 303 });
}
