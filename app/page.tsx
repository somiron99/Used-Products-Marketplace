import ProductList from '@/components/ProductList';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Find Great Deals Near You
        </h1>
        <p className="text-gray-600">
          Buy and sell used products in your local community
        </p>
      </div>

      <ProductList />
    </div>
  );
}

