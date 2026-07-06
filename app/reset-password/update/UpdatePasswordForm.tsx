"use client";

import { useActionState } from "react";
import {
  Field,
  FormAlert,
  Input,
  SubmitButton,
} from "@/components/forms/fields";
import { resetPassword, type ResetUpdateState } from "./actions";

export function UpdatePasswordForm() {
  const [state, formAction, pending] = useActionState<
    ResetUpdateState,
    FormData
  >(resetPassword, undefined);

  return (
    <form action={formAction} className="space-y-5">
      <Field
        label="New password"
        name="password"
        error={state?.fieldErrors?.password}
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
        error={state?.fieldErrors?.confirm}
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

      {state?.error && <FormAlert kind="error">{state.error}</FormAlert>}

      <SubmitButton pending={pending} className="w-full sm:w-auto">
        Save new password
      </SubmitButton>
    </form>
  );
}
