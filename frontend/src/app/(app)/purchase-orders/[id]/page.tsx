import PurchaseOrderForm from '@/components/purchase/PurchaseOrderForm';

export default async function PurchaseOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">
        {id === 'new' ? 'New Purchase Order' : 'Edit Purchase Order'}
      </h1>
      <PurchaseOrderForm id={id} />
    </div>
  );
}
