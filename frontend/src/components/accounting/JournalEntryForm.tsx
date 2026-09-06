'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { MOCK_JOURNALS, MOCK_ACCOUNTS } from '@/lib/mockData';
import { formatCurrency } from '@/lib/utils';
import { ui } from '@/lib/theme';

export default function JournalEntryForm({ id }: { id: string }) {
  const router = useRouter();
  const isNew = id === 'new';
  const [form, setForm] = useState({
    name: 'MISC/2026/00002',
    date: new Date().toISOString().split('T')[0],
    journal_id: MOCK_JOURNALS[0]?.id || '',
    ref: 'Monthly Office Expense Allocation',
    state: 'draft' as 'draft' | 'posted',
  });

  const [lines, setLines] = useState([
    { account_id: MOCK_ACCOUNTS[0]?.id || '', label: 'Office Supplies', debit: 450, credit: 0 },
    { account_id: MOCK_ACCOUNTS[1]?.id || '', label: 'Bank Account - Operating', debit: 0, credit: 450 },
  ]);

  const [loading, setLoading] = useState(false);

  const totalDebit = lines.reduce((sum, l) => sum + (parseFloat(String(l.debit)) || 0), 0);
  const totalCredit = lines.reduce((sum, l) => sum + (parseFloat(String(l.credit)) || 0), 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isBalanced) {
      alert('Journal entry must be balanced (Total Debits must equal Total Credits)!');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/journal-entries');
    }, 400);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#E5E3DC]">
        <Button
          type="button"
          disabled={!isBalanced}
          onClick={() => setForm({ ...form, state: 'posted' })}
        >
          Post Journal Entry
        </Button>
        <Badge variant={form.state === 'posted' ? 'confirmed' : 'draft'}>{form.state}</Badge>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#E5E3DC] pb-4">
            <div>
              <h1 className={ui.pageTitle}>{form.name}</h1>
              <p className="text-xs text-[#737373] mt-0.5">General Ledger Accounting Entry</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Entry Number" name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input label="Accounting Date" name="date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
            <Select
              label="Journal"
              name="journal_id"
              value={form.journal_id}
              onChange={(e) => setForm({ ...form, journal_id: e.target.value })}
              options={MOCK_JOURNALS.map((j) => ({ value: j.id, label: j.name }))}
            />
          </div>
          <Input label="Reference / Memo" name="ref" value={form.ref} onChange={(e) => setForm({ ...form, ref: e.target.value })} placeholder="Entry narrative description..." />

          {/* Journal Items Table */}
          <div className="space-y-3 pt-3">
            <h3 className="text-sm font-semibold text-[#2C2C2C] font-display">Journal Items (Debits & Credits)</h3>
            <div className="overflow-x-auto border border-[#E5E3DC] rounded-xl bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F8F6F1] border-b border-[#E5E3DC] text-[#737373] text-left text-xs font-semibold">
                    <th className="p-3">GL Account</th>
                    <th className="p-3">Label</th>
                    <th className="p-3 w-36">Debit ($)</th>
                    <th className="p-3 w-36">Credit ($)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E3DC]">
                  {lines.map((line, idx) => (
                    <tr key={idx}>
                      <td className="p-3">
                        <select
                          className={ui.select}
                          value={line.account_id}
                          onChange={(e) => {
                            const newLines = [...lines];
                            newLines[idx].account_id = e.target.value;
                            setLines(newLines);
                          }}
                        >
                          {MOCK_ACCOUNTS.map((a) => (
                            <option key={a.id} value={a.id}>
                              {a.code} - {a.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          className={ui.input}
                          value={line.label}
                          onChange={(e) => {
                            const newLines = [...lines];
                            newLines[idx].label = e.target.value;
                            setLines(newLines);
                          }}
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          step="0.01"
                          className={ui.input}
                          value={line.debit}
                          onChange={(e) => {
                            const newLines = [...lines];
                            newLines[idx].debit = parseFloat(e.target.value) || 0;
                            setLines(newLines);
                          }}
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          step="0.01"
                          className={ui.input}
                          value={line.credit}
                          onChange={(e) => {
                            const newLines = [...lines];
                            newLines[idx].credit = parseFloat(e.target.value) || 0;
                            setLines(newLines);
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-[#E5E3DC]">
            <div className="w-72 space-y-2 text-sm">
              <div className="flex justify-between text-[#737373]">
                <span>Total Debits:</span>
                <span className="font-mono text-[#2C2C2C]">{formatCurrency(totalDebit)}</span>
              </div>
              <div className="flex justify-between text-[#737373]">
                <span>Total Credits:</span>
                <span className="font-mono text-[#2C2C2C]">{formatCurrency(totalCredit)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm pt-2 border-t border-[#E5E3DC]">
                <span>Balance Status:</span>
                <span className={isBalanced ? 'text-[#3D7A4E]' : 'text-[#C0392B]'}>
                  {isBalanced ? '✓ Balanced' : '✕ Unbalanced Difference'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E3DC]">
            <Button type="button" variant="secondary" onClick={() => router.push('/journal-entries')}>
              Cancel
            </Button>
            <Button type="submit" loading={loading} disabled={!isBalanced}>
              {isNew ? 'Create Journal Entry' : 'Save Entry'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
