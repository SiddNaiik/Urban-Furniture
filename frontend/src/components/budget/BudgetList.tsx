'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import SearchBar from '@/components/ui/SearchBar';
import ViewToggle from '@/components/ui/ViewToggle';
import BudgetKanban from './BudgetKanban';
import { MOCK_BUDGETS } from '@/lib/mockData';
import { formatDate } from '@/lib/utils';

export default function BudgetList() {
  const router = useRouter();
  const [view, setView] = useState<'list' | 'kanban'>('list');
  const [search, setSearch] = useState('');
  const [budgets] = useState(MOCK_BUDGETS);

  const filtered = budgets.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search budget positions..." className="max-w-md flex-1" />
        <div className="flex items-center gap-3">
          <ViewToggle view={view} onChange={setView} />
          <Button onClick={() => router.push('/budgets/new')}>+ Create New Budget</Button>
        </div>
      </div>

      {view === 'list' ? (
        <Table
          columns={[
            { key: 'name', header: 'Budget Name', render: (b) => <span className="font-semibold text-[#2C2C2C]">{b.name}</span> },
            { key: 'date_from', header: 'Start Date', render: (b) => <span className="text-[#737373] text-xs">{formatDate(b.date_from)}</span> },
            { key: 'date_to', header: 'End Date', render: (b) => <span className="text-[#737373] text-xs">{formatDate(b.date_to)}</span> },
            {
              key: 'state',
              header: 'Status',
              render: (b) => (
                <Badge variant={b.state === 'done' ? 'confirmed' : 'draft'}>
                  {b.state === 'confirm' ? 'Confirmed' : b.state}
                </Badge>
              ),
            },
          ]}
          data={filtered}
          keyExtractor={(b) => b.id}
          onRowClick={(b) => router.push(`/budgets/${b.id}`)}
        />
      ) : (
        <BudgetKanban budgets={filtered} />
      )}
    </div>
  );
}
