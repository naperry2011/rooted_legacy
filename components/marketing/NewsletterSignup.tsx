"use client";

import { useActionState } from "react";
import { Mail } from "lucide-react";
import { Input, SubmitButton } from "@/components/forms/fields";
import {
  subscribeToNewsletter,
  type NewsletterState,
} from "@/app/actions/newsletter";

export function NewsletterSignup({
  source = "footer",
  variant = "compact",
}: {
  source?: string;
  variant?: "compact" | "hero";
}) {
  const [state, formAction, pending] = useActionState<NewsletterState, FormData>(
    subscribeToNewsletter,
    undefined,
  );

  const isHero = variant === "hero";

  return (
    <div
      className={
        isHero
          ? "rounded-2xl border border-line bg-bg-elev p-6 sm:p-8 bg-grain"
          : ""
      }
    >
      {isHero && (
        <>
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-primary-deep mb-3">
            Stay in the loop
          </p>
          <h2 className="font-display text-2xl sm:text-3xl text-primary mb-2">
            News from the farm
          </h2>
          <p className="text-sm text-ink-muted mb-5">
            Classes, harvest updates, events. One email a month, no spam.
          </p>
        </>
      )}

      {state?.ok ? (
        <p className="text-sm text-leaf">
          Check your inbox to confirm <strong>{state.email}</strong>.
        </p>
      ) : (
        <form action={formAction} className="space-y-3">
          <input type="hidden" name="source" value={source} />
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted/60 pointer-events-none"
                aria-hidden
              />
              <Input
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                aria-label="Email address"
                className="pl-10"
              />
            </div>
            <SubmitButton pending={pending}>Subscribe</SubmitButton>
          </div>
          {state?.error && (
            <p className="text-sm text-tomato" role="alert">
              {state.error}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
