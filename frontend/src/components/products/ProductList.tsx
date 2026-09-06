'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import SearchBar from '@/components/ui/SearchBar';
import ViewToggle from '@/components/ui/ViewToggle';
import ProductKanban from './ProductKanban';
import { MOCK_PRODUCTS } from '@/lib/mockData';
import { formatCurrency } from '@/lib/utils';

/*
  BACKEND DYNAMIC API CODE:
  -------------------------
  import { useFetch } from '@/hooks/useFetch';
  import { getProducts } from '@/lib/api';
  // const { data: products = [] } = useFetch(getProducts);
*/

export default function ProductList() {
  const router = useRouter();
  const [view, setView] = useState<'list' | 'kanban'>('list');
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState(MOCK_PRODUCTS);

  function handleUpdateProduct(updated: typeof MOCK_PRODUCTS[number]) {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  }


  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.category && p.category.toLowerCase().includes(search.toLowerCase())) ||
    p.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search products by name, category, or type..." className="max-w-md flex-1" />
        <div className="flex items-center gap-3">
          <ViewToggle view={view} onChange={setView} />
          <Button onClick={() => router.push('/products/new')}>+ New Product</Button>
        </div>
      </div>

      {view === 'list' ? (
        <Table
          columns={[
            { key: 'name', header: 'Product', render: (p) => <span className="font-semibold text-[#2C2C2C]">{p.name}</span> },
            { key: 'category', header: 'Category', render: (p) => <span className="text-xs font-medium text-[#A5A58D] uppercase tracking-wider">{p.category || 'General'}</span> },
            { key: 'type', header: 'Type', render: (p) => <Badge variant="warning">{p.type}</Badge>},
            { key: 'sales_price', header: 'Sales Price', render: (p) => <span className="font-mono font-medium text-[#2C2C2C]">{formatCurrency(p.sales_price)}</span> },
            { key: 'cost', header: 'Cost', render: (p) => <span className="font-mono text-[#737373]">{formatCurrency(p.cost)}</span> },
            { key: 'is_active', header: 'Status', render: (p) => <Badge variant={p.is_active ? 'success' : 'warning'}>{p.is_active ? 'Active' : 'Archived'}</Badge> },
          ]}
          data={filtered}
          keyExtractor={(p) => p.id}
          onRowClick={(p) => router.push(`/products/₹{p.id}`)}
        />
      ) : (
        <ProductKanban products={filtered} onUpdateProduct={handleUpdateProduct} />
      )}
    </div>
  );
}