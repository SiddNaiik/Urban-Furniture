'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { ui } from '@/lib/theme';
import { MOCK_CATEGORIES } from '@/lib/mockData';
import type { Product } from '@/types/product';

function EditProductModal({
  product,
  onClose,
  onSave,
}: {
  product: Product;
  onClose: () => void;
  onSave: (updated: Product) => void;
}) {
  const [form, setForm] = useState({
    name: product.name,
    type: product.type,
    category_id: product.category_id,
    sales_price: product.sales_price,
    cost: product.cost,
    is_active: product.is_active,
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const category = MOCK_CATEGORIES.find((c) => c.id === form.category_id)?.name;
    onSave({ ...product, ...form, category });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#2C2C2C] font-display">Edit Product</h2>
          <button onClick={onClose} className="text-[#737373] hover:text-[#2C2C2C] transition-colors p-1">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={ui.label}>Product Name</label>
            <input className={ui.input} name="name" value={form.name} onChange={handleChange} required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={ui.label}>Type</label>
              <select className={ui.select} name="type" value={form.type} onChange={handleChange}>
                <option value="Goods">Goods</option>
                <option value="Service">Service</option>
                <option value="Combo">Combo</option>
              </select>
            </div>
            <div>
              <label className={ui.label}>Category</label>
              <select className={ui.select} name="category_id" value={form.category_id} onChange={handleChange}>
                {MOCK_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={ui.label}>Sales Price (₹)</label>
              <input className={ui.input} type="number" step="0.01" name="sales_price" value={form.sales_price} onChange={handleChange} required />
            </div>
            <div>
              <label className={ui.label}>Cost (₹)</label>
              <input className={ui.input} type="number" step="0.01" name="cost" value={form.cost} onChange={handleChange} required />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-[#2C2C2C]">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm((prev) => ({ ...prev, is_active: e.target.checked }))}
              className="rounded border-[#E5E3DC]"
            />
            Active
          </label>

          <div className="flex justify-end gap-3 pt-2 border-t border-[#E5E3DC]">
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProductKanban({
  products,
  onUpdateProduct,
}: {
  products: Product[];
  onUpdateProduct?: (updated: Product) => void;
}) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  function handleSave(updated: Product) {
    onUpdateProduct?.(updated);
    setEditingProduct(null);
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((p) => (
          <Card key={p.id} className="hover:border-[#6B705C] transition-all cursor-pointer shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A5A58D] font-mono">
                  {p.category || 'GENERAL'}
                </span>
                <Badge variant={p.is_active ? 'success' : 'warning'}>
                  {p.is_active ? 'Active' : 'Archived'}
                </Badge>
              </div>
              <div className="w-full h-24 rounded-md bg-[#FAFAF8] border border-[#E5E3DC] flex items-center justify-center mb-2 overflow-hidden">
                {p.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs text-[#A5A58D]">Image</span>
                )}
              </div>
              <h4 className="font-semibold text-[#2C2C2C] text-base font-display mb-1">{p.name}</h4>
              <Badge variant="warning">{p.type}</Badge>
            </div>

            <div className="mt-5 pt-3 border-t border-[#E5E3DC] flex items-center justify-between">
              <span className="text-base font-semibold text-[#2C2C2C] font-mono">{formatCurrency(p.sales_price)}</span>
              <button
                onClick={() => setEditingProduct(p)}
                className="text-xs text-[#6B705C] font-medium hover:underline"
              >
                Edit Product →
              </button>
            </div>
          </Card>
        ))}
      </div>

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={handleSave}
        />
      )}
    </>
  );
}