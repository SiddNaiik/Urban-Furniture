"use client";

import { useState } from "react";

const MOCK_DATA = {
  sales: {
    all: 12,
    confirmed: 10,
    draft: 2,
  },
  purchase: {
    all: 12,
    confirmed: 10,
    draft: 2,
  },
  budget: {
    achieved: 3,
    budget: 2,
    committed: 4,
  },
};

const NAV_MENUS = {
  Sales: [
    { label: "Sales order",  href: "/sales-orders" },
    { label: "Sale Invoice", href: "/customer-invoices" },
    { label: "Receipt",      href: "/payments?type=receive" },
  ],
  Purchase: [
    { label: "Purchase Order", href: "/purchase-orders" },
    { label: "Purchase Bill",  href: "/vendor-bills" },
    { label: "Payment",        href: "/payments?type=send" },
  ],
  Account: [
    { label: "Contact",           href: "/contacts" },
    { label: "Product",           href: "/products" },
    { label: "Analyticals",       href: "/analytic-accounts" },
    { label: "Analytical Budget", href: "/budgets" },
    { label: "Chart of Account",  href: "/chart-of-accounts" },
    { label: "Journals",          href: "/journals" },
    { label: "Journal Entries",   href: "/journal-entries" },
  ],
  Report: [
    { label: "Balancesheet",    href: "/reports/balance-sheet" },
    { label: "Profit and Loss", href: "/reports/profit-loss" },
    { label: "Budget Report",   href: "/reports/budget-report" },
  ],
};

function NavDropdown({
  label,
  items,
  open,
  onToggle,
}: {
  label: string;
  items: { label: string; href: string }[];
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="relative">

      {}
      <button
        onClick={onToggle}
        className={`flex items-center gap-1 px-9 py-3 text-sm rounded-md transition-colors ${
          open
            ? "text-[#2C2C2C] font-semibold"
            : "text-[#737373] hover:text-[#2C2C2C]"
        }`}
      >
        {label}
        {}
        <svg
          width="10" height="10" viewBox="0 0 10 10" fill="none"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path d="M2 3.5l3 3 3-3" stroke="currentColor"
            strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {}
      {open && (
        <div className="absolute top-full left-0 mt-1.5 bg-white border border-[#E5E3DC] rounded-xl shadow-md z-50 min-w-[170px] py-1.5">
          {items.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="block px-4 py-2 text-sm text-[#2C2C2C] hover:bg-[#F8F6F1] hover:text-[#6B705C] transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function Topbar({
  activeMenu,
  onMenuToggle,
}: {
  activeMenu: string | null;
  onMenuToggle: (menu: string) => void;
}) {
  return (
    <header className="h-17 bg-white border-b border-[#E5E3DC] flex items-center justify-between pl-60 pr-8 sticky top-0 z-40">

      {}
      <nav className="flex items-center gap-0.5">
        {Object.keys(NAV_MENUS).map((menu) => (
          <NavDropdown
            key={menu}
            label={menu}
            items={NAV_MENUS[menu as keyof typeof NAV_MENUS]}
            open={activeMenu === menu}
            onToggle={() => onMenuToggle(menu)}
          />
        ))}
      </nav>

      {}
      {}
      <div className="flex items-center gap-2.5 pl-3 pr-2 py-1.5 rounded-xl border border-[#E5E3DC] hover:border-[#A5A58D] transition-colors cursor-pointer">
        {}
        <div className="w-7 h-7 rounded-full bg-[#6B705C] flex items-center justify-center">
          <span className="text-white text-xs font-semibold">
            A {}
          </span>
        </div>
        {}
        <div className="flex flex-col leading-tight">
          <span className="text-xs font-semibold text-[#2C2C2C]">
            Admin User {}
          </span>
          <span className="text-[10px] text-[#737373]">
            Administrator {}
          </span>
        </div>
        {}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="ml-1 text-[#737373]">
          <path d="M2.5 4.5l3.5 3.5 3.5-3.5" stroke="currentColor"
            strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </header>
  );
}

function StatChip({ label, value }: { label: string; value: number }) {
  return (

    <div className="flex-1 border border-[#E5E3DC] rounded-xl px-6 py-5 bg-[#FAFAF8] hover:border-[#A5A58D] transition-colors">
      <p className="text-xs text-[#737373] mb-2">{label}</p>
      <p className="text-3xl font-semibold text-[#2C2C2C] tabular-nums">{value}</p>
    </div>
  );
}

function SectionCard({
  title,
  chips,
  actionLabel,
  actionHref,
}: {
  title: string;
  chips: { label: string; value: number }[];
  actionLabel: string;
  actionHref: string;
}) {
  return (
    <div className="bg-white border border-[#E5E3DC] rounded-2xl p-7 shadow-sm">

      {}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold text-[#2C2C2C]">{title}</h2>
        <a
          href={actionHref}
          className="bg-[#6B705C] text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-[#5C6149] transition-colors"
        >
          {actionLabel}
        </a>
      </div>

      {}
      <div className="flex flex-row gap-4">
        {chips.map((chip) => (
          <StatChip key={chip.label} label={chip.label} value={chip.value} />
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {

  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const data = MOCK_DATA;

  function toggleMenu(menu: string) {
    setActiveMenu((prev) => (prev === menu ? null : menu));
  }

  return (
    <div className="min-h-screen bg-[#F8F6F1]" style={{ fontFamily: "'Inter', sans-serif" }}>

      {}
      <Topbar activeMenu={activeMenu} onMenuToggle={toggleMenu} />

      {}
      {activeMenu && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setActiveMenu(null)}
        />
      )}

      {}
      <main className="max-w-3xl mx-auto px-6 py-10 flex flex-col gap-5">

        {}
        <h1 className="text-2xl font-semibold text-[#2C2C2C] mb-2">
          Dashboard
        </h1>

        {}
        <SectionCard
          title="Sales"
          actionLabel="New"
          actionHref="/sales-orders/new"
          chips={[
            { label: "All",       value: data.sales.all },
            { label: "Confirmed", value: data.sales.confirmed },
            { label: "Draft",     value: data.sales.draft },
          ]}
        />

        {}
        <SectionCard
          title="Purchase"
          actionLabel="New"
          actionHref="/purchase-orders/new"
          chips={[
            { label: "All",       value: data.purchase.all },
            { label: "Confirmed", value: data.purchase.confirmed },
            { label: "Draft",     value: data.purchase.draft },
          ]}
        />

        {}
        <SectionCard
          title="Budget Reports"
          actionLabel="Report"
          actionHref="/reports/budget-report"
          chips={[
            { label: "Achieved",  value: data.budget.achieved },
            { label: "Budget",    value: data.budget.budget },
            { label: "Committed", value: data.budget.committed },
          ]}
        />
      </main>
    </div>
  );
}
