// Invoice payment registration form
'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { registerInvoicePayment } from '@/lib/api';

interface InvoicePaymentFormProps {
  invoiceId: string;
  onSuccess?: () => void;
}

export default function InvoicePaymentForm({ invoiceId, onSuccess }: InvoicePaymentFormProps) {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await registerInvoicePayment(invoiceId, { amount: Number(amount), date });
      onSuccess?.();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
      <Input label="Payment Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      <Button type="submit" loading={loading} className="w-full">Register Payment</Button>
    </form>
  );
}
