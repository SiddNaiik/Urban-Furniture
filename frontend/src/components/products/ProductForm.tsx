'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Select from '@/components/ui/Select';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '@/lib/mockData';
import { ui } from '@/lib/theme';
import type { ProductType } from '@/types/product';

interface ProductFormProps {
  id: string;
}

const CREATE_NEW = '__create_new__';

export default function ProductForm({ id }: ProductFormProps) {
  const router = useRouter();
  const isNew = id === 'new';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState(MOCK_CATEGORIES);
  const [form, setForm] = useState({
    name: '',
    type: 'Goods' as ProductType,
    category_id: categories[0]?.id ?? '',
    sales_price: 0,
    cost: 0,
    image_url: '' as string | null,
    is_active: true,
  });
  const [newCategoryName, setNewCategoryName] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isNew) {
      const existing = MOCK_PRODUCTS.find((p) => p.id === id);
      if (existing) {
        setForm({
          name: existing.name,
          type: existing.type,
          category_id: existing.category_id,
          sales_price: existing.sales_price,
          cost: existing.cost,
          image_url: existing.image_url ?? '',
          is_active: existing.is_active,
        });
        setImagePreview(existing.image_url ?? null);
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

  function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    if (value === CREATE_NEW) {
      setForm((prev) => ({ ...prev, category_id: CREATE_NEW }));
      return;
    }
    setForm((prev) => ({ ...prev, category_id: value }));
  }

  function handleConfirmNewCategory() {
    if (!newCategoryName.trim()) return;
    const newCat = { id: `cat-₹{Date.now()}`, name: newCategoryName.trim() };
    setCategories((prev) => [...prev, newCat]);
    setForm((prev) => ({ ...prev, category_id: newCat.id }));
    setNewCategoryName('');
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImagePreview(url);
    setForm((prev) => ({ ...prev, image_url: url }));
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
        <h1 className={ui.pageTitle}>{isNew ? 'New Product' : `Edit Product: ₹{form.name}`}</h1>
      </div>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Product Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="e.g. Air Conditioner"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Product Type"
              name="type"
              value={form.type}
              onChange={handleChange}
              options={[
                { value: 'Goods', label: 'Goods' },
                { value: 'Service', label: 'Service' },
                { value: 'Combo', label: 'Combo' },
              ]}
            />

            <div>
              <Select
                label="Category"
                name="category_id"
                value={form.category_id}
                onChange={handleCategoryChange}
                options={[
                  ...categories.map((c) => ({ value: c.id, label: c.name })),
                  { value: CREATE_NEW, label: '+ Create new category…' },
                ]}
              />
              {form.category_id === CREATE_NEW && (
                <div className="flex gap-2 mt-2">
                  <Input
                    name="newCategory"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="New category name"
                  />
                  <Button type="button" variant="secondary" onClick={handleConfirmNewCategory}>
                    Add
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Sales Price (₹)"
              name="sales_price"
              type="number"
              step="0.01"
              value={form.sales_price}
              onChange={handleChange}
              required
            />
            <Input
              label="Cost (₹)"
              name="cost"
              type="number"
              step="0.01"
              value={form.cost}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Product Image</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-32 h-32 rounded-lg border-2 border-dashed border-[#E5E3DC] flex items-center justify-center cursor-pointer hover:border-[#6B705C] transition-colors overflow-hidden bg-[#FAFAF8]"
            >
              {imagePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imagePreview} alt="Product" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs text-[#A5A58D] text-center px-2">Upload Image</span>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
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