'use client';

import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import type { Contact } from '@/types/contact';

export default function ContactKanban({ contacts }: { contacts: Contact[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {contacts.map((c) => (
        <Card key={c.id} className="hover:border-[#6B705C] transition-all cursor-pointer shadow-2xs">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#6B705C]/10 text-[#6B705C] font-semibold flex items-center justify-center font-display text-sm">
                {c.name.substring(0, 2).toUpperCase()}
              </div>
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
            <span className="text-[#6B705C] font-medium hover:underline">Details →</span>
          </div>
        </Card>
      ))}
    </div>
  );
}
