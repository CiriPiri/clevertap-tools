import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Check,
  ClipboardCopy,
  ClipboardPaste,
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
import {
  Badge,
  Button,
  EmptyState,
  ErrorNote,
  Label,
  PageHeader,
} from "../components/ui";
import { fadeIn, riseIn } from "../components/ui/tokens";

export const SentLogDecoder = () => {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  const { entries, error } = useMemo(() => parseSentLog(input), [input]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setInput(text);
    } catch {
      /* permission denied */
    }
  };

  const handleCopyAll = async () => {
    if (!entries.length) return;
    try {
      await navigator.clipboard.writeText(formatAllEntriesAsText(entries));
      setCopied(true);
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="flex flex-col">
      <PageHeader
        title="SentLog Decoder"
        description="Paste raw CleverTap notification-sent log JSON. Every entry is parsed, validated, and rendered as plain text you can copy anywhere."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Input */}
        <section className="flex flex-col">
          <div className="flex items-center justify-between gap-2 mb-2.5 h-7">
            <Label>Raw log JSON</Label>
            <div className="flex items-center gap-0.5">
              <Button size="sm" variant="ghost" icon={ClipboardPaste} onClick={handlePaste}>
                Paste
              </Button>
              <Button
                size="sm"
                variant="ghost"
                icon={Sparkles}
                onClick={() => setInput(SAMPLE_INPUT)}
              >
                Sample
              </Button>
              <Button
                size="sm"
                variant="ghost"
                icon={Trash2}
                disabled={!input}
                onClick={() => setInput("")}
              >
                Clear
              </Button>
            </div>
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            placeholder={`{\n  "20260521|NotificationSent|1762858086|ios": [\n    "\\u001e9006676\\u001e1261\\u001e10\\u001eVariant B"\n  ]\n}`}
            className={`w-full min-h-100 lg:min-h-140 resize-y rounded-xl border p-4 text-[12.5px] font-mono leading-[1.6] outline-none transition-colors bg-white text-zinc-800 placeholder:text-zinc-300 dark:bg-zinc-900/40 dark:text-zinc-200 dark:placeholder:text-zinc-700 ${
              error
                ? "border-rose-300 dark:border-rose-500/40"
                : "border-zinc-200 focus:border-zinc-400 dark:border-zinc-800 dark:focus:border-zinc-600"
            }`}
          />

          <div className="mt-3">
            <FieldGuide />
          </div>
        </section>

        {/* Output */}
        <section className="flex flex-col min-w-0">
          <div className="flex items-center justify-between gap-2 mb-2.5 h-7">
            <div className="flex items-center gap-2">
              <Label>Decoded output</Label>
              <AnimatePresence>
                {entries.length > 0 && (
                  <motion.span {...fadeIn} key={entries.length}>
                    <Badge tone="accent">
                      {entries.length}{" "}
                      {entries.length === 1 ? "entry" : "entries"}
                    </Badge>
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            {entries.length > 0 && (
              <Button
                size="sm"
                variant={copied ? "secondary" : "primary"}
                icon={copied ? Check : ClipboardCopy}
                onClick={handleCopyAll}
                className={copied ? "text-emerald-600 dark:text-emerald-400" : ""}
              >
                {copied ? "Copied" : "Copy all"}
              </Button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {error ? (
              <motion.div key="error" {...riseIn}>
                <ErrorNote
                  icon={AlertCircle}
                  title="Could not parse input"
                  detail={error}
                />
              </motion.div>
            ) : entries.length === 0 ? (
              <motion.div
                key="empty"
                {...fadeIn}
                className="rounded-xl border border-dashed bg-white/40 border-zinc-300 dark:bg-zinc-900/20 dark:border-zinc-800"
              >
                <EmptyState
                  icon={Inbox}
                  title="Nothing decoded yet"
                  body={
                    <>
                      Paste a notification log on the left, or load the{" "}
                      <span className="font-medium text-zinc-700 dark:text-zinc-300">
                        sample
                      </span>{" "}
                      to see how it works.
                    </>
                  }
                />
              </motion.div>
            ) : (
              <motion.div key="results" {...fadeIn} className="flex flex-col gap-3">
                {entries.map((entry, i) => (
                  <ResultCard key={i} entry={entry} index={i} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
};
