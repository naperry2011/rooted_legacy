"use client";

import { useActionState } from "react";
import {
  Field,
  FormAlert,
  Input,
  SubmitButton,
} from "@/components/forms/fields";
import { signIn, type LoginState } from "./actions";

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    signIn,
    undefined,
  );

  return (
    <form action={formAction} className="space-y-5">
      {next && <input type="hidden" name="next" value={next} />}

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

      <Field label="Password" name="password">
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
        />
      </Field>

      {state?.error && <FormAlert kind="error">{state.error}</FormAlert>}

      <SubmitButton pending={pending} className="w-full sm:w-auto">
        Sign in
      </SubmitButton>
    </form>
  );
}
