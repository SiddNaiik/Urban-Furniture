'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import {
  MOCK_PURCHASE_ORDERS,
  MOCK_CONTACTS,
  MOCK_PRODUCTS,
  MOCK_ANALYTIC_ACCOUNTS,
} from '@/lib/mockData';
import { formatCurrency } from '@/lib/utils';
import { ui } from '@/lib/theme';
import type { PurchaseOrderLine } from '@/types/purchase';

interface PurchaseOrderFormProps {
  id: string;
}

/*
  NOTE ON BUDGET CHECK (mock-data limitation):
  The backend Budget model currently has no per-analytic-account line or
  linkage to a Purchase Order, so there is no real "approved/remaining
  budget for this line" to check against yet. Until that exists, we use
  MOCK_ANALYTIC_ACCOUNTS[].balance as a stand-in for "remaining approved
  budget" on that analytic account, purely so the warning behavior in the
  diagram can be demonstrated. Replace getRemainingBudget() with a real
  API call once the backend exposes budget-per-analytic-account data.
*/
function getRemainingBudget(analyticAccountId?: string): number | null {
  if (!analyticAccountId) return null;
  const acc = MOCK_ANALYTIC_ACCOUNTS.find((a) => a.id === analyticAccountId);
  return acc?.balance ?? null;
}

function generateNextPoNumber(): string {
  const nums = MOCK_PURCHASE_ORDERS.map((o) => {
    const match = o.reference.match(/(\d+)$/);
    return match ? parseInt(match[1], 10) : 0;
  });
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return `P${String(next).padStart(5, '0')}`;
}

