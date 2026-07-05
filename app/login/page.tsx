import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to manage your RSVPs at Rooted Legacy.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const user = await getCurrentUser().catch(() => null);
  if (user) {
    redirect(params.next ?? "/account");
  }

  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 py-16 sm:py-20">
      <header className="mb-8">
        <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-primary-deep mb-3">
          Welcome
        </p>
        <h1 className="font-display text-4xl sm:text-5xl text-primary">
          Sign in
        </h1>
        <p className="mt-3 text-ink-muted">
          Sign in with your email and password.
        </p>
      </header>

      <LoginForm next={params.next} />
    </div>
  );
}
