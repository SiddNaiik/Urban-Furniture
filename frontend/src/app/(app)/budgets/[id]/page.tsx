import BudgetForm from '@/components/budget/BudgetForm';

export default async function BudgetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">
        {id === 'new' ? 'New Budget' : 'Edit Budget'}
      </h1>
      <BudgetForm id={id} />
    </div>
  );
}
