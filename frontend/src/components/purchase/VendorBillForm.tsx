'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import {
  MOCK_VENDOR_BILLS,
  MOCK_PURCHASE_ORDERS,
  MOCK_CONTACTS,
  MOCK_PRODUCTS,
  MOCK_ACCOUNTS,
  MOCK_ANALYTIC_ACCOUNTS,
} from '@/lib/mockData';
import { formatCurrency } from '@/lib/utils';
import { ui } from '@/lib/theme';
import type { VendorBillLine } from '@/types/purchase';

interface VendorBillFormProps {
  id: string;
}

/*
  BACKEND GAP — READ BEFORE WIRING THIS TO A REAL API
  -----------------------------------------------------
  The current backend only implements /api/auth, /api/dashboard, /api/users.
  There is no VendorBill, Payment, JournalEntry, Account, or AnalyticAccount
  router/model — even though frontend/src/lib/api.ts already defines client
  functions for them (getVendorBills, createVendorBill, registerBillPayment,
  createJournalEntry, getAnalyticAccounts, etc). Those functions will 404
  against the real backend today; they are not wired up here because doing
  so would silently fail, and using them without a backend would mean this
  form does nothing real anyway.

  To make this component actually persist data and honor the "Confirm
  triggers accounting/journal logic" requirement, the backend needs:
    1. VendorBill model + router: CRUD + POST /vendor-bills/{id}/confirm
       (id, bill_number, bill_reference, vendor_id, po_id, date, due_date,
        status, lines[] with product_id/account_id/analytic_account_id/
        qty/unit_price/amount, amount, amount_paid)
    2. Payment model + router: POST /vendor-bills/{id}/register-payment
       (amount, payment_date, journal_id/payment_via) — must update the
       bill's amount_paid and recompute status server-side
    3. JournalEntry model + router, and server-side logic in the confirm
       endpoint that auto-creates a balanced entry (Purchase A/c debit,
       Creditor A/c credit) per the workflow diagram — this cannot be
       faked safely on the frontend since it needs to be atomic with the
       bill confirmation and actually balance in the ledger
    4. Contact/Vendor, Product, Account (Chart of Accounts), and
       AnalyticAccount models + routers — none exist yet, so there is
       nothing real to select from besides the current PurchaseOrder/
       AnalyticAccount mock data
    5. PurchaseOrder model needs vendor_id, date, line items and total —
       today it only stores id/order_number/status, so even a "real" PO
       has nothing to carry over yet

  Until those exist, this form stays on the same mock-data pattern as
  PurchaseOrderForm (Part 1) so the two stay consistent, and the
  "Confirm" action here does NOT create any journal entry — it only
  moves the bill to a posted/payment-tracked state, with a visible note
  explaining why no ledger entry was created.
*/

function generateNextBillNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const countThisMonth = MOCK_VENDOR_BILLS.length + 1;
  return `Bill/₹{year}/₹{String(countThisMonth).padStart(4, '0')}`;
}

// Default "Purchase account" per the diagram note: "Purchase account to
// be set by default". Falls back to the first expense-type account.
function getDefaultPurchaseAccountId(): string {
  const purchaseAcc = MOCK_ACCOUNTS.find((a) => a.type === 'expense');
  return purchaseAcc?.id || MOCK_ACCOUNTS[0]?.id || '';
}

type PaymentStatus = 'not_paid' | 'partial' | 'paid';

function computeStatus(total: number, amountPaid: number): PaymentStatus {
  if (amountPaid <= 0) return 'not_paid';
  if (amountPaid < total) return 'partial';
  return 'paid';
}

