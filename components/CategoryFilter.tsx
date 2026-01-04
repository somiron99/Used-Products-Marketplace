'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const categories = [
  'All',
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

export default function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get('category') || 'All';

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category === 'All') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => handleCategoryChange(category)}
          className={`px-4 py-2 rounded-lg transition ${
            selectedCategory === category
              ? 'bg-primary-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

