'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Table from '@/components/ui/Table';
import SearchBar from '@/components/ui/SearchBar';
import ViewToggle from '@/components/ui/ViewToggle';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import ContactKanban from './ContactKanban';
import { MOCK_CONTACTS } from '@/lib/mockData';
import type { Contact } from '@/types/contact';

export default function ContactList() {
  const router = useRouter();
  const [view, setView] = useState<'list' | 'kanban'>('list');
  const [search, setSearch] = useState('');
  const [contacts] = useState<Contact[]>(MOCK_CONTACTS);

  const filtered = contacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
  );

  /**
   * columns — defines the table columns for List view.
   *
   * CHANGE: Added "Photo" column between Name and Email (as requested).
   * Photo column renders a circular avatar:
   *   - If contact.imageUrl exists → shows <img> tag with the photo
   *   - If no imageUrl → shows initials fallback (first 2 letters, olive bg)
   *
   * Column order: Photo | Name | Email | Phone | Type
   */
  const columns = [
    // ── PHOTO COLUMN (new) ──────────────────────────────────
    {
      key: 'photo',
      header: 'Photo',
      render: (c: Contact) =>
        c.imageUrl ? (
          // Real photo — shown when contact has an uploaded image
          <img
            src={c.imageUrl}
            alt={c.name}
            className="w-8 h-8 rounded-full object-cover border border-[#E5E3DC]"
          />
        ) : (
          // Initials fallback — shown when no image uploaded
          <div className="w-8 h-8 rounded-full bg-[#6B705C]/10 text-[#6B705C] font-semibold flex items-center justify-center text-xs">
            {c.name.substring(0, 2).toUpperCase()}
          </div>
        ),
    },
    // ── EXISTING COLUMNS (unchanged) ────────────────────────
    {
      key: 'name',
      header: 'Name',
      render: (c: Contact) => (
        <span className="font-medium text-[#2C2C2C]">{c.name}</span>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      render: (c: Contact) => (
        <span className="text-[#737373]">{c.email || '-'}</span>
      ),
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (c: Contact) => (
        <span className="font-mono text-[#737373]">{c.phone || '-'}</span>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (c: Contact) => (
        <Badge
          variant={
            c.type === 'customer'
              ? 'confirmed'
              : c.type === 'vendor'
              ? 'warning'
              : 'default'
          }
        >
          {c.type}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toolbar — unchanged */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search contacts..."
          className="max-w-md flex-1"
        />
        <div className="flex items-center gap-3">
          <ViewToggle view={view} onChange={setView} />
          <Button onClick={() => router.push('/contacts/new')}>
            + New Contact
          </Button>
        </div>
      </div>

      {/* Content area — list or kanban */}
      {view === 'list' ? (
        <Table
          columns={columns}
          data={filtered}
          keyExtractor={(c) => c.id}
          onRowClick={(c) => router.push(`/contacts/₹{c.id}`)}
        />
      ) : (
        <ContactKanban contacts={filtered} />
      )}
    </div>
  );
}