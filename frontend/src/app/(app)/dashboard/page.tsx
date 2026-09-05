import MetricCard from '@/components/dashboard/MetricCard';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import SalesChart from '@/components/dashboard/SalesChart';
import TopProductsChart from '@/components/dashboard/TopProductsChart';
import CashFlowChart from '@/components/dashboard/CashFlowChart';
import AccountBalanceSummary from '@/components/dashboard/AccountBalanceSummary';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard title="Total Revenue" value="$0" trend={0} />
        <MetricCard title="Total Expenses" value="$0" trend={0} />
        <MetricCard title="Net Profit" value="$0" trend={0} />
        <MetricCard title="Pending Invoices" value="0" trend={0} />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <SalesChart />
        <CashFlowChart />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <RecentTransactions />
        </div>
        <div className="space-y-6">
          <TopProductsChart />
          <AccountBalanceSummary />
        </div>
      </div>
    </div>
  );
}
