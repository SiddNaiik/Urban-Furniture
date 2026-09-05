'use client';

import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import type { Budget } from '@/types/budget';

export default function BudgetKanban({ budgets }: { budgets: Budget[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {budgets.map((b) => (
        <Card key={b.id} className="hover:border-[#6B705C] transition-all cursor-pointer shadow-2xs">
          <div className="flex items-start justify-between">
            <h4 className="font-semibold text-[#2C2C2C] text-base font-display">{b.name}</h4>
            <Badge variant={b.state === 'done' ? 'confirmed' : 'draft'}>{b.state}</Badge>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E5E3DC] text-xs text-[#737373]">
            <span>Period: {formatDate(b.date_from)} - {formatDate(b.date_to)}</span>
          </div>
        </Card>
      ))}
    </div>
  );
}
