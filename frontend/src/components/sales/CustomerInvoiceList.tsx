'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import SearchBar from '@/components/ui/SearchBar';
import { MOCK_CUSTOMER_INVOICES } from '@/lib/mockData';
import { formatDate, formatCurrency } from '@/lib/utils';

export default function CustomerInvoiceList() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [invoices] = useState(MOCK_CUSTOMER_INVOICES);

  const filtered = invoices.filter(
    (inv) =>
      inv.number.toLowerCase().includes(search.toLowerCase()) ||
      inv.customer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search customer invoices..." className="max-w-md flex-1" />
        <Button onClick={() => router.push('/customer-invoices/new')}>+ Create Customer Invoice</Button>
      </div>

      <Table
        columns={[
          { key: 'number', header: 'Invoice #', render: (inv) => <span className="font-mono font-medium text-[#2C2C2C]">{inv.number}</span> },
          { key: 'customer', header: 'Customer', render: (inv) => <span className="font-medium text-[#2C2C2C]">{inv.customer}</span> },
          { key: 'date', header: 'Invoice Date', render: (inv) => <span className="text-[#737373] text-xs">{formatDate(inv.date)}</span> },
          { key: 'due_date', header: 'Due Date', render: (inv) => <span className="text-[#737373] text-xs">{formatDate(inv.due_date)}</span> },
          { key: 'amount', header: 'Amount', render: (inv) => <span className="font-mono font-semibold text-[#2C2C2C]">{formatCurrency(inv.amount)}</span> },
          {
            key: 'status',
            header: 'Status',
            render: (inv) => (
              <Badge variant={inv.status === 'paid' ? 'paid' : inv.status === 'posted' ? 'confirmed' : 'draft'}>
                {inv.status}
              </Badge>
            ),
          },
        ]}
        data={filtered}
        keyExtractor={(inv) => inv.id}
        onRowClick={(inv) => router.push(`/customer-invoices/₹{inv.id}`)}
      />
    </div>
  );
}
