'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import SearchBar from '@/components/ui/SearchBar';
import Badge from '@/components/ui/Badge';
import { MOCK_ACCOUNTS } from '@/lib/mockData';
import { formatCurrency } from '@/lib/utils';
import type { Account } from '@/types/accounting';

export default function CoAList() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [accounts] = useState<Account[]>(MOCK_ACCOUNTS);

  const filtered = accounts.filter(
    (a) =>
      a.code.toLowerCase().includes(search.toLowerCase()) ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search accounts by code or name..." className="max-w-md flex-1" />
        <Button onClick={() => router.push('/chart-of-accounts/new')}>+ New Account</Button>
      </div>

      <Table
        columns={[
          { key: 'code', header: 'Account Code', render: (a: Account) => <span className="font-mono font-medium text-[#6B705C]">{a.code}</span> },
          { key: 'name', header: 'Account Name', render: (a: Account) => <span className="font-semibold text-[#2C2C2C]">{a.name}</span> },
          {
            key: 'type',
            header: 'Type',
            render: (a: Account) => (
              <Badge variant={a.type === 'asset' || a.type === 'income' ? 'confirmed' : 'warning'}>
                {a.type}
              </Badge>
            ),
          },
          { key: 'balance', header: 'Current Balance', render: (a: Account) => <span className="font-mono font-semibold text-[#2C2C2C]">{formatCurrency(a.balance || 0)}</span> },
        ]}
        data={filtered}
        keyExtractor={(a) => a.id}
        onRowClick={(a) => router.push(`/chart-of-accounts/₹{a.id}`)}
      />
    </div>
  );
}
