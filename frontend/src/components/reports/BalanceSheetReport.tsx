'use client';

import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Table from '@/components/ui/Table';
import { formatCurrency } from '@/lib/utils';
import { ui } from '@/lib/theme';

export default function BalanceSheetReport() {
  const assets = [
    { code: '101000', name: 'Bank Operating Account', amount: 145000.00 },
    { code: '120000', name: 'Accounts Receivable', amount: 24500.00 },
    { code: '140000', name: 'Furniture Inventory Stock', amount: 82000.00 },
  ];

  const liabilities = [
    { code: '210000', name: 'Accounts Payable', amount: 18200.00 },
    { code: '220000', name: 'Sales Tax Payable', amount: 4800.00 },
  ];

  const equity = [
    { code: '300000', name: 'Owner Capital', amount: 150000.00 },
    { code: '310000', name: 'Retained Earnings', amount: 78500.00 },
  ];

  const totalAssets = assets.reduce((s, a) => s + a.amount, 0);
  const totalLiabilities = liabilities.reduce((s, l) => s + l.amount, 0);
  const totalEquity = equity.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-6">
      <Card className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={ui.pageTitle}>Balance Sheet Report</h1>
          <p className="text-xs text-[#737373] mt-1">Financial position snapshot as of current date</p>
        </div>
        <div className="flex items-center gap-3">
          <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-auto" />
          <Button variant="secondary" onClick={() => window.print()}>Print / Export</Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assets */}
        <Card padding={false} className="overflow-hidden p-5 space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[#3D7A4E] font-display">Assets</h3>
          <Table
            columns={[
              { key: 'code', header: 'Code', render: (r) => <span className="font-mono text-xs text-[#737373]">{r.code}</span> },
              { key: 'name', header: 'Account', render: (r) => <span className="font-medium text-[#2C2C2C]">{r.name}</span> },
              { key: 'amount', header: 'Balance', render: (r) => <span className="font-mono font-medium text-[#2C2C2C]">{formatCurrency(r.amount)}</span> },
            ]}
            data={assets}
            keyExtractor={(r) => r.code}
          />
          <div className="flex justify-between items-center p-3 bg-[#F8F6F1] font-bold text-sm border-t border-[#E5E3DC]">
            <span>Total Assets</span>
            <span className="font-mono text-[#3D7A4E] text-lg">{formatCurrency(totalAssets)}</span>
          </div>
        </Card>

        {/* Liabilities & Equity */}
        <Card padding={false} className="overflow-hidden p-5 space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[#C0392B] font-display">Liabilities & Equity</h3>
          <Table
            columns={[
              { key: 'code', header: 'Code', render: (r) => <span className="font-mono text-xs text-[#737373]">{r.code}</span> },
              { key: 'name', header: 'Account', render: (r) => <span className="font-medium text-[#2C2C2C]">{r.name}</span> },
              { key: 'amount', header: 'Balance', render: (r) => <span className="font-mono font-medium text-[#2C2C2C]">{formatCurrency(r.amount)}</span> },
            ]}
            data={[...liabilities, ...equity]}
            keyExtractor={(r) => r.code}
          />
          <div className="flex justify-between items-center p-3 bg-[#F8F6F1] font-bold text-sm border-t border-[#E5E3DC]">
            <span>Total Liabilities & Equity</span>
            <span className="font-mono text-[#6B705C] text-lg">{formatCurrency(totalLiabilities + totalEquity)}</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
