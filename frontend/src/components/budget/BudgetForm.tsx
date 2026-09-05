'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { getBudget, createBudget, updateBudget } from '@/lib/api';

export default function BudgetForm({ id }: { id: string }) {
  const router = useRouter();
  const isNew = id === 'new';
  const [form, setForm] = useState({ name: '', period: '', total_amount: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isNew) getBudget(id).then(setForm);
  }, [id, isNew]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (isNew) await createBudget(form);
      else await updateBudget(id, form);
      router.push('/budgets');
    } finally { setLoading(false); }
  }

  return (
    <Card className="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Name" name="name" value={form.name} onChange={handleChange} required />
        <Input label="Period (e.g. 2024-Q1)" name="period" value={form.period} onChange={handleChange} required />
        <Input label="Total Amount" name="total_amount" type="number" value={form.total_amount} onChange={handleChange} />
        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={loading}>{isNew ? 'Create' : 'Save'}</Button>
          <Button type="button" variant="secondary" onClick={() => router.push('/budgets')}>Cancel</Button>
        </div>
      </form>
    </Card>
  );
}
