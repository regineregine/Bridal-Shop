import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Shop() {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(location.state?.selectedCategory || 'all');
  const { isLoggedIn, user } = useAuth();
  const userName = user?.name || "Guest";
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
        console.error("Error fetching products:", error);
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
      rootMargin: '0px 0px -100px 0px'
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
      setFilteredProducts(products.filter(product => product.category === selectedCategory));
    }
    setCurrentPage(1); // Reset to first page when filter changes
  }, [selectedCategory, products]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'dresses', label: 'Dresses' },
    { id: 'accessories', label: 'Accessories' },
    { id: 'veils', label: 'Veils' },
    { id: 'robes', label: 'Robes' },
  ];

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Helper to get image
  const getImageUrl = (imageName) => {
      if (!imageName) return '/img/p-1.webp';
      if (imageName.startsWith('http') || imageName.startsWith('data:')) {
          return imageName;
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
        extraClass="py-32"
      />

      <div className="mx-auto max-w-7xl py-10 px-4 flex-1 w-full">
        <div className="flex flex-col gap-8">
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
            <h2 className="font-Tinos text-center text-2xl leading-none tracking-widest text-pink-950 uppercase mb-8 md:tracking-[0.6em] lg:tracking-[0.8em]">
              Categories
            </h2>
            <div className="flex justify-center items-center gap-3 flex-wrap max-w-2xl mx-auto">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-300 border-2 ${
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
              <p className="text-slate-900 font-medium">
                {filteredProducts.length} Product{filteredProducts.length !== 1 ? 's' : ''} Available
                {selectedCategory !== 'all' && ` in ${categories.find(c => c.id === selectedCategory)?.label}`}
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
                  <h3 className="font-Tinos text-2xl text-slate-700 mb-4">No products found</h3>
                  <p className="text-slate-700">
                    {selectedCategory === 'all' 
                      ? 'Check back later for new arrivals!' 
                      : `No products available in ${categories.find(c => c.id === selectedCategory)?.label} category.`}
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
                  <div key={product.id} className="group relative overflow-hidden rounded-lg border border-candy-lavender bg-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl">
                    <div className="aspect-3/4 overflow-hidden bg-gray-200">
                      <img 
                        src={getImageUrl(product.image)} 
                        alt={product.name} 
                        className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-4 text-center">
                      <h3 className="text-lg font-medium text-slate-900">
                        <Link 
                          to={`/product/${product.id}`}
                          state={{ fromCategory: selectedCategory }}
                        >
                          <span aria-hidden="true" className="absolute inset-0" />
                          {product.name}
                        </Link>
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">₱{Number(product.price).toLocaleString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            )}

            {/* Warning Message for Logged Out Users */}
            {!isLoggedIn && (
              <div className="mt-8 mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-center">
                <p className="text-yellow-800">You must create an account and upload your address before placing an order.</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-12 space-x-2">
                <button 
                  onClick={() => paginate(currentPage - 1)} 
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md border ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-pink-500 hover:bg-pink-50 border-pink-200'}`}
                >
                  Previous
                </button>
                
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => paginate(index + 1)}
                    className={`px-3 py-1 rounded-md border ${currentPage === index + 1 ? 'bg-pink-500 text-white border-pink-500' : 'bg-white text-pink-500 hover:bg-pink-50 border-pink-200'}`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button 
                  onClick={() => paginate(currentPage + 1)} 
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-md border ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-pink-500 hover:bg-pink-50 border-pink-200'}`}
                >
                  Next
                </button>
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
        <h2 className="font-Tinos text-3xl font-semibold text-slate-900 mb-4">Ready to Find Your Perfect Dress?</h2>
        <p className="text-slate-700 mb-8 max-w-2xl mx-auto">
          Book an appointment with us today and let our experts help you find the dress of your dreams.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/reservation" className="inline-block rounded-full bg-pink-500 px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-pink-600">
            Book Appointment
          </a>
          <a href="/contact" className="inline-block rounded-full border-2 border-slate-900 px-8 py-3 text-base font-semibold text-slate-900 transition-colors hover:bg-slate-900 hover:text-white">
            Contact Us
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}
