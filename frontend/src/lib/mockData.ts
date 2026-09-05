import type { Contact } from '@/types/contact';
import type { Product } from '@/types/product';
import type { SalesOrder, CustomerInvoice } from '@/types/sales';
import type { PurchaseOrder, VendorBill } from '@/types/purchase';
import type { Account, Journal, JournalEntry, AnalyticAccount } from '@/types/accounting';
import type { Budget } from '@/types/budget';

export const MOCK_CONTACTS: Contact[] = [
  { id: '1', name: 'Azure Interior', email: 'info@azure.example.com', phone: '+1 555-0192', type: 'customer' },
  { id: '2', name: 'WoodCraft Supplies', email: 'sales@woodcraft.example.com', phone: '+1 555-0144', type: 'vendor' },
  { id: '3', name: 'Deco Addict', email: 'orders@decoaddict.example.com', phone: '+1 555-0188', type: 'customer' },
  { id: '4', name: 'Steel & Foam Co.', email: 'contact@steelfoam.example.com', phone: '+1 555-0177', type: 'vendor' },
  { id: '5', name: 'Gemini Design Studio', email: 'hello@gemini.example.com', phone: '+1 555-0166', type: 'both' },
];

export const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Ergonomic Office Chair', sku: 'FUR-001', price: 350.00, lst_price: 350.00, standard_price: 180.00, qty_available: 45, category: 'Seating' },
  { id: '2', name: 'Solid Oak Dining Table', sku: 'FUR-002', price: 1200.00, lst_price: 1200.00, standard_price: 650.00, qty_available: 12, category: 'Tables' },
  { id: '3', name: 'Modular Velvet Sofa', sku: 'FUR-003', price: 2400.00, lst_price: 2400.00, standard_price: 1300.00, qty_available: 8, category: 'Living Room' },
  { id: '4', name: 'Minimalist Desk Lamp', sku: 'FUR-004', price: 85.00, lst_price: 85.00, standard_price: 35.00, qty_available: 120, category: 'Lighting' },
  { id: '5', name: 'Bookshelf Cabinet', sku: 'FUR-005', price: 780.00, lst_price: 780.00, standard_price: 400.00, qty_available: 18, category: 'Storage' },
];

export const MOCK_SALES_ORDERS: SalesOrder[] = [
  {
    id: 'so-1',
    reference: 'S00001',
    customer: 'Azure Interior',
    date: '2026-09-01',
    total: 3200.00,
    status: 'sale',
    order_lines: [
      { id: 'sol-1', product_id: '1', name: 'Ergonomic Office Chair', quantity: 4, unit_price: 350.00, subtotal: 1400.00 },
      { id: 'sol-2', product_id: '2', name: 'Solid Oak Dining Table', quantity: 1.5, unit_price: 1200.00, subtotal: 1800.00 },
    ]
  },
  {
    id: 'so-2',
    reference: 'S00002',
    customer: 'Deco Addict',
    date: '2026-09-03',
    total: 2400.00,
    status: 'draft',
    order_lines: [
      { id: 'sol-3', product_id: '3', name: 'Modular Velvet Sofa', quantity: 1, unit_price: 2400.00, subtotal: 2400.00 },
    ]
  },
  {
    id: 'so-3',
    reference: 'S00003',
    customer: 'Gemini Design Studio',
    date: '2026-09-04',
    total: 1560.00,
    status: 'done',
    order_lines: [
      { id: 'sol-4', product_id: '5', name: 'Bookshelf Cabinet', quantity: 2, unit_price: 780.00, subtotal: 1560.00 },
    ]
  },
];

export const MOCK_CUSTOMER_INVOICES: CustomerInvoice[] = [
  {
    id: 'inv-1',
    number: 'INV/2026/00001',
    customer: 'Azure Interior',
    date: '2026-09-01',
    due_date: '2026-09-30',
    amount: 3200.00,
    status: 'paid',
    lines: [
      { id: 'il-1', product_id: '1', name: 'Ergonomic Office Chair', quantity: 4, price_unit: 350.00, amount: 1400.00 },
      { id: 'il-2', product_id: '2', name: 'Solid Oak Dining Table', quantity: 1.5, price_unit: 1200.00, amount: 1800.00 },
    ]
  },
  {
    id: 'inv-2',
    number: 'INV/2026/00002',
    customer: 'Gemini Design Studio',
    date: '2026-09-04',
    due_date: '2026-10-04',
    amount: 1560.00,
    status: 'posted',
    lines: [
      { id: 'il-3', product_id: '5', name: 'Bookshelf Cabinet', quantity: 2, price_unit: 780.00, amount: 1560.00 },
    ]
  },
];

