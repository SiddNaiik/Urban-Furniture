'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuthContext } from '@/context/AuthContext';

const NAV_MENUS = {
  Sales: [
    { label: "Sales Orders",  href: "/sales-orders" },
    { label: "Customer Invoices", href: "/customer-invoices" },
    { label: "Payments Received", href: "/payments" },
  ],
  Purchase: [
    { label: "Purchase Orders", href: "/purchase-orders" },
    { label: "Vendor Bills",    href: "/vendor-bills" },
    { label: "Payments Sent",   href: "/payments" },
  ],
  Account: [
    { label: "Contacts",           href: "/contacts" },
    { label: "Products",           href: "/products" },
    { label: "Chart of Accounts",  href: "/chart-of-accounts" },
    { label: "Journals",          href: "/journals" },
    { label: "Journal Entries",   href: "/journal-entries" },
    { label: "Analytic Accounts", href: "/analytic-accounts" },
    { label: "Budgets",           href: "/budgets" },
  ],
  Report: [
    { label: "Profit & Loss", href: "/reports/profit-loss" },
    { label: "Balance Sheet", href: "/reports/balance-sheet" },
    { label: "Budget Report", href: "/reports/budget-report" },
  ],
};

export default function Topbar() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { user, logout } = useAuthContext();

  const initials = (user?.name ?? 'U').slice(0, 1).toUpperCase();
  const displayRole = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : '';

  return (
    <header className="h-16 bg-white border-b border-[#E5E3DC] flex items-center justify-between px-8 sticky top-0 z-40 shadow-2xs">
      {/* Menu items */}
      <nav className="flex items-center gap-1">
        {Object.keys(NAV_MENUS).map((menuKey) => {
          const isOpen = activeMenu === menuKey;
          const items = NAV_MENUS[menuKey as keyof typeof NAV_MENUS];

          return (
            <div key={menuKey} className="relative">
              <button
                onClick={() => setActiveMenu(isOpen ? null : menuKey)}
                className={`flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg font-medium transition-colors cursor-pointer ${
                  isOpen
                    ? "bg-[#6B705C]/10 text-[#6B705C]"
                    : "text-[#737373] hover:text-[#2C2C2C] hover:bg-[#F8F6F1]"
                }`}
              >
                {menuKey}
                <svg
                  width="12" height="12" viewBox="0 0 12 12" fill="none"
                  className={`transition-transform duration-200 ${isOpen ? "rotate-180 text-[#6B705C]" : "text-[#A5A58D]"}`}
                >
                  <path d="M2.5 4.5l3.5 3.5 3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {isOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setActiveMenu(null)} />
                  <div className="absolute top-full left-0 mt-1.5 bg-white border border-[#E5E3DC] rounded-xl shadow-lg z-40 min-w-[200px] py-1.5 animate-in fade-in zoom-in-95 duration-100">
                    {items.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setActiveMenu(null)}
                        className="block px-4 py-2.5 text-sm text-[#2C2C2C] hover:bg-[#F8F6F1] hover:text-[#6B705C] transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </nav>

      {/* User profile + logout */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-[#E5E3DC] bg-[#F8F6F1]/50">
          <div className="w-7 h-7 rounded-full bg-[#6B705C] flex items-center justify-center text-white text-xs font-semibold">
            {initials}
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-xs font-semibold text-[#2C2C2C]">{user?.name ?? 'User'}</span>
            <span className="text-[10px] text-[#737373]">{displayRole}</span>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#737373] hover:text-[#C0392B] rounded-lg hover:bg-red-50 transition-colors"
          title="Sign out"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </header>
  );
}
