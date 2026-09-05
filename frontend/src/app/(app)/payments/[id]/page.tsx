import PaymentForm from '@/components/payments/PaymentForm';

export default async function PaymentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">
        {id === 'new' ? 'New Payment' : 'Edit Payment'}
      </h1>
      <PaymentForm id={id} />
    </div>
  );
}
