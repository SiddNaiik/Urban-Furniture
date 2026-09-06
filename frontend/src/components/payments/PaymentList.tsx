'use client';

import { useState } from 'react';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import SearchBar from '@/components/ui/SearchBar';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';
import { formatDate, formatCurrency } from '@/lib/utils';
import { MOCK_CUSTOMER_INVOICES } from '@/lib/mockData';

export default function PaymentList() {
  const [search, setSearch] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [payments] = useState([
    { id: 'pay-1', date: '2026-09-01', memo: 'Payment for INV/2026/00001', partner: 'Azure Interior', amount: 3200.00, journal: 'Bank Account - Operating', type: 'receive' },
    { id: 'pay-2', date: '2026-08-26', memo: 'Vendor Payment BILL/2026/08/001', partner: 'WoodCraft Supplies', amount: 4500.00, journal: 'Bank Account - Operating', type: 'send' },
  ]);

  const filtered = payments.filter(
    (p) =>
      p.memo.toLowerCase().includes(search.toLowerCase()) ||
      p.partner.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search payments by memo or partner..." className="max-w-md flex-1" />
        <Button onClick={() => setShowNewModal(true)}>+ Register New Payment</Button>
      </div>

      <Table
        columns={[
          { key: 'date', header: 'Payment Date', render: (p) => <span className="text-[#737373] text-xs">{formatDate(p.date)}</span> },
          { key: 'partner', header: 'Partner / Customer / Vendor', render: (p) => <span className="font-semibold text-[#2C2C2C]">{p.partner}</span> },
          { key: 'memo', header: 'Memo / Reference', render: (p) => <span className="text-[#737373]">{p.memo}</span> },
          { key: 'journal', header: 'Payment Journal', render: (p) => <span className="text-xs text-[#A5A58D] uppercase tracking-wider font-semibold">{p.journal}</span> },
          { key: 'amount', header: 'Amount', render: (p) => <span className="font-mono font-semibold text-[#2C2C2C]">{formatCurrency(p.amount)}</span> },
          {
            key: 'type',
            header: 'Payment Type',
            render: (p) => (
              <Badge variant={p.type === 'receive' ? 'paid' : 'warning'}>
                {p.type === 'receive' ? 'Inbound (Received)' : 'Outbound (Sent)'}
              </Badge>
            ),
          },
        ]}
        data={filtered}
        keyExtractor={(p) => p.id}
      />

      <Modal isOpen={showNewModal} onClose={() => setShowNewModal(false)} title="Register Direct Payment">
        <form onSubmit={(e) => { e.preventDefault(); setShowNewModal(false); }} className="space-y-4">
          <Select
            label="Payment Type"
            options={[
              { value: 'receive', label: 'Receive Money (Customer Inbound)' },
              { value: 'send', label: 'Send Money (Vendor Outbound)' },
            ]}
          />
          <Input label="Partner (Customer / Vendor)" placeholder="e.g. Azure Interior" required />
          <Input label="Amount (₹)" type="number" step="0.01" placeholder="1000.00" required />
          <Select
            label="Payment Journal"
            options={[
              { value: 'bank', label: 'Bank Account - Operating' },
              { value: 'cash', label: 'Petty Cash' },
            ]}
          />
          <Input label="Payment Date" type="date" defaultValue={new Date().toISOString().split('T')[0]} required />
          <Input label="Memo / Reference" placeholder="Invoice reference or description" />
          <div className="flex justify-end gap-3 pt-4 border-t border-[#E5E3DC]">
            <Button type="button" variant="secondary" onClick={() => setShowNewModal(false)}>Cancel</Button>
            <Button type="submit">Confirm & Post Payment</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
