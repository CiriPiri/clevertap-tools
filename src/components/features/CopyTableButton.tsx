import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, Copy, Download } from "lucide-react";
import type { CleverTapReport } from "../../types/clevertap";
import type { ColumnDef } from "../../config/tableColumns";
import { copyTable, COPY_FORMATS, type CopyFormat } from "../../utils/clipboard";
import { popIn } from "../ui/tokens";

interface CopyTableButtonProps {
  parsedData: CleverTapReport[] | null;
  activeColumns: ColumnDef[];
}

const STORAGE_KEY = "ct-preferred-copy-format";

export const CopyTableButton = ({
  parsedData,
  activeColumns,
}: CopyTableButtonProps) => {
  const [status, setStatus] = useState<"idle" | "done" | "error">("idle");
  const [open, setOpen] = useState(false);
  // Remember the last format used — most people copy to the same place daily.
  const [format, setFormat] = useState<CopyFormat>(
    () => (localStorage.getItem(STORAGE_KEY) as CopyFormat) || "rich",
  );
  const wrapRef = useRef<HTMLDivElement>(null);

  const active = COPY_FORMATS.find((f) => f.id === format) ?? COPY_FORMATS[0];
  const disabled = !parsedData?.length || !activeColumns.length;

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const run = async (fmt: CopyFormat) => {
    if (!parsedData) return;
    const ok = await copyTable(fmt, parsedData, activeColumns);
    setStatus(ok ? "done" : "error");
    setTimeout(() => setStatus("idle"), 2200);
  };

  const choose = (fmt: CopyFormat) => {
    setFormat(fmt);
    localStorage.setItem(STORAGE_KEY, fmt);
    setOpen(false);
    run(fmt);
  };

  const label =
    status === "done"
      ? format === "csv"
        ? "Downloaded"
        : "Copied"
      : status === "error"
        ? "Copy failed"
        : `Copy ${active.label.toLowerCase()}`;

  return (
    <div ref={wrapRef} className="relative">
      <div
        className={`flex items-stretch rounded-lg border transition-colors ${
          status === "done"
            ? "border-emerald-500/40 bg-emerald-500/10"
            : "border-zinc-200 bg-zinc-900 dark:border-zinc-700 dark:bg-zinc-100"
        } ${disabled ? "opacity-40 pointer-events-none" : ""}`}
      >
        <button
          onClick={() => run(format)}
          disabled={disabled}
          className={`flex items-center gap-2 px-3.5 py-2 text-[13px] font-medium rounded-l-lg transition-colors ${
            status === "done"
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-white hover:bg-zinc-800 dark:text-zinc-900 dark:hover:bg-white"
          }`}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={status + format}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.12 }}
              className="flex items-center gap-2"
            >
              {status === "done" ? (
                <Check className="w-3.5 h-3.5" />
              ) : format === "csv" ? (
                <Download className="w-3.5 h-3.5" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              {label}
            </motion.span>
          </AnimatePresence>
        </button>

        <div
          className={`w-px my-1.5 ${status === "done" ? "bg-emerald-500/30" : "bg-white/20 dark:bg-zinc-900/20"}`}
        />

        <button
          onClick={() => setOpen((v) => !v)}
          disabled={disabled}
          aria-label="Choose copy format"
          aria-expanded={open}
          className={`px-2 rounded-r-lg transition-colors ${
            status === "done"
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-white hover:bg-zinc-800 dark:text-zinc-900 dark:hover:bg-white"
          }`}
        >
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            {...popIn}
            className="absolute right-0 mt-2 w-72 z-30 origin-top-right rounded-xl border p-1.5 shadow-xl bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800"
          >
            {COPY_FORMATS.map((f) => (
              <button
                key={f.id}
                onClick={() => choose(f.id)}
                className={`w-full text-left px-2.5 py-2 rounded-lg transition-colors ${
                  f.id === format
                    ? "bg-zinc-100 dark:bg-zinc-800"
                    : "hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[13px] font-medium text-zinc-900 dark:text-zinc-100">
                    {f.label}
                  </span>
                  {f.id === format && (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  )}
                </div>
                <p className="text-[11px] mt-0.5 text-zinc-500 dark:text-zinc-500">
                  {f.hint}
                </p>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {f.targets.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] px-1.5 py-0.5 rounded border text-zinc-600 border-zinc-200 bg-zinc-50 dark:text-zinc-400 dark:border-zinc-700/60 dark:bg-zinc-800/60"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
