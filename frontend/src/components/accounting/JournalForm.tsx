'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { ui } from '@/lib/theme';

export default function JournalForm({ id }: { id: string }) {
  const router = useRouter();
  const isNew = id === 'new';
  const [form, setForm] = useState({ code: 'BNK2', name: 'Secondary Bank Journal', type: 'bank' });
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/journals');
    }, 400);
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className={ui.pageTitle}>{isNew ? 'New Accounting Journal' : `Edit Journal: ${form.name}`}</h1>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Journal Name" name="name" value={form.name} onChange={handleChange} required placeholder="e.g. Sales Invoices" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Short Code" name="code" value={form.code} onChange={handleChange} required placeholder="INV" />
            <Select
              label="Journal Type"
              name="type"
              value={form.type}
              onChange={handleChange}
              options={[
                { value: 'sale', label: 'Sales' },
                { value: 'purchase', label: 'Purchase' },
                { value: 'cash', label: 'Cash' },
                { value: 'bank', label: 'Bank' },
                { value: 'general', label: 'Miscellaneous / General' },
              ]}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E3DC]">
            <Button type="button" variant="secondary" onClick={() => router.push('/journals')}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {isNew ? 'Create Journal' : 'Save Journal'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
