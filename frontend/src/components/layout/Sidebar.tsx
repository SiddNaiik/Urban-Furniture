'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navGroups = [
  {
    label: 'Overview',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    ],
  },
  {
    label: 'Master Data',
    items: [
      { href: '/contacts', label: 'Contacts', icon: '👥' },
      { href: '/products', label: 'Products', icon: '📦' },
      { href: '/users', label: 'Users', icon: '👤' },
    ],
  },
  {
    label: 'Accounting',
    items: [
      { href: '/chart-of-accounts', label: 'Chart of Accounts', icon: '📒' },
      { href: '/journals', label: 'Journals', icon: '📓' },
      { href: '/journal-entries', label: 'Journal Entries', icon: '📝' },
      { href: '/analytic-accounts', label: 'Analytic Accounts', icon: '📈' },
    ],
  },
  {
    label: 'Purchase',
    items: [
      { href: '/purchase-orders', label: 'Purchase Orders', icon: '🛒' },
      { href: '/vendor-bills', label: 'Vendor Bills', icon: '🧾' },
    ],
  },
  {
    label: 'Sales',
    items: [
      { href: '/sales-orders', label: 'Sales Orders', icon: '🛍️' },
      { href: '/customer-invoices', label: 'Customer Invoices', icon: '📄' },
    ],
  },
  {
    label: 'Finance',
    items: [
      { href: '/payments', label: 'Payments', icon: '💳' },
      { href: '/budgets', label: 'Budgets', icon: '🏦' },
    ],
  },
  {
    label: 'Reports',
    items: [
      { href: '/reports/profit-loss', label: 'Profit & Loss', icon: '📉' },
      { href: '/reports/balance-sheet', label: 'Balance Sheet', icon: '⚖️' },
      { href: '/reports/budget-report', label: 'Budget Report', icon: '📋' },
    ],
  },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 text-white flex flex-col transition-transform duration-300',
          'lg:relative lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-700">
          <span className="text-2xl">🪑</span>
          <span className="text-lg font-bold tracking-tight">Urban Furniture</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="px-3 mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
                {group.label}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const active = pathname === item.href || pathname.startsWith(item.href + '/');
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                          active
                            ? 'bg-indigo-600 text-white'
                            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                        )}
                      >
                        <span className="text-base">{item.icon}</span>
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
