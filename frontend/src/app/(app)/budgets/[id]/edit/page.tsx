import BudgetForm from '@/components/budget/BudgetForm';

export default async function BudgetEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-[#2C2C2C]">Edit Budget</h1>
      <BudgetForm id={id} />
    </div>
  );
}
