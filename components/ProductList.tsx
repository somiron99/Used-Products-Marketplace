'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Eye } from 'lucide-react';

interface Product {
  _id: string;
  title: string;
  price: number;
  images: string[];
  location: string;
  condition: string;
  views: number;
  seller: {
    name: string;
    avatar?: string;
  };
  createdAt: string;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    fetchProducts();
  }, [searchParams, page]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', '12');

      const category = searchParams.get('category');
      const search = searchParams.get('search');
      const location = searchParams.get('location');

      if (category) params.set('category', category);
      if (search) params.set('search', search);
      if (location) params.set('location', location);

      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();

      if (data.success) {
        if (page === 1) {
          setProducts(data.products);
        } else {
          setProducts((prev) => [...prev, ...data.products]);
        }
        setHasMore(data.pagination.page < data.pagination.pages);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-t-lg" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No products found</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link
            key={product._id}
            href={`/products/${product._id}`}
            className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden group"
          >
            <div className="aspect-square relative bg-gray-100 overflow-hidden">
              {product.images && product.images.length > 0 ? (
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
              <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
                <Eye className="w-3 h-3" />
                <span>{product.views || 0}</span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-primary-600 transition">
                {product.title}
              </h3>
              <p className="text-2xl font-bold text-primary-600 mb-2">
                ${product.price.toLocaleString()}
              </p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{product.location}</span>
                </div>
                <span className="capitalize text-xs bg-gray-100 px-2 py-1 rounded">
                  {product.condition}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={loading}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </>
  );
}

