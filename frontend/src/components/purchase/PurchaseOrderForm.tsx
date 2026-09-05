'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { MOCK_PURCHASE_ORDERS, MOCK_CONTACTS, MOCK_PRODUCTS } from '@/lib/mockData';
import { formatCurrency } from '@/lib/utils';
import { ui } from '@/lib/theme';
import type { PurchaseOrderLine } from '@/types/purchase';

interface PurchaseOrderFormProps {
  id: string;
}

export default function PurchaseOrderForm({ id }: PurchaseOrderFormProps) {
  const router = useRouter();
  const isNew = id === 'new';

  const [form, setForm] = useState({
    reference: 'P00003',
    vendor: 'WoodCraft Supplies',
    date: new Date().toISOString().split('T')[0],
    status: 'draft' as 'draft' | 'purchase' | 'done',
  });

  const [lines, setLines] = useState<PurchaseOrderLine[]>([
    { id: 'pol-1', product_id: '2', name: 'Oak Timber Raw Material', quantity: 5, unit_price: 450.00, subtotal: 2250.00 },
  ]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isNew) {
      const existing = MOCK_PURCHASE_ORDERS.find((o) => o.id === id);
      if (existing) {
        setForm({
          reference: existing.reference,
          vendor: existing.vendor,
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

  const totalAmount = lines.reduce((acc, l) => acc + (l.subtotal || 0), 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/purchase-orders');
    }, 400);
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Workflow Action Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#E5E3DC]">
        <div className="flex items-center gap-3">
          <Button type="button" variant={form.status === 'draft' ? 'primary' : 'secondary'} onClick={() => setForm({ ...form, status: 'purchase' })}>
            Confirm Purchase Order
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.push('/vendor-bills/new')}>
            Create Vendor Bill
          </Button>
        </div>

        {/* State Pills */}
        <div className="flex items-center gap-1 border border-[#E5E3DC] rounded-lg p-1 bg-[#F8F6F1] text-xs">
          <span className={`px-3 py-1 rounded-md font-medium ${form.status === 'draft' ? 'bg-[#6B705C] text-white' : 'text-[#737373]'}`}>
            1. RFQ Draft
          </span>
          <span className={`px-3 py-1 rounded-md font-medium ${form.status === 'purchase' ? 'bg-[#6B705C] text-white' : 'text-[#737373]'}`}>
            2. PO Confirmed
          </span>
          <span className={`px-3 py-1 rounded-md font-medium ${form.status === 'done' ? 'bg-[#6B705C] text-white' : 'text-[#737373]'}`}>
            3. Received
          </span>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#E5E3DC] pb-4">
            <div>
              <h1 className={ui.pageTitle}>{form.reference}</h1>
              <p className="text-xs text-[#737373] mt-0.5">Supplier Purchase Procurement Order</p>
            </div>
            <Badge variant={form.status === 'purchase' ? 'confirmed' : 'draft'}>{form.status}</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="PO Reference" name="reference" value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} required />
            <Select
              label="Vendor"
              name="vendor"
              value={form.vendor}
              onChange={(e) => setForm({ ...form, vendor: e.target.value })}
              options={MOCK_CONTACTS.filter(c => c.type === 'vendor' || c.type === 'both').map((c) => ({ value: c.name, label: c.name }))}
            />
            <Input label="Order Date" name="date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
          </div>

          {/* Lines Table */}
          <div className="space-y-3 pt-3">
            <h3 className="text-sm font-semibold text-[#2C2C2C] font-display">Purchased Items & Materials</h3>
            <div className="overflow-x-auto border border-[#E5E3DC] rounded-xl bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F8F6F1] border-b border-[#E5E3DC] text-[#737373] text-left text-xs font-semibold">
                    <th className="p-3">Product / Material</th>
                    <th className="p-3 w-28">Quantity</th>
                    <th className="p-3 w-36">Cost Price ($)</th>
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
                          value={line.unit_price}
                          onChange={(e) => handleLineChange(idx, 'unit_price', e.target.value)}
                        />
                      </td>
                      <td className="p-3 font-mono font-semibold text-[#2C2C2C]">
                        {formatCurrency(line.subtotal || 0)}
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

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E3DC]">
            <Button type="button" variant="secondary" onClick={() => router.push('/purchase-orders')}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {isNew ? 'Create Purchase Order' : 'Save PO'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
