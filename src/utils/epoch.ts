export type EpochUnit = "s" | "ms" | "us" | "ns";

export const EPOCH_UNITS: { value: EpochUnit; label: string; factor: bigint }[] =
  [
    { value: "s", label: "Seconds", factor: 1000n },
    { value: "ms", label: "Milliseconds", factor: 1n },
    { value: "us", label: "Microseconds (µs)", factor: 0n },
    { value: "ns", label: "Nanoseconds", factor: 0n },
  ];

/**
 * Heuristically detect the unit of a numeric epoch.
 * Based on the typical magnitude of timestamps near "now" (year ~2001 — ~2286).
 */
export function detectEpochUnit(value: string): EpochUnit {
  const digits = value.replace(/[^0-9]/g, "");
  const len = digits.length;
  if (len <= 0) return "ms";
  if (len <= 10) return "s";
  if (len <= 13) return "ms";
  if (len <= 16) return "us";
  return "ns";
}

/**
 * Convert any epoch value + unit into a millisecond-precision Date.
 * Uses BigInt internally to preserve precision for ns/µs inputs.
 */
export function epochToDate(rawValue: string, unit: EpochUnit): Date {
  const trimmed = rawValue.trim();
  if (trimmed === "" || !/^-?\d+$/.test(trimmed)) {
    throw new Error("Enter a whole number (no decimals).");
  }
  const big = BigInt(trimmed);
  let ms: bigint;
  switch (unit) {
    case "s":
      ms = big * 1000n;
      break;
    case "ms":
      ms = big;
      break;
    case "us":
      ms = big / 1000n;
      break;
    case "ns":
      ms = big / 1_000_000n;
      break;
  }
  const n = Number(ms);
  if (!Number.isFinite(n)) {
    throw new Error("Value is out of the supported date range.");
  }
  const d = new Date(n);
  if (isNaN(d.getTime())) {
    throw new Error("Resulting date is invalid.");
  }
  return d;
}

/**
 * Convert a Date back into an epoch number string in the requested unit.
 */
export function dateToEpoch(date: Date, unit: EpochUnit): string {
  const ms = BigInt(date.getTime());
  switch (unit) {
    case "s":
      return (ms / 1000n).toString();
    case "ms":
      return ms.toString();
    case "us":
      return (ms * 1000n).toString();
    case "ns":
      return (ms * 1_000_000n).toString();
  }
}

const RTF = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
const RELATIVE_DIVISIONS: { amount: number; unit: Intl.RelativeTimeFormatUnit }[] =
  [
    { amount: 60, unit: "second" },
    { amount: 60, unit: "minute" },
    { amount: 24, unit: "hour" },
    { amount: 7, unit: "day" },
    { amount: 4.34524, unit: "week" },
    { amount: 12, unit: "month" },
    { amount: Number.POSITIVE_INFINITY, unit: "year" },
  ];

/**
 * "2 minutes ago", "in 3 hours" — uses Intl.RelativeTimeFormat.
 */
export function formatRelative(date: Date, from: Date = new Date()): string {
  let duration = (date.getTime() - from.getTime()) / 1000;
  for (const division of RELATIVE_DIVISIONS) {
    if (Math.abs(duration) < division.amount) {
      return RTF.format(Math.round(duration), division.unit);
    }
    duration /= division.amount;
  }
  return RTF.format(Math.round(duration), "year");
}

/** ISO 8601 string in UTC, e.g. "2026-05-22T12:34:56.789Z". */
export const formatISO = (d: Date) => d.toISOString();

/** RFC 2822-like UTC string. */
export const formatRFC = (d: Date) => d.toUTCString();

/** Locale-aware long string in a given IANA timezone. */
export function formatInTimezone(d: Date, timeZone: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      timeZone,
      dateStyle: "full",
      timeStyle: "long",
    }).format(d);
  } catch {
    return `Invalid timezone: ${timeZone}`;
  }
}

/**
 * Get a `<input type="datetime-local">`-compatible string for a given Date,
 * rendered in the user's local timezone. Includes seconds.
 */
export function toDatetimeLocalValue(d: Date): string {
  const pad = (n: number, len = 2) => String(n).padStart(len, "0");
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
    `T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  );
}

/** Parse a `datetime-local` input string (interpreted as local time) into a Date. */
export function fromDatetimeLocalValue(s: string): Date {
  const d = new Date(s);
  if (isNaN(d.getTime())) {
    throw new Error("Invalid date/time.");
  }
  return d;
}

/** Common IANA timezones for the quick picker. */
export const COMMON_TIMEZONES: string[] = [
  "UTC",
  "America/Los_Angeles",
  "America/New_York",
  "Europe/London",
  "Europe/Berlin",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
];
