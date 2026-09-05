import type { Product, ProductCategory } from '@/types/product';
import type { Contact } from '@/types/contact';
import type { SalesOrder, CustomerInvoice } from '@/types/sales';
import type { PurchaseOrder, VendorBill } from '@/types/purchase';
import type { Account, Journal, JournalEntry, AnalyticAccount } from '@/types/accounting';
import type { Budget } from '@/types/budget';
import type { User } from '@/types/user';

export const MOCK_CATEGORIES: ProductCategory[] = [
  { id: 'cat-1', name: 'Electronics' },
  { id: 'cat-2', name: 'Seating' },
  { id: 'cat-3', name: 'Tables' },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Air Conditioner',
    type: 'Goods',
    category_id: 'cat-1',
    category: 'Electronics',
    sales_price: 25000,
    cost: 15000,
    image_url: null,
    is_active: true,
  },
  {
    id: 'prod-2',
    name: 'Refrigerator',
    type: 'Goods',
    category_id: 'cat-1',
    category: 'Electronics',
    sales_price: 10000,
    cost: 7000,
    image_url: null,
    is_active: true,
  },
];
export const MOCK_CONTACTS: Contact[] = [
  { id: 'cont-1', name: 'Azure Interior', email: 'contact@azureinterior.com', phone: '555-0101', type: 'customer', city: 'Mumbai', country: 'India' },
  { id: 'cont-2', name: 'Deco Addict', email: 'sales@decoaddict.com', phone: '555-0102', type: 'customer', city: 'Pune', country: 'India' },
  { id: 'cont-3', name: 'Wood Corner Supplies', email: 'orders@woodcorner.com', phone: '555-0201', type: 'vendor', city: 'Ahmedabad', country: 'India' },
  { id: 'cont-4', name: 'Metal Works Ltd', email: 'info@metalworks.com', phone: '555-0202', type: 'both', city: 'Surat', country: 'India' },
];

export const MOCK_SALES_ORDERS: SalesOrder[] = [
  {
    id: 'so-1',
    reference: 'S00001',
    customer: 'Azure Interior',
    date: '2026-08-20',
    total: 770.00,
    status: 'sale',
    order_lines: [
      { id: 'sol-1', product_id: 'prod-1', name: 'Air Conditioner', quantity: 1, unit_price: 25000, subtotal: 25000 },
    ],
  },
  {
    id: 'so-2',
    reference: 'S00002',
    customer: 'Deco Addict',
    date: '2026-08-28',
    total: 10000,
    status: 'draft',
    order_lines: [
      { id: 'sol-2', product_id: 'prod-2', name: 'Refrigerator', quantity: 1, unit_price: 10000, subtotal: 10000 },
    ],
  },
];

export const MOCK_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 'po-1',
    reference: 'P00001',
    vendor: 'Wood Corner Supplies',
    date: '2026-08-18',
    total: 15000,
    status: 'purchase',
    order_lines: [
      { id: 'pol-1', product_id: 'prod-1', name: 'Air Conditioner', quantity: 1, unit_price: 15000, subtotal: 15000 },
    ],
  },
  {
    id: 'po-2',
    reference: 'P00002',
    vendor: 'Metal Works Ltd',
    date: '2026-08-30',
    total: 7000,
    status: 'draft',
    order_lines: [
      { id: 'pol-2', product_id: 'prod-2', name: 'Refrigerator', quantity: 1, unit_price: 7000, subtotal: 7000 },
    ],
  },
];

export const MOCK_CUSTOMER_INVOICES: CustomerInvoice[] = [
  {
    id: 'inv-1',
    number: 'INV/2026/0001',
    customer: 'Azure Interior',
    date: '2026-08-21',
    due_date: '2026-09-20',
    amount: 25000,
    status: 'posted',
    lines: [
      { id: 'il-1', product_id: 'prod-1', name: 'Air Conditioner', quantity: 1, price_unit: 25000, amount: 25000 },
    ],
  },
  {
    id: 'inv-2',
    number: 'INV/2026/0002',
    customer: 'Deco Addict',
    date: '2026-08-29',
    due_date: '2026-09-28',
    amount: 10000,
    status: 'overdue',
    lines: [
      { id: 'il-2', product_id: 'prod-2', name: 'Refrigerator', quantity: 1, price_unit: 10000, amount: 10000 },
    ],
  },
];

