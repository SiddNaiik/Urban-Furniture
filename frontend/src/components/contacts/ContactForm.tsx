'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { MOCK_CONTACTS } from '@/lib/mockData';
import { ui } from '@/lib/theme';
import type { Contact } from '@/types/contact';

interface ContactFormProps {
  id: string;
}

export default function ContactForm({ id }: ContactFormProps) {
  const router = useRouter();
  const isNew = id === 'new';
  const [form, setForm] = useState({ name: '', email: '', phone: '', type: 'customer' as 'customer' | 'vendor' | 'both' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isNew) {
      const existing = MOCK_CONTACTS.find((c) => c.id === id);
      if (existing) {
        setForm({
          name: existing.name,
          email: existing.email || '',
          phone: existing.phone || '',
          type: (existing.type as any) || 'customer',
        });
      }
    }
  }, [id, isNew]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/contacts');
    }, 400);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className={ui.pageTitle}>{isNew ? 'New Contact' : `Edit Contact: ${form.name}`}</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="Full Name / Company Name" name="name" value={form.name} onChange={handleChange} required placeholder="e.g. Azure Interior" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} placeholder="name@example.com" />
            <Input label="Phone Number" name="phone" value={form.phone} onChange={handleChange} placeholder="+1 555-0000" />
          </div>
          <Select
            label="Contact Type"
            name="type"
            value={form.type}
            onChange={handleChange}
            options={[
              { value: 'customer', label: 'Customer' },
              { value: 'vendor', label: 'Vendor' },
              { value: 'both', label: 'Customer & Vendor' },
            ]}
          />
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E3DC]">
            <Button type="button" variant="secondary" onClick={() => router.push('/contacts')}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {isNew ? 'Create Contact' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
