import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { CleverTapReport } from '../types/clevertap';
import type { ColumnDef } from '../config/tableColumns';
import {
  toMonospaceTable,
  toMarkdownTable,
  toTSV,
  toCSV,
} from './tableSerializers';

export type CopyFormat = 'rich' | 'slack' | 'markdown' | 'sheets' | 'csv';

export interface CopyFormatMeta {
  id: CopyFormat;
  label: string;
  hint: string;
  /** Where this flavour is known to paste cleanly. */
  targets: string[];
}

export const COPY_FORMATS: CopyFormatMeta[] = [
  {
    id: 'rich',
    label: 'Rich table',
    hint: 'Styled HTML with inline CSS',
    targets: ['Gmail', 'Outlook', 'Docs', 'Notion'],
  },
  {
    id: 'slack',
    label: 'Slack block',
    hint: 'Monospace, wrapped in a code fence',
    targets: ['Slack', 'Teams', 'Discord'],
  },
  {
    id: 'markdown',
    label: 'Markdown',
    hint: 'GitHub-flavoured pipe table',
    targets: ['GitHub', 'Linear', 'Notion'],
  },
  {
    id: 'sheets',
    label: 'Spreadsheet',
    hint: 'Tab-separated, lands in real cells',
    targets: ['Sheets', 'Excel'],
  },
  {
    id: 'csv',
    label: 'CSV file',
    hint: 'Downloads a .csv',
    targets: ['Download'],
  },
];

/* ------------------------------------------------------------------ */
/* Email HTML                                                          */
/* ------------------------------------------------------------------ */

/**
 * Email clients are far stricter than browsers. Two rules drive this markup:
 *  1. Outlook renders through Word, which ignores `border-collapse`. We set the
 *     `border`/`cellspacing`/`cellpadding` *attributes* so borders survive.
 *  2. Every style must be inline — no classes, no <style> block.
 */
const EmailTable = ({
  data,
  columns,
}: {
  data: CleverTapReport[];
  columns: ColumnDef[];
}) =>
  createElement(
    'table',
    {
      cellPadding: 0,
      cellSpacing: 0,
      border: 0,
      role: 'presentation',
      style: {
        borderCollapse: 'collapse',
        fontFamily:
          "-apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        fontSize: '13px',
        lineHeight: '1.45',
        border: '1px solid #e4e7ec',
        borderRadius: '6px',
      },
    },
    createElement(
      'thead',
      null,
      createElement(
        'tr',
        { style: { backgroundColor: '#18181b' } },
        columns.map((col) =>
          createElement(
            'th',
            {
              key: col.header,
              style: {
                padding: '10px 14px',
                textAlign: 'left',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '11px',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                borderRight: '1px solid #2e2e38',
                whiteSpace: 'nowrap',
              },
            },
            col.header,
          ),
        ),
      ),
    ),
    createElement(
      'tbody',
      null,
      data.map((row, i) =>
        createElement(
          'tr',
          {
            key: row._id || i,
            style: {
              backgroundColor: i % 2 === 0 ? '#ffffff' : '#fafafa',
              color: '#18181b',
            },
          },
          columns.map((col) => {
            const dynamicStyle =
              typeof col.emailStyle === 'function'
                ? col.emailStyle(row)
                : col.emailStyle || {};

            return createElement(
              'td',
              {
                key: col.header,
                style: {
                  padding: '9px 14px',
                  borderBottom: '1px solid #e4e7ec',
                  borderRight: '1px solid #eff1f4',
                  ...dynamicStyle,
                },
              },
              col.accessor(row, i) as React.ReactNode,
            );
          }),
        ),
      ),
    ),
  );

export const buildEmailHtml = (data: CleverTapReport[], columns: ColumnDef[]) =>
  renderToStaticMarkup(createElement(EmailTable, { data, columns }));

/* ------------------------------------------------------------------ */
/* Clipboard write                                                     */
/* ------------------------------------------------------------------ */

/**
 * Writes both an HTML and a plain-text flavour in a single clipboard item.
 * This is what makes one button work everywhere: rich clients read text/html,
 * while Slack and other plain-text composers read text/plain. Writing only
 * text/html — the previous behaviour — is why Slack pastes came out empty.
 */
const writeToClipboard = async (html: string | null, plain: string) => {
  try {
    if (html && typeof ClipboardItem !== 'undefined') {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': new Blob([html], { type: 'text/html' }),
          'text/plain': new Blob([plain], { type: 'text/plain' }),
        }),
      ]);
      return true;
    }
    await navigator.clipboard.writeText(plain);
    return true;
  } catch {
    // Safari/permission fallback: hidden textarea + execCommand.
    try {
      const ta = document.createElement('textarea');
      ta.value = plain;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
};

const downloadCsv = (csv: string) => {
  // Prepend a BOM so Excel opens UTF-8 correctly.
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `clevertap-report-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const copyTable = async (
  format: CopyFormat,
  data: CleverTapReport[],
  columns: ColumnDef[],
): Promise<boolean> => {
  if (!data.length || !columns.length) return false;

  switch (format) {
    case 'rich':
      // Plain flavour doubles as the fallback for targets that reject HTML.
      return writeToClipboard(
        buildEmailHtml(data, columns),
        toMonospaceTable(data, columns),
      );

    case 'slack':
      // The fence makes Slack render it as a monospace block, which is the
      // only way column alignment survives in a Slack message.
      return writeToClipboard(null, '```\n' + toMonospaceTable(data, columns) + '\n```');

    case 'markdown':
      return writeToClipboard(null, toMarkdownTable(data, columns));

    case 'sheets':
      return writeToClipboard(
        buildEmailHtml(data, columns),
        toTSV(data, columns),
      );

    case 'csv':
      downloadCsv(toCSV(data, columns));
      return true;

    default:
      return false;
  }
};

/** Kept for backwards compatibility with any existing callers. */
export const copyRichTableToClipboard = (
  data: CleverTapReport[],
  columns: ColumnDef[],
) => copyTable('rich', data, columns);
