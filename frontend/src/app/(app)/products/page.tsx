import ProductList from '@/components/products/ProductList';

export default function ProductsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Products</h1>
      <ProductList />
    </div>
  );
}
