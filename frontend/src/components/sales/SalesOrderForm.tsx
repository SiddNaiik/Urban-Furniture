'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { MOCK_SALES_ORDERS, MOCK_CONTACTS, MOCK_PRODUCTS } from '@/lib/mockData';
import { formatCurrency } from '@/lib/utils';
import { ui } from '@/lib/theme';
import type { SalesOrderLine } from '@/types/sales';

interface SalesOrderFormProps {
  id: string;
}

export default function SalesOrderForm({ id }: SalesOrderFormProps) {
  const router = useRouter();
  const isNew = id === 'new';

  const [form, setForm] = useState({
    reference: 'S00004',
    customer: 'Azure Interior',
    date: new Date().toISOString().split('T')[0],
    status: 'draft' as 'draft' | 'sale' | 'done',
  });

  const [lines, setLines] = useState<SalesOrderLine[]>([
    { id: 'sol-1', product_id: '1', name: 'Ergonomic Office Chair', quantity: 2, unit_price: 350.00, subtotal: 700.00 },
  ]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isNew) {
      const existing = MOCK_SALES_ORDERS.find((o) => o.id === id);
      if (existing) {
        setForm({
          reference: existing.reference,
          customer: existing.customer,
          date: existing.date,
          status: existing.status as any,
        });
        if (existing.order_lines && existing.order_lines.length > 0) {
          setLines(existing.order_lines);
        }
      }
    }
  }, [id, isNew]);

  function handleLineChange(index: number, field: keyof SalesOrderLine, value: any) {
    const newLines = [...lines];
    const line = { ...newLines[index], [field]: value };
    
    if (field === 'product_id') {
      const prod = MOCK_PRODUCTS.find((p) => p.id === value);
      if (prod) {
        line.name = prod.name;
        line.unit_price = prod.lst_price;
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
        id: `sol-${Date.now()}`,
        product_id: firstProd.id,
        name: firstProd.name,
        quantity: 1,
        unit_price: firstProd.lst_price,
        subtotal: firstProd.lst_price,
      },
    ]);
  }

  function removeLine(index: number) {
    if (lines.length === 1) return;
    setLines(lines.filter((_, i) => i !== index));
  }

  const untaxedAmount = lines.reduce((acc, l) => acc + (l.subtotal || 0), 0);
  const taxAmount = untaxedAmount * 0.10; // 10% tax
  const totalAmount = untaxedAmount + taxAmount;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/sales-orders');
    }, 400);
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Workflow Status Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#E5E3DC]">
        <div className="flex items-center gap-3">
          <Button type="button" variant={form.status === 'draft' ? 'primary' : 'secondary'} onClick={() => setForm({ ...form, status: 'sale' })}>
            Confirm Order
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.push('/customer-invoices/new')}>
            Create Invoice
          </Button>
        </div>

        {/* Workflow State Stage Pills */}
        <div className="flex items-center gap-1 border border-[#E5E3DC] rounded-lg p-1 bg-[#F8F6F1] text-xs">
          <span className={`px-3 py-1 rounded-md font-medium ${form.status === 'draft' ? 'bg-[#6B705C] text-white' : 'text-[#737373]'}`}>
            1. Quotation Draft
          </span>
          <span className={`px-3 py-1 rounded-md font-medium ${form.status === 'sale' ? 'bg-[#6B705C] text-white' : 'text-[#737373]'}`}>
            2. Sales Order Confirmed
          </span>
          <span className={`px-3 py-1 rounded-md font-medium ${form.status === 'done' ? 'bg-[#6B705C] text-white' : 'text-[#737373]'}`}>
            3. Done
          </span>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#E5E3DC] pb-4">
            <div>
              <h1 className={ui.pageTitle}>{form.reference}</h1>
              <p className="text-xs text-[#737373] mt-0.5">Sales Order quotation document</p>
            </div>
            <Badge variant={form.status === 'sale' ? 'confirmed' : 'draft'}>{form.status}</Badge>
          </div>

          {/* Form Header Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Order Reference" name="reference" value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} required />
            <Select
              label="Customer"
              name="customer"
              value={form.customer}
              onChange={(e) => setForm({ ...form, customer: e.target.value })}
              options={MOCK_CONTACTS.map((c) => ({ value: c.name, label: c.name }))}
            />
            <Input label="Order Date" name="date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
          </div>

          {/* Line Items Table */}
          <div className="space-y-3 pt-3">
            <h3 className="text-sm font-semibold text-[#2C2C2C] font-display">Order Lines & Products</h3>
            <div className="overflow-x-auto border border-[#E5E3DC] rounded-xl bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F8F6F1] border-b border-[#E5E3DC] text-[#737373] text-left text-xs font-semibold">
                    <th className="p-3">Product</th>
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
                              {p.name} ({formatCurrency(p.lst_price)})
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
              + Add Product Line
            </Button>
          </div>

          {/* Totals Summary */}
          <div className="flex justify-end pt-4 border-t border-[#E5E3DC]">
            <div className="w-64 space-y-2 text-sm">
              <div className="flex justify-between text-[#737373]">
                <span>Untaxed Amount:</span>
                <span className="font-mono text-[#2C2C2C]">{formatCurrency(untaxedAmount)}</span>
              </div>
              <div className="flex justify-between text-[#737373]">
                <span>Estimated Tax (10%):</span>
                <span className="font-mono text-[#2C2C2C]">{formatCurrency(taxAmount)}</span>
              </div>
              <div className="flex justify-between font-bold text-[#2C2C2C] text-base pt-2 border-t border-[#E5E3DC]">
                <span>Total:</span>
                <span className="font-mono text-[#6B705C]">{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Form Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E3DC]">
            <Button type="button" variant="secondary" onClick={() => router.push('/sales-orders')}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {isNew ? 'Save Order' : 'Update Order'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
