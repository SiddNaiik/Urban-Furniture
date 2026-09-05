import JournalEntryForm from '@/components/accounting/JournalEntryForm';

export default async function JournalEntryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">
        {id === 'new' ? 'New Journal Entry' : 'Edit Journal Entry'}
      </h1>
      <JournalEntryForm id={id} />
    </div>
  );
}
