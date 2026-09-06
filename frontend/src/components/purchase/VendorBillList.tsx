'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import SearchBar from '@/components/ui/SearchBar';
import { MOCK_VENDOR_BILLS } from '@/lib/mockData';
import { formatDate, formatCurrency } from '@/lib/utils';

export default function VendorBillList() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [bills] = useState(MOCK_VENDOR_BILLS);

  const filtered = bills.filter(
    (b) =>
      b.reference.toLowerCase().includes(search.toLowerCase()) ||
      b.vendor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search vendor bills..." className="max-w-md flex-1" />
        <Button onClick={() => router.push('/vendor-bills/new')}>+ Add Vendor Bill</Button>
      </div>

      <Table
        columns={[
          { key: 'reference', header: 'Bill #', render: (b) => <span className="font-mono font-medium text-[#2C2C2C]">{b.reference}</span> },
          { key: 'vendor', header: 'Vendor / Supplier', render: (b) => <span className="font-medium text-[#2C2C2C]">{b.vendor}</span> },
          { key: 'date', header: 'Bill Date', render: (b) => <span className="text-[#737373] text-xs">{formatDate(b.date)}</span> },
          { key: 'due_date', header: 'Due Date', render: (b) => <span className="text-[#737373] text-xs">{formatDate(b.due_date)}</span> },
          { key: 'amount', header: 'Amount', render: (b) => <span className="font-mono font-semibold text-[#2C2C2C]">{formatCurrency(b.amount)}</span> },
          {
            key: 'status',
            header: 'Status',
            render: (b) => (
              <Badge variant={b.status === 'paid' ? 'paid' : b.status === 'posted' ? 'confirmed' : 'draft'}>
                {b.status}
              </Badge>
            ),
          },
        ]}
        data={filtered}
        keyExtractor={(b) => b.id}
        onRowClick={(b) => router.push(`/vendor-bills/₹{b.id}`)}
      />
    </div>
  );
}