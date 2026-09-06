import { Suspense } from 'react';
import VendorBillForm from '@/components/purchase/VendorBillForm';

export default async function VendorBillDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">
        {id === 'new' ? 'New Vendor Bill' : 'Edit Vendor Bill'}
      </h1>
      <Suspense fallback={null}>
        <VendorBillForm id={id} />
      </Suspense>
    </div>
  );
}