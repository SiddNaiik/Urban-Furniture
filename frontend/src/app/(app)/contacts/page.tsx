import ContactList from '@/components/contacts/ContactList';
export default function ContactsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
      <ContactList />
    </div>
  );
}
