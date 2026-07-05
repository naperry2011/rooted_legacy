"use client";

import { useActionState } from "react";
import {
  Field,
  FormAlert,
  Input,
  SubmitButton,
} from "@/components/forms/fields";
import { createTeamMember, type TeamState } from "./actions";

export function AddMemberForm() {
  const [state, formAction, pending] = useActionState<TeamState, FormData>(
    createTeamMember,
    undefined,
  );
  const fieldErrors =
    state && "fieldErrors" in state ? state.fieldErrors : undefined;

  return (
    <form action={formAction} className="space-y-5 max-w-md">
      {state?.ok && (
        <FormAlert kind="success">
          Admin account created for <strong>{state.email}</strong>. Share the
          password with them — they can change it under Password after logging in.
        </FormAlert>
      )}

      <Field label="Full name" name="full_name" error={fieldErrors?.full_name}>
        <Input
          id="full_name"
          name="full_name"
          required
          autoComplete="off"
          placeholder="Jane Grower"
        />
      </Field>

      <Field label="Email" name="email" error={fieldErrors?.email}>
        <Input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="off"
          required
          placeholder="jane@example.com"
        />
      </Field>

      <Field
        label="Temporary password"
        name="password"
        error={fieldErrors?.password}
        hint="At least 8 characters. Share it with them; they'll change it after logging in."
      >
        <Input
          id="password"
          name="password"
          type="text"
          autoComplete="off"
          required
          placeholder="temporary password"
        />
      </Field>

      {state && "error" in state && state.error && (
        <FormAlert kind="error">{state.error}</FormAlert>
      )}

      <SubmitButton pending={pending} className="w-full sm:w-auto">
        Create admin
      </SubmitButton>
    </form>
  );
}
