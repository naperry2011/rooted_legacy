import "server-only";

import { cookies } from "next/headers";
import { createServerClient as createSSRClient } from "@supabase/ssr";

/**
 * Server-side Supabase client bound to the current request's cookies.
 * Use from React Server Components, Server Actions, and Route Handlers.
 *
 * In RSCs you can't actually write cookies; the SSR helper handles that
 * by trying and silently no-op'ing on the read-only context. Middleware
 * is what keeps the session fresh across requests.
 */
export async function createServerClient() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    throw new Error(
      "Supabase env vars missing: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }
  return createSSRClient(url, anon, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // No-op in a Server Component render — middleware refreshes the session.
        }
      },
    },
  });
}
