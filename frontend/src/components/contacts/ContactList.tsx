'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Table from '@/components/ui/Table';
import SearchBar from '@/components/ui/SearchBar';
import ViewToggle from '@/components/ui/ViewToggle';
import Button from '@/components/ui/Button';
import ContactKanban from './ContactKanban';
import { useFetch } from '@/hooks/useFetch';
import { getContacts } from '@/lib/api';
import type { Contact } from '@/types/contact';

export default function ContactList() {
  const router = useRouter();
  const [view, setView] = useState<'list' | 'kanban'>('list');
  const [search, setSearch] = useState('');
  const { data: contacts = [], loading } = useFetch<Contact[]>(getContacts);

  const filtered = contacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    { key: 'type', header: 'Type' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <SearchBar value={search} onChange={setSearch} className="flex-1 min-w-48" />
        <ViewToggle view={view} onChange={setView} />
        <Button onClick={() => router.push('/contacts/new')}>+ New Contact</Button>
      </div>
      {loading ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : view === 'list' ? (
        <Table
          columns={columns}
          data={filtered}
          keyExtractor={(c) => c.id}
          onRowClick={(c) => router.push(`/contacts/${c.id}`)}
        />
      ) : (
        <ContactKanban contacts={filtered} />
      )}
    </div>
  );
}
