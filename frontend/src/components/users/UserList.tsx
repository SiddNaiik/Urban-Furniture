'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import SearchBar from '@/components/ui/SearchBar';
import { MOCK_USERS } from '@/lib/mockData';
import { ui } from '@/lib/theme';

export default function UserList() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [users] = useState(MOCK_USERS);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search users by name or email..." className="max-w-md flex-1" />
        <Button onClick={() => router.push('/users/create')}>+ Create New User</Button>
      </div>

      <Table
        columns={[
          {
            key: 'name',
            header: 'User Name',
            render: (u) => (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#6B705C] text-white flex items-center justify-center font-semibold text-xs">
                  {u.name.charAt(0)}
                </div>
                <span className="font-semibold text-[#2C2C2C]">{u.name}</span>
              </div>
            ),
          },
          { key: 'email', header: 'Email Address', render: (u) => <span className="text-[#737373] text-sm">{u.email}</span> },
          {
            key: 'role',
            header: 'Role & Permissions',
            render: (u) => (
              <Badge variant={u.role === 'Administrator' ? 'confirmed' : 'default'}>
                {u.role}
              </Badge>
            ),
          },
        ]}
        data={filtered}
        keyExtractor={(u) => u.id}
      />
    </div>
  );
}
