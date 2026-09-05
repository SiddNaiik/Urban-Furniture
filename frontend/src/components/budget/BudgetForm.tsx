'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { ui } from '@/lib/theme';

export default function BudgetForm({ id }: { id: string }) {
  const router = useRouter();
  const isNew = id === 'new';
  const [form, setForm] = useState({
    name: 'Q4 2026 Operational Budget',
    date_from: '2026-10-01',
    date_to: '2026-12-31',
    state: 'draft' as 'draft' | 'confirm' | 'done',
  });
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/budgets');
    }, 400);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#E5E3DC]">
        <Button type="button" onClick={() => setForm({ ...form, state: 'confirm' })}>
          Confirm Budget
        </Button>
        <Badge variant={form.state === 'done' ? 'confirmed' : 'draft'}>{form.state}</Badge>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="Budget Title" name="name" value={form.name} onChange={handleChange} required placeholder="e.g. Q3 Marketing Budget" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Start Date" name="date_from" type="date" value={form.date_from} onChange={handleChange} required />
            <Input label="End Date" name="date_to" type="date" value={form.date_to} onChange={handleChange} required />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E3DC]">
            <Button type="button" variant="secondary" onClick={() => router.push('/budgets')}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {isNew ? 'Create Budget' : 'Save Budget'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
