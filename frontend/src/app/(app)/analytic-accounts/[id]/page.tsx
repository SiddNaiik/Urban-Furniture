import AnalyticAccountForm from '@/components/accounting/AnalyticAccountForm';

export default async function AnalyticAccountDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">
        {id === 'new' ? 'New Analytic Account' : 'Edit Analytic Account'}
      </h1>
      <AnalyticAccountForm id={id} />
    </div>
  );
}
