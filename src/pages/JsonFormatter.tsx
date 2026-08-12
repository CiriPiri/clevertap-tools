import { useState, useMemo } from "react";
import { tableColumns } from "../config/tableColumns";
import { useJsonParser } from "../hooks/useJsonParser";
import { JsonEditor } from "../components/features/JsonEditor";
import { ColumnSelector } from "../components/features/ColumnSelector";
import { PreviewTable } from "../components/features/PreviewTable";
import { CopyTableButton } from "../components/features/CopyTableButton";
import {
  toMonospaceTable,
  toMarkdownTable,
} from "../utils/tableSerializers";
import { PageHeader } from "../components/ui";

type PreviewMode = "table" | "slack" | "markdown";

const PREVIEW_TABS: { id: PreviewMode; label: string }[] = [
  { id: "table", label: "Table" },
  { id: "slack", label: "Slack" },
  { id: "markdown", label: "Markdown" },
];

export const JsonFormatter = () => {
  const { jsonInput, setJsonInput, parsedData, error, formatJson, rowCount } =
    useJsonParser();

  // `order` owns column sequence; `selected` owns visibility. Keeping them
  // separate lets a hidden column keep its position when re-enabled.
  const [order, setOrder] = useState<string[]>(
    tableColumns.map((c) => c.header),
  );
  const [selected, setSelected] = useState<string[]>(
    tableColumns.map((c) => c.header),
  );
  const [mode, setMode] = useState<PreviewMode>("table");

  const activeColumnDefs = useMemo(
    () =>
      order
        .filter((h) => selected.includes(h))
        .map((h) => tableColumns.find((c) => c.header === h)!)
        .filter(Boolean),
    [order, selected],
  );

  const toggleColumn = (header: string) =>
    setSelected((prev) =>
      prev.includes(header)
        ? prev.filter((c) => c !== header)
        : [...prev, header],
    );

  const moveColumn = (header: string, direction: -1 | 1) =>
    setOrder((prev) => {
      const i = prev.indexOf(header);
      const j = i + direction;
      if (i < 0 || j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const setAll = (on: boolean) =>
    setSelected(on ? tableColumns.map((c) => c.header) : []);

  // The text preview mirrors exactly what the clipboard will receive.
  const textPreview = useMemo(() => {
    if (!parsedData?.length || !activeColumnDefs.length || mode === "table")
      return null;
    return mode === "slack"
      ? "```\n" + toMonospaceTable(parsedData, activeColumnDefs) + "\n```"
      : toMarkdownTable(parsedData, activeColumnDefs);
  }, [parsedData, activeColumnDefs, mode]);

  return (
    <div className="flex flex-col h-[calc(100vh-190px)] min-h-130">
      <PageHeader
        title="JSON Formatter"
        description="Paste a CleverTap export payload and copy it as a formatted table — styled for email, monospaced for Slack, or markdown for docs."
      />

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(340px,420px)_1fr] gap-5 flex-1 min-h-0">
        <JsonEditor
          jsonInput={jsonInput}
          setJsonInput={setJsonInput}
          error={error}
          onFormat={formatJson}
          rowCount={rowCount}
        />

        <section className="flex flex-col min-h-0">
          <div className="flex items-center justify-between gap-3 mb-2.5 flex-wrap">
            <div className="flex items-center gap-2">
              <ColumnSelector
                allColumns={tableColumns}
                order={order}
                selectedCols={selected}
                toggleColumn={toggleColumn}
                moveColumn={moveColumn}
                setAll={setAll}
              />

              {/* Preview flavour switcher */}
              <div className="flex items-center p-0.5 rounded-lg border bg-zinc-100/70 border-zinc-200 dark:bg-zinc-800/50 dark:border-zinc-800">
                {PREVIEW_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setMode(tab.id)}
                    className={`px-2.5 py-1 rounded-md text-[12px] font-medium transition-colors ${
                      mode === tab.id
                        ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-zinc-100"
                        : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <CopyTableButton
              parsedData={parsedData}
              activeColumns={activeColumnDefs}
            />
          </div>

          <PreviewTable
            data={parsedData}
            activeColumns={activeColumnDefs}
            textPreview={textPreview}
          />
        </section>
      </div>
    </div>
  );
};
