import CoAForm from '@/components/accounting/CoAForm';

export default async function CoADetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">
        {id === 'new' ? 'New Account' : 'Edit Account'}
      </h1>
      <CoAForm id={id} />
    </div>
  );
}
