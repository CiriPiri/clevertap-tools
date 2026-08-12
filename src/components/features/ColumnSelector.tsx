import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, Columns3, ArrowUp, ArrowDown } from "lucide-react";
import type { ColumnDef } from "../../config/tableColumns";
import { popIn } from "../ui/tokens";

interface ColumnSelectorProps {
  allColumns: ColumnDef[];
  /** Ordered list of active headers — order drives the rendered table. */
  order: string[];
  selectedCols: string[];
  toggleColumn: (header: string) => void;
  moveColumn: (header: string, direction: -1 | 1) => void;
  setAll: (on: boolean) => void;
}

export const ColumnSelector = ({
  allColumns,
  order,
  selectedCols,
  toggleColumn,
  moveColumn,
  setAll,
}: ColumnSelectorProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border text-[13px] font-medium transition-colors bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800/60"
      >
        <Columns3 className="w-3.5 h-3.5" />
        Columns
        <span className="text-[11px] tabular-nums text-zinc-500 dark:text-zinc-500">
          {selectedCols.length}/{allColumns.length}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            {...popIn}
            className="absolute left-0 mt-2 w-64 z-30 origin-top-left rounded-xl border shadow-xl overflow-hidden bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800"
          >
            <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                Columns & order
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => setAll(true)}
                  className="text-[11px] font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                >
                  All
                </button>
                <span className="text-zinc-300 dark:text-zinc-700">·</span>
                <button
                  onClick={() => setAll(false)}
                  className="text-[11px] font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                >
                  None
                </button>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto p-1">
              {order.map((header, i) => {
                const isActive = selectedCols.includes(header);
                return (
                  <div
                    key={header}
                    className="group flex items-center gap-1 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
                  >
                    <button
                      onClick={() => toggleColumn(header)}
                      className="flex flex-1 items-center gap-2.5 px-2 py-1.5 text-left min-w-0"
                    >
                      <span
                        className={`w-3.5 h-3.5 rounded flex items-center justify-center border shrink-0 transition-colors ${
                          isActive
                            ? "bg-zinc-900 border-zinc-900 dark:bg-zinc-100 dark:border-zinc-100"
                            : "border-zinc-300 dark:border-zinc-600"
                        }`}
                      >
                        {isActive && (
                          <Check className="w-2.5 h-2.5 text-white dark:text-zinc-900" />
                        )}
                      </span>
                      <span
                        className={`text-[13px] truncate ${
                          isActive
                            ? "text-zinc-900 dark:text-zinc-100"
                            : "text-zinc-400 dark:text-zinc-600"
                        }`}
                      >
                        {header}
                      </span>
                    </button>

                    <div className="flex opacity-0 group-hover:opacity-100 transition-opacity pr-1">
                      <button
                        onClick={() => moveColumn(header, -1)}
                        disabled={i === 0}
                        aria-label={`Move ${header} up`}
                        className="p-1 rounded text-zinc-400 hover:text-zinc-900 disabled:opacity-20 disabled:pointer-events-none dark:hover:text-zinc-100"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => moveColumn(header, 1)}
                        disabled={i === order.length - 1}
                        aria-label={`Move ${header} down`}
                        className="p-1 rounded text-zinc-400 hover:text-zinc-900 disabled:opacity-20 disabled:pointer-events-none dark:hover:text-zinc-100"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
