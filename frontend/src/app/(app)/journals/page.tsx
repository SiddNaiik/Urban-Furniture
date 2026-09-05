import JournalList from '@/components/accounting/JournalList';

export default function JournalsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Journals</h1>
      <JournalList />
    </div>
  );
}
