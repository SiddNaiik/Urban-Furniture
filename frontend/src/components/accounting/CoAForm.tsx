'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { getAccount, createAccount, updateAccount } from '@/lib/api';

const ACCOUNT_TYPES = [
  { value: 'asset', label: 'Asset' },
  { value: 'liability', label: 'Liability' },
  { value: 'equity', label: 'Equity' },
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' },
];

export default function CoAForm({ id }: { id: string }) {
  const router = useRouter();
  const isNew = id === 'new';
  const [form, setForm] = useState({ code: '', name: '', type: 'asset' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isNew) getAccount(id).then(setForm);
  }, [id, isNew]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (isNew) await createAccount(form);
      else await updateAccount(id, form);
      router.push('/chart-of-accounts');
    } finally { setLoading(false); }
  }

  return (
    <Card className="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Code" name="code" value={form.code} onChange={handleChange} required />
        <Input label="Name" name="name" value={form.name} onChange={handleChange} required />
        <Select label="Type" name="type" value={form.type} onChange={handleChange} options={ACCOUNT_TYPES} />
        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={loading}>{isNew ? 'Create' : 'Save'}</Button>
          <Button type="button" variant="secondary" onClick={() => router.push('/chart-of-accounts')}>Cancel</Button>
        </div>
      </form>
    </Card>
  );
}
