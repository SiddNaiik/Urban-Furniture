'use client';

import { useAuth } from '@/hooks/useAuth';
import { removeToken } from '@/lib/auth';
import { useRouter } from 'next/navigation';

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const { user } = useAuth();
  const router = useRouter();

  function handleLogout() {
    removeToken();
    router.push('/login');
  }

  return (
    <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
        aria-label="Open sidebar"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div className="ml-auto flex items-center gap-4">
        <span className="text-sm text-gray-600">
          {user?.name || user?.email || 'User'}
        </span>
        <button
          onClick={handleLogout}
          className="rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
