"use client";

import { useActionState } from "react";
import {
  Field,
  FormAlert,
  Input,
  SubmitButton,
} from "@/components/forms/fields";
import { sendMagicLink, type LoginState } from "./actions";

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    sendMagicLink,
    undefined,
  );

  return (
    <form action={formAction} className="space-y-5">
      {next && <input type="hidden" name="next" value={next} />}

      <Field label="Email" name="email" error={state?.error}>
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
        Send magic link
      </SubmitButton>

      <p className="text-xs text-ink-muted/70">
        By signing in you agree to receive transactional emails from Rooted
        Legacy.
      </p>
    </form>
  );
}
