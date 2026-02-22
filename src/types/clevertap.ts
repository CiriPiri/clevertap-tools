export interface CleverTapReport {
  _id: number;
  f?: string;
  campaigninfo?: {
    createddatetime?: { from: number; to: number };
    targetList?: Record<string, number[]>;
  };
  cr_status: number;
  report_sent: boolean;
  conv_event?: string;
  conv_prop?: string;
  o_queries?: number[];
  uinfo?: Array<{ user: string; email: string }>;
}