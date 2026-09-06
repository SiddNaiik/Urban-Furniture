'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import SearchBar from '@/components/ui/SearchBar';
import { MOCK_SALES_ORDERS } from '@/lib/mockData';
import { formatDate, formatCurrency } from '@/lib/utils';
import { ui } from '@/lib/theme';

export default function SalesOrderList() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [orders] = useState(MOCK_SALES_ORDERS);

  const filtered = orders.filter(
    (o) =>
      o.reference.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search sales orders by ref or customer..." className="max-w-md flex-1" />
        <Button onClick={() => router.push('/sales-orders/new')}>+ New Sales Order</Button>
      </div>

      <Table
        columns={[
          { key: 'reference', header: 'Reference', render: (o) => <span className="font-mono font-medium text-[#2C2C2C]">{o.reference}</span> },
          { key: 'customer', header: 'Customer', render: (o) => <span className="font-medium text-[#2C2C2C]">{o.customer}</span> },
          { key: 'date', header: 'Order Date', render: (o) => <span className="text-[#737373] text-xs">{formatDate(o.date)}</span> },
          { key: 'total', header: 'Total Amount', render: (o) => <span className="font-mono font-semibold text-[#2C2C2C]">{formatCurrency(o.total)}</span> },
          {
            key: 'status',
            header: 'Status Stage',
            render: (o) => (
              <Badge variant={o.status === 'sale' || o.status === 'done' ? 'confirmed' : o.status === 'draft' ? 'draft' : 'default'}>
                {o.status === 'sale' ? 'Confirmed Order' : o.status}
              </Badge>
            ),
          },
        ]}
        data={filtered}
        keyExtractor={(o) => o.id}
        onRowClick={(o) => router.push(`/sales-orders/₹{o.id}`)}
      />
    </div>
  );
}
