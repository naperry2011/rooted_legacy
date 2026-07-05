"use client";

import { useActionState } from "react";
import {
  Field,
  FormAlert,
  Input,
  SubmitButton,
} from "@/components/forms/fields";
import { requestReset, type ResetState } from "./actions";

export function RequestResetForm() {
  const [state, formAction, pending] = useActionState<ResetState, FormData>(
    requestReset,
    undefined,
  );

  if (state?.ok) {
    return (
      <div className="rounded-2xl border border-line bg-bg-elev p-6">
        <h2 className="font-display text-2xl text-cream">Check your email</h2>
        <p className="mt-2 text-ink-muted">
          If an account exists for that address, we just sent a link to reset
          your password. It expires in 1 hour.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <Field label="Email" name="email">
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          placeholder="you@example.com"
        />
      </Field>

      {state?.error && <FormAlert kind="error">{state.error}</FormAlert>}

      <SubmitButton pending={pending} className="w-full sm:w-auto">
        Send reset link
      </SubmitButton>
    </form>
  );
}
