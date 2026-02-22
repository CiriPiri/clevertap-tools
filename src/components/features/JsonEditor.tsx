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
    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">
      <FileJson className="w-4 h-4" /> Raw Payload
    </div>

    <div className="relative flex-1 group">
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <textarea
        className="absolute inset-0 w-full h-full bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 text-sm font-mono text-zinc-300 placeholder:text-zinc-700 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 outline-none resize-none transition-all shadow-inner"
        placeholder="[\n  {\n    '_id': 1719992868199,\n    'campaigninfo': { ... }\n  }\n]"
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
          className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-xl flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.section>
);
