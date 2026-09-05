import PurchaseOrderList from '@/components/purchase/PurchaseOrderList';

export default function PurchaseOrdersPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Purchase Orders</h1>
      <PurchaseOrderList />
    </div>
  );
}
