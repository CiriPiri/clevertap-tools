import { useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  ClipboardPaste,
  Sparkles,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import type { ParseError } from "../../hooks/useJsonParser";

interface JsonEditorProps {
  jsonInput: string;
  setJsonInput: (val: string) => void;
  error: ParseError | null;
  onFormat: () => void;
  rowCount: number;
}

const ToolbarButton = ({
  onClick,
  icon: Icon,
  children,
  disabled,
}: {
  onClick: () => void;
  icon: typeof Trash2;
  children: React.ReactNode;
  disabled?: boolean;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium transition-colors text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 disabled:opacity-40 disabled:pointer-events-none dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
  >
    <Icon className="w-3 h-3" />
    {children}
  </button>
);

export const JsonEditor = ({
  jsonInput,
  setJsonInput,
  error,
  onFormat,
  rowCount,
}: JsonEditorProps) => {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  const lineCount = useMemo(
    () => Math.max(jsonInput.split("\n").length, 1),
    [jsonInput],
  );

  const handlePaste = async () => {
    try {
      setJsonInput(await navigator.clipboard.readText());
    } catch {
      taRef.current?.focus();
    }
  };

  // Keep the gutter locked to the textarea's scroll offset.
  const syncScroll = () => {
    if (gutterRef.current && taRef.current) {
      gutterRef.current.scrollTop = taRef.current.scrollTop;
    }
  };

  const isValid = jsonInput.trim() && !error;

  return (
    <section className="flex flex-col min-h-0">
      <div className="flex items-center justify-between mb-2.5 h-6">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-500">
            Payload
          </span>
          {isValid && (
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400"
            >
              <CheckCircle2 className="w-3 h-3" />
              {rowCount} {rowCount === 1 ? "record" : "records"}
            </motion.span>
          )}
        </div>

        <div className="flex items-center gap-0.5">
          <ToolbarButton onClick={handlePaste} icon={ClipboardPaste}>
            Paste
          </ToolbarButton>
          <ToolbarButton
            onClick={onFormat}
            icon={Sparkles}
            disabled={!isValid}
          >
            Format
          </ToolbarButton>
          <ToolbarButton
            onClick={() => setJsonInput("")}
            icon={Trash2}
            disabled={!jsonInput}
          >
            Clear
          </ToolbarButton>
        </div>
      </div>

      <div
        className={`relative flex-1 min-h-0 rounded-xl border overflow-hidden transition-colors bg-white dark:bg-zinc-900/40 ${
          error
            ? "border-rose-300 dark:border-rose-500/40"
            : "border-zinc-200 focus-within:border-zinc-400 dark:border-zinc-800 dark:focus-within:border-zinc-600"
        }`}
      >
        <div className="absolute inset-0 flex">
          {/* Line-number gutter */}
          <div
            ref={gutterRef}
            aria-hidden
            className="shrink-0 w-11 overflow-hidden py-4 text-right select-none border-r bg-zinc-50 border-zinc-100 dark:bg-zinc-900/60 dark:border-zinc-800/70"
          >
            {Array.from({ length: lineCount }, (_, i) => (
              <div
                key={i}
                className={`px-2 text-[11px] leading-[21px] font-mono tabular-nums ${
                  error?.line === i + 1
                    ? "text-rose-500 font-semibold"
                    : "text-zinc-400 dark:text-zinc-600"
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>

          <textarea
            ref={taRef}
            onScroll={syncScroll}
            className="flex-1 h-full py-4 px-3 text-[12.5px] leading-[21px] font-mono resize-none outline-none bg-transparent text-zinc-800 placeholder:text-zinc-300 dark:text-zinc-300 dark:placeholder:text-zinc-700"
            placeholder={
              '[\n  {\n    "_id": 1719992868199,\n    "f": "Campaign report",\n    "campaigninfo": { ... }\n  }\n]'
            }
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            spellCheck={false}
          />
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-2.5 text-[12px] px-3 py-2 rounded-lg flex items-start gap-2 border bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-500/10 dark:border-rose-500/25 dark:text-rose-400">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <p className="font-mono">{error.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
