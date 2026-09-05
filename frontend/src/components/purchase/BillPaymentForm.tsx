// BillPaymentForm - used when registering payment for a vendor bill
'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { registerBillPayment } from '@/lib/api';

interface BillPaymentFormProps {
  billId: string;
  onSuccess?: () => void;
}

export default function BillPaymentForm({ billId, onSuccess }: BillPaymentFormProps) {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await registerBillPayment(billId, { amount: Number(amount), date });
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
