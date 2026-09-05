import SalesOrderForm from '@/components/sales/SalesOrderForm';

export default async function SalesOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">
        {id === 'new' ? 'New Sales Order' : 'Edit Sales Order'}
      </h1>
      <SalesOrderForm id={id} />
    </div>
  );
}
