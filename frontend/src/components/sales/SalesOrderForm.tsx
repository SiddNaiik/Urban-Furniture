'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { getSalesOrder, createSalesOrder, updateSalesOrder } from '@/lib/api';

export default function SalesOrderForm({ id }: { id: string }) {
  const router = useRouter();
  const isNew = id === 'new';
  const [form, setForm] = useState({ reference: '', customer: '', date: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isNew) getSalesOrder(id).then(setForm);
  }, [id, isNew]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (isNew) await createSalesOrder(form);
      else await updateSalesOrder(id, form);
      router.push('/sales-orders');
    } finally { setLoading(false); }
  }

  return (
    <Card className="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Reference" name="reference" value={form.reference} onChange={handleChange} />
        <Input label="Customer" name="customer" value={form.customer} onChange={handleChange} required />
        <Input label="Date" name="date" type="date" value={form.date} onChange={handleChange} required />
        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={loading}>{isNew ? 'Create' : 'Save'}</Button>
          <Button type="button" variant="secondary" onClick={() => router.push('/sales-orders')}>Cancel</Button>
        </div>
      </form>
    </Card>
  );
}
