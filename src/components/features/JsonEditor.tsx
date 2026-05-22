import { motion, AnimatePresence } from "framer-motion";
import { FileJson, AlertCircle } from "lucide-react";

interface JsonEditorProps {
  jsonInput: string;
  setJsonInput: (val: string) => void;
  error: string | null;
}

export const JsonEditor = ({
  jsonInput,
  setJsonInput,
  error,
}: JsonEditorProps) => (
  <motion.section
    initial={{ x: -20, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ delay: 0.1 }}
    className="flex flex-col gap-4 h-[calc(100vh-140px)]"
  >
    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-500">
      <FileJson className="w-4 h-4" /> Raw Payload
    </div>

    <div className="relative flex-1 group">
      <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-linear-to-b from-indigo-200/40 to-transparent dark:from-emerald-500/5" />
      <textarea
        className="absolute inset-0 w-full h-full rounded-2xl p-6 text-sm font-mono resize-none outline-none transition-all border shadow-inner bg-white border-zinc-200 text-zinc-800 placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 dark:bg-zinc-900/50 dark:backdrop-blur-sm dark:border-zinc-800 dark:text-zinc-300 dark:placeholder:text-zinc-700 dark:focus:border-emerald-500/50 dark:focus:ring-emerald-500/50"
        placeholder={`[\n  {\n    '_id': 1719992868199,\n    'campaigninfo': { ... }\n  }\n]`}
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        spellCheck={false}
      />
    </div>

    <AnimatePresence>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -10, height: 0 }}
          className="text-sm p-4 rounded-xl flex items-center gap-3 border bg-rose-50 border-rose-200 text-rose-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.section>
);
