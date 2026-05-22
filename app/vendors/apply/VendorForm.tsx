"use client";

import { useActionState } from "react";
import {
  Field,
  FormAlert,
  Input,
  SubmitButton,
  Textarea,
} from "@/components/forms/fields";
import {
  submitVendorApplication,
  type VendorState,
} from "./actions";

export function VendorForm() {
  const [state, formAction, pending] = useActionState<VendorState, FormData>(
    submitVendorApplication,
    undefined,
  );

  if (state?.ok) {
    return (
      <FormAlert kind="success">
        Thanks! We received your application and will reach out within a week.
      </FormAlert>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <Field
        label="Business name"
        name="business_name"
        error={state?.fieldErrors?.business_name}
      >
        <Input id="business_name" name="business_name" required />
      </Field>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field
          label="Your name"
          name="contact_name"
          error={state?.fieldErrors?.contact_name}
        >
          <Input id="contact_name" name="contact_name" autoComplete="name" />
        </Field>

        <Field
          label="Contact email"
          name="contact_email"
          error={state?.fieldErrors?.contact_email}
        >
          <Input
            id="contact_email"
            name="contact_email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
          />
        </Field>

        <Field
          label="Phone (optional)"
          name="phone"
          error={state?.fieldErrors?.phone}
        >
          <Input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
          />
        </Field>

        <Field
          label="Category"
          name="category"
          error={state?.fieldErrors?.category}
          hint="e.g. food truck, wellness, crafts"
        >
          <Input id="category" name="category" />
        </Field>

        <Field
          label="Website"
          name="website"
          error={state?.fieldErrors?.website}
        >
          <Input
            id="website"
            name="website"
            type="url"
            placeholder="https://example.com"
          />
        </Field>

        <Field
          label="Instagram handle"
          name="instagram"
          error={state?.fieldErrors?.instagram}
        >
          <Input id="instagram" name="instagram" placeholder="@handle" />
        </Field>
      </div>

      <Field
        label="Tell us about your business"
        name="blurb"
        error={state?.fieldErrors?.blurb}
        hint="A few sentences — what you make or do, why you'd be a good fit."
      >
        <Textarea id="blurb" name="blurb" required minLength={20} maxLength={1000} />
      </Field>

      <Field
        label="Booth needs (optional)"
        name="booth_needs"
        error={state?.fieldErrors?.booth_needs}
        hint="Power, water, tent, table — let us know what you need."
      >
        <Textarea id="booth_needs" name="booth_needs" rows={3} maxLength={500} />
      </Field>

      {state?.error && <FormAlert kind="error">{state.error}</FormAlert>}

      <SubmitButton pending={pending}>Submit application</SubmitButton>
    </form>
  );
}
