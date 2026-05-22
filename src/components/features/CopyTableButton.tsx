import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardCopy, CheckCircle2 } from "lucide-react";
import type { CleverTapReport } from "../../types/clevertap";
import type { ColumnDef } from "../../config/tableColumns";
import { copyRichTableToClipboard } from "../../utils/clipboard";

interface CopyTableButtonProps {
  parsedData: CleverTapReport[] | null;
  activeColumns: ColumnDef[];
}

export const CopyTableButton = ({
  parsedData,
  activeColumns,
}: CopyTableButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!parsedData) return;
    await copyRichTableToClipboard(parsedData, activeColumns);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
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
              ? "bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] dark:text-zinc-950"
              : "bg-zinc-900 text-white hover:bg-zinc-800 hover:scale-105 shadow-sm dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
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
  );
};
