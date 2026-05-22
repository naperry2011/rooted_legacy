"use client";

import { useActionState } from "react";
import {
  Field,
  FormAlert,
  Input,
  SubmitButton,
  Textarea,
} from "@/components/forms/fields";
import { createBooking, type BookingState } from "@/app/events/[slug]/actions";

export function BookingForm({
  eventId,
  defaultEmail,
}: {
  eventId: string;
  defaultEmail?: string;
}) {
  const [state, formAction, pending] = useActionState<BookingState, FormData>(
    createBooking,
    undefined,
  );

  if (state?.ok) {
    return (
      <FormAlert kind="success">
        You&apos;re on the list! We sent a confirmation to{" "}
        <strong>{state.email}</strong>. See you on the farm.
      </FormAlert>
    );
  }

  return (
    <form action={formAction} className="space-y-5 max-w-xl">
      <input type="hidden" name="event_id" value={eventId} />

      <div className="grid sm:grid-cols-2 gap-4">
        <Field
          label="Your name"
          name="attendee_name"
          error={state?.fieldErrors?.attendee_name}
        >
          <Input
            id="attendee_name"
            name="attendee_name"
            required
            autoComplete="name"
            placeholder="Jane Grower"
          />
        </Field>

        <Field
          label="Email"
          name="attendee_email"
          error={state?.fieldErrors?.attendee_email}
        >
          <Input
            id="attendee_email"
            name="attendee_email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            defaultValue={defaultEmail}
            placeholder="you@example.com"
          />
        </Field>
      </div>

      <Field
        label="How many in your party?"
        name="party_size"
        error={state?.fieldErrors?.party_size}
        hint="Just you? Leave it as 1."
      >
        <Input
          id="party_size"
          name="party_size"
          type="number"
          inputMode="numeric"
          min={1}
          max={20}
          defaultValue={1}
          required
        />
      </Field>

      <Field
        label="Anything we should know? (optional)"
        name="notes"
        error={state?.fieldErrors?.notes}
        hint="Accessibility needs, dietary restrictions, etc."
      >
        <Textarea id="notes" name="notes" rows={3} maxLength={500} />
      </Field>

      {state?.error && <FormAlert kind="error">{state.error}</FormAlert>}

      <SubmitButton pending={pending}>Reserve my spot</SubmitButton>

      <p className="text-xs text-ink-muted/70">
        Free RSVP. We&apos;ll email confirmation details.
      </p>
    </form>
  );
}
