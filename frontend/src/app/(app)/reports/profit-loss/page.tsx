import ProfitLossReport from '@/components/reports/ProfitLossReport';

export default function ProfitLossPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Profit & Loss Report</h1>
      <ProfitLossReport />
    </div>
  );
}
