import BudgetList from '@/components/budget/BudgetList';

export default function BudgetsPage() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-widest text-[#A5A58D] font-semibold">
          Accounting
        </p>
        <h1 className="text-2xl font-bold text-[#2C2C2C] font-display">Budgets</h1>
      </div>
      <BudgetList />
    </div>
  );
}
