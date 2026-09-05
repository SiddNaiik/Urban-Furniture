import ProductForm from '@/components/products/ProductForm';

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">
        {id === 'new' ? 'New Product' : 'Edit Product'}
      </h1>
      <ProductForm id={id} />
    </div>
  );
}
