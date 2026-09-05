'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { getCustomerInvoice, createCustomerInvoice, updateCustomerInvoice } from '@/lib/api';

export default function CustomerInvoiceForm({ id }: { id: string }) {
  const router = useRouter();
  const isNew = id === 'new';
  const [form, setForm] = useState({ number: '', customer: '', date: '', amount: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isNew) getCustomerInvoice(id).then(setForm);
  }, [id, isNew]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (isNew) await createCustomerInvoice(form);
      else await updateCustomerInvoice(id, form);
      router.push('/customer-invoices');
    } finally { setLoading(false); }
  }

  return (
    <Card className="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Invoice #" name="number" value={form.number} onChange={handleChange} />
        <Input label="Customer" name="customer" value={form.customer} onChange={handleChange} required />
        <Input label="Date" name="date" type="date" value={form.date} onChange={handleChange} required />
        <Input label="Amount" name="amount" type="number" value={form.amount} onChange={handleChange} required />
        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={loading}>{isNew ? 'Create' : 'Save'}</Button>
          <Button type="button" variant="secondary" onClick={() => router.push('/customer-invoices')}>Cancel</Button>
        </div>
      </form>
    </Card>
  );
}
