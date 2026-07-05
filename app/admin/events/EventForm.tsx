"use client";

import { useActionState } from "react";
import {
  Field,
  FormAlert,
  Input,
  SubmitButton,
  Textarea,
} from "@/components/forms/fields";
import { upsertEvent, type EventFormState } from "./actions";
import type { EventRow } from "@/lib/events";

const selectClass =
  "w-full rounded-xl border border-line bg-bg-elev px-4 py-3 text-ink focus:outline-none focus:border-primary/60 transition-colors";

function arrToText(v: string[] | null | undefined): string {
  return (v ?? []).join("\n");
}

export function EventForm({ event }: { event?: EventRow }) {
  const [state, formAction, pending] = useActionState<EventFormState, FormData>(
    upsertEvent,
    undefined,
  );
  const e = event;
  const err = state && "fieldErrors" in state ? state.fieldErrors : undefined;

  return (
    <form action={formAction} className="space-y-6 max-w-2xl">
      {e?.id && <input type="hidden" name="id" value={e.id} />}

      {state?.ok && (
        <FormAlert kind="success">Saved. Your changes are live.</FormAlert>
      )}

      <Field label="Title" name="title" error={err?.title}>
        <Input
          id="title"
          name="title"
          required
          defaultValue={e?.title}
          placeholder="Soothing Sundays"
        />
      </Field>

      <Field
        label="Slug (optional)"
        name="slug"
        error={err?.slug}
        hint="The web address: /events/your-slug. Leave blank to build it from the title."
      >
        <Input
          id="slug"
          name="slug"
          defaultValue={e?.slug}
          placeholder="soothing-sundays"
        />
      </Field>

      <Field label="Summary" name="summary" error={err?.summary} hint="One or two sentences shown on cards.">
        <Textarea
          id="summary"
          name="summary"
          rows={2}
          required
          defaultValue={e?.summary}
          maxLength={500}
        />
      </Field>

      <Field
        label="Tagline (optional)"
        name="tagline"
        error={err?.tagline}
        hint="Short hook shown above the title."
      >
        <Input id="tagline" name="tagline" defaultValue={e?.tagline ?? ""} />
      </Field>

      <div className="grid sm:grid-cols-3 gap-4">
        <Field label="Date" name="date" error={err?.date}>
          <Input
            id="date"
            name="date"
            type="date"
            required
            defaultValue={e?.date}
          />
        </Field>
        <Field label="Start time" name="start_time" error={err?.start_time} hint="Optional">
          <Input
            id="start_time"
            name="start_time"
            type="time"
            defaultValue={e?.start_time?.slice(0, 5) ?? ""}
          />
        </Field>
        <Field label="End time" name="end_time" error={err?.end_time} hint="Optional">
          <Input
            id="end_time"
            name="end_time"
            type="time"
            defaultValue={e?.end_time?.slice(0, 5) ?? ""}
          />
        </Field>
      </div>

      <Field label="Location" name="location" error={err?.location}>
        <Input
          id="location"
          name="location"
          required
          defaultValue={e?.location}
          placeholder="The farm — 123 Greenway Rd"
        />
      </Field>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field
          label="Status"
          name="status"
          error={err?.status}
          hint="Draft = hidden from the public site."
        >
          <select
            id="status"
            name="status"
            defaultValue={e?.status ?? "draft"}
            className={selectClass}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </Field>

        <Field
          label="Type"
          name="kind"
          error={err?.kind}
          hint="Free RSVP uses the on-site sign-up form."
        >
          <select
            id="kind"
            name="kind"
            defaultValue={e?.kind ?? "free_rsvp"}
            className={selectClass}
          >
            <option value="free_rsvp">Free RSVP</option>
            <option value="ticketed">Ticketed</option>
            <option value="external">External link</option>
          </select>
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field
          label="External link"
          name="external_url"
          error={err?.external_url}
          hint="Required only for external-link events."
        >
          <Input
            id="external_url"
            name="external_url"
            type="url"
            defaultValue={e?.external_url ?? ""}
            placeholder="https://..."
          />
        </Field>
        <Field
          label="Capacity (optional)"
          name="capacity"
          error={err?.capacity}
          hint="Leave blank for no limit."
        >
          <Input
            id="capacity"
            name="capacity"
            type="number"
            min={1}
            defaultValue={e?.capacity ?? undefined}
          />
        </Field>
      </div>

      <Field
        label="Details (optional)"
        name="body_md"
        error={err?.body_md}
        hint="Longer description shown on the event page. Markdown allowed."
      >
        <Textarea id="body_md" name="body_md" rows={5} defaultValue={e?.body_md ?? ""} />
      </Field>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field
          label="Highlights"
          name="highlights"
          error={err?.highlights}
          hint="One per line."
        >
          <Textarea
            id="highlights"
            name="highlights"
            rows={4}
            defaultValue={arrToText(e?.highlights)}
            placeholder={"Live music\nFarm tours\nKids' corner"}
          />
        </Field>
        <Field
          label="Partners"
          name="partners"
          error={err?.partners}
          hint="One per line."
        >
          <Textarea
            id="partners"
            name="partners"
            rows={4}
            defaultValue={arrToText(e?.partners)}
            placeholder={"Pure-trition\nLocal Roasters"}
          />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Themes" name="themes" error={err?.themes} hint="One per line.">
          <Textarea
            id="themes"
            name="themes"
            rows={3}
            defaultValue={arrToText(e?.themes)}
          />
        </Field>
        <Field
          label="Included perks"
          name="included_perks"
          error={err?.included_perks}
          hint="One per line."
        >
          <Textarea
            id="included_perks"
            name="included_perks"
            rows={3}
            defaultValue={arrToText(e?.included_perks)}
          />
        </Field>
      </div>

      <label className="flex items-center gap-3 text-sm text-cream">
        <input
          type="checkbox"
          name="is_featured"
          defaultChecked={e?.is_featured ?? false}
          className="h-4 w-4 rounded border-line bg-bg-elev accent-primary"
        />
        Feature this event
      </label>

      {state && "error" in state && state.error && (
        <FormAlert kind="error">{state.error}</FormAlert>
      )}

      <SubmitButton pending={pending}>
        {e?.id ? "Save changes" : "Create event"}
      </SubmitButton>
    </form>
  );
}
