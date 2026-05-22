import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Clock3,
  AlertCircle,
  Copy,
  Check,
  Zap,
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

type Direction = "epochToDate" | "dateToEpoch";

const browserTimezone =
  Intl.DateTimeFormat().resolvedOptions().timeZone ?? "UTC";

const inputCls =
  "bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 dark:bg-zinc-950/60 dark:border-zinc-800 dark:text-zinc-200 dark:placeholder:text-zinc-700 dark:focus:border-emerald-500/50 dark:focus:ring-emerald-500/50";

const cardCls =
  "bg-white border-zinc-200 dark:bg-zinc-900/50 dark:border-zinc-800";

const labelCls =
  "text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-500";

export const EpochConverter = () => {
  const [direction, setDirection] = useState<Direction>("epochToDate");

  const [epochInput, setEpochInput] = useState<string>(
    Math.floor(Date.now() / 1000).toString(),
  );
  const [unit, setUnit] = useState<EpochUnit>("s");
  const [autoUnit, setAutoUnit] = useState<boolean>(true);

  const [dateInput, setDateInput] = useState<string>(
    toDatetimeLocalValue(new Date()),
  );

  const [extraTz, setExtraTz] = useState<string>("UTC");

  const [now, setNow] = useState<number>(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!autoUnit) return;
    const detected = detectEpochUnit(epochInput);
    setUnit((prev) => (prev === detected ? prev : detected));
  }, [epochInput, autoUnit]);

  const parsed = useMemo<
    { ok: true; date: Date } | { ok: false; error: string }
  >(() => {
    try {
      if (direction === "epochToDate") {
        return { ok: true, date: epochToDate(epochInput, unit) };
      }
      return { ok: true, date: fromDatetimeLocalValue(dateInput) };
    } catch (e) {
      return { ok: false, error: (e as Error).message };
    }
  }, [direction, epochInput, unit, dateInput]);

  const applyDate = (d: Date) => {
    if (direction === "epochToDate") {
      setEpochInput(dateToEpoch(d, unit));
    } else {
      setDateInput(toDatetimeLocalValue(d));
    }
  };

  const presets = [
    { label: "Now", fn: () => new Date() },
    {
      label: "Start of day",
      fn: () => {
        const d = parsed.ok ? new Date(parsed.date) : new Date();
        d.setHours(0, 0, 0, 0);
        return d;
      },
    },
    {
      label: "End of day",
      fn: () => {
        const d = parsed.ok ? new Date(parsed.date) : new Date();
        d.setHours(23, 59, 59, 999);
        return d;
      },
    },
    {
      label: "+1 day",
      fn: () =>
        new Date((parsed.ok ? parsed.date.getTime() : Date.now()) + 86_400_000),
    },
    {
      label: "−1 day",
      fn: () =>
        new Date((parsed.ok ? parsed.date.getTime() : Date.now()) - 86_400_000),
    },
    {
      label: "+1 hour",
      fn: () =>
        new Date((parsed.ok ? parsed.date.getTime() : Date.now()) + 3_600_000),
    },
    {
      label: "−1 hour",
      fn: () =>
        new Date((parsed.ok ? parsed.date.getTime() : Date.now()) - 3_600_000),
    },
  ];

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col gap-2"
      >
        <div className={`flex items-center gap-2 ${labelCls}`}>
          <Clock3 className="w-4 h-4" /> Epoch ↔ Date
        </div>
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              Convert between epoch timestamps and human dates
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              Auto-detects seconds, milliseconds, microseconds, and nanoseconds.
            </p>
          </div>
          <CurrentEpochBadge now={now} />
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.05 }}
        className="flex items-center gap-2 p-1 rounded-full border w-fit bg-white border-zinc-200 dark:bg-zinc-900/50 dark:border-zinc-800"
      >
        <DirectionToggle
          active={direction === "epochToDate"}
          onClick={() => setDirection("epochToDate")}
        >
          Epoch → Date
        </DirectionToggle>
        <button
          onClick={() =>
            setDirection((d) =>
              d === "epochToDate" ? "dateToEpoch" : "epochToDate",
            )
          }
          className="p-1.5 rounded-full transition-colors text-zinc-500 hover:text-indigo-600 hover:bg-zinc-100 dark:hover:text-emerald-400 dark:hover:bg-zinc-800/60"
          aria-label="Swap direction"
          title="Swap direction"
        >
          <ArrowDownUp className="w-3.5 h-3.5" />
        </button>
        <DirectionToggle
          active={direction === "dateToEpoch"}
          onClick={() => setDirection("dateToEpoch")}
        >
          Date → Epoch
        </DirectionToggle>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className={`p-6 rounded-2xl border flex flex-col gap-5 ${cardCls}`}
      >
        {direction === "epochToDate" ? (
          <EpochInput
            value={epochInput}
            onChange={setEpochInput}
            unit={unit}
            setUnit={(u) => {
              setAutoUnit(false);
              setUnit(u);
            }}
            autoUnit={autoUnit}
            setAutoUnit={setAutoUnit}
            onNow={() => setEpochInput(dateToEpoch(new Date(), unit))}
          />
        ) : (
          <DateInput
            value={dateInput}
            onChange={setDateInput}
            unit={unit}
            setUnit={setUnit}
            onNow={() => setDateInput(toDatetimeLocalValue(new Date()))}
          />
        )}

        <div className="flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              key={p.label}
              onClick={() => applyDate(p.fn())}
              className="px-3 py-1.5 rounded-full text-xs font-medium border transition-colors bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100 hover:text-zinc-900 dark:bg-zinc-800/40 dark:text-zinc-400 dark:border-zinc-700/50 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            >
              {p.label}
            </button>
          ))}
        </div>
      </motion.div>

      {!parsed.ok ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 rounded-xl text-sm border bg-rose-50 border-rose-200 text-rose-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400"
        >
          <AlertCircle className="w-5 h-5 shrink-0" />
          {parsed.error}
        </motion.div>
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

const CurrentEpochBadge = ({ now }: { now: number }) => (
  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono border bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400">
    <Zap className="w-3.5 h-3.5" />
    <span className="text-zinc-500 dark:text-zinc-500">now:</span>
    <span>{Math.floor(now / 1000)}</span>
  </div>
);

const DirectionToggle = ({
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
    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
      active
        ? "bg-indigo-100 text-indigo-700 dark:bg-emerald-500/15 dark:text-emerald-400"
        : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-300"
    }`}
  >
    {children}
  </button>
);

interface EpochInputProps {
  value: string;
  onChange: (v: string) => void;
  unit: EpochUnit;
  setUnit: (u: EpochUnit) => void;
  autoUnit: boolean;
  setAutoUnit: (b: boolean) => void;
  onNow: () => void;
}
const EpochInput = ({
  value,
  onChange,
  unit,
  setUnit,
  autoUnit,
  setAutoUnit,
  onNow,
}: EpochInputProps) => (
  <div className="flex flex-col gap-3">
    <div className="flex items-center justify-between">
      <label htmlFor="epoch-input" className={labelCls}>
        Epoch timestamp
      </label>
      <button
        onClick={onNow}
        className="text-xs font-medium transition-colors text-indigo-600 hover:text-indigo-500 dark:text-emerald-400 dark:hover:text-emerald-300"
      >
        Use now
      </button>
    </div>
    <div className="flex flex-col sm:flex-row gap-3">
      <input
        id="epoch-input"
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`flex-1 border rounded-xl px-4 py-3 text-base font-mono outline-none transition-all ${inputCls}`}
        placeholder="1748000000"
        spellCheck={false}
      />
      <div className="flex items-stretch gap-2">
        <select
          aria-label="Epoch unit"
          value={unit}
          onChange={(e) => setUnit(e.target.value as EpochUnit)}
          className={`border rounded-xl px-3 py-3 text-sm outline-none transition-all ${inputCls}`}
        >
          {EPOCH_UNITS.map((u) => (
            <option key={u.value} value={u.value}>
              {u.label}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 px-3 rounded-xl border text-xs cursor-pointer transition-colors bg-white border-zinc-200 text-zinc-600 hover:text-zinc-900 dark:bg-zinc-950/60 dark:border-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200">
          <input
            type="checkbox"
            checked={autoUnit}
            onChange={(e) => setAutoUnit(e.target.checked)}
            className="accent-indigo-600 dark:accent-emerald-500"
          />
          Auto
        </label>
      </div>
    </div>
  </div>
);

interface DateInputProps {
  value: string;
  onChange: (v: string) => void;
  unit: EpochUnit;
  setUnit: (u: EpochUnit) => void;
  onNow: () => void;
}
const DateInput = ({
  value,
  onChange,
  unit,
  setUnit,
  onNow,
}: DateInputProps) => (
  <div className="flex flex-col gap-3">
    <div className="flex items-center justify-between">
      <label htmlFor="date-input" className={labelCls}>
        Date & time (local)
      </label>
      <button
        onClick={onNow}
        className="text-xs font-medium transition-colors text-indigo-600 hover:text-indigo-500 dark:text-emerald-400 dark:hover:text-emerald-300"
      >
        Use now
      </button>
    </div>
    <div className="flex flex-col sm:flex-row gap-3">
      <input
        id="date-input"
        type="datetime-local"
        step="1"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`flex-1 border rounded-xl px-4 py-3 text-base font-mono outline-none transition-all scheme-light dark:scheme-dark ${inputCls}`}
      />
      <select
        aria-label="Output epoch unit"
        value={unit}
        onChange={(e) => setUnit(e.target.value as EpochUnit)}
        className={`border rounded-xl px-3 py-3 text-sm outline-none transition-all ${inputCls}`}
      >
        {EPOCH_UNITS.map((u) => (
          <option key={u.value} value={u.value}>
            Output: {u.label}
          </option>
        ))}
      </select>
    </div>
  </div>
);

interface ResultsProps {
  date: Date;
  extraTz: string;
  setExtraTz: (s: string) => void;
  now: number;
}
const Results = ({ date, extraTz, setExtraTz, now }: ResultsProps) => {
  const epochs = useMemo(
    () =>
      EPOCH_UNITS.map((u) => ({
        label: u.label,
        value: dateToEpoch(date, u.value),
      })),
    [date],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-4"
    >
      <ResultCard title="ISO 8601 (UTC)" value={formatISO(date)} mono />
      <ResultCard title="RFC 2822 (UTC)" value={formatRFC(date)} />
      <ResultCard
        title={`Local — ${browserTimezone}`}
        value={formatInTimezone(date, browserTimezone)}
      />
      <ResultCard
        title="Relative"
        value={formatRelative(date, new Date(now))}
        highlight
      />

      <div className={`lg:col-span-2 p-5 rounded-2xl border ${cardCls}`}>
        <div className="flex items-center justify-between mb-3">
          <div className={`flex items-center gap-2 ${labelCls}`}>
            <Globe2 className="w-4 h-4" /> Another timezone
          </div>
          <select
            aria-label="Display timezone"
            value={extraTz}
            onChange={(e) => setExtraTz(e.target.value)}
            className={`border rounded-lg px-2.5 py-1.5 text-xs outline-none transition-all ${inputCls}`}
          >
            {COMMON_TIMEZONES.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
        </div>
        <div className="text-base text-zinc-900 dark:text-zinc-200">
          {formatInTimezone(date, extraTz)}
        </div>
      </div>

      <div className={`lg:col-span-2 p-5 rounded-2xl border ${cardCls}`}>
        <div className={`${labelCls} mb-3`}>Epoch in every unit</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {epochs.map((e) => (
            <CopyRow key={e.label} label={e.label} value={e.value} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const ResultCard = ({
  title,
  value,
  mono,
  highlight,
}: {
  title: string;
  value: string;
  mono?: boolean;
  highlight?: boolean;
}) => (
  <div
    className={`p-5 rounded-2xl border ${
      highlight
        ? "bg-indigo-50 border-indigo-200 dark:bg-emerald-500/5 dark:border-emerald-500/20"
        : cardCls
    }`}
  >
    <div className="flex items-start justify-between gap-3 mb-2">
      <div className={labelCls}>{title}</div>
      <CopyButton value={value} />
    </div>
    <div
      className={`text-base break-all text-zinc-900 dark:text-zinc-100 ${mono ? "font-mono" : ""}`}
    >
      {value}
    </div>
  </div>
);

const CopyRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg border bg-zinc-50 border-zinc-200 dark:bg-zinc-950/40 dark:border-zinc-800/60">
    <div className="flex flex-col min-w-0">
      <div className="text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-500">
        {label}
      </div>
      <div className="text-sm font-mono truncate text-zinc-900 dark:text-zinc-200">
        {value}
      </div>
    </div>
    <CopyButton value={value} />
  </div>
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
      // ignore
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
      className={`shrink-0 p-1.5 rounded-md border transition-colors ${
        copied
          ? "bg-indigo-100 border-indigo-200 text-indigo-700 dark:bg-emerald-500/15 dark:border-emerald-500/30 dark:text-emerald-400"
          : "bg-white border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:bg-zinc-800/40 dark:border-zinc-700/50 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-800"
      }`}
      aria-label="Copy"
      title="Copy"
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
};
