import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { tableColumns } from "./config/tableColumns";
import { useJsonParser } from "./hooks/useJsonParser";
import { Header } from "./components/layout/Header";
import { JsonEditor } from "./components/features/JsonEditor";
import { ColumnSelector } from "./components/features/ColumnSelector";
import { PreviewTable } from "./components/features/PreviewTable";

export default function App() {
  const { jsonInput, setJsonInput, parsedData, error } = useJsonParser();
  const [selectedCols, setSelectedCols] = useState<string[]>(
    tableColumns.map((c) => c.header),
  );

  const activeColumnDefs = useMemo(() => {
    return tableColumns.filter((col) => selectedCols.includes(col.header));
  }, [selectedCols]);

  const toggleColumn = (header: string) => {
    setSelectedCols((prev) =>
      prev.includes(header)
        ? prev.filter((c) => c !== header)
        : [...prev, header],
    );
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 font-sans selection:bg-emerald-500/30">
      <Header parsedData={parsedData} activeColumns={activeColumnDefs} />

      <main className="max-w-[1600px] mx-auto p-8 grid grid-cols-1 xl:grid-cols-[450px_1fr] gap-8">
        <JsonEditor
          jsonInput={jsonInput}
          setJsonInput={setJsonInput}
          error={error}
        />

        <motion.section
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-4"
        >
          <ColumnSelector
            allColumns={tableColumns}
            selectedCols={selectedCols}
            toggleColumn={toggleColumn}
          />
          <PreviewTable data={parsedData} activeColumns={activeColumnDefs} />
        </motion.section>
      </main>
    </div>
  );
}
