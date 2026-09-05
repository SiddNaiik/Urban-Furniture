'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { getProduct, createProduct, updateProduct } from '@/lib/api';

interface ProductFormProps {
  id: string;
}

const defaultForm = { name: '', sku: '', category: '', price: '' };

export default function ProductForm({ id }: ProductFormProps) {
  const router = useRouter();
  const isNew = id === 'new';
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isNew) getProduct(id).then((d) => setForm(d));
  }, [id, isNew]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (isNew) await createProduct(form);
      else await updateProduct(id, form);
      router.push('/products');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Name" name="name" value={form.name} onChange={handleChange} required />
        <Input label="SKU" name="sku" value={form.sku} onChange={handleChange} />
        <Input label="Category" name="category" value={form.category} onChange={handleChange} />
        <Input label="Price" name="price" type="number" value={form.price} onChange={handleChange} />
        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={loading}>{isNew ? 'Create' : 'Save'}</Button>
          <Button type="button" variant="secondary" onClick={() => router.push('/products')}>Cancel</Button>
        </div>
      </form>
    </Card>
  );
}
