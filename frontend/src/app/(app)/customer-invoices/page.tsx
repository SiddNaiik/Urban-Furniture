import CustomerInvoiceList from '@/components/sales/CustomerInvoiceList';

export default function CustomerInvoicesPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Customer Invoices</h1>
      <CustomerInvoiceList />
    </div>
  );
}
