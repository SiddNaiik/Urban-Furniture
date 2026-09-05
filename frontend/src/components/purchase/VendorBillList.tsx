'use client';

import { useRouter } from 'next/navigation';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useFetch } from '@/hooks/useFetch';
import { getVendorBills } from '@/lib/api';
import type { VendorBill } from '@/types/purchase';
import { formatDate, formatCurrency } from '@/lib/utils';

export default function VendorBillList() {
  const router = useRouter();
  const { data: bills = [], loading } = useFetch<VendorBill[]>(getVendorBills);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => router.push('/vendor-bills/new')}>+ New Bill</Button>
      </div>
      {loading ? <p className="text-sm text-gray-400">Loading…</p> : (
        <Table
          columns={[
            { key: 'reference', header: 'Reference' },
            { key: 'vendor', header: 'Vendor' },
            { key: 'date', header: 'Date', render: (b) => formatDate(b.date) },
            { key: 'amount', header: 'Amount', render: (b) => formatCurrency(b.amount) },
            { key: 'status', header: 'Status', render: (b) => <Badge variant={b.status === 'paid' ? 'success' : 'warning'}>{b.status}</Badge> },
          ]}
          data={bills}
          keyExtractor={(b) => b.id}
          onRowClick={(b) => router.push(`/vendor-bills/${b.id}`)}
        />
      )}
    </div>
  );
}
