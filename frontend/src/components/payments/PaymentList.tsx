'use client';

import { useRouter } from 'next/navigation';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useFetch } from '@/hooks/useFetch';
import { getPayments } from '@/lib/api';
import { formatDate, formatCurrency } from '@/lib/utils';

export interface PaymentItem {
  id: string;
  payment_type: 'inbound' | 'outbound' | string;
  partner?: string;
  amount: number;
  date: string;
  journal?: string;
  status: 'draft' | 'posted' | 'reconciled' | string;
}

export default function PaymentList() {
  const router = useRouter();
  const { data: payments = [], loading } = useFetch<PaymentItem[]>(getPayments);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => router.push('/payments/new')}>+ New Payment</Button>
      </div>
      {loading ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : (
        <Table<PaymentItem>
          columns={[
            { key: 'date', header: 'Date', render: (p) => formatDate(p.date) },
            {
              key: 'payment_type',
              header: 'Type',
              render: (p) => (
                <Badge variant={p.payment_type === 'inbound' ? 'info' : 'warning'}>
                  {p.payment_type === 'inbound' ? 'Customer Inbound' : 'Vendor Outbound'}
                </Badge>
              ),
            },
            { key: 'partner', header: 'Partner' },
            { key: 'journal', header: 'Journal' },
            { key: 'amount', header: 'Amount', render: (p) => formatCurrency(p.amount) },
            {
              key: 'status',
              header: 'Status',
              render: (p) => (
                <Badge variant={p.status === 'posted' || p.status === 'reconciled' ? 'success' : 'warning'}>
                  {p.status}
                </Badge>
              ),
            },
          ]}
          data={payments}
          keyExtractor={(p) => p.id}
          onRowClick={(p) => router.push(`/payments/${p.id}`)}
        />
      )}
    </div>
  );
}
