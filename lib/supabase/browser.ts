"use client";

import { createBrowserClient as createCSRClient } from "@supabase/ssr";

let cached: ReturnType<typeof createCSRClient> | null = null;

export function createBrowserClient() {
  if (cached) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    throw new Error(
      "Supabase env vars missing: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }
  cached = createCSRClient(url, anon);
  return cached;
}
