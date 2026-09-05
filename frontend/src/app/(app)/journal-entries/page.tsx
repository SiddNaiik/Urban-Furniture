import JournalEntryList from '@/components/accounting/JournalEntryList';

export default function JournalEntriesPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Journal Entries</h1>
      <JournalEntryList />
    </div>
  );
}
