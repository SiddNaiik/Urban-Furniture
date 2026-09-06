'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { ui } from '@/lib/theme';

export default function CoAForm({ id }: { id: string }) {
  const router = useRouter();
  const isNew = id === 'new';
  const [form, setForm] = useState({ code: '101100', name: 'Petty Cash Operating Account', type: 'asset', balance: 5000 });
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/chart-of-accounts');
    }, 400);
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className={ui.pageTitle}>{isNew ? 'New General Ledger Account' : `Edit Account: ₹{form.code}`}</h1>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Account Code" name="code" value={form.code} onChange={handleChange} required placeholder="101000" />
            <Select
              label="Account Type"
              name="type"
              value={form.type}
              onChange={handleChange}
              options={[
                { value: 'asset', label: 'Asset' },
                { value: 'liability', label: 'Liability' },
                { value: 'equity', label: 'Equity' },
                { value: 'income', label: 'Income' },
                { value: 'expense', label: 'Expense' },
              ]}
            />
          </div>
          <Input label="Account Name" name="name" value={form.name} onChange={handleChange} required placeholder="e.g. Bank Operating Account" />
          <Input label="Opening Balance (₹)" name="balance" type="number" step="0.01" value={form.balance} onChange={handleChange} />
          
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E3DC]">
            <Button type="button" variant="secondary" onClick={() => router.push('/chart-of-accounts')}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {isNew ? 'Create Account' : 'Save Account'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
