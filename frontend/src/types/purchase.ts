export interface PurchaseOrderLine {
  id?: string;
  product_id: string;
  name?: string;
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
  quantity: number;
  price_unit: number;
  amount?: number;
}

export interface VendorBill {
  id: string;
  reference: string;
  vendor: string;
  partner_id?: string;
  date: string;
  due_date?: string;
  amount: number;
  status: 'draft' | 'posted' | 'paid' | 'cancel' | string;
  lines?: VendorBillLine[];
}

export interface BillPaymentInput {
  bill_id: string;
  journal_id: string;
  amount: number;
  payment_date: string;
}
