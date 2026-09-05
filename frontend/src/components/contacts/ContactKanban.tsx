'use client';

import type { Contact } from '@/types/contact';
import { useRouter } from 'next/navigation';

interface ContactKanbanProps {
  contacts: Contact[];
}

export default function ContactKanban({ contacts }: ContactKanbanProps) {
  const router = useRouter();

  const groups = {
    customer: contacts.filter((c) => c.type === 'customer'),
    vendor: contacts.filter((c) => c.type === 'vendor'),
    both: contacts.filter((c) => c.type === 'both'),
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {Object.entries(groups).map(([key, items]) => (
        <div key={key} className="bg-gray-100 rounded-xl p-4 space-y-3">
          <h3 className="text-xs font-semibold Uppercase text-gray-500 tracking-wider capitalize">{key}</h3>
          {items.map((c) => (
            <div
              key={c.id}
              onClick={() => router.push(`/contacts/${c.id}`)}
              className="bg-white rounded-lg p-3 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            >
              <p className="font-medium text-sm text-gray-900">{c.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{c.email}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
