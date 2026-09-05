'use client';

import { useRouter } from 'next/navigation';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useFetch } from '@/hooks/useFetch';
import { getBudgets } from '@/lib/api';
import type { Budget } from '@/types/budget';
import { formatCurrency } from '@/lib/utils';

export default function BudgetList() {
  const router = useRouter();
  const { data: budgets = [], loading } = useFetch<Budget[]>(getBudgets);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => router.push('/budgets/new')}>+ New Budget</Button>
      </div>
      {loading ? <p className="text-sm text-gray-400">Loading…</p> : (
        <Table
          columns={[
            { key: 'name', header: 'Name' },
            { key: 'period', header: 'Period' },
            { key: 'total_amount', header: 'Total', render: (b) => formatCurrency(b.total_amount) },
            { key: 'status', header: 'Status', render: (b) => <Badge variant={b.status === 'confirmed' ? 'success' : 'warning'}>{b.status}</Badge> },
          ]}
          data={budgets}
          keyExtractor={(b) => b.id}
          onRowClick={(b) => router.push(`/budgets/${b.id}`)}
        />
      )}
    </div>
  );
}
