import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { tableColumns } from "../config/tableColumns";
import { useJsonParser } from "../hooks/useJsonParser";
import { JsonEditor } from "../components/features/JsonEditor";
import { ColumnSelector } from "../components/features/ColumnSelector";
import { PreviewTable } from "../components/features/PreviewTable";
import { CopyTableButton } from "../components/features/CopyTableButton";

export const JsonFormatter = () => {
  const { jsonInput, setJsonInput, parsedData, error } = useJsonParser();
  const [selectedCols, setSelectedCols] = useState<string[]>(
    tableColumns.map((c) => c.header),
  );

  const activeColumnDefs = useMemo(
    () => tableColumns.filter((col) => selectedCols.includes(col.header)),
    [selectedCols],
  );

  const toggleColumn = (header: string) => {
    setSelectedCols((prev) =>
      prev.includes(header)
        ? prev.filter((c) => c !== header)
        : [...prev, header],
    );
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <CopyTableButton
          parsedData={parsedData}
          activeColumns={activeColumnDefs}
        />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-[450px_1fr] gap-8">
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
      </div>
    </>
  );
};
