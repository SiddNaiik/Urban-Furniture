import AnalyticAccountList from '@/components/accounting/AnalyticAccountList';

export default function AnalyticAccountsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Analytic Accounts</h1>
      <AnalyticAccountList />
    </div>
  );
}
