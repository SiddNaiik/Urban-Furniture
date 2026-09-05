'use client';

import { useRouter } from 'next/navigation';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import { useFetch } from '@/hooks/useFetch';
import { getAnalyticAccounts } from '@/lib/api';
import type { AnalyticAccount } from '@/types/accounting';

export default function AnalyticAccountList() {
  const router = useRouter();
  const { data: accounts = [], loading } = useFetch<AnalyticAccount[]>(getAnalyticAccounts);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => router.push('/analytic-accounts/new')}>+ New Analytic Account</Button>
      </div>
      {loading ? <p className="text-sm text-gray-400">Loading…</p> : (
        <Table
          columns={[
            { key: 'code', header: 'Code' },
            { key: 'name', header: 'Name' },
            { key: 'balance', header: 'Balance' },
          ]}
          data={accounts}
          keyExtractor={(a) => a.id}
          onRowClick={(a) => router.push(`/analytic-accounts/${a.id}`)}
        />
      )}
    </div>
  );
}
