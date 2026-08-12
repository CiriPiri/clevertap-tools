import type { CleverTapReport } from '../types/clevertap';
import type { ColumnDef } from '../config/tableColumns';

/**
 * Serializers turn parsed rows into the various plain-text shapes different
 * paste targets understand. The rich HTML flavour lives in `clipboard.ts`.
 *
 * These are pure string functions on purpose — they are the "email generation
 * layer" equivalent for text, fully decoupled from the React preview.
 */

/** Flattens a cell to a string. Accessors may return numbers/elements. */
const cellToText = (col: ColumnDef, row: CleverTapReport, index: number): string => {
  const value = col.accessor(row, index);
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  // Anything richer (elements) has no meaningful text form here.
  return '';
};

const buildMatrix = (data: CleverTapReport[], columns: ColumnDef[]): string[][] => [
  columns.map((c) => c.header),
  ...data.map((row, i) => columns.map((col) => cellToText(col, row, i))),
];

/**
 * Monospace box table. This is the flavour that survives Slack, Teams and
 * anywhere else that renders a code block, because alignment is done with
 * real spaces rather than markup.
 */
export const toMonospaceTable = (data: CleverTapReport[], columns: ColumnDef[]): string => {
  const matrix = buildMatrix(data, columns);
  const widths = columns.map((_, colIndex) =>
    Math.max(...matrix.map((row) => row[colIndex].length)),
  );

  const line = (left: string, mid: string, right: string) =>
    left + widths.map((w) => '─'.repeat(w + 2)).join(mid) + right;

  const renderRow = (cells: string[]) =>
    '│ ' + cells.map((cell, i) => cell.padEnd(widths[i])).join(' │ ') + ' │';

  const [header, ...body] = matrix;

  return [
    line('┌', '┬', '┐'),
    renderRow(header),
    line('├', '┼', '┤'),
    ...body.map(renderRow),
    line('└', '┴', '┘'),
  ].join('\n');
};

/** GitHub-flavoured markdown table — for PRs, Notion, docs, Linear. */
export const toMarkdownTable = (data: CleverTapReport[], columns: ColumnDef[]): string => {
  const [header, ...body] = buildMatrix(data, columns);
  // Escape pipes so a value containing "|" cannot break the table structure.
  const escape = (cell: string) => cell.replace(/\|/g, '\\|');

  return [
    `| ${header.map(escape).join(' | ')} |`,
    `| ${header.map(() => '---').join(' | ')} |`,
    ...body.map((row) => `| ${row.map(escape).join(' | ')} |`),
  ].join('\n');
};

/** Tab-separated — pastes into Sheets/Excel as real cells. */
export const toTSV = (data: CleverTapReport[], columns: ColumnDef[]): string =>
  buildMatrix(data, columns)
    .map((row) => row.map((cell) => cell.replace(/\t|\n/g, ' ')).join('\t'))
    .join('\n');

/** RFC 4180 CSV, for download and spreadsheet import. */
export const toCSV = (data: CleverTapReport[], columns: ColumnDef[]): string =>
  buildMatrix(data, columns)
    .map((row) =>
      row
        .map((cell) => (/[",\n]/.test(cell) ? `"${cell.replace(/"/g, '""')}"` : cell))
        .join(','),
    )
    .join('\n');
