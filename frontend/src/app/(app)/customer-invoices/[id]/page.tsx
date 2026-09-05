import CustomerInvoiceForm from '@/components/sales/CustomerInvoiceForm';

export default async function CustomerInvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">
        {id === 'new' ? 'New Customer Invoice' : 'Edit Customer Invoice'}
      </h1>
      <CustomerInvoiceForm id={id} />
    </div>
  );
}
