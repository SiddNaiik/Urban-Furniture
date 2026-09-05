'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { getJournalEntry, createJournalEntry, updateJournalEntry } from '@/lib/api';

export default function JournalEntryForm({ id }: { id: string }) {
  const router = useRouter();
  const isNew = id === 'new';
  const [form, setForm] = useState({ date: '', reference: '', journal: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isNew) getJournalEntry(id).then(setForm);
  }, [id, isNew]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (isNew) await createJournalEntry(form);
      else await updateJournalEntry(id, form);
      router.push('/journal-entries');
    } finally { setLoading(false); }
  }

  return (
    <Card className="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Date" name="date" type="date" value={form.date} onChange={handleChange} required />
        <Input label="Reference" name="reference" value={form.reference} onChange={handleChange} />
        <Input label="Journal" name="journal" value={form.journal} onChange={handleChange} />
        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={loading}>{isNew ? 'Create' : 'Save'}</Button>
          <Button type="button" variant="secondary" onClick={() => router.push('/journal-entries')}>Cancel</Button>
        </div>
      </form>
    </Card>
  );
}
