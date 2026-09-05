import VendorBillList from '@/components/purchase/VendorBillList';

export default function VendorBillsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Vendor Bills</h1>
      <VendorBillList />
    </div>
  );
}