export default function VendorBillForm({ id }: VendorBillFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isNew = id === 'new';
  const poIdFromQuery = searchParams.get('po_id') || undefined;

  const [form, setForm] = useState({
    reference: isNew ? generateNextBillNumber() : '',
    bill_reference: '',
    vendor_id: '',
    po_id: poIdFromQuery,
    date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    confirmed: false, // draft -> confirmed (posted)
  });

  const [lines, setLines] = useState<VendorBillLine[]>([
    {
      id: 'bl-1',
      product_id: MOCK_PRODUCTS[0].id,
      name: MOCK_PRODUCTS[0].name,
      account_id: getDefaultPurchaseAccountId(),
      quantity: 1,
      price_unit: MOCK_PRODUCTS[0].standard_price || 0,
      amount: MOCK_PRODUCTS[0].standard_price || 0,
    },
  ]);

  const [amountPaid, setAmountPaid] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showJournalNote, setShowJournalNote] = useState(false);

  const vendors = MOCK_CONTACTS.filter((c) => c.type === 'vendor' || c.type === 'both');

  // Load existing bill (edit mode)
  useEffect(() => {
    if (!isNew) {
      const existing = MOCK_VENDOR_BILLS.find((b) => b.id === id);
      if (existing) {
        const vendorContact = MOCK_CONTACTS.find((c) => c.name === existing.vendor);
        setForm({
          reference: existing.reference,
          bill_reference: existing.bill_reference || '',
          vendor_id: vendorContact?.id || '',
          po_id: existing.po_id,
          date: existing.date,
          due_date: existing.due_date || existing.date,
          confirmed: existing.status !== 'draft',
        });
        setAmountPaid(existing.amount_paid || (existing.status === 'paid' ? existing.amount : 0));
        if (existing.lines && existing.lines.length > 0) {
          setLines(existing.lines);
        }
      }
      return;
    }

    // New bill created from a confirmed PO — auto carry over PO data so
    // the user never has to re-enter vendor/products/qty/price/analytics.
    if (poIdFromQuery) {
      const sourcePo = MOCK_PURCHASE_ORDERS.find((p) => p.id === poIdFromQuery);
      if (sourcePo) {
        const vendorContact = MOCK_CONTACTS.find((c) => c.name === sourcePo.vendor);
        setForm((f) => ({
          ...f,
          vendor_id: vendorContact?.id || '',
          po_id: sourcePo.id,
        }));
        if (sourcePo.order_lines && sourcePo.order_lines.length > 0) {
          setLines(
            sourcePo.order_lines.map((line, idx) => ({
              id: `bl-po-₹{idx}`,
              product_id: line.product_id,
              name: line.name,
              account_id: getDefaultPurchaseAccountId(),
              analytic_account_id: line.analytic_account_id,
              quantity: line.quantity,
              price_unit: line.unit_price,
              amount: line.subtotal,
            }))
          );
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isNew, poIdFromQuery]);

  function handleLineChange(index: number, field: keyof VendorBillLine, value: any) {
    const newLines = [...lines];
    const line = { ...newLines[index], [field]: value };

    if (field === 'product_id') {
      const prod = MOCK_PRODUCTS.find((p) => p.id === value);
      if (prod) {
        line.name = prod.name;
        line.price_unit = prod.standard_price || 100;
      }
    }

    const qty = field === 'quantity' ? parseFloat(value) || 0 : line.quantity;
    const price = field === 'price_unit' ? parseFloat(value) || 0 : line.price_unit;
    line.amount = qty * price;

    newLines[index] = line;
    setLines(newLines);
  }

  function addLine() {
    const firstProd = MOCK_PRODUCTS[0];
    setLines([
      ...lines,
      {
        id: `bl-₹{Date.now()}`,
        product_id: firstProd.id,
        name: firstProd.name,
        account_id: getDefaultPurchaseAccountId(),
        quantity: 1,
        price_unit: firstProd.standard_price || 100,
        amount: firstProd.standard_price || 100,
      },
    ]);
  }

  function removeLine(index: number) {
    if (lines.length === 1) return;
    setLines(lines.filter((_, i) => i !== index));
  }

  const totalAmount = useMemo(
    () => lines.reduce((acc, l) => acc + (l.amount || 0), 0),
    [lines]
  );

  const amountDue = Math.max(totalAmount - amountPaid, 0);
  const paymentStatus = computeStatus(totalAmount, amountPaid);

  function handleConfirm() {
    setForm((f) => ({ ...f, confirmed: true }));
    // See BACKEND GAP note above: no journal entry is created here
    // because there is no backend endpoint to do so atomically/for real.
    setShowJournalNote(true);
  }

  /*
    PAYMENT SUBMISSION — MOCK ONLY, NOT PERSISTED
    ------------------------------------------------
    Per the BACKEND GAP note above: registerBillPayment() in lib/api.ts
    calls POST /purchase/vendor-bills/{id}/register-payment/, which does
    not exist on the backend (no VendorBill/Payment router at all yet).
    Calling it here would just throw a 404, so this stays as local state
    updates that simulate steps 1–4 from the spec:
      1. Update the bill payment amount   -> setAmountPaid
      2. Update bill status                -> derived via computeStatus()
      3. "Refresh" the Vendor Bill          -> re-reads local state (no
         real refetch is possible without a GET /vendor-bills/{id})
      4. Close the payment modal            -> setShowPaymentModal(false)

    Once the backend exposes registerBillPayment for real, replace the
    body of this function with:
      const updated = await registerBillPayment(id, {
        amount: paymentAmount,
        payment_type: paymentType,
        payment_via: paymentVia,
        payment_date: paymentDate,
        note,
      });
      setAmountPaid(updated.amount_paid);   // trust server-computed value
      // then re-fetch the bill (step 3) via a real getVendorBill(id) call
  */
  function handleRegisterPayment(paidNow: number) {
    setAmountPaid((prev) => Math.min(prev + paidNow, totalAmount));
    setShowPaymentModal(false);
  }

  function openSourcePo() {
    if (form.po_id) router.push(`/purchase-orders/₹{form.po_id}`);
  }

  function openBudgetView() {
    const firstAnalyticId = lines.find((l) => l.analytic_account_id)?.analytic_account_id;
    router.push(
      firstAnalyticId
        ? `/reports/budget-report?analytic_account_id=₹{firstAnalyticId}`
        : '/reports/budget-report'
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // NOTE: kept as a simulated save (not a fake success message dressed
    // up as real) — see BACKEND GAP note: createVendorBill()/
    // updateVendorBill() in lib/api.ts point at endpoints the backend
    // does not implement yet, so calling them here would just 404.
    // Swap this for `await createVendorBill(payload)` /
    // `await updateVendorBill(id, payload)` once that router exists.
    setTimeout(() => {
      setLoading(false);
      router.push('/vendor-bills');
    }, 400);
  }

  const statusBadgeVariant =
    paymentStatus === 'paid' ? 'paid' : paymentStatus === 'partial' ? 'warning' : 'unpaid';
  const statusLabel =
    paymentStatus === 'paid' ? 'Paid' : paymentStatus === 'partial' ? 'Partial' : 'Not Paid';

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Source PO banner */}
      {form.po_id && (
        <div className="rounded-xl border border-[#6B705C]/30 bg-[#6B705C]/5 px-4 py-2 text-xs text-[#6B705C] flex items-center justify-between">
          <span>
            Bill created from Purchase Order fetch — vendor, products, quantity, price and
            budget analytics were carried over automatically.
          </span>
          <button type="button" onClick={openSourcePo} className="underline font-medium shrink-0 ml-3">
            View source PO
          </button>
        </div>
      )}

      {/* Workflow Actions: New | Confirm | Pay | PO | Budget | Cancel | Back */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#E5E3DC]">
        <div className="flex flex-wrap items-center gap-3">
          <Button type="button" variant="secondary" onClick={() => router.push('/vendor-bills/new')}>
            New
          </Button>
          <Button
            type="button"
            variant={form.confirmed ? 'secondary' : 'primary'}
            disabled={form.confirmed}
            onClick={handleConfirm}
          >
            Confirm
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={!form.confirmed || paymentStatus === 'paid'}
            onClick={() => setShowPaymentModal(true)}
          >
            Pay
          </Button>
          {/* PO: only shown if this bill actually came from a PO */}
          {form.po_id && (
            <Button type="button" variant="secondary" onClick={openSourcePo}>
              PO
            </Button>
          )}
          <Button type="button" variant="secondary" onClick={openBudgetView}>
            Budget
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Button type="button" variant="secondary" onClick={() => router.push('/vendor-bills')}>
            Cancel
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.back()}>
            Back
          </Button>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#E5E3DC] pb-4">
            <div>
              <h1 className={ui.pageTitle}>{form.reference}</h1>
              <p className="text-xs text-[#737373] mt-0.5">Supplier Payable Bill Document</p>
            </div>
            <div className="flex items-center gap-2">
              {!form.confirmed && <Badge variant="draft">Draft</Badge>}
              {form.confirmed && <Badge variant={statusBadgeVariant}>{statusLabel}</Badge>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Vendor Bill No." name="reference" value={form.reference} readOnly disabled />
            <Select
              label="Vendor Name"
              name="vendor_id"
              value={form.vendor_id}
              onChange={(e) => setForm({ ...form, vendor_id: e.target.value })}
              placeholder="Select from Contact Master..."
              options={vendors.map((c) => ({ value: c.id, label: c.name }))}
              disabled={form.confirmed || !!form.po_id}
            />
            <Input
              label="Bill Reference"
              name="bill_reference"
              placeholder="Alphanumeric (e.g. ABC-26-001)"
              value={form.bill_reference}
              onChange={(e) => setForm({ ...form, bill_reference: e.target.value })}
              disabled={form.confirmed}
            />
            <Input
              label="Bill Date"
              name="date"
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
              disabled={form.confirmed}
            />
            <Input
              label="Due Date"
              name="due_date"
              type="date"
              value={form.due_date}
              onChange={(e) => setForm({ ...form, due_date: e.target.value })}
              required
              disabled={form.confirmed}
            />
            {/* Status pills — computed, not user-editable */}
            <div className="space-y-1">
              <label className={ui.label}>Status</label>
              <div className="flex items-center gap-1 border border-[#E5E3DC] rounded-lg p-1 bg-[#F8F6F1] text-xs w-fit">
                {(['not_paid', 'partial', 'paid'] as PaymentStatus[]).map((s) => (
                  <span
                    key={s}
                    className={`px-3 py-1 rounded-md font-medium ₹{
                      form.confirmed && paymentStatus === s ? 'bg-[#6B705C] text-white' : 'text-[#737373]'
                    }`}
                  >
                    {s === 'not_paid' ? 'Not Paid' : s === 'partial' ? 'Partial' : 'Paid'}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Lines Table */}
          <div className="space-y-3 pt-3">
            <h3 className="text-sm font-semibold text-[#2C2C2C] font-display">Billed Items & Expenses</h3>
            <div className="overflow-x-auto border border-[#E5E3DC] rounded-xl bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F8F6F1] border-b border-[#E5E3DC] text-[#737373] text-left text-xs font-semibold">
                    <th className="p-3 w-12">Sr. No.</th>
                    <th className="p-3">Product</th>
                    <th className="p-3">Chart of Account</th>
                    <th className="p-3">Budget Analytics</th>
                    <th className="p-3 w-20">Qty</th>
                    <th className="p-3 w-32">Unit Price</th>
                    <th className="p-3 w-36">Total</th>
                    <th className="p-3 w-12 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E3DC]">
                  {lines.map((line, idx) => (
                    <tr key={line.id || idx} className="hover:bg-[#F8F6F1]/50">
                      <td className="p-3 text-[#737373]">{idx + 1}</td>
                      <td className="p-3">
                        <select
                          className={ui.select}
                          value={line.product_id}
                          onChange={(e) => handleLineChange(idx, 'product_id', e.target.value)}
                          disabled={form.confirmed}
                        >
                          {MOCK_PRODUCTS.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-3">
                        <select
                          className={ui.select}
                          value={line.account_id || ''}
                          onChange={(e) => handleLineChange(idx, 'account_id', e.target.value)}
                          disabled={form.confirmed}
                        >
                          {MOCK_ACCOUNTS.map((a) => (
                            <option key={a.id} value={a.id}>
                              {a.code} — {a.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-3">
                        <select
                          className={ui.select}
                          value={line.analytic_account_id || ''}
                          onChange={(e) => handleLineChange(idx, 'analytic_account_id', e.target.value)}
                          disabled={form.confirmed}
                        >
                          <option value="">— none —</option>
                          {MOCK_ANALYTIC_ACCOUNTS.map((a) => (
                            <option key={a.id} value={a.id}>
                              {a.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          min="1"
                          className={ui.input}
                          value={line.quantity}
                          onChange={(e) => handleLineChange(idx, 'quantity', e.target.value)}
                          disabled={form.confirmed}
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          step="0.01"
                          className={ui.input}
                          value={line.price_unit}
                          onChange={(e) => handleLineChange(idx, 'price_unit', e.target.value)}
                          disabled={form.confirmed}
                        />
                      </td>
                      <td className="p-3 font-mono font-semibold text-[#2C2C2C]">
                        {formatCurrency(line.amount || 0)}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() => removeLine(idx)}
                          disabled={form.confirmed}
                          className="text-[#737373] hover:text-[#C0392B] p-1 disabled:opacity-30"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Button type="button" variant="secondary" size="sm" onClick={addLine} disabled={form.confirmed}>
              + Add Bill Line
            </Button>
          </div>

          {/* Summary */}
          <div className="flex justify-end pt-4 border-t border-[#E5E3DC]">
            <div className="w-72 space-y-2 text-sm">
              <div className="flex justify-between text-[#737373]">
                <span>Total Bill Amount:</span>
                <span className="font-mono text-[#2C2C2C]">{formatCurrency(totalAmount)}</span>
              </div>
              {form.confirmed && (
                <>
                  <div className="flex justify-between text-[#737373]">
                    <span>Amount Paid:</span>
                    <span className="font-mono text-[#2C2C2C]">{formatCurrency(amountPaid)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-[#2C2C2C] text-base pt-2 border-t border-[#E5E3DC]">
                    <span>Amount Due:</span>
                    <span className="font-mono text-[#6B705C]">{formatCurrency(amountDue)}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Journal entry note — honest about backend gap, no fake entry shown */}
          {showJournalNote && (
            <div className="rounded-xl border border-[#E5E3DC] bg-[#F8F6F1] p-4 text-xs text-[#737373] space-y-1">
              <p className="font-semibold text-[#2C2C2C]">Bill confirmed.</p>
              <p>
                A balanced journal entry (Purchase A/c debit / Creditor A/c credit) would
                normally be created here. That requires a JournalEntry endpoint on the
                backend which does not exist yet, so no entry has been created — this bill
                is not yet reflected in the ledger.
              </p>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E3DC]">
            <Button type="button" variant="secondary" onClick={() => router.push('/vendor-bills')}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {isNew ? 'Save Vendor Bill' : 'Update Bill'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Bill Payment Registration Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amountDue={amountDue}
        vendorName={vendors.find((v) => v.id === form.vendor_id)?.name || form.vendor_id}
        onConfirm={handleRegisterPayment}
      />
    </div>
  );
}

type PaymentType = 'send' | 'receive';

function PaymentModal({
  isOpen,
  onClose,
  amountDue,
  vendorName,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  amountDue: number;
  vendorName: string;
  onConfirm: (amount: number) => void;
}) {
  // Payment Type — default "Send" for a Vendor Bill (money going out)
  const [paymentType, setPaymentType] = useState<PaymentType>('send');
  const [amount, setAmount] = useState(amountDue);
  const [paymentVia, setPaymentVia] = useState('bank');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  // Reset the form each time the modal opens, defaulting amount to the
  // full outstanding balance.
  useEffect(() => {
    if (isOpen) {
      setPaymentType('send');
      setAmount(amountDue);
      setPaymentVia('bank');
      setDate(new Date().toISOString().split('T')[0]);
      setNote('');
      setError('');
    }
  }, [isOpen, amountDue]);

  function validate(value: number): string {
    if (!value || value === 0) return 'Payment amount cannot be zero.';
    if (value < 0) return 'Payment amount cannot be negative.';
    if (value > amountDue) {
      return `Payment amount cannot exceed the outstanding amount (₹{formatCurrency(amountDue)}).`;
    }
    return '';
  }

  function handleAmountChange(raw: string) {
    const value = parseFloat(raw) || 0;
    setAmount(value);
    setError(validate(value));
  }

  function handleConfirmClick() {
    const validationError = validate(amount);
    if (validationError) {
      setError(validationError);
      return;
    }
    onConfirm(amount);
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Register Vendor Bill Payment">
      <div className="space-y-4">
        {/* Payment Type: Send / Receive — Send is the default+correct
            direction for a Vendor Bill (outgoing payment to a vendor) */}
        <div className="space-y-1">
          <label className={ui.label}>Payment Type</label>
          <div className="flex items-center gap-1 border border-[#E5E3DC] rounded-lg p-1 bg-[#F8F6F1] text-xs w-fit">
            {(['send', 'receive'] as PaymentType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setPaymentType(t)}
                className={`px-3 py-1 rounded-md font-medium capitalize ₹{
                  paymentType === t ? 'bg-[#6B705C] text-white' : 'text-[#737373]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          {paymentType === 'receive' && (
            <p className="text-[11px] text-amber-700">
              ⚠ Vendor Bill payments are normally outgoing — double check this is intentional.
            </p>
          )}
        </div>

        <Input label="Partner" value={vendorName} readOnly disabled />

        <p className="text-xs text-[#737373]">
          Outstanding amount: <span className="font-mono font-semibold text-[#2C2C2C]">{formatCurrency(amountDue)}</span>
        </p>

        <Input
          label="Amount (₹)"
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => handleAmountChange(e.target.value)}
          error={error}
        />

        <Select
          label="Payment Via"
          value={paymentVia}
          onChange={(e) => setPaymentVia(e.target.value)}
          options={[
            { value: 'bank', label: 'Bank Account - Operating' },
            { value: 'cash', label: 'Petty Cash' },
          ]}
        />

        <Input label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />

        <Input
          label="Note (optional)"
          placeholder="Add a note..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-[#E5E3DC]">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirmClick} disabled={!!validate(amount)}>
            Confirm Payment
          </Button>
        </div>
      </div>
    </Modal>
  );
}