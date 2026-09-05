'use client';

import { useRouter } from 'next/navigation';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useFetch } from '@/hooks/useFetch';
import { getJournalEntries } from '@/lib/api';
import type { JournalEntry } from '@/types/accounting';
import { formatDate, formatCurrency } from '@/lib/utils';

export default function JournalEntryList() {
  const router = useRouter();
  const { data: entries = [], loading } = useFetch<JournalEntry[]>(getJournalEntries);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => router.push('/journal-entries/new')}>+ New Entry</Button>
      </div>
      {loading ? <p className="text-sm text-gray-400">Loading…</p> : (
        <Table
          columns={[
            { key: 'date', header: 'Date', render: (e) => formatDate(e.date) },
            { key: 'reference', header: 'Reference' },
            { key: 'journal', header: 'Journal' },
            { key: 'total_debit', header: 'Debit', render: (e) => formatCurrency(e.total_debit) },
            { key: 'state', header: 'Status', render: (e) => (
              <Badge variant={e.state === 'posted' ? 'success' : 'warning'}>{e.state}</Badge>
            ) },
          ]}
          data={entries}
          keyExtractor={(e) => e.id}
          onRowClick={(e) => router.push(`/journal-entries/${e.id}`)}
        />
      )}
    </div>
  );
}
