import Card from '@/components/ui/Card';

export default function ProfitLossReport() {
  return (
    <Card>
      <p className="text-sm text-gray-500">Select a date range to generate the Profit & Loss report.</p>
      <div className="mt-6 text-center text-gray-400 text-sm">Report data will appear here.</div>
    </Card>
  );
}
