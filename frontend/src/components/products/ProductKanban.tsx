'use client';

import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';
import type { Product } from '@/types/product';

export default function ProductKanban({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {products.map((p) => (
        <Card key={p.id} className="hover:border-[#6B705C] transition-all cursor-pointer shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A5A58D] font-mono">
                {p.sku || 'NO SKU'}
              </span>
              <Badge variant={p.qty_available > 10 ? 'success' : 'warning'}>
                {p.qty_available} in stock
              </Badge>
            </div>
            <h4 className="font-semibold text-[#2C2C2C] text-base font-display mb-1">{p.name}</h4>
            <p className="text-xs text-[#737373]">{p.category || 'General Furniture'}</p>
          </div>

          <div className="mt-5 pt-3 border-t border-[#E5E3DC] flex items-center justify-between">
            <span className="text-base font-semibold text-[#2C2C2C] font-mono">{formatCurrency(p.lst_price)}</span>
            <span className="text-xs text-[#6B705C] font-medium hover:underline">Edit Product →</span>
          </div>
        </Card>
      ))}
    </div>
  );
}
