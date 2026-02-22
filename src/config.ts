export interface CleverTapReport {
  _id: number;
  f: string;
  cr_status: number;
  report_sent: boolean;
  conv_event?: string;
  conv_prop?: string;
  createdts: number;
  o_queries?: number[];
  campaigninfo?: {
    createddatetime?: { from: number; to: number };
    targetList?: Record<string, number[]>;
    report?: any;
  };
  uinfo?: { user: string; email: string }[];
}

export interface ColumnConfig {
  header: string;
  accessor: (row: CleverTapReport) => string | number;
  emailStyle?: React.CSSProperties; // For specific column styles in the email
}