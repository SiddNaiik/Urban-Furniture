'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { getAnalyticAccount, createAnalyticAccount, updateAnalyticAccount } from '@/lib/api';

export default function AnalyticAccountForm({ id }: { id: string }) {
  const router = useRouter();
  const isNew = id === 'new';
  const [form, setForm] = useState({ code: '', name: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isNew) getAnalyticAccount(id).then(setForm);
  }, [id, isNew]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (isNew) await createAnalyticAccount(form);
      else await updateAnalyticAccount(id, form);
      router.push('/analytic-accounts');
    } finally { setLoading(false); }
  }

  return (
    <Card className="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Code" name="code" value={form.code} onChange={handleChange} required />
        <Input label="Name" name="name" value={form.name} onChange={handleChange} required />
        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={loading}>{isNew ? 'Create' : 'Save'}</Button>
          <Button type="button" variant="secondary" onClick={() => router.push('/analytic-accounts')}>Cancel</Button>
        </div>
      </form>
    </Card>
  );
}
