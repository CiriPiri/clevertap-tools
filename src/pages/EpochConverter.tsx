import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  Copy,
  Check,
  ArrowDownUp,
  Globe2,
} from "lucide-react";
import {
  COMMON_TIMEZONES,
  EPOCH_UNITS,
  type EpochUnit,
  dateToEpoch,
  detectEpochUnit,
  epochToDate,
  formatISO,
  formatInTimezone,
  formatRFC,
  formatRelative,
  fromDatetimeLocalValue,
  toDatetimeLocalValue,
} from "../utils/epoch";
import {
  Badge,
  ErrorNote,
  Label,
  PageHeader,
  Panel,
} from "../components/ui";
import { cx } from "../components/ui/tokens";

type Direction = "epochToDate" | "dateToEpoch";

const browserTimezone =
  Intl.DateTimeFormat().resolvedOptions().timeZone ?? "UTC";

/** One input style for every field on the page. */
const FIELD =
  "rounded-lg border px-3 py-2 text-[13px] outline-none transition-colors bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-300 focus:border-zinc-400 dark:bg-zinc-900/40 dark:border-zinc-800 dark:text-zinc-200 dark:placeholder:text-zinc-700 dark:focus:border-zinc-600";

export const EpochConverter = () => {
  const [direction, setDirection] = useState<Direction>("epochToDate");
  const [epochInput, setEpochInput] = useState(() =>
    Math.floor(Date.now() / 1000).toString(),
  );
  const [unit, setUnit] = useState<EpochUnit>("s");
  const [autoUnit, setAutoUnit] = useState(true);
  const [dateInput, setDateInput] = useState(() =>
    toDatetimeLocalValue(new Date()),
  );
  const [extraTz, setExtraTz] = useState("UTC");
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Unit detection is derived from the input, not stored — avoids the
  // effect-then-setState round trip the previous version used.
  const effectiveUnit = autoUnit ? detectEpochUnit(epochInput) : unit;

  const parsed = useMemo<
    { ok: true; date: Date } | { ok: false; error: string }
  >(() => {
    try {
      return direction === "epochToDate"
        ? { ok: true, date: epochToDate(epochInput, effectiveUnit) }
        : { ok: true, date: fromDatetimeLocalValue(dateInput) };
    } catch (e) {
      return { ok: false, error: (e as Error).message };
    }
  }, [direction, epochInput, effectiveUnit, dateInput]);

  const applyDate = (d: Date) => {
    if (direction === "epochToDate") setEpochInput(dateToEpoch(d, effectiveUnit));
    else setDateInput(toDatetimeLocalValue(d));
  };

  const base = () => (parsed.ok ? parsed.date.getTime() : Date.now());
  const presets = [
    { label: "Now", fn: () => new Date() },
    {
      label: "Start of day",
      fn: () => {
        const d = new Date(base());
        d.setHours(0, 0, 0, 0);
        return d;
      },
    },
    {
      label: "End of day",
      fn: () => {
        const d = new Date(base());
        d.setHours(23, 59, 59, 999);
        return d;
      },
    },
    { label: "+1 day", fn: () => new Date(base() + 86_400_000) },
    { label: "−1 day", fn: () => new Date(base() - 86_400_000) },
    { label: "+1 hour", fn: () => new Date(base() + 3_600_000) },
    { label: "−1 hour", fn: () => new Date(base() - 3_600_000) },
  ];

  return (
    <div className="max-w-5xl mx-auto flex flex-col">
      <PageHeader
        title="Epoch Converter"
        description="Convert between epoch timestamps and human dates. Auto-detects seconds, milliseconds, microseconds, and nanoseconds."
        actions={
          <Badge tone="neutral" className="px-2 py-1 font-mono">
            <span className="text-zinc-400 dark:text-zinc-500">now</span>
            <span className="tabular">{Math.floor(now / 1000)}</span>
          </Badge>
        }
      />

      {/* Direction switch */}
      <div className="flex items-center gap-1 p-0.5 mb-4 rounded-lg border w-fit bg-zinc-100/70 border-zinc-200 dark:bg-zinc-800/50 dark:border-zinc-800">
        <DirectionTab
          active={direction === "epochToDate"}
          onClick={() => setDirection("epochToDate")}
        >
          Epoch → Date
        </DirectionTab>
        <button
          onClick={() =>
            setDirection((d) =>
              d === "epochToDate" ? "dateToEpoch" : "epochToDate",
            )
          }
          aria-label="Swap direction"
          title="Swap direction"
          className="p-1.5 rounded-md transition-colors text-zinc-500 hover:text-zinc-900 hover:bg-white dark:hover:text-zinc-100 dark:hover:bg-zinc-900"
        >
          <ArrowDownUp className="w-3.5 h-3.5" />
        </button>
        <DirectionTab
          active={direction === "dateToEpoch"}
          onClick={() => setDirection("dateToEpoch")}
        >
          Date → Epoch
        </DirectionTab>
      </div>

      {/* Input */}
      <Panel className="p-5 mb-4 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <Label>
              {direction === "epochToDate"
                ? "Epoch timestamp"
                : "Date & time (local)"}
            </Label>
            {direction === "epochToDate" && autoUnit && (
              <Badge tone="accent">detected: {effectiveUnit}</Badge>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            {direction === "epochToDate" ? (
              <input
                type="text"
                inputMode="numeric"
                value={epochInput}
                onChange={(e) => setEpochInput(e.target.value)}
                placeholder="1748000000"
                spellCheck={false}
                aria-label="Epoch timestamp"
                className={cx(FIELD, "flex-1 font-mono text-[15px] py-2.5")}
              />
            ) : (
              <input
                type="datetime-local"
                step="1"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                aria-label="Date and time"
                className={cx(
                  FIELD,
                  "flex-1 font-mono text-[15px] py-2.5 scheme-light dark:scheme-dark",
                )}
              />
            )}

            <div className="flex items-stretch gap-2">
              <select
                aria-label="Epoch unit"
                value={effectiveUnit}
                onChange={(e) => {
                  setAutoUnit(false);
                  setUnit(e.target.value as EpochUnit);
                }}
                className={cx(FIELD, "cursor-pointer")}
              >
                {EPOCH_UNITS.map((u) => (
                  <option key={u.value} value={u.value}>
                    {u.label}
                  </option>
                ))}
              </select>

              {direction === "epochToDate" && (
                <label
                  className={cx(
                    FIELD,
                    "flex items-center gap-2 cursor-pointer select-none text-zinc-600 dark:text-zinc-400",
                  )}
                >
                  <input
                    type="checkbox"
                    checked={autoUnit}
                    onChange={(e) => setAutoUnit(e.target.checked)}
                    className="accent-accent-600"
                  />
                  Auto
                </label>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {presets.map((p) => (
            <button
              key={p.label}
              onClick={() => applyDate(p.fn())}
              className="px-2.5 py-1 rounded-md text-[12px] font-medium border transition-colors bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50 hover:text-zinc-900 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            >
              {p.label}
            </button>
          ))}
        </div>
      </Panel>

      {!parsed.ok ? (
        <ErrorNote icon={AlertCircle} title="Invalid input" detail={parsed.error} />
      ) : (
        <Results
          date={parsed.date}
          extraTz={extraTz}
          setExtraTz={setExtraTz}
          now={now}
        />
      )}
    </div>
  );
};

const DirectionTab = ({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className={cx(
      "px-3 py-1.5 rounded-md text-[12.5px] font-medium transition-colors",
      active
        ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-zinc-100"
        : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300",
    )}
  >
    {children}
  </button>
);

const Results = ({
  date,
  extraTz,
  setExtraTz,
  now,
}: {
  date: Date;
  extraTz: string;
  setExtraTz: (s: string) => void;
  now: number;
}) => {
  const epochs = useMemo(
    () =>
      EPOCH_UNITS.map((u) => ({
        label: u.label,
        value: dateToEpoch(date, u.value),
      })),
    [date],
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      <ValueCard title="ISO 8601 (UTC)" value={formatISO(date)} mono />
      <ValueCard title="RFC 2822 (UTC)" value={formatRFC(date)} />
      <ValueCard
        title={`Local — ${browserTimezone}`}
        value={formatInTimezone(date, browserTimezone)}
      />
      <ValueCard title="Relative" value={formatRelative(date, new Date(now))} />

      <Panel className="lg:col-span-2 p-4">
        <div className="flex items-center justify-between gap-3 mb-2.5">
          <Label className="flex items-center gap-1.5">
            <Globe2 className="w-3.5 h-3.5" /> Another timezone
          </Label>
          <select
            aria-label="Display timezone"
            value={extraTz}
            onChange={(e) => setExtraTz(e.target.value)}
            className={cx(FIELD, "py-1 text-[12px] cursor-pointer")}
          >
            {COMMON_TIMEZONES.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
        </div>
        <div className="text-[15px] text-zinc-900 dark:text-zinc-100">
          {formatInTimezone(date, extraTz)}
        </div>
      </Panel>

      <Panel className="lg:col-span-2 p-4">
        <Label className="block mb-2.5">Epoch in every unit</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {epochs.map((e) => (
            <div
              key={e.label}
              className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg border bg-zinc-50/70 border-zinc-200 dark:bg-zinc-950/40 dark:border-zinc-800"
            >
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-500">
                  {e.label}
                </div>
                <div className="text-[13px] font-mono truncate tabular text-zinc-900 dark:text-zinc-200">
                  {e.value}
                </div>
              </div>
              <CopyButton value={e.value} />
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
};

const ValueCard = ({
  title,
  value,
  mono,
}: {
  title: string;
  value: string;
  mono?: boolean;
}) => (
  <Panel className="p-4">
    <div className="flex items-start justify-between gap-3 mb-1.5">
      <Label>{title}</Label>
      <CopyButton value={value} />
    </div>
    <div
      className={cx(
        "text-[15px] break-all text-zinc-900 dark:text-zinc-100",
        mono && "font-mono",
      )}
    >
      {value}
    </div>
  </Panel>
);

const CopyButton = ({ value }: { value: string }) => {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    [],
  );

  return (
    <button
      onClick={onCopy}
      aria-label={copied ? "Copied" : "Copy"}
      title="Copy"
      className={cx(
        "shrink-0 p-1.5 rounded-md transition-colors",
        copied
          ? "text-emerald-600 dark:text-emerald-400"
          : "text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-500 dark:hover:text-zinc-100 dark:hover:bg-zinc-800",
      )}
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
};
