'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { getPayment, createPayment, updatePayment } from '@/lib/api';

interface PaymentFormProps {
  id: string;
}

const defaultForm = {
  payment_type: 'inbound',
  partner: '',
  amount: '',
  date: new Date().toISOString().split('T')[0],
  journal: 'Bank',
};

export default function PaymentForm({ id }: PaymentFormProps) {
  const router = useRouter();
  const isNew = id === 'new';
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isNew) {
      getPayment(id).then((data) => {
        if (data) {
          setForm({
            payment_type: data.payment_type || 'inbound',
            partner: data.partner || '',
            amount: data.amount ? String(data.amount) : '',
            date: data.date || '',
            journal: data.journal || 'Bank',
          });
        }
      });
    }
  }, [id, isNew]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (isNew) await createPayment(form);
      else await updatePayment(id, form);
      router.push('/payments');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Payment Type"
          name="payment_type"
          value={form.payment_type}
          onChange={handleChange}
          options={[
            { value: 'inbound', label: 'Customer Payment (Inbound)' },
            { value: 'outbound', label: 'Vendor Payment (Outbound)' },
          ]}
        />
        <Input label="Partner (Customer / Vendor)" name="partner" value={form.partner} onChange={handleChange} required />
        <Input label="Amount" name="amount" type="number" value={form.amount} onChange={handleChange} required />
        <Input label="Date" name="date" type="date" value={form.date} onChange={handleChange} required />
        <Input label="Journal (e.g. Bank, Cash)" name="journal" value={form.journal} onChange={handleChange} required />
        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={loading}>
            {isNew ? 'Create Payment' : 'Save Changes'}
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.push('/payments')}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
