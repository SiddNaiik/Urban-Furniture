'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import { MOCK_VENDOR_BILLS, MOCK_CONTACTS, MOCK_PRODUCTS } from '@/lib/mockData';
import { formatCurrency } from '@/lib/utils';
import { ui } from '@/lib/theme';
import type { VendorBillLine } from '@/types/purchase';

interface VendorBillFormProps {
  id: string;
}

export default function VendorBillForm({ id }: VendorBillFormProps) {
  const router = useRouter();
  const isNew = id === 'new';

  const [form, setForm] = useState({
    reference: 'BILL/2026/09/002',
    vendor: 'WoodCraft Supplies',
    date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    status: 'draft' as 'draft' | 'posted' | 'paid',
  });

  const [lines, setLines] = useState<VendorBillLine[]>([
    { id: 'bl-1', product_id: '2', name: 'Oak Timber Raw Material', quantity: 10, price_unit: 450.00, amount: 4500.00 },
  ]);

  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    if (!isNew) {
      const existing = MOCK_VENDOR_BILLS.find((b) => b.id === id);
      if (existing) {
        setForm({
          reference: existing.reference,
          vendor: existing.vendor,
          date: existing.date,
          due_date: existing.due_date || existing.date,
          status: existing.status as any,
        });
        if (existing.lines && existing.lines.length > 0) {
          setLines(existing.lines);
        }
      }
    }
  }, [id, isNew]);

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
        id: `bl-${Date.now()}`,
        product_id: firstProd.id,
        name: firstProd.name,
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

  const totalAmount = lines.reduce((acc, l) => acc + (l.amount || 0), 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/vendor-bills');
    }, 400);
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Workflow Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#E5E3DC]">
        <div className="flex items-center gap-3">
          {form.status === 'draft' && (
            <Button type="button" onClick={() => setForm({ ...form, status: 'posted' })}>
              Confirm & Post Bill
            </Button>
          )}
          {form.status === 'posted' && (
            <Button type="button" onClick={() => setShowPaymentModal(true)}>
              Register Bill Payment
            </Button>
          )}
        </div>

        {/* State Pills */}
        <div className="flex items-center gap-1 border border-[#E5E3DC] rounded-lg p-1 bg-[#F8F6F1] text-xs">
          <span className={`px-3 py-1 rounded-md font-medium ${form.status === 'draft' ? 'bg-[#6B705C] text-white' : 'text-[#737373]'}`}>
            1. Draft
          </span>
          <span className={`px-3 py-1 rounded-md font-medium ${form.status === 'posted' ? 'bg-[#6B705C] text-white' : 'text-[#737373]'}`}>
            2. Posted
          </span>
          <span className={`px-3 py-1 rounded-md font-medium ${form.status === 'paid' ? 'bg-[#3D7A4E] text-white' : 'text-[#737373]'}`}>
            3. Paid
          </span>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#E5E3DC] pb-4">
            <div>
              <h1 className={ui.pageTitle}>{form.reference}</h1>
              <p className="text-xs text-[#737373] mt-0.5">Supplier Payable Bill Document</p>
            </div>
            <Badge variant={form.status === 'paid' ? 'paid' : form.status === 'posted' ? 'confirmed' : 'draft'}>{form.status}</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input label="Bill Reference #" name="reference" value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} required />
            <Select
              label="Vendor / Supplier"
              name="vendor"
              value={form.vendor}
              onChange={(e) => setForm({ ...form, vendor: e.target.value })}
              options={MOCK_CONTACTS.filter(c => c.type === 'vendor' || c.type === 'both').map((c) => ({ value: c.name, label: c.name }))}
            />
            <Input label="Bill Date" name="date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
            <Input label="Due Date" name="due_date" type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} required />
          </div>

          {/* Lines Table */}
          <div className="space-y-3 pt-3">
            <h3 className="text-sm font-semibold text-[#2C2C2C] font-display">Billed Items & Expenses</h3>
            <div className="overflow-x-auto border border-[#E5E3DC] rounded-xl bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F8F6F1] border-b border-[#E5E3DC] text-[#737373] text-left text-xs font-semibold">
                    <th className="p-3">Product / Expense Account</th>
                    <th className="p-3 w-28">Quantity</th>
                    <th className="p-3 w-36">Unit Price ($)</th>
                    <th className="p-3 w-36">Subtotal</th>
                    <th className="p-3 w-12 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E3DC]">
                  {lines.map((line, idx) => (
                    <tr key={line.id || idx} className="hover:bg-[#F8F6F1]/50">
                      <td className="p-3">
                        <select
                          className={ui.select}
                          value={line.product_id}
                          onChange={(e) => handleLineChange(idx, 'product_id', e.target.value)}
                        >
                          {MOCK_PRODUCTS.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
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
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          step="0.01"
                          className={ui.input}
                          value={line.price_unit}
                          onChange={(e) => handleLineChange(idx, 'price_unit', e.target.value)}
                        />
                      </td>
                      <td className="p-3 font-mono font-semibold text-[#2C2C2C]">
                        {formatCurrency(line.amount || 0)}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() => removeLine(idx)}
                          className="text-[#737373] hover:text-[#C0392B] p-1"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Button type="button" variant="secondary" size="sm" onClick={addLine}>
              + Add Bill Line
            </Button>
          </div>

          <div className="flex justify-end pt-4 border-t border-[#E5E3DC]">
            <div className="w-64 space-y-2 text-sm">
              <div className="flex justify-between font-bold text-[#2C2C2C] text-base pt-2">
                <span>Total Bill Amount:</span>
                <span className="font-mono text-[#6B705C]">{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          </div>

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
      <Modal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} title="Register Vendor Bill Payment">
        <div className="space-y-4">
          <p className="text-xs text-[#737373]">Register outgoing payment for bill {form.reference}</p>
          <Input label="Payment Amount ($)" type="number" defaultValue={totalAmount} />
          <Select
            label="Payment Account"
            options={[
              { value: 'bank', label: 'Bank Account - Operating' },
              { value: 'cash', label: 'Petty Cash' },
            ]}
          />
          <Input label="Payment Date" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
          <div className="flex justify-end gap-3 pt-4 border-t border-[#E5E3DC]">
            <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>Cancel</Button>
            <Button onClick={() => { setForm({ ...form, status: 'paid' }); setShowPaymentModal(false); }}>
              Confirm Payment Out
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
