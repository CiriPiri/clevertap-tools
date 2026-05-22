import { Columns } from "lucide-react";
import type { ColumnDef } from "../../config/tableColumns";

interface ColumnSelectorProps {
  allColumns: ColumnDef[];
  selectedCols: string[];
  toggleColumn: (header: string) => void;
}

export const ColumnSelector = ({
  allColumns,
  selectedCols,
  toggleColumn,
}: ColumnSelectorProps) => (
  <div className="flex flex-col gap-3 mb-2">
    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-500">
      <Columns className="w-4 h-4" /> Column Configurator
    </div>
    <div className="flex flex-wrap gap-2">
      {allColumns.map((col) => {
        const isActive = selectedCols.includes(col.header);
        return (
          <button
            key={col.header}
            onClick={() => toggleColumn(col.header)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-200 border ${
              isActive
                ? "bg-indigo-100 text-indigo-700 border-indigo-200 hover:bg-indigo-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30 dark:hover:bg-emerald-500/20"
                : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-100 hover:text-zinc-900 dark:bg-zinc-800/30 dark:text-zinc-500 dark:border-zinc-700/50 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
            }`}
          >
            {col.header}
          </button>
        );
      })}
    </div>
  </div>
);
