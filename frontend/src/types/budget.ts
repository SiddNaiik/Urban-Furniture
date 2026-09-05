export interface BudgetLine {
  id?: string;
  analytic_account_id?: string;
  planned_amount: number;
  practical_amount?: number;
  percentage?: number;
}

export interface Budget {
  id: string;
  name: string;
  period: string;
  total_amount: number | string;
  status: 'draft' | 'confirmed' | 'done' | 'cancel' | string;
  lines?: BudgetLine[];
  created_at?: string;
}

export interface BudgetInput {
  name: string;
  period: string;
  total_amount?: number | string;
}
