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
    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">
      <Columns className="w-4 h-4" /> Column Configurator
    </div>
    <div className="flex flex-wrap gap-2">
      {allColumns.map((col) => {
        const isActive = selectedCols.includes(col.header);
        return (
          <button
            key={col.header}
            onClick={() => toggleColumn(col.header)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
              isActive
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                : "bg-zinc-800/30 text-zinc-500 border-zinc-700/50 hover:bg-zinc-800 hover:text-zinc-300"
            }`}
          >
            {col.header}
          </button>
        );
      })}
    </div>
  </div>
);
