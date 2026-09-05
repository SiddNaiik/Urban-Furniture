'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { getContact, createContact, updateContact } from '@/lib/api';

interface ContactFormProps {
  id: string;
}

const defaultForm = { name: '', email: '', phone: '', type: 'customer' as const };

export default function ContactForm({ id }: ContactFormProps) {
  const router = useRouter();
  const isNew = id === 'new';
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isNew) {
      getContact(id).then((data) => setForm(data));
    }
  }, [id, isNew]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (isNew) await createContact(form);
      else await updateContact(id, form);
      router.push('/contacts');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Name" name="name" value={form.name} onChange={handleChange} required />
        <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
        <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
        <Select
          label="Type"
          name="type"
          value={form.type}
          onChange={handleChange}
          options={[
            { value: 'customer', label: 'Customer' },
            { value: 'vendor', label: 'Vendor' },
            { value: 'both', label: 'Both' },
          ]}
        />
        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={loading}>{isNew ? 'Create' : 'Save'}</Button>
          <Button type="button" variant="secondary" onClick={() => router.push('/contacts')}>Cancel</Button>
        </div>
      </form>
    </Card>
  );
}
