import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Check,
  ClipboardCopy,
  ClipboardPaste,
  FileSearch,
  Inbox,
  Sparkles,
  Trash2,
} from "lucide-react";
import {
  SAMPLE_INPUT,
  formatAllEntriesAsText,
  parseSentLog,
} from "../utils/sentLogParser";
import { ResultCard } from "../components/features/sentlog/ResultCard";
import { FieldGuide } from "../components/features/sentlog/FieldGuide";

export const SentLogDecoder = () => {
  const [input, setInput] = useState("");
  const [showSparkles, setShowSparkles] = useState(false);
  const [copyAllState, setCopyAllState] = useState<"idle" | "copied">("idle");
  const copyAllTimer = useRef<number | null>(null);
  const lastEntryCountRef = useRef(0);

  const { entries, error } = useMemo(() => parseSentLog(input), [input]);

  // Fire a quick sparkle burst when a new successful parse appears.
  useEffect(() => {
    const prev = lastEntryCountRef.current;
    lastEntryCountRef.current = entries.length;
    if (!error && entries.length > 0 && entries.length !== prev) {
      setShowSparkles(true);
      const id = window.setTimeout(() => setShowSparkles(false), 900);
      return () => window.clearTimeout(id);
    }
  }, [entries.length, error]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setInput(text);
    } catch {
      // permission denied — ignore
    }
  };

  const handleCopyAll = async () => {
    if (entries.length === 0) return;
    try {
      await navigator.clipboard.writeText(formatAllEntriesAsText(entries));
      setCopyAllState("copied");
      if (copyAllTimer.current) window.clearTimeout(copyAllTimer.current);
      copyAllTimer.current = window.setTimeout(
        () => setCopyAllState("idle"),
        1800,
      );
    } catch {
      // ignore
    }
  };

  useEffect(
    () => () => {
      if (copyAllTimer.current) window.clearTimeout(copyAllTimer.current);
    },
    [],
  );

  return (
    <div className="flex flex-col gap-6">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col gap-2"
      >
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
          <FileSearch className="w-4 h-4" /> SentLog Decoder
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          Decode CleverTap notification logs into readable summaries
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl">
          Paste raw log JSON below. Every entry is parsed, validated, and
          rendered as plain text you can copy anywhere.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InputColumn
          input={input}
          setInput={setInput}
          onPaste={handlePaste}
          onSample={() => setInput(SAMPLE_INPUT)}
          onClear={() => setInput("")}
        />

        <ResultsColumn
          entries={entries}
          error={error}
          showSparkles={showSparkles}
          copyAllState={copyAllState}
          onCopyAll={handleCopyAll}
        />
      </div>
    </div>
  );
};

interface InputColumnProps {
  input: string;
  setInput: (v: string) => void;
  onPaste: () => void;
  onSample: () => void;
  onClear: () => void;
}
const InputColumn = ({
  input,
  setInput,
  onPaste,
  onSample,
  onClear,
}: InputColumnProps) => (
  <motion.section
    initial={{ x: -20, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ delay: 0.1 }}
    className="flex flex-col gap-3"
  >
    <div className="flex items-center justify-between flex-wrap gap-2">
      <div className="text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
        Raw log JSON
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPaste}
          aria-label="Paste from clipboard"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-zinc-200 text-zinc-700 hover:border-indigo-400 hover:text-indigo-600 dark:bg-zinc-900/60 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-indigo-400 dark:hover:text-indigo-300 transition-colors"
        >
          <ClipboardPaste className="w-3.5 h-3.5" /> Paste
        </button>
        <button
          type="button"
          onClick={onSample}
          aria-label="Load sample input"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-zinc-200 text-zinc-700 hover:border-indigo-400 hover:text-indigo-600 dark:bg-zinc-900/60 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-indigo-400 dark:hover:text-indigo-300 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" /> Load sample
        </button>
        <button
          type="button"
          onClick={onClear}
          disabled={input === ""}
          aria-label="Clear input"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-zinc-200 text-zinc-700 hover:border-rose-400 hover:text-rose-600 disabled:opacity-40 disabled:hover:border-zinc-200 disabled:hover:text-zinc-700 dark:bg-zinc-900/60 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-rose-400 dark:hover:text-rose-300 dark:disabled:hover:border-zinc-700 dark:disabled:hover:text-zinc-300 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear
        </button>
      </div>
    </div>

    <textarea
      value={input}
      onChange={(e) => setInput(e.target.value)}
      spellCheck={false}
      placeholder={`{
  "20260521|NotificationSent|1762858086|ios": [
    "\\u001e9006676\\u001e9006676\\u001e1261\\u001e10\\u001eVariant B\\u001e\\u001e-1\\u001e"
  ]
}`}
      className="w-full min-h-115 lg:min-h-160 resize-y rounded-2xl border border-zinc-200 bg-white p-5 text-[13px] font-mono leading-relaxed text-zinc-800 placeholder:text-zinc-400 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 outline-none transition-colors dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-200 dark:placeholder:text-zinc-600 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/20"
    />

    <FieldGuide />
  </motion.section>
);

