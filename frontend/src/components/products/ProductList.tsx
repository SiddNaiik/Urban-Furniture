'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Table from '@/components/ui/Table';
import SearchBar from '@/components/ui/SearchBar';
import ViewToggle from '@/components/ui/ViewToggle';
import Button from '@/components/ui/Button';
import ProductKanban from './ProductKanban';
import { useFetch } from '@/hooks/useFetch';
import { getProducts } from '@/lib/api';
import type { Product } from '@/types/product';

export default function ProductList() {
  const router = useRouter();
  const [view, setView] = useState<'list' | 'kanban'>('list');
  const [search, setSearch] = useState('');
  const { data: products = [], loading } = useFetch<Product[]>(getProducts);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'sku', header: 'SKU' },
    { key: 'category', header: 'Category' },
    { key: 'price', header: 'Price' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <SearchBar value={search} onChange={setSearch} className="flex-1 min-w-48" />
        <ViewToggle view={view} onChange={setView} />
        <Button onClick={() => router.push('/products/new')}>+ New Product</Button>
      </div>
      {loading ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : view === 'list' ? (
        <Table columns={columns} data={filtered} keyExtractor={(p) => p.id} onRowClick={(p) => router.push(`/products/${p.id}`)} />
      ) : (
        <ProductKanban products={filtered} />
      )}
    </div>
  );
}
