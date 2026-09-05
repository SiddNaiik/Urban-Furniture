'use client';

import type { Budget } from '@/types/budget';
import { useRouter } from 'next/navigation';
import Badge from '@/components/ui/Badge';

interface BudgetKanbanProps {
  budgets: Budget[];
}

export default function BudgetKanban({ budgets }: BudgetKanbanProps) {
  const router = useRouter();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {budgets.map((b) => (
        <div
          key={b.id}
          onClick={() => router.push(`/budgets/${b.id}`)}
          className="bg-white rounded-xl border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="font-semibold text-gray-900">{b.name}</p>
            <Badge variant={b.status === 'confirmed' ? 'success' : 'warning'}>{b.status}</Badge>
          </div>
          <p className="text-xs text-gray-400">{b.period}</p>
          <p className="text-sm font-medium text-indigo-600 mt-2">${b.total_amount}</p>
        </div>
      ))}
    </div>
  );
}
