'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Select from '@/components/ui/Select';
import { MOCK_PRODUCTS } from '@/lib/mockData';
import { ui } from '@/lib/theme';

interface ProductFormProps {
  id: string;
}

export default function ProductForm({ id }: ProductFormProps) {
  const router = useRouter();
  const isNew = id === 'new';
  const [form, setForm] = useState({
    name: '',
    sku: '',
    lst_price: 0,
    standard_price: 0,
    qty_available: 0,
    category: 'Seating',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isNew) {
      const existing = MOCK_PRODUCTS.find((p) => p.id === id);
      if (existing) {
        setForm({
          name: existing.name,
          sku: existing.sku || '',
          lst_price: existing.lst_price,
          standard_price: existing.standard_price || 0,
          qty_available: existing.qty_available,
          category: existing.category || 'Seating',
        });
      }
    }
  }, [id, isNew]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/products');
    }, 400);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className={ui.pageTitle}>{isNew ? 'New Product' : `Edit Product: ${form.name}`}</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="Product Name" name="name" value={form.name} onChange={handleChange} required placeholder="e.g. Executive Ergonomic Chair" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Internal Reference / SKU" name="sku" value={form.sku} onChange={handleChange} placeholder="FUR-001" />
            <Select
              label="Product Category"
              name="category"
              value={form.category}
              onChange={handleChange}
              options={[
                { value: 'Seating', label: 'Seating' },
                { value: 'Tables', label: 'Tables' },
                { value: 'Living Room', label: 'Living Room' },
                { value: 'Lighting', label: 'Lighting' },
                { value: 'Storage', label: 'Storage' },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Sales Price ($)" name="lst_price" type="number" step="0.01" value={form.lst_price} onChange={handleChange} required />
            <Input label="Cost Price ($)" name="standard_price" type="number" step="0.01" value={form.standard_price} onChange={handleChange} />
            <Input label="Initial Quantity" name="qty_available" type="number" value={form.qty_available} onChange={handleChange} />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E3DC]">
            <Button type="button" variant="secondary" onClick={() => router.push('/products')}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {isNew ? 'Create Product' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
