'use client';

import type { Product } from '@/types/product';
import { useRouter } from 'next/navigation';

interface ProductKanbanProps {
  products: Product[];
}

export default function ProductKanban({ products }: ProductKanbanProps) {
  const router = useRouter();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {products.map((p) => (
        <div
          key={p.id}
          onClick={() => router.push(`/products/${p.id}`)}
          className="bg-white rounded-xl border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
        >
          <p className="font-semibold text-gray-900">{p.name}</p>
          <p className="text-xs text-gray-400 mt-1">{p.sku}</p>
          <p className="text-sm font-medium text-indigo-600 mt-2">${p.price}</p>
        </div>
      ))}
    </div>
  );
}
