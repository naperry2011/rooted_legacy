"use client";

import { deleteEvent } from "./actions";

export function DeleteEventButton({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  return (
    <form
      action={deleteEvent}
      onSubmit={(e) => {
        if (
          !confirm(
            `Delete "${title}"? This also removes its RSVPs and can't be undone.`,
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="text-xs text-tomato hover:underline"
      >
        Delete
      </button>
    </form>
  );
}
