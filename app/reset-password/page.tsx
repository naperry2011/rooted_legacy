import type { Metadata } from "next";
import Link from "next/link";
import { RequestResetForm } from "./RequestResetForm";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Reset your Rooted Legacy password.",
};

export default function ResetPasswordPage() {
  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 py-16 sm:py-20">
      <header className="mb-8">
        <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-primary-deep mb-3">
          Reset password
        </p>
        <h1 className="font-display text-4xl sm:text-5xl text-primary">
          Forgot your password?
        </h1>
        <p className="mt-3 text-ink-muted">
          Enter your email and we&apos;ll send a link to set a new one.
        </p>
      </header>

      <RequestResetForm />

      <p className="mt-6 text-sm text-ink-muted">
        Remembered it?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
