import PaymentList from '@/components/payments/PaymentList';

export default function PaymentsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
      <PaymentList />
    </div>
  );
}
