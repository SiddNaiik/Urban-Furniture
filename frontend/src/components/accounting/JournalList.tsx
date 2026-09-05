'use client';

import { useRouter } from 'next/navigation';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import { useFetch } from '@/hooks/useFetch';
import { getJournals } from '@/lib/api';
import type { Journal } from '@/types/accounting';

export default function JournalList() {
  const router = useRouter();
  const { data: journals = [], loading } = useFetch<Journal[]>(getJournals);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => router.push('/journals/new')}>+ New Journal</Button>
      </div>
      {loading ? <p className="text-sm text-gray-400">Loading…</p> : (
        <Table
          columns={[
            { key: 'name', header: 'Name' },
            { key: 'type', header: 'Type' },
            { key: 'code', header: 'Code' },
          ]}
          data={journals}
          keyExtractor={(j) => j.id}
          onRowClick={(j) => router.push(`/journals/${j.id}`)}
        />
      )}
    </div>
  );
}
