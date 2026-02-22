import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { CleverTapReport } from '../types/clevertap';
import type { ColumnDef } from '../config/tableColumns';

// Now accepts `columns` to know exactly what to render
const EmailTable = ({ data, columns }: { data: CleverTapReport[], columns: ColumnDef[] }) => {
  return createElement('table', { 
    width: '100%', 
    style: { borderCollapse: 'collapse', fontFamily: 'Arial, sans-serif', fontSize: '13px', border: '1px solid #d0d5dd' } 
  },
    createElement('thead', null, 
      createElement('tr', { style: { backgroundColor: '#1a1a2e', color: '#fff' } },
        columns.map(col => createElement('th', { key: col.header, style: { padding: '10px 14px', textAlign: 'left', borderRight: '1px solid #2e2e4e', whiteSpace: 'nowrap' } }, col.header))
      )
    ),
    createElement('tbody', null,
      data.map((row, i) => createElement('tr', { key: row._id || i, style: { backgroundColor: i % 2 === 0 ? '#fff' : '#f9fafb', color: '#1a1a1a' } },
        columns.map(col => {
          // Handle dynamic email styles based on row data
          const dynamicStyle = typeof col.emailStyle === 'function' ? col.emailStyle(row) : (col.emailStyle || {});
          
          return createElement('td', { 
            key: col.header, 
            style: { padding: '9px 14px', borderBottom: '1px solid #e4e7ec', borderRight: '1px solid #e4e7ec', ...dynamicStyle } 
          }, 
            col.accessor(row, i) as React.ReactNode
          );
        })
      ))
    )
  );
};

export const copyRichTableToClipboard = async (data: CleverTapReport[], columns: ColumnDef[]) => {
  const htmlString = renderToStaticMarkup(createElement(EmailTable, { data, columns }));
  
  try {
    const blob = new Blob([htmlString], { type: 'text/html' });
    const item = new ClipboardItem({ 'text/html': blob });
    await navigator.clipboard.write([item]);
    return true;
  } catch (err) {
    const ta = document.createElement('textarea');
    ta.value = htmlString;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    return true;
  }
};