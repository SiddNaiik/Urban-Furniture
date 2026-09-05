'use client';

import { useRouter } from 'next/navigation';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useFetch } from '@/hooks/useFetch';
import { getCustomerInvoices } from '@/lib/api';
import type { CustomerInvoice } from '@/types/sales';
import { formatDate, formatCurrency } from '@/lib/utils';

export default function CustomerInvoiceList() {
  const router = useRouter();
  const { data: invoices = [], loading } = useFetch<CustomerInvoice[]>(getCustomerInvoices);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => router.push('/customer-invoices/new')}>+ New Invoice</Button>
      </div>
      {loading ? <p className="text-sm text-gray-400">Loading…</p> : (
        <Table
          columns={[
            { key: 'number', header: 'Invoice #' },
            { key: 'customer', header: 'Customer' },
            { key: 'date', header: 'Date', render: (i) => formatDate(i.date) },
            { key: 'amount', header: 'Amount', render: (i) => formatCurrency(i.amount) },
            { key: 'status', header: 'Status', render: (i) => <Badge variant={i.status === 'paid' ? 'success' : i.status === 'overdue' ? 'danger' : 'warning'}>{i.status}</Badge> },
          ]}
          data={invoices}
          keyExtractor={(i) => i.id}
          onRowClick={(i) => router.push(`/customer-invoices/${i.id}`)}
        />
      )}
    </div>
  );
}
