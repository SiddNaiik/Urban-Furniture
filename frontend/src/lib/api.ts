import axios from 'axios';
import { getToken, removeToken } from './auth';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      removeToken();
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export async function login(login_id: string, password: string) {
  const res = await apiClient.post('/auth/login', { login_id, password });
  return res.data;
}

export async function signup(name: string, login_id: string, email: string, password: string) {
  const res = await apiClient.post('/auth/signup', { name, login_id, email, password });
  return res.data;
}

// Users
export async function getUsers() {
  const res = await apiClient.get('/users/');
  return res.data?.results || res.data || [];
}

export async function getUser(id: string) {
  const res = await apiClient.get(`/users/${id}/`);
  return res.data;
}

export async function createUser(data: unknown) {
  const res = await apiClient.post('/users/', data);
  return res.data;
}

export async function updateUser(id: string, data: unknown) {
  const res = await apiClient.put(`/users/${id}/`, data);
  return res.data;
}

// Contacts
export async function getContacts() {
  const res = await apiClient.get('/contacts/');
  return res.data?.results || res.data || [];
}

export async function getContact(id: string) {
  const res = await apiClient.get(`/contacts/${id}/`);
  return res.data;
}

export async function createContact(data: unknown) {
  const res = await apiClient.post('/contacts/', data);
  return res.data;
}

export async function updateContact(id: string, data: unknown) {
  const res = await apiClient.put(`/contacts/${id}/`, data);
  return res.data;
}

// Products
export async function getProducts() {
  const res = await apiClient.get('/products/');
  return res.data?.results || res.data || [];
}

export async function getProduct(id: string) {
  const res = await apiClient.get(`/products/${id}/`);
  return res.data;
}

export async function createProduct(data: unknown) {
  const res = await apiClient.post('/products/', data);
  return res.data;
}

export async function updateProduct(id: string, data: unknown) {
  const res = await apiClient.put(`/products/${id}/`, data);
  return res.data;
}

// Chart of Accounts
export async function getChartOfAccounts() {
  const res = await apiClient.get('/accounting/accounts/');
  return res.data?.results || res.data || [];
}

export async function getAccount(id: string) {
  const res = await apiClient.get(`/accounting/accounts/${id}/`);
  return res.data;
}

export async function createAccount(data: unknown) {
  const res = await apiClient.post('/accounting/accounts/', data);
  return res.data;
}

export async function updateAccount(id: string, data: unknown) {
  const res = await apiClient.put(`/accounting/accounts/${id}/`, data);
  return res.data;
}

// Journals
export async function getJournals() {
  const res = await apiClient.get('/accounting/journals/');
  return res.data?.results || res.data || [];
}

export async function getJournal(id: string) {
  const res = await apiClient.get(`/accounting/journals/${id}/`);
  return res.data;
}

export async function createJournal(data: unknown) {
  const res = await apiClient.post('/accounting/journals/', data);
  return res.data;
}

export async function updateJournal(id: string, data: unknown) {
  const res = await apiClient.put(`/accounting/journals/${id}/`, data);
  return res.data;
}

// Journal Entries
export async function getJournalEntries() {
  const res = await apiClient.get('/accounting/journal-entries/');
  return res.data?.results || res.data || [];
}

export async function getJournalEntry(id: string) {
  const res = await apiClient.get(`/accounting/journal-entries/${id}/`);
  return res.data;
}

export async function createJournalEntry(data: unknown) {
  const res = await apiClient.post('/accounting/journal-entries/', data);
  return res.data;
}

export async function updateJournalEntry(id: string, data: unknown) {
  const res = await apiClient.put(`/accounting/journal-entries/${id}/`, data);
  return res.data;
}

// Analytic Accounts
export async function getAnalyticAccounts() {
  const res = await apiClient.get('/accounting/analytic-accounts/');
  return res.data?.results || res.data || [];
}

export async function getAnalyticAccount(id: string) {
  const res = await apiClient.get(`/accounting/analytic-accounts/${id}/`);
  return res.data;
}

export async function createAnalyticAccount(data: unknown) {
  const res = await apiClient.post('/accounting/analytic-accounts/', data);
  return res.data;
}

export async function updateAnalyticAccount(id: string, data: unknown) {
  const res = await apiClient.put(`/accounting/analytic-accounts/${id}/`, data);
  return res.data;
}

// Purchase Orders
export async function getPurchaseOrders() {
  const res = await apiClient.get('/purchase/orders/');
  return res.data?.results || res.data || [];
}

export async function getPurchaseOrder(id: string) {
  const res = await apiClient.get(`/purchase/orders/${id}/`);
  return res.data;
}

export async function createPurchaseOrder(data: unknown) {
  const res = await apiClient.post('/purchase/orders/', data);
  return res.data;
}

