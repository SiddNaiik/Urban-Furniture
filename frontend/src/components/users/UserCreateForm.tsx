'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { ui } from '@/lib/theme';

export default function UserCreateForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Accountant' });
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/users');
    }, 400);
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className={ui.pageTitle}>Create System User</h1>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Full Name" name="name" value={form.name} onChange={handleChange} required placeholder="e.g. John Doe" />
          <Input label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="user@urbanfurniture.com" />
          <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} required placeholder="••••••••" />
          <Select
            label="System Role"
            name="role"
            value={form.role}
            onChange={handleChange}
            options={[
              { value: 'Administrator', label: 'Administrator (Full Access)' },
              { value: 'Accountant', label: 'Accountant (Finance & Accounting)' },
              { value: 'Sales Manager', label: 'Sales Manager (Sales & Customers)' },
            ]}
          />
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E3DC]">
            <Button type="button" variant="secondary" onClick={() => router.push('/users')}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Create User Account
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
