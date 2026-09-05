'use client';

import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';
import { ui } from '@/lib/theme';

export default function BudgetReport() {
  const budgetLines = [
    { name: 'Q3 Marketing & Campaigns', budget: 25000.00, practical: 18400.00, theoretical: 25000.00 },
    { name: 'R&D Furniture Design 2026', budget: 60000.00, practical: 42000.00, theoretical: 50000.00 },
    { name: 'Showroom Lease & Upgrades', budget: 35000.00, practical: 35000.00, theoretical: 35000.00 },
  ];

  return (
    <div className="space-y-6">
      <Card className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={ui.pageTitle}>Budget Performance Analysis Report</h1>
          <p className="text-xs text-[#737373] mt-1">Comparison of budgeted vs practical actual expenditure</p>
        </div>
        <Button variant="secondary" onClick={() => window.print()}>Export Report</Button>
      </Card>

      <Card padding={false} className="overflow-hidden p-6">
        <Table
          columns={[
            { key: 'name', header: 'Budget Position', render: (b) => <span className="font-semibold text-[#2C2C2C]">{b.name}</span> },
            { key: 'budget', header: 'Planned Budget', render: (b) => <span className="font-mono font-medium text-[#2C2C2C]">{formatCurrency(b.budget)}</span> },
            { key: 'practical', header: 'Practical Amount', render: (b) => <span className="font-mono text-[#3D7A4E] font-medium">{formatCurrency(b.practical)}</span> },
            {
              key: 'achievement',
              header: 'Achievement %',
              render: (b) => {
                const pct = Math.round((b.practical / b.budget) * 100);
                return (
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-[#E5E3DC] rounded-full h-2 overflow-hidden">
                      <div className="bg-[#6B705C] h-full rounded-full" style={{ width: `${Math.min(pct, 100)}%` }} />
                    </div>
                    <span className="text-xs font-mono font-semibold text-[#2C2C2C]">{pct}%</span>
                  </div>
                );
              },
            },
            {
              key: 'status',
              header: 'Status',
              render: (b) => {
                const pct = (b.practical / b.budget) * 100;
                return <Badge variant={pct >= 100 ? 'warning' : 'paid'}>{pct >= 100 ? 'Fully Spent' : 'On Track'}</Badge>;
              },
            },
          ]}
          data={budgetLines}
          keyExtractor={(b) => b.name}
        />
      </Card>
    </div>
  );
}
