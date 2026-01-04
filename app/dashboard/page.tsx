'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Eye, Trash2, Edit } from 'lucide-react';
import toast from 'react-hot-toast';

interface Product {
  _id: string;
  title: string;
  price: number;
  images: string[];
  status: string;
  views: number;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    fetchProducts();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (!res.ok) {
        router.push('/login');
        toast.error('Please login to access dashboard');
      } else {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (error) {
      router.push('/login');
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products?limit=100');
      const data = await res.json();
      if (data.success) {
        // Filter products by current user
        const userRes = await fetch('/api/auth/me');
        if (userRes.ok) {
          const userData = await userRes.json();
          const myProducts = data.products.filter(
            (p: any) => p.seller._id === userData.user.id || p.seller === userData.user.id
          );
          setProducts(myProducts);
        }
      }
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Product deleted');
        fetchProducts();
      } else {
        toast.error(data.error || 'Failed to delete product');
      }
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Dashboard</h1>
          <p className="text-gray-600">Manage your listings and account</p>
        </div>
        <Link
          href="/products/new"
          className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
        >
          <Plus className="w-5 h-5" />
          <span>New Listing</span>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Account Information</h2>
        <div className="space-y-2">
          <p><span className="font-medium">Name:</span> {user?.name}</p>
          <p><span className="font-medium">Email:</span> {user?.email}</p>
          {user?.phone && <p><span className="font-medium">Phone:</span> {user.phone}</p>}
          {user?.location && <p><span className="font-medium">Location:</span> {user.location}</p>}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">My Listings ({products.length})</h2>
        {products.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-500 mb-4">You haven't listed any products yet</p>
            <Link
              href="/products/new"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              <Plus className="w-5 h-5" />
              <span>Create Your First Listing</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <Link href={`/products/${product._id}`}>
                  <div className="aspect-video relative bg-gray-100">
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={product.images[0]}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                </Link>
                <div className="p-4">
                  <Link href={`/products/${product._id}`}>
                    <h3 className="font-semibold text-gray-900 mb-1 hover:text-primary-600 transition">
                      {product.title}
                    </h3>
                  </Link>
                  <p className="text-xl font-bold text-primary-600 mb-2">
                    ${product.price.toLocaleString()}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{product.views || 0}</span>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        product.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : product.status === 'sold'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {product.status}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

