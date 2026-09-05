'use client';

import { useState } from 'react';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import SearchBar from '@/components/ui/SearchBar';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import { MOCK_ANALYTIC_ACCOUNTS } from '@/lib/mockData';
import { formatCurrency } from '@/lib/utils';
import type { AnalyticAccount } from '@/types/accounting';

export default function AnalyticAccountList() {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [accounts] = useState<AnalyticAccount[]>(MOCK_ANALYTIC_ACCOUNTS);

  const filtered = accounts.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      (a.code && a.code.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search analytic cost centers..." className="max-w-md flex-1" />
        <Button onClick={() => setShowModal(true)}>+ New Analytic Account</Button>
      </div>

      <Table
        columns={[
          { key: 'code', header: 'Reference / Code', render: (a: AnalyticAccount) => <span className="font-mono font-medium text-[#6B705C]">{a.code || '-'}</span> },
          { key: 'name', header: 'Analytic Cost Center', render: (a: AnalyticAccount) => <span className="font-semibold text-[#2C2C2C]">{a.name}</span> },
          { key: 'balance', header: 'Balance', render: (a: AnalyticAccount) => <span className="font-mono font-semibold text-[#2C2C2C]">{formatCurrency(a.balance || 0)}</span> },
        ]}
        data={filtered}
        keyExtractor={(a) => a.id}
      />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Analytic Cost Center">
        <form onSubmit={(e) => { e.preventDefault(); setShowModal(false); }} className="space-y-4">
          <Input label="Analytic Name" placeholder="e.g. Custom Hotel Furniture Project" required />
          <Input label="Short Code / Reference" placeholder="ANA-003" />
          <div className="flex justify-end gap-3 pt-4 border-t border-[#E5E3DC]">
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit">Create Analytic Account</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
