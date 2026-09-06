"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ui } from "@/lib/theme";
import { useAuthContext } from "@/context/AuthContext";

type NavItem = { label: string; href: string; icon: () => React.ReactElement };
type NavSection = { group: string; items: NavItem[]; roles?: string[] };

const NAV: NavSection[] = [
  {
    group: "OVERVIEW",
    items: [{ label: "Dashboard", href: "/dashboard", icon: DashIcon }],
  },
  {
    group: "MASTER DATA",
    roles: ["admin", "accountant"],
    items: [
      { label: "Contacts", href: "/contacts", icon: ContactIcon },
      { label: "Products", href: "/products", icon: ProductIcon },
    ],
  },
  {
    group: "ADMIN",
    roles: ["admin"],
    items: [
      { label: "Users", href: "/users", icon: UserIcon },
    ],
  },
  {
    group: "ACCOUNTING",
    roles: ["admin", "accountant"],
    items: [
      { label: "Chart of Accounts",  href: "/chart-of-accounts",  icon: CoAIcon },
      { label: "Journals",           href: "/journals",            icon: JournalIcon },
      { label: "Journal Entries",    href: "/journal-entries",     icon: JEIcon },
      { label: "Analytic Accounts",  href: "/analytic-accounts",   icon: AnalyticIcon },
    ],
  },
  {
    group: "PURCHASE",
    roles: ["admin", "accountant"],
    items: [
      { label: "Purchase Orders", href: "/purchase-orders", icon: POIcon },
      { label: "Vendor Bills",    href: "/vendor-bills",    icon: BillIcon },
    ],
  },
  {
    group: "SALES",
    items: [
      { label: "Sales Orders",      href: "/sales-orders",      icon: SOIcon, roles: ["admin", "accountant"] } as unknown as NavItem,
      { label: "Customer Invoices", href: "/customer-invoices", icon: InvIcon },
    ],
  },
  {
    group: "FINANCE",
    roles: ["admin", "accountant"],
    items: [
      { label: "Payments", href: "/payments", icon: PayIcon },
      { label: "Budgets",  href: "/budgets",  icon: BudgetIcon },
    ],
  },
  {
    group: "REPORTS",
    roles: ["admin", "accountant"],
    items: [
      { label: "Profit & Loss",  href: "/reports/profit-loss",    icon: ReportIcon },
      { label: "Balance Sheet",  href: "/reports/balance-sheet",  icon: ReportIcon },
      { label: "Budget Report",  href: "/reports/budget-report",  icon: ReportIcon },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthContext();

  const role = user?.role ?? "user";
  const initials = (user?.name ?? "U").slice(0, 1).toUpperCase();
  const displayRole = role.charAt(0).toUpperCase() + role.slice(1);

  const visibleSections = NAV
    .map((section) => {
      if (section.roles && !section.roles.includes(role)) return null;
      const visibleItems = section.items.filter((item) => {
        const itemRoles = (item as unknown as { roles?: string[] }).roles;
        if (itemRoles) return itemRoles.includes(role);
        return true;
      });
      if (!visibleItems.length) return null;
      return { ...section, items: visibleItems };
    })
    .filter(Boolean) as NavSection[];

  return (
    <aside className="w-56 min-h-screen bg-[#F8F6F1] border-r border-[#E5E3DC] flex flex-col fixed left-0 top-0 bottom-0 z-50">
      {/* Brand Header */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-[#E5E3DC]">
        <div className="w-8 h-8 bg-[#6B705C] rounded-lg flex items-center justify-center flex-shrink-0 shadow-xs">
          <span className="text-white text-xs font-bold font-display">UF</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[#2C2C2C] font-semibold text-sm tracking-wide font-display leading-tight">
            Urban Furniture
          </span>
          <span className="text-[#A5A58D] text-[9px] font-semibold uppercase tracking-widest">
            ERP System
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-thin">
        {visibleSections.map((section) => (
          <div key={section.group}>
            <p className={ui.sectionLabel + " px-2 mb-1.5"}>
              {section.group}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={active ? ui.navActive : ui.navItem}
                  >
                    <span className={active ? "text-white" : "text-[#A5A58D]"}>
                      <item.icon />
                    </span>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Footer Profile */}
      <div className="border-t border-[#E5E3DC] px-4 py-3.5 bg-white/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#6B705C] flex items-center justify-center flex-shrink-0 shadow-xs">
            <span className="text-white text-xs font-semibold">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[#2C2C2C] text-xs font-semibold truncate">
              {user?.name ?? "User"}
            </p>
            <p className="text-[#737373] text-[10px] truncate">
              {displayRole}
            </p>
          </div>
          <button
            onClick={logout}
            className="text-[#A5A58D] hover:text-[#C0392B] transition-colors p-1"
            title="Sign out"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}

// Icons
function DashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity=".9"/>
      <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity=".5"/>
      <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".5"/>
      <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".9"/>
    </svg>
  );
}
function ContactIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="5" r="3" fill="currentColor" opacity=".8"/>
      <path d="M2 13c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    </svg>
  );
}
function ProductIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="8" width="12" height="6" rx="1.5" fill="currentColor" opacity=".5"/>
      <rect x="4" y="2" width="8" height="7" rx="1.5" fill="currentColor" opacity=".9"/>
    </svg>
  );
}
function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M2 13c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    </svg>
  );
}
function CoAIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="2"  width="12" height="2" rx="1" fill="currentColor" opacity=".9"/>
      <rect x="2" y="7"  width="8"  height="2" rx="1" fill="currentColor" opacity=".6"/>
      <rect x="2" y="12" width="10" height="2" rx="1" fill="currentColor" opacity=".4"/>
    </svg>
  );
}
function JournalIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="3" y="1" width="10" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M6 5h4M6 8h4M6 11h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}
function JEIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 4h12M2 8h8M2 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
function AnalyticIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 12L6 7l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}
function POIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M5 8h6M8 5v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
function BillIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="3" y="1" width="10" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M6 5h4M6 8h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}
function SOIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 3h10l-1.5 7H4.5L3 3z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
      <circle cx="6"  cy="13" r="1" fill="currentColor"/>
      <circle cx="11" cy="13" r="1" fill="currentColor"/>
    </svg>
  );
}
function InvIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="3" y="1" width="10" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M6 6h4M6 9h4M6 12h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}
function PayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="4" width="14" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M1 7h14" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}
function BudgetIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M8 4v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
function ReportIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2"   y="10" width="3" height="4" rx="1" fill="currentColor" opacity=".5"/>
      <rect x="6.5" y="6"  width="3" height="8" rx="1" fill="currentColor" opacity=".7"/>
      <rect x="11"  y="2"  width="3" height="12" rx="1" fill="currentColor" opacity=".9"/>
    </svg>
  );
}