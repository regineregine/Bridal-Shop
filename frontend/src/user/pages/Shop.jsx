import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

export default function Shop() {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(
    location.state?.selectedCategory || 'all',
  );
  const { isLoggedIn } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [visibleSections, setVisibleSections] = useState(new Set());

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Scroll animation observer
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleSections((prev) => new Set([...prev, entry.target.id]));
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll('[data-animate]');
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  // Filter products by category
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter((product) => product.category === selectedCategory),
      );
    }
    setCurrentPage(1); // Reset to first page when filter changes
  }, [selectedCategory, products]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'dresses', label: 'Dresses' },
    { id: 'accessories', label: 'Accessories' },
    { id: 'veils', label: 'Veils' },
    { id: 'robes', label: 'Robes' },
  ];

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top of products section on page change
    document.getElementById('products-section')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  // Generate page numbers for pagination with smart truncation
  const getPageNumbers = () => {
    const pages = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Smart pagination: always show first, last, current, and nearby pages
      if (currentPage <= 3) {
        // Near the start
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('ellipsis-end');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pages.push(1);
        pages.push('ellipsis-start');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        // In the middle
        pages.push(1);
        pages.push('ellipsis-start');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('ellipsis-end');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  // Helper to get image
  const getImageUrl = (imageName) => {
    if (!imageName) return '/img/p-1.webp';
    if (imageName.startsWith('http') || imageName.startsWith('data:')) {
      return imageName;
    }
    if (imageName.startsWith('products/')) {
      return `/storage/${imageName}`;
    }
    if (imageName.startsWith('profile-uploads/')) {
      return `/storage/${imageName}`;
    }
    return `/img/${imageName}`;
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />

      <Hero
        title="OUR"
        highlight="PRODUCTS"
        subtitle="Browse our curated collection of wedding attire crafted for elegance, comfort and timeless memories."
        extraClass="py-20 sm:py-24 md:py-28 lg:py-32"
      />

      <div className="mx-auto max-w-7xl py-8 sm:py-10 px-4 sm:px-6 lg:px-8 flex-1 w-full">
        <div className="flex flex-col gap-6 sm:gap-8">
          {/* CATEGORIES SECTION */}
          <div
            id="categories-section"
            data-animate
            className={`w-full transition-all duration-1000 ${
              visibleSections.has('categories-section')
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className="font-Tinos text-center text-xl sm:text-2xl leading-none tracking-widest text-pink-950 uppercase mb-6 sm:mb-8 md:tracking-[0.6em] lg:tracking-[0.8em]">
              Categories
            </h2>
            <div className="flex justify-center items-center gap-2 sm:gap-3 flex-wrap max-w-2xl mx-auto">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-medium text-xs sm:text-sm transition-all duration-300 border-2 active:scale-95 ${
                    selectedCategory === category.id
                      ? 'bg-pink-500 text-white border-pink-500 shadow-md'
                      : 'bg-white text-slate-700 border-slate-300 hover:border-pink-300 hover:bg-pink-50 hover:text-pink-600'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="w-full">
            <div className="text-center">
              <p className="text-slate-900 font-medium text-sm sm:text-base">
                {filteredProducts.length} Product
                {filteredProducts.length !== 1 ? 's' : ''} Available
                {selectedCategory !== 'all' &&
                  ` in ${
                    categories.find((c) => c.id === selectedCategory)?.label
                  }`}
              </p>
            </div>
          </div>

          <div
            id="products-section"
            data-animate
            className={`mx-auto max-w-7xl w-full transition-all duration-1000 ${
              visibleSections.has('products-section')
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            }`}
          >
            {loading ? (
              <div className="text-center py-12">Loading...</div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {currentItems.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <h3 className="font-Tinos text-2xl text-slate-700 mb-4">
                      No products found
                    </h3>
                    <p className="text-slate-700">
                      {selectedCategory === 'all'
                        ? 'Check back later for new arrivals!'
                        : `No products available in ${
                            categories.find((c) => c.id === selectedCategory)
                              ?.label
                          } category.`}
                    </p>
                    {selectedCategory !== 'all' && (
                      <button
                        onClick={() => setSelectedCategory('all')}
                        className="mt-4 px-6 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
                      >
                        View All Products
                      </button>
                    )}
                  </div>
                ) : (
                  currentItems.map((product) => (
                    <div
                      key={product.id}
                      className="group relative overflow-hidden rounded-lg border border-candy-lavender bg-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl"
                    >
                      <div className="aspect-3/4 overflow-hidden bg-gray-200 relative">
                        <img
                          src={getImageUrl(product.image)}
                          alt={product.name}
                          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-110"
                        />
                        {/* Wishlist Heart Button */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleWishlist(product);
                          }}
                          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white transition-colors"
                          aria-label={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill={isInWishlist(product.id) ? 'currentColor' : 'none'}
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className={`w-5 h-5 ${isInWishlist(product.id) ? 'text-red-500' : 'text-slate-600'}`}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="p-4 text-center">
                        <h3 className="text-lg font-medium text-slate-900">
                          <Link
                            to={`/product/${product.id}`}
                            state={{ fromCategory: selectedCategory }}
                          >
                            <span
                              aria-hidden="true"
                              className="absolute inset-0"
                            />
                            {product.name}
                          </Link>
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          ₱{Number(product.price).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Warning Message for Logged Out Users */}
            {!isLoggedIn && (
              <div className="mt-8 mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-center">
                <p className="text-yellow-800">
                  You must create an account and upload your address before
                  placing an order.
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-8 sm:mt-12 gap-1 sm:gap-2 px-4">
                {/* Previous Button */}
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`min-w-11 min-h-11 px-3 sm:px-4 py-2 sm:py-2.5 rounded-md border text-xs sm:text-sm font-medium transition-all active:scale-95 ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                      : 'bg-white text-pink-500 hover:bg-pink-50 border-pink-200 active:bg-pink-100'
                  }`}
                  aria-label="Previous page"
                >
                  <span className="hidden sm:inline">Previous</span>
                  <span className="sm:hidden">‹</span>
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1 sm:gap-2">
                  {getPageNumbers().map((pageNum, index) => {
                    if (typeof pageNum === 'string') {
                      // Ellipsis
                      return (
                        <span
                          key={`${pageNum}-${index}`}
                          className="px-2 text-slate-400 select-none"
                          aria-hidden="true"
                        >
                          ···
                        </span>
                      );
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => paginate(pageNum)}
                        className={`min-w-11 min-h-11 px-3 sm:px-4 py-2 sm:py-2.5 rounded-md border text-xs sm:text-sm font-medium transition-all active:scale-95 ${
                          currentPage === pageNum
                            ? 'bg-pink-500 text-white border-pink-500 shadow-md'
                            : 'bg-white text-pink-500 hover:bg-pink-50 border-pink-200 active:bg-pink-100'
                        }`}
                        aria-label={`Page ${pageNum}`}
                        aria-current={
                          currentPage === pageNum ? 'page' : undefined
                        }
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`min-w-11 min-h-11 px-3 sm:px-4 py-2 sm:py-2.5 rounded-md border text-xs sm:text-sm font-medium transition-all active:scale-95 ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                      : 'bg-white text-pink-500 hover:bg-pink-50 border-pink-200 active:bg-pink-100'
                  }`}
                  aria-label="Next page"
                >
                  <span className="hidden sm:inline">Next</span>
                  <span className="sm:hidden">›</span>
                </button>
              </div>
            )}

            {/* Page Info - Mobile friendly */}
            {totalPages > 1 && (
              <div className="text-center mt-4 text-xs sm:text-sm text-slate-600">
                Page {currentPage} of {totalPages}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div
        id="cta-section"
        data-animate
        className={`mb-16 text-center px-4 transition-all duration-1000 ${
          visibleSections.has('cta-section')
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-10'
        }`}
      >
        <h2 className="font-Tinos text-3xl font-semibold text-slate-900 mb-4">
          Ready to Find Your Perfect Dress?
        </h2>
        <p className="text-slate-700 mb-8 max-w-2xl mx-auto">
          Book an appointment with us today and let our experts help you find
          the dress of your dreams.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/contact"
            className="inline-block rounded-full bg-pink-500 px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-pink-600"
          >
            Contact Us
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}
