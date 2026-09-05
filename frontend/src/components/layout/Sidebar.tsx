"use client";

import { usePathname } from "next/navigation";
// API: import { useAuth } from "@/context/AuthContext";

const NAV = [
  {
    group: "OVERVIEW",
    items: [{ label: "Dashboard", href: "/dashboard", icon: DashIcon }],
  },
  {
    group: "MASTER DATA",
    items: [
      { label: "Contacts", href: "/contacts", icon: ContactIcon },
      { label: "Products", href: "/products", icon: ProductIcon },
      { label: "Users",    href: "/users",    icon: UserIcon },
    ],
  },
  {
    group: "ACCOUNTING",
    items: [
      { label: "Chart of Accounts",  href: "/chart-of-accounts",  icon: CoAIcon },
      { label: "Journals",           href: "/journals",            icon: JournalIcon },
      { label: "Journal Entries",    href: "/journal-entries",     icon: JEIcon },
      { label: "Analytic Accounts",  href: "/analytic-accounts",   icon: AnalyticIcon },
    ],
  },
  {
    group: "PURCHASE",
    items: [
      { label: "Purchase Orders", href: "/purchase-orders", icon: POIcon },
      { label: "Vendor Bills",    href: "/vendor-bills",    icon: BillIcon },
    ],
  },
  {
    group: "SALES",
    items: [
      { label: "Sales Orders",      href: "/sales-orders",      icon: SOIcon },
      { label: "Customer Invoices", href: "/customer-invoices", icon: InvIcon },
    ],
  },
  {
    group: "FINANCE",
    items: [
      { label: "Payments", href: "/payments", icon: PayIcon },
      { label: "Budgets",  href: "/budgets",  icon: BudgetIcon },
    ],
  },
  {
    group: "REPORTS",
    items: [
      { label: "Profit & Loss",  href: "/reports/profit-loss",    icon: ReportIcon },
      { label: "Balance Sheet",  href: "/reports/balance-sheet",  icon: ReportIcon },
      { label: "Budget Report",  href: "/reports/budget-report",  icon: ReportIcon },
    ],
  },
];

// SECTION 2: SVG ICONS

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
      <path d="M2 13c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor"
        strokeWidth="1.5" strokeLinecap="round" fill="none" opacity=".7"/>
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
      <path d="M2 13c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor"
        strokeWidth="1.5" strokeLinecap="round" fill="none"/>
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
      <path d="M2 12L6 7l3 3 5-6" stroke="currentColor" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" fill="none"/>
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
      <path d="M8 11.5l1.5-1.5-1.5-1.5" stroke="currentColor" strokeWidth="1.2"
        strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function SOIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 3h10l-1.5 7H4.5L3 3z" stroke="currentColor" strokeWidth="1.5"
        fill="none" strokeLinejoin="round"/>
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
      <rect x="3" y="9.5" width="3" height="1.5" rx=".5" fill="currentColor" opacity=".6"/>
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

// SECTION 3: SIDEBAR COMPONENT

export default function Sidebar() {
  const pathname = usePathname();

  // API: const { user } = useAuth();
  // API: When backend ready, replace all "Admin User" / "Administrator" / "A"

  return (

    <aside className="w-56 min-h-screen bg-[#E2DDD3] flex flex-col fixed left-0 top-0 bottom-0 z-50">

      {}
      {}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-[#D0CABF]">
        {}
        <div className="w-7 h-7 bg-[#6B705C] rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-bold">UF</span>
        </div>
        <span className="text-[#2C2C2C] font-semibold text-sm tracking-wide">
          Urban Furniture
        </span>
      </div>

      {}
      {}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-hide">
        {NAV.map((section) => (
          <div key={section.group}>

            {}
            {}
            <p className="text-[10px] font-semibold tracking-widest text-[#A5A58D] px-2 mb-1.5">
              {section.group}
            </p>

            {}
            <div className="space-y-0.5">
              {section.items.map((item) => {

                // Dashboard uses an exact match; other routes support nested pages.
                const active =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href));

                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors ${
                      active
                        ? "bg-[#6B705C] text-white font-medium"
                        : "text-[#737373] hover:text-[#2C2C2C] hover:bg-[#CEC9BE]"
                    }`}
                  >
                    {}
                    <span className={active ? "text-white" : "text-[#A5A58D]"}>
                      <item.icon />
                    </span>
                    {item.label}
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {}
      {}
      <div className="border-t border-[#D0CABF] px-4 py-4">
        <div className="flex items-center gap-3">

          {}
          <div className="w-8 h-8 rounded-full bg-[#6B705C] flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-semibold">
              A {}
            </span>
          </div>

          {}
          <div className="flex-1 min-w-0">
            <p className="text-[#2C2C2C] text-xs font-medium truncate">
              Admin User {}
            </p>
            <p className="text-[#737373] text-[10px] truncate">
              Administrator {}
            </p>
          </div>

          {}
          <button className="text-[#A5A58D] hover:text-[#2C2C2C] transition-colors">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 5l4 4 4-4" stroke="currentColor"
                strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}