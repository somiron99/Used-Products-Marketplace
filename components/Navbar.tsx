'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Image from 'next/image';
import { Search, Plus, MessageCircle, User, LogOut, Menu, X, MapPin, Filter, ChevronDown, LayoutDashboard, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import { bangladeshDistricts } from '@/lib/bangladesh-districts';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locationFilterOpen, setLocationFilterOpen] = useState(false);
  const [categoryFilterOpen, setCategoryFilterOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [locationSearchQuery, setLocationSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locationDropdownRef = useRef<HTMLDivElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchUser();
    setSearchQuery(searchParams.get('search') || '');
    setSelectedLocation(searchParams.get('location') || '');
    setSelectedCategory(searchParams.get('category') || '');

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [searchParams]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target as Node)) {
        setLocationFilterOpen(false);
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setCategoryFilterOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      setUserMenuOpen(false);
      toast.success('Logged out successfully');
      router.push('/');
      router.refresh();
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
    setCategoryFilterOpen(false);
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

  const isActiveRoute = (path: string) => pathname === path;

  return (
    <>
      <nav className={`bg-white sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'shadow-lg border-b border-gray-200' : 'shadow-md'
      }`}>
        {/* Main Navigation Bar */}
        <div className="border-b border-gray-100">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="flex items-center justify-between h-16">
              {/* Logo and Main Navigation */}
              <div className="flex items-center space-x-8">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2 group">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary-600 rounded-lg blur-sm opacity-75 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative bg-gradient-to-br from-primary-600 to-primary-700 p-2 rounded-lg">
                      <ShoppingBag className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                    Marketplace
                  </span>
                </Link>

                {/* Desktop Navigation Links */}
                <div className="hidden lg:flex items-center space-x-1">
                  <Link
                    href="/"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActiveRoute('/')
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
                    }`}
                  >
                    Home
                  </Link>
                  <Link
                    href="/products"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActiveRoute('/products')
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
                    }`}
                  >
                    Browse
                  </Link>
                </div>
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center space-x-3">
                {user ? (
                  <>
                    {/* Sell Button */}
                    <Link
                      href="/products/new"
                      className="hidden md:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-sm hover:shadow-md font-medium text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Sell Item</span>
                    </Link>

                    {/* Messages */}
                    <Link
                      href="/chat"
                      className="relative p-2.5 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
                    >
                      <MessageCircle className="w-5 h-5" />
                    </Link>

                    {/* User Menu */}
                    <div className="relative" ref={userMenuRef}>
                      <button
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        className="flex items-center space-x-2 p-1.5 hover:bg-gray-50 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                      >
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center ring-2 ring-white shadow-sm">
                          {user.avatar ? (
                            <Image
                              src={user.avatar}
                              alt={user.name}
                              width={36}
                              height={36}
                              className="rounded-full"
                            />
                          ) : (
                            <User className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <span className="hidden xl:block text-sm font-medium text-gray-700 max-w-[120px] truncate">
                          {user.name}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {/* User Dropdown Menu */}
                      {userMenuOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                          <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                          </div>
                          <div className="py-1">
                            <Link
                              href="/dashboard"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <LayoutDashboard className="w-4 h-4" />
                              <span>Dashboard</span>
                            </Link>
                            <Link
                              href="/products/new"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors md:hidden"
                            >
                              <Plus className="w-4 h-4" />
                              <span>Sell Item</span>
                            </Link>
                            <Link
                              href="/chat"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors md:hidden"
                            >
                              <MessageCircle className="w-4 h-4" />
                              <span>Messages</span>
                            </Link>
                          </div>
                          <div className="border-t border-gray-100 pt-1">
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <LogOut className="w-4 h-4" />
                              <span>Logout</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="px-4 py-2 text-gray-700 hover:text-primary-600 font-medium text-sm transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-sm hover:shadow-md font-medium text-sm"
                    >
                      Sign Up
                    </Link>
                  </>
                )}

                {/* Mobile Menu Button */}
                <button
                  className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
          <div className="container mx-auto px-4 lg:px-6 py-4">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <Search className="w-5 h-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products, brands, and more..."
                    className="w-full pl-12 pr-12 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 placeholder:text-gray-400 text-sm lg:text-base shadow-sm hover:shadow-md"
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
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </form>

              {/* Filter Buttons */}
              <div className="flex items-center gap-3">
                {/* Location Filter */}
                <div className="relative" ref={locationDropdownRef}>
                  <button
                    onClick={() => {
                      setLocationFilterOpen(!locationFilterOpen);
                      setCategoryFilterOpen(false);
                    }}
                    className={`flex items-center space-x-2 px-4 py-3 bg-white border-2 rounded-xl transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md ${
                      selectedLocation
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 text-gray-700 hover:border-primary-300'
                    }`}
                  >
                    <MapPin className={`w-4 h-4 ${selectedLocation ? 'text-primary-600' : 'text-gray-500'}`} />
                    <span className="hidden sm:inline whitespace-nowrap max-w-[120px] truncate">
                      {selectedLocation || 'Location'}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${locationFilterOpen ? 'rotate-180' : ''} ${selectedLocation ? 'text-primary-600' : 'text-gray-400'}`} />
                  </button>

                  {locationFilterOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-96 overflow-hidden z-50">
                      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Select District</div>
                        <input
                          type="text"
                          placeholder="Search district..."
                          value={locationSearchQuery}
                          onChange={(e) => setLocationSearchQuery(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <div className="overflow-y-auto max-h-64 custom-scrollbar">
                        <button
                          onClick={() => handleLocationSelect('')}
                          className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors border-b border-gray-100 ${
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
                              className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 ${
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
                <div className="relative" ref={categoryDropdownRef}>
                  <button
                    onClick={() => {
                      setCategoryFilterOpen(!categoryFilterOpen);
                      setLocationFilterOpen(false);
                    }}
                    className={`flex items-center space-x-2 px-4 py-3 bg-white border-2 rounded-xl transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md ${
                      selectedCategory && selectedCategory !== 'All'
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 text-gray-700 hover:border-primary-300'
                    }`}
                  >
                    <Filter className={`w-4 h-4 ${selectedCategory && selectedCategory !== 'All' ? 'text-primary-600' : 'text-gray-500'}`} />
                    <span className="hidden sm:inline whitespace-nowrap max-w-[120px] truncate">
                      {selectedCategory && selectedCategory !== 'All' ? selectedCategory : 'Category'}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${categoryFilterOpen ? 'rotate-180' : ''} ${selectedCategory && selectedCategory !== 'All' ? 'text-primary-600' : 'text-gray-400'}`} />
                  </button>

                  {categoryFilterOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                      <div className="p-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                        <div className="text-xs font-semibold text-gray-500 uppercase">Category</div>
                      </div>
                      <div className="py-1 max-h-64 overflow-y-auto custom-scrollbar">
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
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="container mx-auto px-4 py-4 space-y-1">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActiveRoute('/') ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="font-medium">Home</span>
              </Link>
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActiveRoute('/products') ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="font-medium">Browse</span>
              </Link>
              {user ? (
                <>
                  <div className="border-t border-gray-200 my-2"></div>
                  <Link
                    href="/products/new"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="font-medium">Sell Item</span>
                  </Link>
                  <Link
                    href="/chat"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span className="font-medium">Messages</span>
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span className="font-medium">Dashboard</span>
                  </Link>
                  <div className="border-t border-gray-200 my-2"></div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <div className="border-t border-gray-200 my-2"></div>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-200 font-medium shadow-sm"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
