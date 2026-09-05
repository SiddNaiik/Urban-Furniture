import JournalForm from '@/components/accounting/JournalForm';

export default async function JournalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">
        {id === 'new' ? 'New Journal' : 'Edit Journal'}
      </h1>
      <JournalForm id={id} />
    </div>
  );
}
