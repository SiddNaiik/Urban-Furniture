'use client';

import { useRouter } from 'next/navigation';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useFetch } from '@/hooks/useFetch';
import { getUsers } from '@/lib/api';
import type { User } from '@/types/user';

export default function UserList() {
  const router = useRouter();
  const { data: users = [], loading } = useFetch<User[]>(getUsers);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => router.push('/users/create')}>+ New User</Button>
      </div>
      {loading ? <p className="text-sm text-gray-400">Loading…</p> : (
        <Table
          columns={[
            { key: 'name', header: 'Name' },
            { key: 'email', header: 'Email' },
            { key: 'role', header: 'Role', render: (u) => <Badge>{u.role}</Badge> },
          ]}
          data={users}
          keyExtractor={(u) => u.id}
        />
      )}
    </div>
  );
}
