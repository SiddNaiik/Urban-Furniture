'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { getJournal, createJournal, updateJournal } from '@/lib/api';

export default function JournalForm({ id }: { id: string }) {
  const router = useRouter();
  const isNew = id === 'new';
  const [form, setForm] = useState({ name: '', code: '', type: 'general' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isNew) getJournal(id).then(setForm);
  }, [id, isNew]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (isNew) await createJournal(form);
      else await updateJournal(id, form);
      router.push('/journals');
    } finally { setLoading(false); }
  }

  return (
    <Card className="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Name" name="name" value={form.name} onChange={handleChange} required />
        <Input label="Code" name="code" value={form.code} onChange={handleChange} required />
        <Select label="Type" name="type" value={form.type} onChange={handleChange} options={[
          { value: 'general', label: 'General' },
          { value: 'sale', label: 'Sales' },
          { value: 'purchase', label: 'Purchase' },
          { value: 'cash', label: 'Cash' },
          { value: 'bank', label: 'Bank' },
        ]} />
        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={loading}>{isNew ? 'Create' : 'Save'}</Button>
          <Button type="button" variant="secondary" onClick={() => router.push('/journals')}>Cancel</Button>
        </div>
      </form>
    </Card>
  );
}
