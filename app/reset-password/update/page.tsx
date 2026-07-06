import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { UpdatePasswordForm } from "./UpdatePasswordForm";

export const metadata: Metadata = {
  title: "Choose a new password",
};

export default async function ResetPasswordUpdatePage() {
  // Requires the recovery session established by /auth/confirm.
  const user = await getCurrentUser().catch(() => null);
  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 py-16 sm:py-20">
      <header className="mb-8">
        <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-primary-deep mb-3">
          Reset password
        </p>
        <h1 className="font-display text-4xl sm:text-5xl text-primary">
          Choose a new password
        </h1>
        <p className="mt-3 text-ink-muted">
          Set a new password for your account. For your security, you&apos;ll be
          signed out on all devices and asked to log in with it.
        </p>
      </header>

      <UpdatePasswordForm />
    </div>
  );
}
