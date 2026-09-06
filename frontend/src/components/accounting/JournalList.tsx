'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import SearchBar from '@/components/ui/SearchBar';
import { MOCK_JOURNALS } from '@/lib/mockData';

export default function JournalList() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [journals] = useState(MOCK_JOURNALS);

  const filtered = journals.filter(
    (j) =>
      j.name.toLowerCase().includes(search.toLowerCase()) ||
      j.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search accounting journals..." className="max-w-md flex-1" />
        <Button onClick={() => router.push('/journals/new')}>+ New Journal</Button>
      </div>

      <Table
        columns={[
          { key: 'code', header: 'Short Code', render: (j) => <span className="font-mono font-medium text-[#6B705C]">{j.code}</span> },
          { key: 'name', header: 'Journal Name', render: (j) => <span className="font-semibold text-[#2C2C2C]">{j.name}</span> },
          { key: 'type', header: 'Type', render: (j) => <Badge variant="default">{j.type}</Badge> },
        ]}
        data={filtered}
        keyExtractor={(j) => j.id}
        onRowClick={(j) => router.push(`/journals/₹{j.id}`)}
      />
    </div>
  );
}
