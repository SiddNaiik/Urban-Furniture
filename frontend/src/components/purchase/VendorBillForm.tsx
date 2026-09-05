'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { getVendorBill, createVendorBill, updateVendorBill } from '@/lib/api';

export default function VendorBillForm({ id }: { id: string }) {
  const router = useRouter();
  const isNew = id === 'new';
  const [form, setForm] = useState({ reference: '', vendor: '', date: '', amount: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isNew) getVendorBill(id).then(setForm);
  }, [id, isNew]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (isNew) await createVendorBill(form);
      else await updateVendorBill(id, form);
      router.push('/vendor-bills');
    } finally { setLoading(false); }
  }

  return (
    <Card className="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Reference" name="reference" value={form.reference} onChange={handleChange} />
        <Input label="Vendor" name="vendor" value={form.vendor} onChange={handleChange} required />
        <Input label="Date" name="date" type="date" value={form.date} onChange={handleChange} required />
        <Input label="Amount" name="amount" type="number" value={form.amount} onChange={handleChange} required />
        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={loading}>{isNew ? 'Create' : 'Save'}</Button>
          <Button type="button" variant="secondary" onClick={() => router.push('/vendor-bills')}>Cancel</Button>
        </div>
      </form>
    </Card>
  );
}
