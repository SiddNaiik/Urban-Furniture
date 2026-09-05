export interface SalesOrderLine {
  id?: string;
  product_id: string;
  name?: string;
  quantity: number;
  unit_price: number;
  subtotal?: number;
}

export interface SalesOrder {
  id: string;
  reference: string;
  customer: string;
  partner_id?: string;
  date: string;
  total: number;
  status: 'draft' | 'sent' | 'sale' | 'done' | 'cancel' | string;
  order_lines?: SalesOrderLine[];
}

export interface CustomerInvoiceLine {
  id?: string;
  product_id?: string;
  name?: string;
  account_id?: string;
  quantity: number;
  price_unit: number;
  amount?: number;
}

export interface CustomerInvoice {
  id: string;
  number: string;
  customer: string;
  partner_id?: string;
  date: string;
  due_date?: string;
  amount: number;
  status: 'draft' | 'posted' | 'paid' | 'overdue' | 'cancel' | string;
  lines?: CustomerInvoiceLine[];
}

export interface InvoicePaymentInput {
  invoice_id: string;
  journal_id: string;
  amount: number;
  payment_date: string;
}
