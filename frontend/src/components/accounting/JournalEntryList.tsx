'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import SearchBar from '@/components/ui/SearchBar';
import { MOCK_JOURNAL_ENTRIES } from '@/lib/mockData';
import { formatDate } from '@/lib/utils';
import type { JournalEntry } from '@/types/accounting';

export default function JournalEntryList() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [entries] = useState<JournalEntry[]>(MOCK_JOURNAL_ENTRIES);

  const filtered = entries.filter(
    (e) =>
      (e.name && e.name.toLowerCase().includes(search.toLowerCase())) ||
      (e.ref && e.ref.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search journal entries..." className="max-w-md flex-1" />
        <Button onClick={() => router.push('/journal-entries/new')}>+ New Journal Entry</Button>
      </div>

      <Table
        columns={[
          { key: 'name', header: 'Number', render: (e: JournalEntry) => <span className="font-mono font-medium text-[#2C2C2C]">{e.name || e.id}</span> },
          { key: 'date', header: 'Date', render: (e: JournalEntry) => <span className="text-[#737373] text-xs">{formatDate(e.date)}</span> },
          { key: 'journal_name', header: 'Journal', render: (e: JournalEntry) => <span className="text-[#2C2C2C]">{e.journal_name || 'General'}</span> },
          { key: 'ref', header: 'Reference / Memo', render: (e: JournalEntry) => <span className="text-[#737373]">{e.ref || '-'}</span> },
          {
            key: 'state',
            header: 'Status Stage',
            render: (e: JournalEntry) => (
              <Badge variant={e.state === 'posted' ? 'confirmed' : 'draft'}>
                {e.state}
              </Badge>
            ),
          },
        ]}
        data={filtered}
        keyExtractor={(e) => e.id}
        onRowClick={(e) => router.push(`/journal-entries/₹{e.id}`)}
      />
    </div>
  );
}
