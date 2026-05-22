import * as React from "react";

export function DataTable({
  columns,
  rows,
  emptyLabel,
}: {
  columns: string[];
  rows: React.ReactNode[][];
  emptyLabel?: string;
}) {
  if (rows.length === 0) {
    return (
      <p className="text-ink-muted">
        {emptyLabel ?? "Nothing here yet."}
      </p>
    );
  }
  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-bg-elev">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-line">
            {columns.map((c) => (
              <th
                key={c}
                className="text-left text-xs uppercase tracking-[0.2em] text-primary-deep px-4 py-3 font-normal"
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-line/60 last:border-0 align-top"
            >
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 text-ink">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    confirmed: "bg-leaf/15 text-leaf",
    cancelled: "bg-tomato/15 text-tomato",
    pending: "bg-primary/15 text-primary",
    active: "bg-leaf/15 text-leaf",
    approved: "bg-leaf/15 text-leaf",
    rejected: "bg-tomato/15 text-tomato",
    unsubscribed: "bg-ink-muted/15 text-ink-muted",
    bounced: "bg-tomato/15 text-tomato",
  };
  return (
    <span
      className={
        "inline-block rounded-full px-2 py-0.5 text-[10px] uppercase tracking-widest " +
        (colors[status] ?? "bg-ink-muted/15 text-ink-muted")
      }
    >
      {status}
    </span>
  );
}
