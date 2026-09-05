export type AccountType = 'asset' | 'liability' | 'equity' | 'income' | 'expense';

export interface Account {
  id: string;
  code: string;
  name: string;
  type: AccountType | string;
  balance?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Journal {
  id: string;
  name: string;
  type: string;
  code: string;
  default_account_id?: string;
}

export interface JournalEntryLine {
  id?: string;
  account_id: string;
  account_name?: string;
  partner_id?: string;
  name?: string;
  debit: number;
  credit: number;
  analytic_account_id?: string;
}

export interface JournalEntry {
  id: string;
  name?: string;
  date: string;
  ref?: string;
  reference?: string;
  journal?: string;
  journal_id?: string;
  journal_name?: string;
  total_debit: number;
  total_credit: number;
  state: 'draft' | 'posted' | 'cancel' | string;
  lines?: JournalEntryLine[];
}

export interface AnalyticAccount {
  id: string;
  name: string;
  code?: string;
  partner_id?: string;
  plan?: string;
  balance?: number;
}