export const MOCK_VENDOR_BILLS: VendorBill[] = [
  {
    id: 'bill-1',
    reference: 'BILL/2026/0001',
    vendor: 'Wood Corner Supplies',
    date: '2026-08-19',
    due_date: '2026-09-18',
    amount: 15000,
    status: 'posted',
    lines: [
      { id: 'bl-1', product_id: 'prod-1', name: 'Air Conditioner', quantity: 1, price_unit: 15000, amount: 15000 },
    ],
  },
  {
    id: 'bill-2',
    reference: 'BILL/2026/0002',
    vendor: 'Metal Works Ltd',
    date: '2026-08-31',
    due_date: '2026-09-30',
    amount: 7000,
    status: 'draft',
    lines: [
      { id: 'bl-2', product_id: 'prod-2', name: 'Refrigerator', quantity: 1, price_unit: 7000, amount: 7000 },
    ],
  },
];

export const MOCK_ACCOUNTS: Account[] = [
  { id: 'acc-1', code: '1000', name: 'Cash', type: 'asset', balance: 50000 },
  { id: 'acc-2', code: '1100', name: 'Accounts Receivable', type: 'asset', balance: 35000 },
  { id: 'acc-3', code: '2000', name: 'Accounts Payable', type: 'liability', balance: 22000 },
  { id: 'acc-4', code: '4000', name: 'Sales Revenue', type: 'income', balance: 35000 },
  { id: 'acc-5', code: '5000', name: 'Cost of Goods Sold', type: 'expense', balance: 22000 },
];

export const MOCK_JOURNALS: Journal[] = [
  { id: 'jrn-1', name: 'Sales Journal', type: 'sale', code: 'SALE' },
  { id: 'jrn-2', name: 'Purchase Journal', type: 'purchase', code: 'PURCH' },
  { id: 'jrn-3', name: 'Bank Journal', type: 'bank', code: 'BANK' },
];

export const MOCK_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'je-1',
    name: 'JE/2026/0001',
    date: '2026-08-21',
    reference: 'INV/2026/0001',
    journal: 'Sales Journal',
    total_debit: 25000,
    total_credit: 25000,
    state: 'posted',
    lines: [
      { account_id: 'acc-2', account_name: 'Accounts Receivable', debit: 25000, credit: 0 },
      { account_id: 'acc-4', account_name: 'Sales Revenue', debit: 0, credit: 25000 },
    ],
  },
  {
    id: 'je-2',
    name: 'JE/2026/0002',
    date: '2026-08-19',
    reference: 'BILL/2026/0001',
    journal: 'Purchase Journal',
    total_debit: 15000,
    total_credit: 15000,
    state: 'posted',
    lines: [
      { account_id: 'acc-5', account_name: 'Cost of Goods Sold', debit: 15000, credit: 0 },
      { account_id: 'acc-3', account_name: 'Accounts Payable', debit: 0, credit: 15000 },
    ],
  },
];

export const MOCK_ANALYTIC_ACCOUNTS: AnalyticAccount[] = [
  { id: 'aa-1', name: 'Marketing', code: 'MKT', balance: 5000 },
  { id: 'aa-2', name: 'Operations', code: 'OPS', balance: 12000 },
];

export const MOCK_BUDGETS: Budget[] = [
  {
    id: 'bud-1',
    name: 'Q3 2026 Marketing Budget',
    period: 'Q3 2026',
    date_from: '2026-07-01',
    date_to: '2026-09-30',
    total_amount: 10000,
    status: 'confirmed',
    lines: [{ id: 'bl-1', analytic_account_id: 'aa-1', planned_amount: 10000, practical_amount: 5000, percentage: 50 }],
  },
  {
    id: 'bud-2',
    name: 'Q3 2026 Operations Budget',
    period: 'Q3 2026',
    date_from: '2026-07-01',
    date_to: '2026-09-30',
    total_amount: 20000,
    status: 'draft',
    lines: [{ id: 'bl-2', analytic_account_id: 'aa-2', planned_amount: 20000, practical_amount: 12000, percentage: 60 }],
  },
];

export const MOCK_USERS: User[] = [
  { id: 'usr-1', name: 'Tasty', email: 'tasty@example.com', role: 'admin' },
  { id: 'usr-2', name: 'Ravi Shah', email: 'ravi@example.com', role: 'accountant' },
  { id: 'usr-3', name: 'Priya Nair', email: 'priya@example.com', role: 'sales' },
];