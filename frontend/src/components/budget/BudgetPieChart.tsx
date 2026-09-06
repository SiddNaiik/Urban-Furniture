'use client';

import Card from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';

interface Props {
  planned: number;
  achieved: number;
  remaining: number;
}

export default function BudgetPieChart({ planned, achieved, remaining }: Props) {
  const safePlanned = Math.max(planned, 0);
  const safeAchieved = Math.min(Math.max(achieved, 0), safePlanned);
  const safeRemaining = Math.max(remaining, 0);
  const percentage = safePlanned > 0 ? Math.round((safeAchieved / safePlanned) * 100) : 0;
  const angle = safePlanned > 0 ? (safeAchieved / safePlanned) * 360 : 0;

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-semibold text-[#2C2C2C]">Budget Analytics</h2>
          <p className="text-xs text-[#737373] mt-1">Planned vs achieved amount</p>
        </div>
        <span className="text-sm font-semibold text-[#6B705C]">{percentage}%</span>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row items-center gap-6">
        <div
          className="relative h-36 w-36 rounded-full shrink-0"
          style={{
            background: `conic-gradient(#6B705C 0deg ₹{angle}deg, #E5E3DC ₹{angle}deg 360deg)`,
          }}
        >
          <div className="absolute inset-5 rounded-full bg-white border border-[#E5E3DC] flex flex-col items-center justify-center">
            <span className="text-xl font-semibold text-[#2C2C2C]">{percentage}%</span>
            <span className="text-[10px] text-[#737373] uppercase tracking-wide">Achieved</span>
          </div>
        </div>

        <div className="w-full space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-[#737373]">Achieved</span>
            <span className="font-mono font-medium">{formatCurrency(safeAchieved)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-[#737373]">Remaining</span>
            <span className="font-mono font-medium">{formatCurrency(safeRemaining)}</span>
          </div>
          <div className="pt-3 border-t border-[#E5E3DC] flex justify-between gap-4">
            <span className="text-[#737373]">Planned Budget</span>
            <span className="font-mono font-semibold">{formatCurrency(safePlanned)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
