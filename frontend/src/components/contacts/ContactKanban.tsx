'use client';
import { useState } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import type { Contact } from '@/types/contact';

function DetailModal({ contact, onClose }: { contact: Contact; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {contact.imageUrl ? (
              <img src={contact.imageUrl} alt={contact.name} className="w-12 h-12 rounded-full object-cover border border-[#E5E3DC]" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-[#6B705C]/10 text-[#6B705C] font-semibold flex items-center justify-center text-sm">
                {contact.name.substring(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <h2 className="text-base font-semibold text-[#2C2C2C]">{contact.name}</h2>
              <Badge variant={contact.type === 'customer' ? 'confirmed' : contact.type === 'vendor' ? 'warning' : 'default'}>
                {contact.type}
              </Badge>
            </div>
          </div>
          <button onClick={onClose} className="text-[#737373] hover:text-[#2C2C2C] transition-colors p-1">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="border-t border-[#E5E3DC] mb-4" />

        <div className="space-y-2.5">
          {[
            { label: 'Email',   value: contact.email },
            { label: 'Phone',   value: contact.phone },
            { label: 'Street',  value: (contact as any).street },
            { label: 'City',    value: (contact as any).city },
            { label: 'State',   value: (contact as any).state },
            { label: 'Country', value: (contact as any).country },
            { label: 'Pincode', value: (contact as any).pincode },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-start gap-3">
              <span className="text-xs text-[#737373] w-16 flex-shrink-0 pt-0.5">{label}</span>
              <span className="text-sm text-[#2C2C2C] font-medium">{value || '—'}</span>
            </div>
          ))}
        </div>

        <div className="mt-5 flex justify-end">
          <button onClick={onClose} className="bg-[#6B705C] text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-[#5C6149] transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ContactKanban({ contacts = [] }: { contacts?: Contact[] }) {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {(contacts ?? []).map((c) => (
          <Card key={c.id} className="hover:border-[#6B705C] transition-all cursor-pointer shadow-2xs">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {c.imageUrl ? (
                  <img src={c.imageUrl} alt={c.name} className="w-10 h-10 rounded-full object-cover border border-[#E5E3DC] flex-shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#6B705C]/10 text-[#6B705C] font-semibold flex items-center justify-center font-display text-sm flex-shrink-0">
                    {c.name.substring(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <h4 className="font-semibold text-[#2C2C2C] text-sm">{c.name}</h4>
                  <p className="text-xs text-[#737373]">{c.email || 'No email'}</p>
                </div>
              </div>
              <Badge variant={c.type === 'customer' ? 'confirmed' : c.type === 'vendor' ? 'warning' : 'default'}>
                {c.type}
              </Badge>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E5E3DC] flex items-center justify-between text-xs text-[#737373]">
              <span className="font-mono">{c.phone || 'No phone'}</span>
              <button onClick={() => setSelectedContact(c)} className="text-[#6B705C] font-medium hover:underline">
                Details →
              </button>
            </div>
          </Card>
        ))}
      </div>

      {selectedContact && (
        <DetailModal contact={selectedContact} onClose={() => setSelectedContact(null)} />
      )}
    </>
  );
}