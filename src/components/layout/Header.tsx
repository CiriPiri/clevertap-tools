import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Database, ClipboardCopy, CheckCircle2 } from "lucide-react";
import type { CleverTapReport } from "../../types/clevertap";
import type { ColumnDef } from "../../config/tableColumns";
import { copyRichTableToClipboard } from "../../utils/clipboard";

interface HeaderProps {
  parsedData: CleverTapReport[] | null;
  activeColumns: ColumnDef[];
}

export const Header = ({ parsedData, activeColumns }: HeaderProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!parsedData) return;
    await copyRichTableToClipboard(parsedData, activeColumns);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-10 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 px-8 py-5 flex justify-between items-center"
    >
      <div className="flex items-center gap-3">
        <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
          <Database className="text-emerald-400 w-5 h-5" />
        </div>
        <h1 className="text-lg font-semibold text-zinc-100 tracking-tight">
          CleverTap{" "}
          <span className="text-zinc-500 font-normal">JSON Formatter</span>
        </h1>
      </div>

      <AnimatePresence mode="wait">
        {parsedData && (
          <motion.button
            key={copied ? "copied" : "copy"}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={handleCopy}
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-full transition-all duration-300 ${
              copied
                ? "bg-emerald-500 text-zinc-950 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                : "bg-zinc-100 text-zinc-900 hover:bg-white hover:scale-105 shadow-sm"
            }`}
          >
            {copied ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <ClipboardCopy className="w-4 h-4" />
            )}
            {copied ? "Copied to Clipboard" : "Copy Email Table"}
          </motion.button>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
