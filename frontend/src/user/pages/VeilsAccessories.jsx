import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import api from '../services/api';

export default function VeilsAccessories() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products?category=accessories');
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getImageUrl = (imageName) => {
      if (!imageName) return '/img/p-1.webp';
      if (imageName.startsWith('http') || imageName.startsWith('data:')) {
          return imageName;
      }
      return `/img/${imageName}`;
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      
      <Hero 
        title="VEILS" 
        highlight="& ACCESSORIES" 
        subtitle="Complete your bridal look with our stunning veils and accessories."
        extraClass="py-32"
      />

      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {loading ? (
            <div className="text-center py-12">Loading...</div>
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentItems.length === 0 ? (
              <div className="col-span-full text-center py-12">
                  <h3 className="font-Tinos text-2xl text-slate-700 mb-4">No products found</h3>
              </div>
          ) : (
          currentItems.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`} className="group">
              <div className="aspect-3/4 w-full overflow-hidden rounded-lg bg-gray-200">
                <img 
                  src={getImageUrl(product.image)} 
                  alt={product.name} 
                  className="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity duration-300"
                />
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-lg font-medium text-slate-900">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">{product.category}</p>
                </div>
                <p className="text-lg font-medium text-slate-900">₱{Number(product.price).toLocaleString()}</p>
              </div>
            </Link>
          ))
          )}
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
      </section>

      {/* Call to Action */}
      <div className="mb-16 text-center px-4">
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
