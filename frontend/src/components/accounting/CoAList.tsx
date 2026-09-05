'use client';

import { useRouter } from 'next/navigation';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import { useFetch } from '@/hooks/useFetch';
import { getChartOfAccounts } from '@/lib/api';
import type { Account } from '@/types/accounting';

export default function CoAList() {
  const router = useRouter();
  const { data: accounts = [], loading } = useFetch<Account[]>(getChartOfAccounts);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => router.push('/chart-of-accounts/new')}>+ New Account</Button>
      </div>
      {loading ? <p className="text-sm text-gray-400">Loading…</p> : (
        <Table
          columns={[
            { key: 'code', header: 'Code' },
            { key: 'name', header: 'Name' },
            { key: 'type', header: 'Type' },
            { key: 'balance', header: 'Balance' },
          ]}
          data={accounts}
          keyExtractor={(a) => a.id}
          onRowClick={(a) => router.push(`/chart-of-accounts/${a.id}`)}
        />
      )}
    </div>
  );
}
