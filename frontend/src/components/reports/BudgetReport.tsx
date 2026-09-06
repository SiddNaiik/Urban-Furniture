'use client';

import { useEffect, useMemo, useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import { getBudgets } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Budget } from '@/types/budget';
import { ui } from '@/lib/theme';

const num = (v: unknown) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

export default function BudgetReport() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getBudgets()
      .then((data) => setBudgets(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error(err);
        setError('Unable to load budget analytics.');
      })
      .finally(() => setLoading(false));
  }, []);

  const rows = useMemo(() => budgets.map((b) => {
    const plannedLines = (b.lines ?? []).reduce((s, l) => s + num(l.planned_amount), 0);
    const practical = (b.lines ?? []).reduce((s, l) => s + num(l.practical_amount), 0);
    const planned = plannedLines > 0 ? plannedLines : num(b.total_amount);
    return {
      ...b,
      planned,
      practical,
      percentage: planned > 0 ? Math.round((practical / planned) * 100) : 0,
    };
  }), [budgets]);

  return (
    <div className="space-y-6">
      <Card className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={ui.pageTitle}>Budget Performance Analysis Report</h1>
          <p className="text-xs text-[#737373] mt-1">Planned budget vs practical achieved expenditure</p>
        </div>
        <Button variant="secondary" onClick={() => window.print()}>Export Report</Button>
      </Card>

      <Card padding={false} className="overflow-hidden">
        {loading ? (
          <div className="p-6 text-sm text-[#737373]">Loading analytics...</div>
        ) : error ? (
          <div className="p-6 text-sm text-[#C0392B]">{error}</div>
        ) : rows.length === 0 ? (
          <div className="p-6 text-sm text-[#737373]">No budgets available.</div>
        ) : (
          <Table
            columns={[
              { key: 'name', header: 'Budget Position', render: (b) => <span className="font-semibold">{b.name}</span> },
              { key: 'period', header: 'Period', render: (b) => <span className="text-xs text-[#737373]">{formatDate(b.date_from)} — {formatDate(b.date_to)}</span> },
              { key: 'planned', header: 'Planned Budget', render: (b) => <span className="font-mono">{formatCurrency(b.planned)}</span> },
              { key: 'practical', header: 'Practical Amount', render: (b) => <span className="font-mono text-[#3D7A4E]">{formatCurrency(b.practical)}</span> },
              {
                key: 'percentage',
                header: 'Achievement %',
                render: (b) => (
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 rounded-full bg-[#E5E3DC] overflow-hidden">
                      <div className="h-full rounded-full bg-[#6B705C]" style={{ width: `₹{Math.min(b.percentage, 100)}%` }} />
                    </div>
                    <span className="text-xs font-mono font-semibold">{b.percentage}%</span>
                  </div>
                ),
              },
              {
                key: 'status',
                header: 'Status',
                render: (b) => <Badge variant={b.percentage >= 100 ? 'warning' : 'paid'}>{b.percentage >= 100 ? 'Fully Spent' : 'On Track'}</Badge>,
              },
            ]}
            data={rows}
            keyExtractor={(b) => b.id}
          />
        )}
      </Card>
    </div>
  );
}
