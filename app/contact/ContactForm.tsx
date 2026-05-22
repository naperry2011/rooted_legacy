"use client";

import { useActionState } from "react";
import {
  Field,
  FormAlert,
  Input,
  SubmitButton,
  Textarea,
} from "@/components/forms/fields";
import { sendContactMessage, type ContactState } from "./actions";

export function ContactForm() {
  const [state, formAction, pending] = useActionState<ContactState, FormData>(
    sendContactMessage,
    undefined,
  );

  if (state?.ok) {
    return (
      <FormAlert kind="success">
        Got it. We&apos;ll get back to you soon.
      </FormAlert>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Your name" name="name" error={state?.fieldErrors?.name}>
          <Input id="name" name="name" required autoComplete="name" />
        </Field>
        <Field label="Email" name="email" error={state?.fieldErrors?.email}>
          <Input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
          />
        </Field>
      </div>

      <Field
        label="Message"
        name="body"
        error={state?.fieldErrors?.body}
      >
        <Textarea id="body" name="body" required rows={6} maxLength={2000} />
      </Field>

      {state?.error && <FormAlert kind="error">{state.error}</FormAlert>}

      <SubmitButton pending={pending}>Send message</SubmitButton>
    </form>
  );
}
