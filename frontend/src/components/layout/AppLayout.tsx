'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useAuthContext } from '@/context/AuthContext';

// Routes only accessible to admin
const ADMIN_ONLY_ROUTES = ['/users'];
// Routes accessible to admin and accountant (not user role)
const ACCOUNTANT_ROUTES = [
  '/contacts', '/products', '/chart-of-accounts', '/journals',
  '/journal-entries', '/analytic-accounts', '/purchase-orders',
  '/vendor-bills', '/sales-orders', '/payments', '/budgets',
  '/reports',
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    // Not logged in → send to login
    if (!user) {
      router.replace('/login');
      return;
    }

    // Admin-only route check
    const isAdminOnly = ADMIN_ONLY_ROUTES.some((r) => pathname.startsWith(r));
    if (isAdminOnly && user.role !== 'admin') {
      router.replace('/dashboard');
      return;
    }

    // Accountant-or-admin only route check
    const isAccountantRoute = ACCOUNTANT_ROUTES.some((r) => pathname.startsWith(r));
    if (isAccountantRoute && user.role === 'user') {
      router.replace('/dashboard');
    }
  }, [loading, user, pathname, router]);

  // While loading or redirecting, show nothing
  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F6F1]">
        <div className="w-8 h-8 border-4 border-[#6B705C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F8F6F1]">
      {/* Fixed Sidebar Space Reserve */}
      <div className="w-56 shrink-0" aria-hidden="true" />
      <Sidebar />

      {/* Main Workspace */}
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar />
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
