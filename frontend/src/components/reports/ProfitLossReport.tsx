'use client';

import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Table from '@/components/ui/Table';
import { formatCurrency } from '@/lib/utils';
import { ui } from '@/lib/theme';

export default function ProfitLossReport() {
  const revenueData = [
    { code: '400000', name: 'Product Sales Income', amount: 312000.00 },
    { code: '410000', name: 'Design Services Revenue', amount: 45000.00 },
  ];

  const expenseData = [
    { code: '500000', name: 'Cost of Goods Sold (Raw Materials)', amount: 165000.00 },
    { code: '510000', name: 'Showroom Rent & Utilities', amount: 24000.00 },
    { code: '520000', name: 'Marketing & Advertising', amount: 18500.00 },
  ];

  const totalIncome = revenueData.reduce((s, r) => s + r.amount, 0);
  const totalExpense = expenseData.reduce((s, e) => s + e.amount, 0);
  const netProfit = totalIncome - totalExpense;

  return (
    <div className="space-y-6">
      {/* Report Controls Header */}
      <Card className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={ui.pageTitle}>Profit & Loss Statement</h1>
          <p className="text-xs text-[#737373] mt-1">Financial performance statement for fiscal year 2026</p>
        </div>
        <div className="flex items-center gap-3">
          <Input type="date" defaultValue="2026-01-01" className="w-auto" />
          <span className="text-xs text-[#737373]">to</span>
          <Input type="date" defaultValue="2026-12-31" className="w-auto" />
          <Button variant="secondary" onClick={() => window.print()}>Print / Export</Button>
        </div>
      </Card>

      {/* Main Financial Report Statement */}
      <Card padding={false} className="overflow-hidden space-y-6 p-6">
        {/* Income Section */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[#6B705C] mb-3 font-display">Operating Income</h3>
          <Table
            columns={[
              { key: 'code', header: 'Code', render: (r) => <span className="font-mono text-xs text-[#737373]">{r.code}</span> },
              { key: 'name', header: 'Account', render: (r) => <span className="font-medium text-[#2C2C2C]">{r.name}</span> },
              { key: 'amount', header: 'Total (₹)', render: (r) => <span className="font-mono font-medium text-[#2C2C2C]">{formatCurrency(r.amount)}</span> },
            ]}
            data={revenueData}
            keyExtractor={(r) => r.code}
          />
          <div className="flex justify-between items-center px-4 py-3 bg-[#F8F6F1] font-semibold text-sm border-t border-[#E5E3DC]">
            <span>Total Gross Revenue</span>
            <span className="font-mono text-[#6B705C] text-base">{formatCurrency(totalIncome)}</span>
          </div>
        </div>

        {/* Expenses Section */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[#C0392B] mb-3 font-display">Operating Expenses</h3>
          <Table
            columns={[
              { key: 'code', header: 'Code', render: (r) => <span className="font-mono text-xs text-[#737373]">{r.code}</span> },
              { key: 'name', header: 'Account', render: (r) => <span className="font-medium text-[#2C2C2C]">{r.name}</span> },
              { key: 'amount', header: 'Total (₹)', render: (r) => <span className="font-mono font-medium text-[#2C2C2C]">{formatCurrency(r.amount)}</span> },
            ]}
            data={expenseData}
            keyExtractor={(r) => r.code}
          />
          <div className="flex justify-between items-center px-4 py-3 bg-[#F8F6F1] font-semibold text-sm border-t border-[#E5E3DC]">
            <span>Total Operating Expenses</span>
            <span className="font-mono text-[#C0392B] text-base">{formatCurrency(totalExpense)}</span>
          </div>
        </div>

        {/* Net Profit Summary */}
        <div className="p-4 bg-[#6B705C]/10 border border-[#6B705C]/30 rounded-xl flex items-center justify-between font-bold text-lg text-[#2C2C2C]">
          <span>Net Operating Profit</span>
          <span className="font-mono text-[#3D7A4E] text-2xl">{formatCurrency(netProfit)}</span>
        </div>
      </Card>
    </div>
  );
}
