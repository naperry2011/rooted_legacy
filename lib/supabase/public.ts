import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

/**
 * Cookie-less Supabase client using the anon key. Safe at build time
 * (no request context) AND at runtime for unauthenticated public reads
 * (RLS public-read policies enforce visibility).
 *
 * Use this for any read that doesn't depend on the current user —
 * events listing, gallery, etc. Keeps generateStaticParams + RSCs working.
 */
let cached: SupabaseClient<Database> | null = null;

export function createPublicClient(): SupabaseClient<Database> {
  if (cached) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    throw new Error(
      "Supabase env vars missing: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }
  cached = createClient<Database>(url, anon, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
