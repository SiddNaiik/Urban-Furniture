import BudgetList from '@/components/budget/BudgetList';

export default function BudgetsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Budgets</h1>
      <BudgetList />
    </div>
  );
}
