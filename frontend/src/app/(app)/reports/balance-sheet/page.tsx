import BalanceSheetReport from '@/components/reports/BalanceSheetReport';

export default function BalanceSheetPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Balance Sheet</h1>
      <BalanceSheetReport />
    </div>
  );
}
