'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { getPurchaseOrder, createPurchaseOrder, updatePurchaseOrder } from '@/lib/api';

export default function PurchaseOrderForm({ id }: { id: string }) {
  const router = useRouter();
  const isNew = id === 'new';
  const [form, setForm] = useState({ reference: '', vendor: '', date: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isNew) getPurchaseOrder(id).then(setForm);
  }, [id, isNew]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (isNew) await createPurchaseOrder(form);
      else await updatePurchaseOrder(id, form);
      router.push('/purchase-orders');
    } finally { setLoading(false); }
  }

  return (
    <Card className="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Reference" name="reference" value={form.reference} onChange={handleChange} required />
        <Input label="Vendor" name="vendor" value={form.vendor} onChange={handleChange} required />
        <Input label="Date" name="date" type="date" value={form.date} onChange={handleChange} required />
        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={loading}>{isNew ? 'Create' : 'Save'}</Button>
          <Button type="button" variant="secondary" onClick={() => router.push('/purchase-orders')}>Cancel</Button>
        </div>
      </form>
    </Card>
  );
}
