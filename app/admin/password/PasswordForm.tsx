"use client";

import { useActionState } from "react";
import {
  Field,
  FormAlert,
  Input,
  SubmitButton,
} from "@/components/forms/fields";
import { updatePassword, type PasswordState } from "./actions";

export function PasswordForm() {
  const [state, formAction, pending] = useActionState<PasswordState, FormData>(
    updatePassword,
    undefined,
  );
  const fieldErrors =
    state && "fieldErrors" in state ? state.fieldErrors : undefined;

  return (
    <form action={formAction} className="space-y-5 max-w-md">
      {state?.ok && (
        <FormAlert kind="success">
          Password updated. Use it next time you log in.
        </FormAlert>
      )}

      <Field
        label="New password"
        name="password"
        error={fieldErrors?.password}
        hint="At least 8 characters."
      >
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          placeholder="••••••••"
        />
      </Field>

      <Field
        label="Confirm new password"
        name="confirm"
        error={fieldErrors?.confirm}
      >
        <Input
          id="confirm"
          name="confirm"
          type="password"
          autoComplete="new-password"
          required
          placeholder="••••••••"
        />
      </Field>

      {state && "error" in state && state.error && (
        <FormAlert kind="error">{state.error}</FormAlert>
      )}

      <SubmitButton pending={pending} className="w-full sm:w-auto">
        Save password
      </SubmitButton>
    </form>
  );
}
