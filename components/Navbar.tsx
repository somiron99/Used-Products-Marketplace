'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Plus, MessageCircle, User, LogOut, Menu, X, MapPin, Filter, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { bangladeshDistricts } from '@/lib/bangladesh-districts';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locationFilterOpen, setLocationFilterOpen] = useState(false);
  const [otherFiltersOpen, setOtherFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [locationSearchQuery, setLocationSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    fetchUser();
    // Get initial values from URL
    setSearchQuery(searchParams.get('search') || '');
    setSelectedLocation(searchParams.get('location') || '');
    setSelectedCategory(searchParams.get('category') || '');

    // Handle scroll
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [searchParams]);

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

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      toast.success('Logged out successfully');
      router.push('/');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    if (selectedLocation) params.set('location', selectedLocation);
    if (selectedCategory) params.set('category', selectedCategory);
    router.push(`/?${params.toString()}`);
  };

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    setLocationFilterOpen(false);
    setLocationSearchQuery('');
    const params = new URLSearchParams(searchParams.toString());
    if (location) {
      params.set('location', location);
    } else {
      params.delete('location');
    }
    router.push(`/?${params.toString()}`);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setOtherFiltersOpen(false);
    const params = new URLSearchParams(searchParams.toString());
    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    router.push(`/?${params.toString()}`);
  };

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

  return (
    <nav className={`bg-white shadow-md border-b border-gray-200 sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'shadow-lg' : ''}`}>
      {/* Topbar */}
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Main Menu */}
            <div className="flex items-center space-x-6">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-primary-600">Marketplace</span>
              </Link>
              <div className="hidden md:flex items-center space-x-5">
                <Link href="/" className="text-gray-700 hover:text-primary-600 transition text-sm font-medium">
                  Home
                </Link>
                <Link href="/products" className="text-gray-700 hover:text-primary-600 transition text-sm font-medium">
                  Browse
                </Link>
                {user && (
                  <Link href="/products/new" className="text-gray-700 hover:text-primary-600 transition text-sm font-medium">
                    Sell
                  </Link>
                )}
              </div>
            </div>

            {/* Login and Sign Up */}
            <div className="flex items-center space-x-3">
              {user ? (
                <>
                  <Link
                    href="/products/new"
                    className="hidden md:flex items-center space-x-1.5 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-sm font-medium shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Sell</span>
                  </Link>
                  <Link
                    href="/chat"
                    className="relative p-2 text-gray-600 hover:text-primary-600 transition"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </Link>
                  <div className="relative group">
                    <button className="flex items-center space-x-1.5 p-2 text-gray-600 hover:text-primary-600 transition">
                      <User className="w-5 h-5" />
                      <span className="hidden lg:block text-sm font-medium">{user.name}</span>
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-gray-700 hover:text-primary-600 transition text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-sm font-medium shadow-sm"
                  >
                    Sign Up
                  </Link>
                </>
              )}
              <button
                className="md:hidden p-2 text-gray-600"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Header Bottom - Search and Filters */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 py-3.5">
            {/* Search Bar - Enhanced Design */}
            <form onSubmit={handleSearch} className={`transition-all duration-300 ${isScrolled ? 'w-64' : 'w-80'}`}>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Search className={`text-gray-400 transition-colors group-focus-within:text-primary-600 ${isScrolled ? 'w-4 h-4' : 'w-5 h-5'}`} />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, brands, and more..."
                  className={`w-full pl-12 pr-14 py-3.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white transition-all duration-200 placeholder:text-gray-400 ${
                    isScrolled ? 'text-sm py-2.5' : 'text-base'
                  }`}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      const params = new URLSearchParams(searchParams.toString());
                      params.delete('search');
                      router.push(`/?${params.toString()}`);
                    }}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>

            {/* Divider */}
            <div className="hidden lg:block w-px h-8 bg-gray-200"></div>

            {/* Filter Buttons Container */}
            <div className="flex items-center gap-2.5">
              {/* Location Filter */}
              <div className="relative">
                <button
                  onClick={() => {
                    setLocationFilterOpen(!locationFilterOpen);
                    setOtherFiltersOpen(false);
                  }}
                  className={`group flex items-center space-x-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-white hover:border-primary-500 hover:shadow-sm transition-all duration-200 font-medium ${
                    selectedLocation ? 'bg-primary-50 border-primary-500 text-primary-700' : 'text-gray-700'
                  } ${isScrolled ? 'text-sm px-3 py-2.5' : 'text-sm'}`}
                >
                  <MapPin className={`transition-colors ${selectedLocation ? 'text-primary-600' : 'text-gray-500 group-hover:text-primary-600'} ${isScrolled ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />
                  <span className="hidden md:inline whitespace-nowrap">
                    {selectedLocation || 'Location'}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-all duration-200 ${locationFilterOpen ? 'rotate-180 text-primary-600' : 'text-gray-400'}`} />
                </button>
                {locationFilterOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-96 overflow-hidden z-50">
                    <div className="p-4 border-b border-gray-100 bg-gray-50">
                      <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Select District</div>
                      <input
                        type="text"
                        placeholder="Search district..."
                        value={locationSearchQuery}
                        onChange={(e) => setLocationSearchQuery(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div className="overflow-y-auto max-h-64">
                      <button
                        onClick={() => handleLocationSelect('')}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                          !selectedLocation ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-700'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>All Locations</span>
                        </div>
                      </button>
                      {bangladeshDistricts
                        .filter((district) =>
                          district.toLowerCase().includes(locationSearchQuery.toLowerCase())
                        )
                        .map((district) => (
                          <button
                            key={district}
                            onClick={() => handleLocationSelect(district)}
                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 ${
                              selectedLocation === district ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-700'
                            }`}
                          >
                            {district}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Category Filter */}
              <div className="relative">
                <button
                  onClick={() => {
                    setOtherFiltersOpen(!otherFiltersOpen);
                    setLocationFilterOpen(false);
                  }}
                  className={`group flex items-center space-x-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-white hover:border-primary-500 hover:shadow-sm transition-all duration-200 font-medium ${
                    selectedCategory && selectedCategory !== 'All' ? 'bg-primary-50 border-primary-500 text-primary-700' : 'text-gray-700'
                  } ${isScrolled ? 'text-sm px-3 py-2.5' : 'text-sm'}`}
                >
                  <Filter className={`transition-colors ${selectedCategory && selectedCategory !== 'All' ? 'text-primary-600' : 'text-gray-500 group-hover:text-primary-600'} ${isScrolled ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />
                  <span className="hidden md:inline whitespace-nowrap">
                    {selectedCategory && selectedCategory !== 'All' ? selectedCategory : 'Category'}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-all duration-200 ${otherFiltersOpen ? 'rotate-180 text-primary-600' : 'text-gray-400'}`} />
                </button>
                {otherFiltersOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                    <div className="p-3 border-b border-gray-100 bg-gray-50">
                      <div className="text-xs font-semibold text-gray-500 uppercase">Category</div>
                    </div>
                    <div className="py-1">
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => handleCategorySelect(category === 'All' ? '' : category)}
                          className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                            (selectedCategory === category || (!selectedCategory && category === 'All'))
                              ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-700'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {user ? (
              <>
                <Link
                  href="/products/new"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                >
                  Sell Product
                </Link>
                <Link
                  href="/chat"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                >
                  Messages
                </Link>
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block px-4 py-2 bg-primary-600 text-white rounded-lg text-center"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Click outside to close dropdowns */}
      {(locationFilterOpen || otherFiltersOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setLocationFilterOpen(false);
            setOtherFiltersOpen(false);
          }}
        />
      )}
    </nav>
  );
}
