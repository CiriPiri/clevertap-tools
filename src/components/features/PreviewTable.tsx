import { motion, AnimatePresence } from "framer-motion";
import { Table2 } from "lucide-react";
import type { CleverTapReport } from "../../types/clevertap";
import type { ColumnDef } from "../../config/tableColumns";

interface PreviewTableProps {
  data: CleverTapReport[] | null;
  activeColumns: ColumnDef[];
  /** Raw text preview (slack/markdown flavours) — shown instead of the grid. */
  textPreview?: string | null;
}

const EmptyState = () => (
  <motion.div
    key="empty"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center"
  >
    <div className="w-11 h-11 rounded-xl flex items-center justify-center border bg-zinc-50 border-zinc-200 dark:bg-zinc-800/40 dark:border-zinc-700/50">
      <Table2 className="w-5 h-5 text-zinc-400 dark:text-zinc-600" />
    </div>
    <div>
      <p className="text-[13px] font-medium text-zinc-700 dark:text-zinc-300">
        No table yet
      </p>
      <p className="text-[12px] mt-0.5 text-zinc-500 dark:text-zinc-600">
        Paste a CleverTap JSON payload to build one.
      </p>
    </div>
  </motion.div>
);

export const PreviewTable = ({
  data,
  activeColumns,
  textPreview,
}: PreviewTableProps) => (
  <div className="relative flex-1 min-h-0 rounded-xl border overflow-hidden bg-white border-zinc-200 dark:bg-zinc-900/40 dark:border-zinc-800">
    <AnimatePresence mode="wait">
      {!data || !data.length ? (
        <EmptyState />
      ) : textPreview ? (
        <motion.pre
          key="text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 overflow-auto p-4 text-[12px] leading-[1.6] font-mono whitespace-pre text-zinc-700 dark:text-zinc-300"
        >
          {textPreview}
        </motion.pre>
      ) : (
        <motion.div
          key="grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 overflow-auto"
        >
          <table className="w-full text-left border-collapse text-[13px]">
            <thead className="sticky top-0 z-10">
              <tr className="bg-zinc-50/95 backdrop-blur dark:bg-zinc-900/95">
                {activeColumns.map((col) => (
                  <th
                    key={col.header}
                    className="py-2.5 px-4 text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap border-b text-zinc-500 border-zinc-200 dark:text-zinc-500 dark:border-zinc-800"
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr
                  key={row._id ?? rowIndex}
                  className="border-b transition-colors border-zinc-100 hover:bg-zinc-50 dark:border-zinc-800/50 dark:hover:bg-zinc-800/30"
                >
                  {activeColumns.map((col) => (
                    <td
                      key={col.header}
                      className="py-2.5 px-4 whitespace-nowrap text-zinc-700 dark:text-zinc-300"
                    >
                      {col.accessor(row, rowIndex)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);
