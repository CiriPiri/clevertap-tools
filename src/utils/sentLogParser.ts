import { minutesToClockTime } from "./time";

export interface ParsedFields {
  installId: string;
  identity: string;
  sentMinutes: number | null;
  sentTimeFormatted: string;
  variantId: string;
  variantName: string;
  errorType: string;
  systemMessageId: string;
  customMessageId: string;
}

export interface ParsedEntry {
  /** Original raw JSON key */
  rawKey: string;
  date: string; // YYYYMMDD
  dateFormatted: string;
  event: string;
  campaignId: string;
  platform: string; // raw lowercase
  platformDisplay: string; // capitalized
  rawValue: string;
  fields: ParsedFields | null; // null if malformed
  warnings: string[];
}

export interface ParseResult {
  entries: ParsedEntry[];
  error: string | null;
}

const SEP = "";
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatDateYYYYMMDD(s: string): string {
  if (!/^\d{8}$/.test(s)) return s;
  const y = s.slice(0, 4);
  const m = parseInt(s.slice(4, 6), 10);
  const d = parseInt(s.slice(6, 8), 10);
  if (m < 1 || m > 12 || d < 1 || d > 31) return s;
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

function capitalizePlatform(p: string): string {
  const lower = p.toLowerCase();
  if (lower === "ios") return "iOS";
  if (lower === "android") return "Android";
  if (lower === "web") return "Web";
  return p.charAt(0).toUpperCase() + p.slice(1);
}

/** Normalize literal "\\u001e" escapes into the actual 0x1E character. */
function normalizeSeparators(raw: string): string {
  return raw
    .replace(/\\u001e/gi, SEP)
    .replace(/\\u001E/g, SEP);
}

function parseValueString(raw: string, warnings: string[]): ParsedFields | null {
  // Strings often start with  producing a leading empty element.
  // Drop leading empties so field indices align with the spec.
  let parts = raw.split(SEP);
  while (parts.length > 0 && parts[0] === "") parts.shift();

  // Expected 8 fields per spec
  const expected = 8;
  if (parts.length < expected) {
    warnings.push(
      `Malformed entry: expected ${expected} fields, found ${parts.length}`,
    );
    // pad so we can still display what we have
    while (parts.length < expected) parts.push("");
  } else if (parts.length > expected) {
    // Trailing empty from a trailing separator is fine; otherwise warn.
    const extras = parts.slice(expected).filter((p) => p !== "");
    if (extras.length > 0) {
      warnings.push(
        `Entry has ${parts.length} fields, expected ${expected} (extra data ignored)`,
      );
    }
    parts = parts.slice(0, expected);
  }

  const [
    installId,
    identity,
    sentRaw,
    variantId,
    variantName,
    errorType,
    systemMessageId,
    customMessageId,
  ] = parts;

  let sentMinutes: number | null = null;
  let sentTimeFormatted: string;
  const trimmedSent = (sentRaw ?? "").trim();
  if (trimmedSent === "") {
    sentTimeFormatted = "Not provided";
  } else {
    const n = Number(trimmedSent);
    if (!Number.isInteger(n) || n < 0 || n >= 1440) {
      warnings.push(`Invalid sent-time value "${sentRaw}"`);
      sentTimeFormatted = `Invalid (${sentRaw})`;
    } else {
      sentMinutes = n;
      sentTimeFormatted = `${minutesToClockTime(n)} UTC (${n} min)`;
    }
  }

  return {
    installId: installId || "",
    identity: identity || "",
    sentMinutes,
    sentTimeFormatted,
    variantId: variantId || "",
    variantName: variantName || "",
    errorType: errorType || "",
    systemMessageId: systemMessageId || "",
    customMessageId: customMessageId || "",
  };
}

export function parseSentLog(rawJsonString: string): ParseResult {
  const trimmed = rawJsonString.trim();
  if (trimmed === "") {
    return { entries: [], error: null };
  }

  let obj: unknown;
  try {
    obj = JSON.parse(trimmed);
  } catch (e) {
    return {
      entries: [],
      error: `Invalid JSON: ${(e as Error).message}`,
    };
  }

  if (obj === null || typeof obj !== "object" || Array.isArray(obj)) {
    return {
      entries: [],
      error: "Expected a JSON object with pipe-separated keys.",
    };
  }

  const entries: ParsedEntry[] = [];

  for (const [rawKey, rawValue] of Object.entries(obj as Record<string, unknown>)) {
    const keyParts = rawKey.split("|");
    const warnings: string[] = [];

    if (keyParts.length !== 4) {
      const labels = ["Date", "Event", "Campaign/Target ID", "Platform"];
      const missing = labels
        .map((l, i) => (keyParts[i] === undefined || keyParts[i] === "" ? l : null))
        .filter((l): l is string => l !== null);
      warnings.push(
        `Key "${rawKey}" has ${keyParts.length} segments, expected 4` +
          (missing.length ? ` (missing: ${missing.join(", ")})` : ""),
      );
    }

    const [date = "", event = "", campaignId = "", platform = ""] = keyParts;

    if (!Array.isArray(rawValue)) {
      entries.push({
        rawKey,
        date,
        dateFormatted: formatDateYYYYMMDD(date),
        event,
        campaignId,
        platform,
        platformDisplay: capitalizePlatform(platform),
        rawValue: String(rawValue),
        fields: null,
        warnings: [
          ...warnings,
          "Value is not an array — expected an array of record-separator-delimited strings.",
        ],
      });
      continue;
    }

    for (const item of rawValue) {
      if (typeof item !== "string") {
        entries.push({
          rawKey,
          date,
          dateFormatted: formatDateYYYYMMDD(date),
          event,
          campaignId,
          platform,
          platformDisplay: capitalizePlatform(platform),
          rawValue: String(item),
          fields: null,
          warnings: [...warnings, "Entry is not a string."],
        });
        continue;
      }

      const normalized = normalizeSeparators(item);
      const entryWarnings = [...warnings];
      const fields = parseValueString(normalized, entryWarnings);

      entries.push({
        rawKey,
        date,
        dateFormatted: formatDateYYYYMMDD(date),
        event,
        campaignId,
        platform,
        platformDisplay: capitalizePlatform(platform),
        rawValue: item,
        fields,
        warnings: entryWarnings,
      });
    }
  }

  return { entries, error: null };
}

/**
 * Render a parsed entry as a compact plain-text block — the single source of
 * truth for both UI rendering and clipboard copy. Default/empty fields
 * (Status: delivered, System Message ID: -1, Custom Message ID: empty) are
 * omitted; they only appear when they carry meaningful values.
 */
export function formatEntryAsText(entry: ParsedEntry): string {
  const pad = (label: string) => label.padEnd(18, " ");
  const lines: string[] = [];

  // Headline: date · event · campaign together, then platform on its own line.
  const headlineParts = [
    entry.dateFormatted,
    entry.event,
    entry.campaignId ? `#${entry.campaignId}` : "",
  ].filter(Boolean);
  lines.push(headlineParts.join(" · "));
  lines.push(`${pad("Platform:")}${entry.platformDisplay}`);

  const f = entry.fields;
  if (f) {
    lines.push("");
    if (f.installId) lines.push(`${pad("Install ID:")}${f.installId}`);
    if (f.identity && f.identity !== f.installId) {
      lines.push(`${pad("Identity:")}${f.identity}`);
    }
    lines.push(`${pad("Sent Time:")}${f.sentTimeFormatted}`);
    if (f.variantName) {
      const variantId = f.variantId ? ` (#${f.variantId})` : "";
      lines.push(`${pad("Variant:")}${f.variantName}${variantId}`);
    }

    // Only surface these when non-default.
    const errorTrimmed = f.errorType.trim();
    if (errorTrimmed !== "") {
      lines.push(`${pad("Error:")}${errorTrimmed}`);
    }
    const sysTrimmed = f.systemMessageId.trim();
    if (sysTrimmed !== "" && sysTrimmed !== "-1") {
      lines.push(`${pad("System Msg ID:")}${sysTrimmed}`);
    }
    const customTrimmed = f.customMessageId.trim();
    if (customTrimmed !== "") {
      lines.push(`${pad("Custom Msg ID:")}${customTrimmed}`);
    }
  } else {
    lines.push("");
    lines.push(`${pad("Status:")}Unable to parse entry value`);
  }

  return lines.join("\n");
}

export const ENTRY_SEPARATOR = "-".repeat(60);

/** Concatenate every entry as one big copy-all blob. */
export function formatAllEntriesAsText(entries: ParsedEntry[]): string {
  return entries
    .map((e) => formatEntryAsText(e))
    .join(`\n\n${ENTRY_SEPARATOR}\n\n`);
}

export const SAMPLE_INPUT = `{
  "20260521|NotificationSent|1762858086|ios": [
    "\\u001e9006676\\u001e9006676\\u001e1261\\u001e10\\u001eVariant B\\u001e\\u001e-1\\u001e"
  ],
  "20260521|NotificationViewed|1762858086|android": [
    "\\u001e9006677\\u001ealice@example.com\\u001e720\\u001e11\\u001eVariant A\\u001e\\u001e-1\\u001e"
  ]
}`;
