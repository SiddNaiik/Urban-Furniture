import SalesOrderList from '@/components/sales/SalesOrderList';

export default function SalesOrdersPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Sales Orders</h1>
      <SalesOrderList />
    </div>
  );
}
