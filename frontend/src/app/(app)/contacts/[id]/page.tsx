import ContactForm from '@/components/contacts/ContactForm';

export default async function ContactDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">
        {id === 'new' ? 'New Contact' : 'Edit Contact'}
      </h1>
      <ContactForm id={id} />
    </div>
  );
}
