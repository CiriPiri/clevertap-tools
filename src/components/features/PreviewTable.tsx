import { motion, AnimatePresence } from "framer-motion";
import { Database } from "lucide-react";
import type { CleverTapReport } from "../../types/clevertap";
import type { ColumnDef } from "../../config/tableColumns";

interface PreviewTableProps {
  data: CleverTapReport[] | null;
  activeColumns: ColumnDef[];
}

export const PreviewTable = ({ data, activeColumns }: PreviewTableProps) => (
  <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl overflow-hidden shadow-2xl relative min-h-[calc(100vh-250px)]">
    <AnimatePresence mode="wait">
      {!data ? (
        <motion.div
          key="empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 flex flex-col items-center justify-center text-zinc-600 gap-5"
        >
          <div className="w-16 h-16 rounded-2xl bg-zinc-800/50 flex items-center justify-center border border-zinc-700/50">
            <Database className="w-8 h-8 text-zinc-500" />
          </div>
          <p className="text-sm font-medium">Awaiting valid JSON array</p>
        </motion.div>
      ) : (
        <motion.div
          key="table"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="overflow-x-auto p-1"
        >
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-zinc-800/80">
                {activeColumns.map((col, i) => (
                  <th
                    key={i}
                    className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-zinc-500 whitespace-nowrap"
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <motion.tr
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: rowIndex * 0.05 }}
                  key={row._id}
                  className="border-b border-zinc-800/30 hover:bg-zinc-800/20 transition-colors group"
                >
                  {activeColumns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className="py-4 px-6 whitespace-nowrap text-zinc-300 group-hover:text-zinc-100 transition-colors"
                    >
                      {col.accessor(row, rowIndex)}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);
