export interface PurchaseOrderLine {
  id?: string;
  product_id: string;
  name?: string;
  analytic_account_id?: string;
  quantity: number;
  unit_price: number;
  subtotal?: number;
}

export interface PurchaseOrder {
  id: string;
  reference: string;
  vendor: string;
  partner_id?: string;
  date: string;
  total: number;
  status: 'draft' | 'sent' | 'to_approve' | 'purchase' | 'done' | 'cancel' | string;
  order_lines?: PurchaseOrderLine[];
}

export interface VendorBillLine {
  id?: string;
  product_id?: string;
  name?: string;
  account_id?: string;
  standard_price?: number;
  analytic_account_id?: string;
  quantity: number;
  price_unit: number;
  amount?: number;
}

export interface VendorBill {
  id: string;
  reference: string;
  bill_reference?: string;
  po_id?: string;
  vendor: string;
  partner_id?: string;
  standard_price?: number;
  date: string;
  due_date?: string;
  amount: number;
  amount_paid?: number;
  status: 'draft' | 'posted' | 'paid' | 'cancel' | string;
  lines?: VendorBillLine[];
}

export interface BillPaymentInput {
  bill_id: string;
  journal_id: string;
  amount: number;
  payment_date: string;
}

export interface Product {
  id: string;
  name: string;
  sku?: string;
  category?: string;
  price: number | string;
  lst_price: number;
  cost?: number | string;
  standard_price?: number;   
  stock?: number;
  qty_available: number;
  description?: string;
  created_at?: string;
  updated_at?: string;
}