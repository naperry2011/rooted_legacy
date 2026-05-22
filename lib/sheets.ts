import "server-only";

import { google } from "googleapis";

/**
 * Google Sheets is the source of truth for produce availability. Staff
 * maintain a single sheet; the site reads it on demand and caches for 15
 * minutes. To bust the cache from admin, call revalidateTag("produce").
 *
 * Expected header row (case-insensitive, order-flexible):
 *   sku, name, category, unit, qty_available, price_retail, price_wholesale,
 *   csa_eligible, farmstand, wholesale, in_season, photo_url, notes
 */

const SHEET_RANGE = "A:Z";
const REVALIDATE_SECONDS = 60 * 15;

export type ProduceItem = {
  sku: string;
  name: string;
  category: string;
  unit: string;
  qtyAvailable: number;
  priceRetailCents: number | null;
  priceWholesaleCents: number | null;
  csaEligible: boolean;
  farmstand: boolean;
  wholesale: boolean;
  inSeason: boolean;
  photoUrl: string | null;
  notes: string | null;
};

function parseBool(v: string | undefined): boolean {
  if (!v) return false;
  return ["y", "yes", "true", "1", "x"].includes(v.trim().toLowerCase());
}

function parsePriceToCents(v: string | undefined): number | null {
  if (!v) return null;
  const cleaned = v.replace(/[$,\s]/g, "");
  if (!cleaned) return null;
  const n = Number(cleaned);
  if (!Number.isFinite(n)) return null;
  return Math.round(n * 100);
}

function parseNum(v: string | undefined): number {
  const n = Number((v ?? "").trim());
  return Number.isFinite(n) ? n : 0;
}

export function sheetsConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_SHEETS_ID && process.env.GOOGLE_SERVICE_ACCOUNT_JSON,
  );
}

function getServiceAccount(): { client_email: string; private_key: string } | null {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) return null;
  // Accept either raw JSON or base64-encoded JSON.
  let text = raw.trim();
  if (!text.startsWith("{")) {
    try {
      text = Buffer.from(text, "base64").toString("utf8");
    } catch {
      return null;
    }
  }
  try {
    const parsed = JSON.parse(text) as {
      client_email?: string;
      private_key?: string;
    };
    if (!parsed.client_email || !parsed.private_key) return null;
    // Normalize escaped newlines that often come from env vars.
    return {
      client_email: parsed.client_email,
      private_key: parsed.private_key.replace(/\\n/g, "\n"),
    };
  } catch {
    return null;
  }
}

/**
 * Use Sheets' built-in CSV export endpoint via google APIs proper.
 * The service account must be added as a viewer on the sheet.
 */
async function fetchRows(): Promise<string[][] | null> {
  if (!sheetsConfigured()) return null;
  const sa = getServiceAccount();
  if (!sa) return null;

  try {
    const auth = new google.auth.JWT({
      email: sa.client_email,
      key: sa.private_key,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });
    const sheets = google.sheets({ version: "v4", auth });
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID!,
      range: SHEET_RANGE,
      valueRenderOption: "UNFORMATTED_VALUE",
    });
    return (res.data.values ?? []) as string[][];
  } catch (e) {
    console.warn("[sheets] read failed:", e instanceof Error ? e.message : e);
    return null;
  }
}

function parseRows(rows: string[][]): ProduceItem[] {
  if (rows.length < 2) return [];
  const header = rows[0].map((h) => String(h ?? "").trim().toLowerCase());
  const idx = (name: string) => header.indexOf(name);
  const col = {
    sku: idx("sku"),
    name: idx("name"),
    category: idx("category"),
    unit: idx("unit"),
    qty: idx("qty_available"),
    retail: idx("price_retail"),
    wholesale: idx("price_wholesale"),
    csa: idx("csa_eligible"),
    farm: idx("farmstand"),
    whl: idx("wholesale"),
    season: idx("in_season"),
    photo: idx("photo_url"),
    notes: idx("notes"),
  };
  const items: ProduceItem[] = [];
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    const name = String(r[col.name] ?? "").trim();
    if (!name) continue;
    items.push({
      sku: String(r[col.sku] ?? "").trim() || `row-${i}`,
      name,
      category: String(r[col.category] ?? "").trim(),
      unit: String(r[col.unit] ?? "").trim() || "each",
      qtyAvailable: parseNum(r[col.qty]),
      priceRetailCents: parsePriceToCents(r[col.retail]),
      priceWholesaleCents: parsePriceToCents(r[col.wholesale]),
      csaEligible: parseBool(r[col.csa]),
      farmstand: parseBool(r[col.farm]),
      wholesale: parseBool(r[col.whl]),
      inSeason: parseBool(r[col.season]),
      photoUrl: String(r[col.photo] ?? "").trim() || null,
      notes: String(r[col.notes] ?? "").trim() || null,
    });
  }
  return items;
}

// Wrap the read in Next.js fetch cache via unstable_cache.
import { unstable_cache } from "next/cache";

const _readAll = unstable_cache(
  async (): Promise<ProduceItem[]> => {
    const rows = await fetchRows();
    if (!rows) return [];
    return parseRows(rows);
  },
  ["produce-sheet"],
  { revalidate: REVALIDATE_SECONDS, tags: ["produce"] },
);

export async function listProduce(): Promise<ProduceItem[]> {
  return _readAll();
}

export async function listFarmStand(): Promise<ProduceItem[]> {
  const all = await _readAll();
  return all.filter((p) => p.farmstand && p.inSeason && p.qtyAvailable > 0);
}

export async function listInSeason(): Promise<ProduceItem[]> {
  const all = await _readAll();
  return all.filter((p) => p.inSeason);
}

export function formatPrice(cents: number | null): string {
  if (cents == null) return "—";
  return `$${(cents / 100).toFixed(2)}`;
}
