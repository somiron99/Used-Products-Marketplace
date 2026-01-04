'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Upload } from 'lucide-react';

interface ProductForm {
  title: string;
  description: string;
  price: number;
  category: string;
  condition: 'new' | 'like-new' | 'excellent' | 'good' | 'fair';
  location: string;
  images: FileList;
}

const categories = [
  'Electronics',
  'Furniture',
  'Clothing',
  'Vehicles',
  'Books',
  'Sports',
  'Toys',
  'Home & Garden',
  'Other',
];

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const { register, handleSubmit, formState: { errors }, watch } = useForm<ProductForm>();

  const images = watch('images');

  useEffect(() => {
    if (images && images.length > 0) {
      const previews: string[] = [];
      Array.from(images).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          previews.push(reader.result as string);
          if (previews.length === images.length) {
            setImagePreviews(previews);
          }
        };
        reader.readAsDataURL(file);
      });
    } else {
      setImagePreviews([]);
    }
  }, [images]);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (!res.ok) {
        router.push('/login');
        toast.error('Please login to create a product');
      }
    } catch (error) {
      router.push('/login');
    }
  };

  const onSubmit = async (data: ProductForm) => {
    setLoading(true);
    try {
      // For now, we'll use placeholder images
      // In production, you'd upload to Cloudinary or similar
      const imageUrls = imagePreviews.length > 0 
        ? imagePreviews 
        : ['https://via.placeholder.com/400'];

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          price: data.price,
          category: data.category,
          condition: data.condition,
          location: data.location,
          images: imageUrls,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success('Product created successfully!');
        router.push(`/products/${result.product._id}`);
      } else {
        toast.error(result.error || 'Failed to create product');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">List a New Product</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Product Title *
          </label>
          <input
            {...register('title', {
              required: 'Title is required',
              maxLength: { value: 100, message: 'Title must be less than 100 characters' },
            })}
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="e.g., iPhone 13 Pro Max 256GB"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            {...register('description', {
              required: 'Description is required',
              maxLength: { value: 2000, message: 'Description must be less than 2000 characters' },
            })}
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Describe your product in detail..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              Price ($) *
            </label>
            <input
              {...register('price', {
                required: 'Price is required',
                min: { value: 0, message: 'Price must be positive' },
              })}
              type="number"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="0.00"
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              {...register('category', { required: 'Category is required' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-2">
              Condition *
            </label>
            <select
              {...register('condition', { required: 'Condition is required' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select condition</option>
              <option value="new">New</option>
              <option value="like-new">Like New</option>
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
            </select>
            {errors.condition && (
              <p className="mt-1 text-sm text-red-600">{errors.condition.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <input
              {...register('location', { required: 'Location is required' })}
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="City, State"
            />
            {errors.location && (
              <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-2">
            Product Images
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <input
              {...register('images')}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              id="images"
            />
            <label
              htmlFor="images"
              className="cursor-pointer flex flex-col items-center justify-center"
            >
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">
                Click to upload images or drag and drop
              </span>
            </label>
          </div>
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-4 gap-4 mt-4">
              {imagePreviews.map((preview, idx) => (
                <div key={idx} className="aspect-square relative rounded-lg overflow-hidden">
                  <img src={preview} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50 transition"
          >
            {loading ? 'Creating...' : 'Create Listing'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