export default function PurchaseOrderForm({ id }: PurchaseOrderFormProps) {
  const router = useRouter();
  const isNew = id === 'new';

  const [form, setForm] = useState({
    reference: isNew ? generateNextPoNumber() : '',
    vendor_id: '',
    date: new Date().toISOString().split('T')[0],
    status: 'draft' as 'draft' | 'purchase' | 'done',
  });

  const [lines, setLines] = useState<PurchaseOrderLine[]>([
    { id: 'pol-1', product_id: MOCK_PRODUCTS[0].id, name: MOCK_PRODUCTS[0].name, quantity: 1, unit_price: MOCK_PRODUCTS[0].standard_price || 0, subtotal: MOCK_PRODUCTS[0].standard_price || 0 },
  ]);

  const [loading, setLoading] = useState(false);
  const [showBudgetWarning, setShowBudgetWarning] = useState(false);

  const vendors = MOCK_CONTACTS.filter((c) => c.type === 'vendor' || c.type === 'both');

  useEffect(() => {
    if (!isNew) {
      const existing = MOCK_PURCHASE_ORDERS.find((o) => o.id === id);
      if (existing) {
        const vendorContact = MOCK_CONTACTS.find((c) => c.name === existing.vendor);
        setForm({
          reference: existing.reference,
          vendor_id: vendorContact?.id || '',
          date: existing.date,
          status: existing.status as any,
        });
        if (existing.order_lines && existing.order_lines.length > 0) {
          setLines(existing.order_lines);
        }
      }
    }
  }, [id, isNew]);

  function handleLineChange(index: number, field: keyof PurchaseOrderLine, value: any) {
    const newLines = [...lines];
    const line = { ...newLines[index], [field]: value };

    if (field === 'product_id') {
      const prod = MOCK_PRODUCTS.find((p) => p.id === value);
      if (prod) {
        line.name = prod.name;
        line.unit_price = prod.standard_price || 100;
      }
    }

    const qty = field === 'quantity' ? parseFloat(value) || 0 : line.quantity;
    const price = field === 'unit_price' ? parseFloat(value) || 0 : line.unit_price;
    line.subtotal = qty * price;

    newLines[index] = line;
    setLines(newLines);
  }

  function addLine() {
    const firstProd = MOCK_PRODUCTS[0];
    setLines([
      ...lines,
      {
        id: `pol-${Date.now()}`,
        product_id: firstProd.id,
        name: firstProd.name,
        quantity: 1,
        unit_price: firstProd.standard_price || 100,
        subtotal: firstProd.standard_price || 100,
      },
    ]);
  }

  function removeLine(index: number) {
    if (lines.length === 1) return;
    setLines(lines.filter((_, i) => i !== index));
  }

  const totalAmount = useMemo(
    () => lines.reduce((acc, l) => acc + (l.subtotal || 0), 0),
    [lines]
  );

  // Non-blocking check: does any line exceed its analytic account's
  // remaining approved budget?
  const exceedsBudget = useMemo(() => {
    return lines.some((line) => {
      const remaining = getRemainingBudget(line.analytic_account_id);
      if (remaining === null) return false;
      return (line.subtotal || 0) > remaining;
    });
  }, [lines]);

  function handleConfirm() {
    setShowBudgetWarning(exceedsBudget);
    // Non-blocking: confirmation proceeds regardless of the warning.
    setForm((f) => ({ ...f, status: 'purchase' }));
  }

  function handleCreateBill() {
    // Preserve PO data for Part 2 (Vendor Bill creation) by passing the
    // PO id through the route. VendorBillForm can look this PO up (via
    // MOCK_PURCHASE_ORDERS today, or a real GET /purchase-orders/{id}
    // once that endpoint exists) to pre-fill vendor, product, price, qty.
    router.push(`/vendor-bills/new?po_id=${id}`);
  }

  const totalAmount = lines.reduce((acc, l) => acc + (l.subtotal || 0), 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/purchase-orders');
    }, 400);
  }

  const isConfirmed = form.status === 'purchase' || form.status === 'done';

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Workflow Action Strip — New / Confirm / Create Bill / Cancel / Back */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#E5E3DC]">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push('/purchase-orders/new')}
          >
            New
          </Button>
          <Button
            type="button"
            variant={isConfirmed ? 'secondary' : 'primary'}
            disabled={isConfirmed}
            onClick={handleConfirm}
          >
            Confirm
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={!isConfirmed}
            onClick={handleCreateBill}
          >
            Create Bill
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Button type="button" variant="secondary" onClick={() => router.push('/purchase-orders')}>
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
              <p className="text-xs text-[#737373] mt-0.5">
                {isNew ? 'Auto-generated PO number (last PO + 1)' : 'Supplier Purchase Procurement Order'}
              </p>
            </div>
            <Badge variant={isConfirmed ? 'confirmed' : 'draft'}>
              {isConfirmed ? 'Confirmed' : 'Draft'}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="PO No."
              name="reference"
              value={form.reference}
              readOnly
              disabled
            />
            <Select
              label="Vendor Name"
              name="vendor_id"
              value={form.vendor_id}
              onChange={(e) => setForm({ ...form, vendor_id: e.target.value })}
              placeholder="Select from Contact Master..."
              options={vendors.map((c) => ({ value: c.id, label: c.name }))}
              disabled={isConfirmed}
            />
            <Input
              label="PO Date"
              name="date"
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
              disabled={isConfirmed}
            />
          </div>

          {/* Lines Table */}
          <div className="space-y-3 pt-3">
            <h3 className="text-sm font-semibold text-[#2C2C2C] font-display">Purchased Items & Materials</h3>
            <div className="overflow-x-auto border border-[#E5E3DC] rounded-xl bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F8F6F1] border-b border-[#E5E3DC] text-[#737373] text-left text-xs font-semibold">
                    <th className="p-3 w-12">Sr. No.</th>
                    <th className="p-3">Product</th>
                    <th className="p-3">Budget Analytics</th>
                    <th className="p-3 w-24">Quantity</th>
                    <th className="p-3 w-32">Unit Price</th>
                    <th className="p-3 w-36">Total</th>
                    <th className="p-3 w-12 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E3DC]">
                  {lines.map((line, idx) => {
                    const remaining = getRemainingBudget(line.analytic_account_id);
                    const lineExceeds = remaining !== null && (line.subtotal || 0) > remaining;
                    return (
                      <tr key={line.id || idx} className="hover:bg-[#F8F6F1]/50">
                        <td className="p-3 text-[#737373]">{idx + 1}</td>
                        <td className="p-3">
                          <select
                            className={ui.select}
                            value={line.product_id}
                            onChange={(e) => handleLineChange(idx, 'product_id', e.target.value)}
                            disabled={isConfirmed}
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
                            value={line.analytic_account_id || ''}
                            onChange={(e) => handleLineChange(idx, 'analytic_account_id', e.target.value)}
                            disabled={isConfirmed}
                          >
                            <option value="">— none —</option>
                            {MOCK_ANALYTIC_ACCOUNTS.map((a) => (
                              <option key={a.id} value={a.id}>
                                {a.name}
                              </option>
                            ))}
                          </select>
                          {lineExceeds && (
                            <p className="text-[11px] text-amber-700 mt-1">
                              ⚠ Exceeds Approved Budget
                            </p>
                          )}
                        </td>
                        <td className="p-3">
                          <input
                            type="number"
                            min="1"
                            className={ui.input}
                            value={line.quantity}
                            onChange={(e) => handleLineChange(idx, 'quantity', e.target.value)}
                            disabled={isConfirmed}
                          />
                        </td>
                        <td className="p-3">
                          <input
                            type="number"
                            step="0.01"
                            className={ui.input}
                            value={line.unit_price}
                            onChange={(e) => handleLineChange(idx, 'unit_price', e.target.value)}
                            disabled={isConfirmed}
                          />
                        </td>
                        <td className="p-3 font-mono font-semibold text-[#2C2C2C]">
                          {formatCurrency(line.subtotal || 0)}
                        </td>
                        <td className="p-3 text-center">
                          <button
                            type="button"
                            onClick={() => removeLine(idx)}
                            disabled={isConfirmed}
                            className="text-[#737373] hover:text-[#C0392B] p-1 disabled:opacity-30"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <Button type="button" variant="secondary" size="sm" onClick={addLine} disabled={isConfirmed}>
              + Add Material Line
            </Button>
          </div>

          {/* Summary */}
          <div className="flex justify-end pt-4 border-t border-[#E5E3DC]">
            <div className="w-64 space-y-2 text-sm">
              <div className="flex justify-between font-bold text-[#2C2C2C] text-base pt-2">
                <span>Total PO Amount:</span>
                <span className="font-mono text-[#6B705C]">{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Non-blocking budget warning banner (shown after Confirm) */}
          {showBudgetWarning && (
            <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800 space-y-1">
              <p className="font-semibold">⚠ Exceeds Approved Budget</p>
              <p className="text-xs">
                The entered amount is higher than the remaining budget amount for this
                budget line. Consider adjusting the value or revise the budget. The
                Purchase Order has still been confirmed.
              </p>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E3DC]">
            <Button type="button" variant="secondary" onClick={() => router.push('/purchase-orders')}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {isNew ? 'Save Purchase Order' : 'Save PO'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}