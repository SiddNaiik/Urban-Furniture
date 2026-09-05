'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { createUser } from '@/lib/api';
import type { Role } from '@/types/user';

const ROLE_OPTIONS = [
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Manager' },
  { value: 'accountant', label: 'Accountant' },
  { value: 'sales', label: 'Sales' },
  { value: 'inventory', label: 'Inventory' },
  { value: 'user', label: 'User' },
];

export default function UserCreateForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user' as Role,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await createUser(form);
      router.push('/users');
    } catch {
      setError('Failed to create user.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="max-w-xl">
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Name" name="name" value={form.name} onChange={handleChange} required />
        <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
        <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} required />
        <Select label="Role" name="role" value={form.role} onChange={handleChange} options={ROLE_OPTIONS} />
        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={loading}>Create</Button>
          <Button type="button" variant="secondary" onClick={() => router.push('/users')}>Cancel</Button>
        </div>
      </form>
    </Card>
  );
}
