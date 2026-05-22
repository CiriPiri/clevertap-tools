import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Info } from "lucide-react";

interface FieldRow {
  label: string;
  source: string;
  meaning: string;
}

const KEY_FIELDS: FieldRow[] = [
  { label: "Date", source: "Key part 1", meaning: "YYYYMMDD in the log key (e.g. 20260521 → May 21, 2026)." },
  { label: "Event", source: "Key part 2", meaning: "NotificationSent / NotificationViewed / NotificationClicked, etc." },
  { label: "Campaign ID", source: "Key part 3", meaning: "Numeric campaign or target identifier." },
  { label: "Platform", source: "Key part 4", meaning: "ios / android / web — capitalized in the output." },
];

const VALUE_FIELDS: FieldRow[] = [
  { label: "Install ID", source: "Value field 0", meaning: "Device install identifier (CleverTap iid)." },
  { label: "Identity", source: "Value field 1", meaning: "User identity (idn) — email, customer ID, etc. Hidden when identical to Install ID." },
  { label: "Sent Time", source: "Value field 2", meaning: "Minutes since midnight UTC (0–1439). 1261 → 09:01 PM UTC." },
  { label: "Variant", source: "Value fields 3 & 4", meaning: "A/B variant name + numeric ID. Omitted when there is no variant." },
  { label: "Error", source: "Value field 5", meaning: "Delivery error. Hidden when empty (i.e. delivered successfully)." },
  { label: "System Msg ID", source: "Value field 6", meaning: "Hidden when -1 (not assigned)." },
  { label: "Custom Msg ID", source: "Value field 7", meaning: "Hidden when empty (not set)." },
];

export const FieldGuide = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border bg-white border-zinc-200 dark:bg-zinc-900/50 dark:border-zinc-800 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900"
      >
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-300" />
          <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
            What do these fields mean?
          </span>
          <span className="text-xs text-zinc-500 dark:text-zinc-500 hidden sm:inline">
            Defaults like “delivered” are hidden in the output.
          </span>
        </div>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-zinc-500"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-zinc-200 dark:border-zinc-800"
          >
            <div className="p-4 grid gap-4 sm:grid-cols-2 text-[13px]">
              <FieldList title="From the JSON key" rows={KEY_FIELDS} />
              <FieldList title="From the value string" rows={VALUE_FIELDS} />
            </div>
            <div className="px-4 pb-4 text-[12px] text-zinc-500 dark:text-zinc-400">
              Values inside the string are split by the ASCII record separator{" "}
              <code className="font-mono px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800"></code>{" "}
              (0x1E). Literal escapes and real 0x1E characters both work.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FieldList = ({ title, rows }: { title: string; rows: FieldRow[] }) => (
  <div className="flex flex-col gap-2">
    <div className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-500">
      {title}
    </div>
    <ul className="flex flex-col gap-2">
      {rows.map((r) => (
        <li
          key={r.label}
          className="flex flex-col gap-0.5 pl-2 border-l-2 border-indigo-200 dark:border-indigo-500/30"
        >
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-medium text-zinc-800 dark:text-zinc-200">
              {r.label}
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-500">
              {r.source}
            </span>
          </div>
          <div className="text-zinc-600 dark:text-zinc-400 leading-snug">
            {r.meaning}
          </div>
        </li>
      ))}
    </ul>
  </div>
);