interface ResultsColumnProps {
  entries: ReturnType<typeof parseSentLog>["entries"];
  error: string | null;
  showSparkles: boolean;
  copyAllState: "idle" | "copied";
  onCopyAll: () => void;
}
const ResultsColumn = ({
  entries,
  error,
  showSparkles,
  copyAllState,
  onCopyAll,
}: ResultsColumnProps) => (
  <motion.section
    initial={{ x: 20, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ delay: 0.15 }}
    className="flex flex-col gap-3 min-w-0"
  >
    <div className="flex items-center justify-between gap-3 flex-wrap">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
        <span>Decoded output</span>
        <AnimatePresence>
          {entries.length > 0 && (
            <motion.span
              key={entries.length}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] dark:bg-indigo-500/15 dark:text-indigo-300"
            >
              {entries.length} {entries.length === 1 ? "entry" : "entries"}
            </motion.span>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showSparkles && (
            <motion.span
              initial={{ opacity: 0, scale: 0.7, rotate: -20 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.7, rotate: 20 }}
              transition={{ duration: 0.35 }}
              className="text-indigo-500 dark:text-indigo-300"
              aria-hidden
            >
              <Sparkles className="w-3.5 h-3.5" />
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {entries.length > 0 && (
        <button
          type="button"
          onClick={onCopyAll}
          aria-label="Copy all entries"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm transition-colors"
        >
          {copyAllState === "copied" ? (
            <>
              <Check className="w-3.5 h-3.5" /> Copied all
            </>
          ) : (
            <>
              <ClipboardCopy className="w-3.5 h-3.5" /> Copy all
            </>
          )}
        </button>
      )}
    </div>

    <AnimatePresence mode="wait">
      {error ? (
        <motion.div
          key="error"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex items-start gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm dark:bg-rose-500/10 dark:border-rose-500/30 dark:text-rose-300"
        >
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <div className="font-medium">Could not parse input</div>
            <div className="text-xs opacity-90">{error}</div>
          </div>
        </motion.div>
      ) : entries.length === 0 ? (
        <EmptyState key="empty" />
      ) : (
        <motion.div
          key="results"
          layout
          className="flex flex-col gap-4"
        >
          {entries.map((entry, i) => (
            <ResultCard key={i} entry={entry} index={i} />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  </motion.section>
);

const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex flex-col items-center justify-center text-center gap-3 py-16 px-6 rounded-2xl border border-dashed border-zinc-300 bg-white/50 dark:border-zinc-800 dark:bg-zinc-900/30"
  >
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      className="p-3 rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300"
    >
      <Inbox className="w-6 h-6" />
    </motion.div>
    <div className="flex flex-col gap-1">
      <div className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
        Nothing decoded yet
      </div>
      <div className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm">
        Paste a CleverTap notification log on the left, or click{" "}
        <span className="font-medium">Load sample</span> to see how it works.
      </div>
    </div>
  </motion.div>
);
