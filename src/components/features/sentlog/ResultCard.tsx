import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Check, ClipboardCopy } from "lucide-react";
import { formatEntryAsText, type ParsedEntry } from "../../../utils/sentLogParser";

interface ResultCardProps {
  entry: ParsedEntry;
  index: number;
}

export const ResultCard = ({ entry, index }: ResultCardProps) => {
  const text = formatEntryAsText(entry);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard unavailable — ignore
    }
  };

  useEffect(
    () => () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    },
    [],
  );

  // Stagger only the first batch; bulk pastes shouldn't pay for a long cascade.
  const delay = Math.min(index, 6) * 0.04;

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ delay, duration: 0.22, ease: "easeOut" }}
      className="group rounded-xl border overflow-hidden transition-colors border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:border-zinc-700"
    >
      <header className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded border text-[10px] font-medium bg-accent-50 text-accent-700 border-accent-200 dark:bg-accent-500/15 dark:text-accent-300 dark:border-accent-500/30">
            {entry.event || "Unknown"}
          </span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded border text-[10px] font-medium bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700">
            {entry.platformDisplay || "—"}
          </span>
          <span className="text-[11px] text-zinc-500 dark:text-zinc-500 font-mono truncate">
            #{entry.campaignId || "—"} · {entry.dateFormatted}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy this entry"
          title="Copy this entry"
          className="relative shrink-0 flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition-colors text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
        >
          <motion.span
            animate={copied ? { scale: [1, 1.15, 1] } : { scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-1"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3" />
                Copied
              </>
            ) : (
              <>
                <ClipboardCopy className="w-3 h-3" />
                Copy
              </>
            )}
          </motion.span>
        </button>
      </header>

      <pre className="px-4 py-3 text-[12.5px] leading-[1.55] font-mono whitespace-pre-wrap wrap-break-word text-zinc-800 dark:text-zinc-200">
{text}
      </pre>

      {entry.warnings.length > 0 && (
        <div className="mx-4 mb-3 flex items-start gap-2 p-2 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-[11px] dark:bg-amber-500/10 dark:border-amber-500/30 dark:text-amber-300">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-0.5">
            {entry.warnings.map((w, i) => (
              <div key={i}>{w}</div>
            ))}
          </div>
        </div>
      )}
    </motion.article>
  );
};
