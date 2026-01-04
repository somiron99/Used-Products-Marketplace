'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Eye, MessageCircle, User, Trash2, ArrowLeft, Calendar, Tag, Shield, Phone, Mail, Share2, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  location: string;
  condition: string;
  category: string;
  views: number;
  seller: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    location?: string;
  };
  createdAt: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchProduct();
    fetchUser();
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${params.id}`);
      const data = await res.json();
      if (data.success) {
        setProduct(data.product);
      } else {
        toast.error('Product not found');
        router.push('/');
      }
    } catch (error) {
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (error) {
      // User not logged in
    }
  };

  const handleContactSeller = async () => {
    if (!user) {
      toast.error('Please login to contact seller');
      router.push('/login');
      return;
    }

    if (!product) return;

    if (user.id === product.seller._id) {
      toast.error('You cannot contact yourself');
      return;
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product._id,
          sellerId: product.seller._id,
        }),
      });

      const data = await res.json();
      if (data.success) {
        router.push(`/chat/${data.chat._id}`);
      } else {
        toast.error(data.error || 'Failed to start chat');
      }
    } catch (error) {
      toast.error('Failed to start chat');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`/api/products/${params.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Product deleted');
        router.push('/dashboard');
      } else {
        toast.error(data.error || 'Failed to delete product');
      }
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.title,
        text: product?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-32 mb-6" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded-xl" />
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4" />
                <div className="h-12 bg-gray-200 rounded w-1/2" />
                <div className="h-32 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const isOwner = user && user.id === product.seller._id;
  const conditionColors: { [key: string]: string } = {
    'new': 'bg-green-100 text-green-800 border-green-200',
    'like-new': 'bg-blue-100 text-blue-800 border-blue-200',
    'excellent': 'bg-purple-100 text-purple-800 border-purple-200',
    'good': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'fair': 'bg-orange-100 text-orange-800 border-orange-200',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to listings</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200 group">
              {product.images && product.images.length > 0 ? (
                <Image
                  src={product.images[selectedImage]}
                  alt={product.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                  <div className="text-center">
                    <Image
                      src="/placeholder-image.png"
                      alt="No image"
                      width={200}
                      height={200}
                      className="opacity-20"
                    />
                    <p className="mt-4">No Image Available</p>
                  </div>
                </div>
              )}
              {isOwner && (
                <div className="absolute top-4 right-4">
                  <button
                    onClick={handleDelete}
                    className="p-2 bg-white/90 backdrop-blur-sm text-red-600 hover:bg-red-50 rounded-lg transition shadow-sm"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
            
            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square relative rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === idx 
                        ? 'border-primary-600 ring-2 ring-primary-200 scale-105' 
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    <Image 
                      src={img} 
                      alt={`${product.title} ${idx + 1}`} 
                      fill 
                      className="object-cover" 
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">
                    {product.title}
                  </h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Posted {format(new Date(product.createdAt), 'MMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{product.views || 0} views</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleShare}
                  className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              {/* Price */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <p className="text-5xl font-bold text-primary-600 mb-2">
                  ৳{product.price.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">Price is negotiable</p>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-white rounded-lg">
                    <MapPin className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="font-semibold text-gray-900">{product.location}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-white rounded-lg">
                    <Tag className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Category</p>
                    <p className="font-semibold text-gray-900">{product.category}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Condition Badge */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Shield className="w-6 h-6 text-primary-600" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Condition</p>
                    <span className={`inline-flex items-center px-4 py-2 rounded-lg border font-medium capitalize ${
                      conditionColors[product.condition] || 'bg-gray-100 text-gray-800 border-gray-200'
                    }`}>
                      {product.condition.replace('-', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <span>Description</span>
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {product.description}
              </p>
            </div>

            {/* Seller Information */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Seller Information</h2>
              <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-200">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center ring-4 ring-white shadow-lg">
                    {product.seller.avatar ? (
                      <Image
                        src={product.seller.avatar}
                        alt={product.seller.name}
                        width={64}
                        height={64}
                        className="rounded-full"
                      />
                    ) : (
                      <User className="w-8 h-8 text-primary-600" />
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-lg text-gray-900">{product.seller.name}</p>
                  {product.seller.location && (
                    <div className="flex items-center space-x-1 text-gray-600 mt-1">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{product.seller.location}</span>
                    </div>
                  )}
                  <p className="text-sm text-gray-500 mt-1">Active seller</p>
                </div>
              </div>

              {!isOwner && (
                <div className="space-y-3">
                  <button
                    onClick={handleContactSeller}
                    className="w-full flex items-center justify-center space-x-2 bg-primary-600 text-white py-4 rounded-xl hover:bg-primary-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Contact Seller</span>
                  </button>
                  {product.seller.phone && (
                    <a
                      href={`tel:${product.seller.phone}`}
                      className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition font-medium"
                    >
                      <Phone className="w-5 h-5" />
                      <span>Call Seller</span>
                    </a>
                  )}
                </div>
              )}

              {isOwner && (
                <div className="p-4 bg-primary-50 rounded-xl border border-primary-200">
                  <p className="text-sm text-primary-800 font-medium">
                    This is your listing. You can edit or delete it from your dashboard.
                  </p>
                </div>
              )}
            </div>

            {/* Safety Tips */}
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Safety Tips</span>
              </h3>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>Meet in a public place</li>
                <li>Inspect the item before buying</li>
                <li>Never send money in advance</li>
                <li>Trust your instincts</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