export async function updatePurchaseOrder(id: string, data: unknown) {
  const res = await apiClient.put(`/purchase/orders/${id}/`, data);
  return res.data;
}

// Vendor Bills
export async function getVendorBills() {
  const res = await apiClient.get('/purchase/vendor-bills/');
  return res.data?.results || res.data || [];
}

export async function getVendorBill(id: string) {
  const res = await apiClient.get(`/purchase/vendor-bills/${id}/`);
  return res.data;
}

export async function createVendorBill(data: unknown) {
  const res = await apiClient.post('/purchase/vendor-bills/', data);
  return res.data;
}

export async function updateVendorBill(id: string, data: unknown) {
  const res = await apiClient.put(`/purchase/vendor-bills/${id}/`, data);
  return res.data;
}

export async function registerBillPayment(billIdOrData: string | unknown, data?: unknown) {
  if (typeof billIdOrData === 'string') {
    const res = await apiClient.post(`/purchase/vendor-bills/${billIdOrData}/register-payment/`, data);
    return res.data;
  }
  const res = await apiClient.post('/purchase/vendor-bills/register-payment/', billIdOrData);
  return res.data;
}

// Sales Orders
export async function getSalesOrders() {
  const res = await apiClient.get('/sales/orders/');
  return res.data?.results || res.data || [];
}

export async function getSalesOrder(id: string) {
  const res = await apiClient.get(`/sales/orders/${id}/`);
  return res.data;
}

export async function createSalesOrder(data: unknown) {
  const res = await apiClient.post('/sales/orders/', data);
  return res.data;
}

export async function updateSalesOrder(id: string, data: unknown) {
  const res = await apiClient.put(`/sales/orders/${id}/`, data);
  return res.data;
}

// Customer Invoices
export async function getCustomerInvoices() {
  const res = await apiClient.get('/sales/invoices/');
  return res.data?.results || res.data || [];
}

export async function getCustomerInvoice(id: string) {
  const res = await apiClient.get(`/sales/invoices/${id}/`);
  return res.data;
}

export async function createCustomerInvoice(data: unknown) {
  const res = await apiClient.post('/sales/invoices/', data);
  return res.data;
}

export async function updateCustomerInvoice(id: string, data: unknown) {
  const res = await apiClient.put(`/sales/invoices/${id}/`, data);
  return res.data;
}

export async function registerInvoicePayment(invoiceIdOrData: string | unknown, data?: unknown) {
  if (typeof invoiceIdOrData === 'string') {
    const res = await apiClient.post(`/sales/invoices/${invoiceIdOrData}/register-payment/`, data);
    return res.data;
  }
  const res = await apiClient.post('/sales/invoices/register-payment/', invoiceIdOrData);
  return res.data;
}

// Payments
export async function getPayments() {
  const res = await apiClient.get('/payments/');
  return res.data?.results || res.data || [];
}

export async function getPayment(id: string) {
  const res = await apiClient.get(`/payments/${id}/`);
  return res.data;
}

export async function createPayment(data: unknown) {
  const res = await apiClient.post('/payments/', data);
  return res.data;
}

export async function updatePayment(id: string, data: unknown) {
  const res = await apiClient.put(`/payments/${id}/`, data);
  return res.data;
}

// Budgets
export async function getBudgets() {
  const res = await apiClient.get('/budgets/');
  return res.data?.results || res.data || [];
}

export async function getBudget(id: string) {
  const res = await apiClient.get(`/budgets/${id}/`);
  return res.data;
}

export async function createBudget(data: unknown) {
  const res = await apiClient.post('/budgets/', data);
  return res.data;
}

export async function updateBudget(id: string, data: unknown) {
  const res = await apiClient.put(`/budgets/${id}/`, data);
  return res.data;
}

// ============================================================
// BUDGET WORKFLOW HELPERS
// ============================================================
//
// FRONTEND ONLY:
//
// These helpers are intentionally local until the backend
// exposes authoritative budget workflow/check endpoints.
//
// Do NOT use these as a replacement for backend validation.
// Purchase Order confirmation must eventually be validated
// by the backend.
//

export function calculateBudgetAvailability(
  budgetAmount: number,
  committedAmount: number
) {
  const budget = Number(budgetAmount) || 0;
  const committed = Number(committedAmount) || 0;

  return {
    remaining: Math.max(
      budget - committed,
      0
    ),

    exceeded:
      committed > budget,
  };
}

export function calculateBudgetAchievement(
  budgetAmount: number,
  achievedAmount: number
) {
  const budget = Number(budgetAmount) || 0;
  const achieved = Number(achievedAmount) || 0;

  return {
    percentage:
      budget > 0
        ? Math.round(
            (achieved / budget) * 100
          )
        : 0,
  };
}