export const MOCK_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 'po-1',
    reference: 'P00001',
    vendor: 'WoodCraft Supplies',
    date: '2026-08-25',
    total: 4500.00,
    status: 'purchase',
    order_lines: [
      { id: 'pol-1', product_id: '2', name: 'Oak Timber Raw Material', quantity: 10, unit_price: 450.00, subtotal: 4500.00 }
    ]
  },
  {
    id: 'po-2',
    reference: 'P00002',
    vendor: 'Steel & Foam Co.',
    date: '2026-09-02',
    total: 2800.00,
    status: 'draft',
    order_lines: [
      { id: 'pol-2', product_id: '1', name: 'Chair Steel Frame Base', quantity: 40, unit_price: 70.00, subtotal: 2800.00 }
    ]
  },
];

export const MOCK_VENDOR_BILLS: VendorBill[] = [
  {
    id: 'bill-1',
    reference: 'BILL/2026/08/001',
    vendor: 'WoodCraft Supplies',
    date: '2026-08-26',
    due_date: '2026-09-26',
    amount: 4500.00,
    status: 'posted',
    lines: [
      { id: 'bl-1', product_id: '2', name: 'Oak Timber Raw Material', quantity: 10, price_unit: 450.00, amount: 4500.00 }
    ]
  },
];

export const MOCK_ACCOUNTS: Account[] = [
  { id: 'acc-1', code: '101000', name: 'Bank Account - Operating', type: 'asset', balance: 145000.00 },
  { id: 'acc-2', code: '120000', name: 'Account Receivable', type: 'asset', balance: 24500.00 },
  { id: 'acc-3', code: '210000', name: 'Account Payable', type: 'liability', balance: 18200.00 },
  { id: 'acc-4', code: '400000', name: 'Product Sales Income', type: 'income', balance: 312000.00 },
  { id: 'acc-5', code: '500000', name: 'Cost of Goods Sold', type: 'expense', balance: 165000.00 },
];

export const MOCK_JOURNALS: Journal[] = [
  { id: 'j-1', name: 'Customer Invoices', code: 'INV', type: 'sale' },
  { id: 'j-2', name: 'Vendor Bills', code: 'BILL', type: 'purchase' },
  { id: 'j-3', name: 'Bank Operating', code: 'BNK1', type: 'bank' },
  { id: 'j-4', name: 'Miscellaneous Operations', code: 'MISC', type: 'general' },
];

export const MOCK_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'je-1',
    name: 'MISC/2026/00001',
    date: '2026-09-01',
    journal_id: 'j-4',
    journal_name: 'Miscellaneous Operations',
    ref: 'Monthly Rent Allocation',
    total_debit: 4500,
    total_credit: 4500,
    state: 'posted',
    lines: [
      { id: 'jel-1', account_id: 'acc-5', account_name: 'Cost of Goods Sold / Rent', name: 'Rent', debit: 4500, credit: 0 },
      { id: 'jel-2', account_id: 'acc-1', account_name: 'Bank Account - Operating', name: 'Rent Payment', debit: 0, credit: 4500 },
    ]
  }
];

export const MOCK_ANALYTIC_ACCOUNTS: AnalyticAccount[] = [
  { id: 'ana-1', name: 'Internal Showroom Renovation', code: 'ANA-001', balance: 12400.00 },
  { id: 'ana-2', name: 'Custom Hotel Project - Marriot', code: 'ANA-002', balance: 85000.00 },
];

export const MOCK_BUDGETS: Budget[] = [
  { id: 'b-1', name: 'Q3 Marketing & Sales Budget', period: 'Q3 2026', date_from: '2026-07-01', date_to: '2026-09-30', total_amount: 25000, status: 'done', state: 'done' },
  { id: 'b-2', name: 'R&D Furniture Design 2026', period: 'FY 2026', date_from: '2026-01-01', date_to: '2026-12-31', total_amount: 60000, status: 'confirm', state: 'confirm' },
];

export const MOCK_USERS = [
  { id: 'u-1', name: 'Admin User', email: 'admin@urbanfurniture.com', role: 'Administrator' },
  { id: 'u-2', name: 'Sarah Accountant', email: 'sarah@urbanfurniture.com', role: 'Accountant' },
  { id: 'u-3', name: 'David Sales', email: 'david@urbanfurniture.com', role: 'Sales Manager' },
];
