import type { CleverTapReport } from '../types/clevertap';
import { formatDate, getStatusText } from '../utils/formatters';

export interface ColumnDef {
  header: string;
  accessor: (row: CleverTapReport, index: number) => React.ReactNode;
  emailStyle?: React.CSSProperties | ((row: CleverTapReport) => React.CSSProperties);
}

export const tableColumns: ColumnDef[] = [
  {
    header: '#',
    accessor: (_, index) => index + 1,
    emailStyle: { color: '#888', textAlign: 'center' }
  },
  {
    header: 'Report Name',
    accessor: (row) => row.f || '—',
    emailStyle: { fontWeight: 'bold' }
  },
  {
    header: 'Requested By',
    accessor: (row) => row.uinfo?.[0]?.user || 'Unknown',
  },
  {
    header: 'Date Range',
    accessor: (row) => {
      const from = formatDate(row.campaigninfo?.createddatetime?.from);
      const to = formatDate(row.campaigninfo?.createddatetime?.to);
      return from === to ? from : `${from} – ${to}`;
    },
    emailStyle: { whiteSpace: 'nowrap' }
  },
  {
    header: 'Campaigns',
    accessor: (row) => Object.keys(row.campaigninfo?.targetList || {}).length,
    emailStyle: { textAlign: 'center' }
  },
  {
    header: 'Queries',
    accessor: (row) => row.o_queries?.length || 0,
    emailStyle: { textAlign: 'center' }
  },
  {
    header: 'Conv. Event',
    accessor: (row) => row.conv_event ? `${row.conv_event} / ${row.conv_prop}` : '—',
    emailStyle: { color: '#555' }
  },
  {
    header: 'Report Sent',
    accessor: (row) => row.report_sent ? '✓ Yes' : '✗ No',
    emailStyle: (row) => ({ 
      color: row.report_sent ? '#16a34a' : '#dc2626', 
      fontWeight: 'bold' 
    })
  },
  {
    header: 'Status',
    accessor: (row) => {
      const isCompleted = row.cr_status === 2;
      return isCompleted ? 'Completed' : getStatusText(row.cr_status);
    },
    emailStyle: (row) => ({ 
      fontWeight: 'bold', 
      color: row.cr_status === 2 ? '#166534' : '#854d0e' 
    })
  }
];