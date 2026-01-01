import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import api from '../services/api';

export default function Collections() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await api.get('/collections');
        setCollections(response.data);
      } catch (error) {
        console.error("Error fetching collections:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  const getImageUrl = (imageName) => {
      if (!imageName) return '/img/pp-1.webp';
      if (imageName.startsWith('http') || imageName.startsWith('data:')) {
          return imageName;
      }
      return `/img/${imageName}`;
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      
      <Hero 
        title="THE BRIDAL" 
        highlight="COLLECTIONS" 
        subtitle="Discover our exquisite collection of wedding dresses, each designed to make your special day unforgettable."
        extraClass="py-32"
      />

      <section className="grow py-5 md:py-5">
        <div className="relative z-10 m-auto max-w-7xl justify-center py-5">
          {/* Collections Grid */}
          {loading ? (
              <div className="text-center py-12">Loading...</div>
          ) : (
          <div className="grid grid-cols-1 gap-8 px-4 sm:grid-cols-2 lg:grid-cols-3">
            {collections.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <h3 className="font-Tinos text-2xl text-slate-700 mb-4">No collections found</h3>
                </div>
            ) : (
                collections.map((collection) => (
                    <div key={collection.id} className="group cursor-pointer overflow-hidden rounded-lg bg-white shadow-[0_8px_30px_rgba(210,199,229,0.12)] transition-all duration-300 hover:shadow-[0_12px_40px_rgba(210,199,229,0.2)]">
                    <div className="aspect-3/4 overflow-hidden bg-linear-to-br from-amber-900 to-amber-700">
                        <img src={getImageUrl(collection.image)} alt={collection.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <div className="p-6 text-center">
                        <h3 className="font-Tinos text-2xl text-slate-900">{collection.name}</h3>
                        <p className="mt-2 text-sm text-slate-600">{collection.description}</p>
                    </div>
                    </div>
                ))
            )}
          </div>
          )}

          {/* Call to Action */}
          <div className="mt-10 text-center px-4">
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
        </div>
      </section>

      <Footer />
    </div>
  );
}
