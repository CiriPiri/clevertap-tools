import { motion, AnimatePresence } from "framer-motion";
import { Database } from "lucide-react";
import type { CleverTapReport } from "../../types/clevertap";
import type { ColumnDef } from "../../config/tableColumns";

interface PreviewTableProps {
  data: CleverTapReport[] | null;
  activeColumns: ColumnDef[];
}

export const PreviewTable = ({ data, activeColumns }: PreviewTableProps) => (
  <div className="rounded-2xl overflow-hidden shadow-sm relative min-h-[calc(100vh-250px)] border bg-white border-zinc-200 dark:bg-zinc-900/30 dark:border-zinc-800/50 dark:shadow-2xl">
    <AnimatePresence mode="wait">
      {!data ? (
        <motion.div
          key="empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 flex flex-col items-center justify-center gap-5 text-zinc-500 dark:text-zinc-600"
        >
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center border bg-zinc-100 border-zinc-200 dark:bg-zinc-800/50 dark:border-zinc-700/50">
            <Database className="w-8 h-8 text-zinc-400 dark:text-zinc-500" />
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
              <tr className="border-b border-zinc-200 dark:border-zinc-800/80">
                {activeColumns.map((col, i) => (
                  <th
                    key={i}
                    className="py-4 px-6 text-xs font-semibold uppercase tracking-wider whitespace-nowrap text-zinc-500 dark:text-zinc-500"
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
                  className="border-b transition-colors group border-zinc-100 hover:bg-zinc-50 dark:border-zinc-800/30 dark:hover:bg-zinc-800/20"
                >
                  {activeColumns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className="py-4 px-6 whitespace-nowrap transition-colors text-zinc-700 group-hover:text-zinc-900 dark:text-zinc-300 dark:group-hover:text-zinc-100"
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
