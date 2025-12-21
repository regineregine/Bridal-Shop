import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  const handleBack = () => {
    // Check if there's a referrer state or use product category
    const fromCategory = location.state?.fromCategory || product?.category;

    if (fromCategory) {
      navigate('/shop', { state: { selectedCategory: fromCategory } });
    } else {
      navigate('/shop');
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    const requiresSize =
      product.category === 'dresses' || product.category === 'robes';

    if (requiresSize && !selectedSize) {
      toast.error('Please select a size');
      return;
    }

    // Check stock availability
    const requestedQty = requiresSize ? 1 : quantity;
    if (product.stock < requestedQty) {
      toast.error(`Sorry, only ${product.stock} items available in stock.`);
      return;
    }

    try {
      // Update stock in backend
      await api.post(`/products/${product.id}/reduce-stock`, {
        quantity: requestedQty,
      });

      // Update local product state
      setProduct((prev) => ({
        ...prev,
        stock: prev.stock - requestedQty,
      }));

      // For items that don't require size, add multiple quantities
      if (!requiresSize) {
        for (let i = 0; i < quantity; i++) {
          addToCart(product, 'N/A');
        }
      } else {
        addToCart(product, selectedSize);
      }

      toast.success('Product added to cart!');
    } catch (error) {
      console.error('Error updating stock:', error);
      toast.error('Failed to add product to cart. Please try again.');
    }
  };

  const getImageUrl = (imageName) => {
    if (!imageName) return '/img/p-1.webp';
    if (imageName.startsWith('http') || imageName.startsWith('data:')) {
      return imageName;
    }
    return `/img/${imageName}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Product not found
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img
              src={getImageUrl(product.image)}
              alt={product.name}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            {/* Back Button */}
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-slate-600 hover:text-pink-500 transition-colors mb-4 w-fit"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
              <span className="font-medium">Back to Shop</span>
            </button>

            <nav className="text-sm text-slate-500 mb-4">
              <Link to="/" className="hover:text-pink-500">
                Home
              </Link>{' '}
              /{' '}
              <Link to="/shop" className="hover:text-pink-500">
                Shop
              </Link>{' '}
              / <span className="text-slate-900">{product.name}</span>
            </nav>

            <h1 className="font-Tinos text-4xl text-slate-900 mb-4">
              {product.name}
            </h1>
            <p className="text-2xl text-pink-500 font-semibold mb-6">
              ₱{Number(product.price).toLocaleString()}
            </p>

            <p className="text-slate-700 mb-8 leading-relaxed">
              {product.description}
              <br />
              <br />
            </p>

            {/* Size Selector for Dresses and Robes */}
            {(product.category === 'dresses' ||
              product.category === 'robes') && (
              <div className="mb-8">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select Size
                </label>
                <div className="flex gap-3">
                  {['2', '4', '6', '8', '10', '12', '14', '16'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${
                        selectedSize === size
                          ? 'bg-pink-500 text-white border-pink-500'
                          : 'border-gray-300 text-slate-700 hover:border-pink-500'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <div className="mt-2">
                  <Link
                    to="/size-guide"
                    className="text-sm text-pink-500 hover:underline"
                  >
                    View Size Guide
                  </Link>
                </div>
              </div>
            )}

            {/* Quantity Selector for Veils and Accessories */}
            {(product.category === 'veils' ||
              product.category === 'accessories') && (
              <div className="mb-8">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-pink-500 hover:text-pink-500 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 12h-15"
                      />
                    </svg>
                  </button>
                  <span className="text-xl font-semibold text-slate-900 w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-pink-500 hover:text-pink-500 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 px-8 py-4 rounded-full font-semibold transition-colors ${
                  product.stock === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button className="w-14 h-14 flex items-center justify-center rounded-full border border-gray-300 text-slate-400 hover:text-pink-500 hover:border-pink-500 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
              </button>
            </div>

            {/* Additional Info */}
            <div className="mt-12 border-t border-gray-200 pt-8">
              <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
                <div>
                  <span className="font-semibold text-slate-900 block mb-1">
                    Category:
                  </span>
                  {product.category}
                </div>
                <div>
                  <span className="font-semibold text-slate-900 block mb-1">
                    Availability:
                  </span>
                  {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </div>
                <div>
                  <span className="font-semibold text-slate-900 block mb-1">
                    Stock:
                  </span>
                  <span
                    className={
                      product.stock <= 5 && product.stock > 0
                        ? 'text-orange-500'
                        : product.stock === 0
                        ? 'text-red-500'
                        : ''
                    }
                  >
                    {product.stock} {product.stock === 1 ? 'item' : 'items'}{' '}
                    available
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
