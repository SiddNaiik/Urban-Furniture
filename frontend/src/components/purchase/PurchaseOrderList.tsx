'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import SearchBar from '@/components/ui/SearchBar';
import { MOCK_PURCHASE_ORDERS } from '@/lib/mockData';
import { formatDate, formatCurrency } from '@/lib/utils';

export default function PurchaseOrderList() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [orders] = useState(MOCK_PURCHASE_ORDERS);

  const filtered = orders.filter(
    (o) =>
      o.reference.toLowerCase().includes(search.toLowerCase()) ||
      o.vendor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search purchase orders..." className="max-w-md flex-1" />
        <Button onClick={() => router.push('/purchase-orders/new')}>+ New Purchase Order</Button>
      </div>

      <Table
        columns={[
          { key: 'reference', header: 'Reference', render: (o) => <span className="font-mono font-medium text-[#2C2C2C]">{o.reference}</span> },
          { key: 'vendor', header: 'Vendor', render: (o) => <span className="font-medium text-[#2C2C2C]">{o.vendor}</span> },
          { key: 'date', header: 'Order Date', render: (o) => <span className="text-[#737373] text-xs">{formatDate(o.date)}</span> },
          { key: 'total', header: 'Total Amount', render: (o) => <span className="font-mono font-semibold text-[#2C2C2C]">{formatCurrency(o.total)}</span> },
          {
            key: 'status',
            header: 'Status Stage',
            render: (o) => (
              <Badge variant={o.status === 'purchase' || o.status === 'done' ? 'confirmed' : 'draft'}>
                {o.status === 'purchase' ? 'Confirmed Order' : o.status}
              </Badge>
            ),
          },
        ]}
        data={filtered}
        keyExtractor={(o) => o.id}
        onRowClick={(o) => router.push(`/purchase-orders/${o.id}`)}
      />
    </div>
  );
}
