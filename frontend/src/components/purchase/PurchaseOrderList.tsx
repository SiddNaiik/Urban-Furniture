'use client';

import { useRouter } from 'next/navigation';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useFetch } from '@/hooks/useFetch';
import { getPurchaseOrders } from '@/lib/api';
import type { PurchaseOrder } from '@/types/purchase';
import { formatDate, formatCurrency } from '@/lib/utils';

export default function PurchaseOrderList() {
  const router = useRouter();
  const { data: orders = [], loading } = useFetch<PurchaseOrder[]>(getPurchaseOrders);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => router.push('/purchase-orders/new')}>+ New Order</Button>
      </div>
      {loading ? <p className="text-sm text-gray-400">Loading…</p> : (
        <Table
          columns={[
            { key: 'reference', header: 'Reference' },
            { key: 'vendor', header: 'Vendor' },
            { key: 'date', header: 'Date', render: (o) => formatDate(o.date) },
            { key: 'total', header: 'Total', render: (o) => formatCurrency(o.total) },
            { key: 'status', header: 'Status', render: (o) => <Badge variant={o.status === 'done' ? 'success' : 'warning'}>{o.status}</Badge> },
          ]}
          data={orders}
          keyExtractor={(o) => o.id}
          onRowClick={(o) => router.push(`/purchase-orders/${o.id}`)}
        />
      )}
    </div>
  );
}
