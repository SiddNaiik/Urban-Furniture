export interface ReportRow {
  label: string;
  amount: number;
  subrows?: ReportRow[];
}

export interface ProfitLossReportData {
  income: ReportRow[];
  total_income: number;
  expenses: ReportRow[];
  total_expenses: number;
  net_profit: number;
}

export interface BalanceSheetReportData {
  assets: ReportRow[];
  total_assets: number;
  liabilities: ReportRow[];
  total_liabilities: number;
  equity: ReportRow[];
  total_equity: number;
}

export interface BudgetReportData {
  budgets: {
    name: string;
    planned: number;
    practical: number;
    variance: number;
    percentage: number;
  }[];
}
