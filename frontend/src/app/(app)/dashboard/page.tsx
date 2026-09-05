"use client";

import React, { useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Table from "@/components/ui/Table";
import { formatCurrency } from "@/lib/utils";
import { MOCK_SALES_ORDERS, MOCK_PURCHASE_ORDERS, MOCK_CUSTOMER_INVOICES, MOCK_PRODUCTS } from "@/lib/mockData";
import { ui } from "@/lib/theme";

/*
  BACKEND DYNAMIC DATA INTEGRATION (API Example):
  -----------------------------------------------
  import { useFetch } from "@/hooks/useFetch";
  import { getSalesOrders, getPurchaseOrders, getCustomerInvoices } from "@/lib/api";

  const { data: salesOrders = MOCK_SALES_ORDERS } = useFetch(getSalesOrders);
  const { data: purchaseOrders = MOCK_PURCHASE_ORDERS } = useFetch(getPurchaseOrders);
  const { data: invoices = MOCK_CUSTOMER_INVOICES } = useFetch(getCustomerInvoices);
*/

export default function DashboardPage() {
  const [sales] = useState(MOCK_SALES_ORDERS);
  const [purchases] = useState(MOCK_PURCHASE_ORDERS);
  const [invoices] = useState(MOCK_CUSTOMER_INVOICES);
  const [products] = useState(MOCK_PRODUCTS);

  const totalSalesAmount = sales.reduce((sum, item) => sum + item.total, 0);
  const totalPurchaseAmount = purchases.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={ui.pageTitle}>Dashboard Overview</h1>
          <p className="text-sm text-[#737373] mt-1">Real-time accounting insights & business performance</p>
        </div>
        <div className="flex gap-3">
          <Link href="/sales-orders/new" className={ui.btnPrimary}>
            + New Sales Order
          </Link>
          <Link href="/purchase-orders/new" className={ui.btnSecondary}>
            + New Purchase Order
          </Link>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={ui.metricCard}>
          <span className={ui.metricLabel}>Total Revenue (Sales)</span>
          <span className={ui.metricValue}>{formatCurrency(totalSalesAmount)}</span>
          <span className="text-xs text-[#3D7A4E] font-medium mt-1">↑ 12% vs last month</span>
        </div>
        <div className={ui.metricCard}>
          <span className={ui.metricLabel}>Total Purchases</span>
          <span className={ui.metricValue}>{formatCurrency(totalPurchaseAmount)}</span>
          <span className="text-xs text-[#737373] mt-1">2 Pending Approval</span>
        </div>
        <div className={ui.metricCard}>
          <span className={ui.metricLabel}>Active Invoices</span>
          <span className={ui.metricValue}>{invoices.length}</span>
          <span className="text-xs text-[#D97706] font-medium mt-1">1 Awaiting Payment</span>
        </div>
        <div className={ui.metricCard}>
          <span className={ui.metricLabel}>Products in Stock</span>
          <span className={ui.metricValue}>{products.reduce((acc, p) => acc + p.qty_available, 0)} units</span>
          <span className="text-xs text-[#3D7A4E] font-medium mt-1">5 Categories</span>
        </div>
      </div>

      {/* Section Cards matching wireframe style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SectionCard
          title="Sales Orders"
          actionLabel="New Order"
          actionHref="/sales-orders/new"
          chips={[
            { label: "All Orders", value: sales.length },
            { label: "Confirmed", value: sales.filter(s => s.status === 'sale' || s.status === 'done').length },
            { label: "Draft", value: sales.filter(s => s.status === 'draft').length },
          ]}
        />

        <SectionCard
          title="Purchase Orders"
          actionLabel="New PO"
          actionHref="/purchase-orders/new"
          chips={[
            { label: "All Orders", value: purchases.length },
            { label: "Confirmed", value: purchases.filter(p => p.status === 'purchase').length },
            { label: "Draft", value: purchases.filter(p => p.status === 'draft').length },
          ]}
        />

        <SectionCard
          title="Budgets & Reports"
          actionLabel="View P&L"
          actionHref="/reports/profit-loss"
          chips={[
            { label: "Achieved", value: 3 },
            { label: "Committed", value: 4 },
            { label: "Active", value: 2 },
          ]}
        />
      </div>

      {/* Recent Orders & Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sales Orders */}
        <Card padding={false} className="overflow-hidden">
          <div className="p-5 border-b border-[#E5E3DC] flex items-center justify-between">
            <h3 className="font-semibold text-[#2C2C2C] font-display">Recent Sales Orders</h3>
            <Link href="/sales-orders" className="text-xs text-[#6B705C] font-medium hover:underline">View All →</Link>
          </div>
          <Table
            columns={[
              { key: 'reference', header: 'Reference' },
              { key: 'customer', header: 'Customer' },
              { key: 'total', header: 'Total', render: (row) => <span className="font-mono font-medium">{formatCurrency(row.total)}</span> },
              { key: 'status', header: 'Status', render: (row) => <Badge variant={row.status === 'sale' || row.status === 'done' ? 'confirmed' : 'draft'}>{row.status}</Badge> },
            ]}
            data={sales.slice(0, 5)}
            keyExtractor={(item) => item.id}
          />
        </Card>

        {/* Top Furniture Products */}
        <Card padding={false} className="overflow-hidden">
          <div className="p-5 border-b border-[#E5E3DC] flex items-center justify-between">
            <h3 className="font-semibold text-[#2C2C2C] font-display">Top Furniture Inventory</h3>
            <Link href="/products" className="text-xs text-[#6B705C] font-medium hover:underline">View All →</Link>
          </div>
          <Table
            columns={[
              { key: 'name', header: 'Product' },
              { key: 'category', header: 'Category' },
              { key: 'lst_price', header: 'Price', render: (row) => <span className="font-mono font-medium">{formatCurrency(row.lst_price)}</span> },
              { key: 'qty_available', header: 'Stock', render: (row) => <span className="font-semibold text-[#2C2C2C]">{row.qty_available} units</span> },
            ]}
            data={products.slice(0, 5)}
            keyExtractor={(item) => item.id}
          />
        </Card>
      </div>
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
    <Card className="flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-[#2C2C2C] font-display">{title}</h2>
          <Link href={actionHref} className="bg-[#6B705C] text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-[#5C6149] transition-colors">
            {actionLabel}
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {chips.map((chip) => (
            <div key={chip.label} className="border border-[#E5E3DC] rounded-lg p-3 bg-[#F8F6F1]/50 text-center">
              <p className="text-[10px] text-[#737373] uppercase tracking-wider font-semibold mb-1">{chip.label}</p>
              <p className="text-xl font-semibold text-[#2C2C2C] font-mono">{chip.value}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
