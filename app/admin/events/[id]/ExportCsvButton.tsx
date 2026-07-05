"use client";

import { Download } from "lucide-react";

export type AttendeeCsvRow = {
  name: string;
  email: string;
  party_size: number;
  status: string;
  created_at: string;
};

function toCsv(rows: AttendeeCsvRow[]): string {
  const header = ["Name", "Email", "Party size", "Status", "RSVP'd at"];
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const lines = rows.map((r) =>
    [r.name, r.email, String(r.party_size), r.status, r.created_at]
      .map((c) => escape(String(c)))
      .join(","),
  );
  return [header.map(escape).join(","), ...lines].join("\r\n");
}

export function ExportCsvButton({
  rows,
  filename,
}: {
  rows: AttendeeCsvRow[];
  filename: string;
}) {
  function download() {
    const blob = new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={download}
      disabled={rows.length === 0}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-line text-ink hover:border-primary/60 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
    >
      <Download className="h-4 w-4" aria-hidden />
      Export CSV
    </button>
  );
}
