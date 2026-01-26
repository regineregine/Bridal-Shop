import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';
import SizeCustomizationModal from '../components/SizeCustomizationModal';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [savedMeasurements, setSavedMeasurements] = useState(null);

  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [useCustomSize, setUseCustomSize] = useState(false);

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

  useEffect(() => {
    const fetchMeasurements = async () => {
      if (isLoggedIn) {
        try {
          const response = await api.get('/user/measurements');
          setSavedMeasurements(response.data);
        } catch {
          // Measurements might not exist yet, that's okay
          console.log('No saved measurements found');
        }
      }
    };

    fetchMeasurements();
  }, [isLoggedIn]);

  const handleAddToCart = async () => {
    // Check if user is logged in
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }

    const requiresSize =
      product.category === 'dresses' || product.category === 'robes';

    if (requiresSize && !selectedSize && !useCustomSize) {
      toast.error('Please select a size or use custom measurements');
      return;
    }

    // Check stock availability
    const requestedQty = requiresSize ? 1 : quantity;
    if (product.stock < requestedQty) {
      toast.error(`Sorry, only ${product.stock} items available in stock.`);
      return;
    }

    // For items that don't require size, add multiple quantities
    if (!requiresSize) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product, 'N/A');
      }
    } else {
      const sizeToUse = useCustomSize ? 'Custom' : selectedSize;
      addToCart(product, sizeToUse);
    }

    toast.success('Product added to cart!');
  };

  const handleLoginSuccess = async () => {
    setShowAuthModal(false);
    // After successful login, try adding to cart again
    // Wait a bit for auth state to update
    setTimeout(async () => {
      const requiresSize =
        product.category === 'dresses' || product.category === 'robes';

      if (requiresSize && !selectedSize && !useCustomSize) {
        toast.error('Please select a size or use custom measurements');
        return;
      }

      const requestedQty = requiresSize ? 1 : quantity;
      if (product.stock < requestedQty) {
        toast.error(`Sorry, only ${product.stock} items available in stock.`);
        return;
      }

      if (!requiresSize) {
        for (let i = 0; i < quantity; i++) {
          addToCart(product, 'N/A');
        }
      } else {
        const sizeToUse = useCustomSize ? 'Custom' : selectedSize;
        addToCart(product, sizeToUse);
      }

      toast.success('Product added to cart!');
    }, 200);
  };

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

      <div className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12">
          {/* Product Image */}
          <div className="rounded-lg overflow-hidden shadow-lg order-1">
            <img
              src={getImageUrl(product.image)}
              alt={product.name}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center order-2">
            {/* Back Button */}
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-slate-600 hover:text-pink-500 active:text-pink-600 transition-colors mb-4 w-fit"
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

            <nav className="text-xs sm:text-sm text-slate-500 mb-3 sm:mb-4">
              <Link to="/" className="hover:text-pink-500">
                Home
              </Link>{' '}
              /{' '}
              <Link to="/shop" className="hover:text-pink-500">
                Shop
              </Link>{' '}
              / <span className="text-slate-900">{product.name}</span>
            </nav>

            <h1 className="font-Tinos text-2xl sm:text-3xl lg:text-4xl text-slate-900 mb-3 sm:mb-4">
              {product.name}
            </h1>
            <p className="text-xl sm:text-2xl text-pink-500 font-semibold mb-4 sm:mb-6">
              ₱{Number(product.price).toLocaleString()}
            </p>

            <p className="text-slate-700 text-sm sm:text-base mb-6 sm:mb-8 leading-relaxed">
              {product.description}
              <br />
              <br />
            </p>

            {/* Size Selector for Dresses and Robes */}
            {(product.category === 'dresses' ||
              product.category === 'robes') && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Select Size
                  </label>
                  {isLoggedIn && (
                    <button
                      type="button"
                      onClick={() => setShowSizeModal(true)}
                      className="text-sm text-pink-500 hover:text-pink-600 font-medium flex items-center gap-1"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                        />
                      </svg>
                      Customize Size
                    </button>
                  )}
                </div>
                {isLoggedIn && savedMeasurements && (
                  <div className="mb-4 flex items-start gap-3 p-3 bg-pink-50 border border-pink-200 rounded-lg">
                    <input
                      type="checkbox"
                      id="use-custom-size"
                      checked={useCustomSize}
                      onChange={(e) => {
                        setUseCustomSize(e.target.checked);
                        if (!e.target.checked) {
                          setSelectedSize('');
                        }
                      }}
                      className="mt-1 w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                    />
                    <label
                      htmlFor="use-custom-size"
                      className="text-sm text-slate-700 cursor-pointer flex-1"
                    >
                      <span className="font-medium block mb-1">
                        Use my saved custom measurements
                      </span>
                      {savedMeasurements && (
                        <span className="text-xs text-slate-600 block">
                          Bust: {savedMeasurements.bust}", Waist:{' '}
                          {savedMeasurements.waist}", Hips:{' '}
                          {savedMeasurements.hips}"
                        </span>
                      )}
                    </label>
                  </div>
                )}
                {!useCustomSize && (
                  <>
                    <div className="flex gap-3">
                      {['2', '4', '6', '8', '10', '12', '14', '16'].map(
                        (size) => (
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
                        ),
                      )}
                    </div>
                    <div className="mt-2">
                      <Link
                        to="/size-guide"
                        className="text-sm text-pink-500 hover:underline"
                      >
                        View Size Guide
                      </Link>
                    </div>
                  </>
                )}
                {useCustomSize && (
                  <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                    <p className="text-sm text-slate-700">
                      <strong>Custom Size Selected:</strong> Your saved
                      measurements will be used for this order.
                    </p>
                  </div>
                )}
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

            {/* Diet Reminder for Dresses and Robes */}
            {(product.category === 'dresses' ||
              product.category === 'robes') && (
              <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-yellow-600 mt-0.5 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm text-yellow-800">
                      <strong>Diet & Weight Changes:</strong> If your current
                      diet or weight is expected to change significantly by the
                      delivery date, the dress may not fit properly. Please
                      consider maintaining a stable weight during the ordering
                      period or ordering closer to your event date.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              {isLoggedIn ? (
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
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  disabled={product.stock === 0}
                  className={`flex-1 px-8 py-4 rounded-full font-semibold transition-colors ${
                    product.stock === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-linear-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600'
                  }`}
                >
                  {product.stock === 0
                    ? 'Out of Stock'
                    : 'Log in to add to cart'}
                </button>
              )}
              <button
                onClick={() => toggleWishlist(product)}
                className="w-14 h-14 flex items-center justify-center rounded-full border border-gray-300 text-slate-400 hover:text-pink-500 hover:border-pink-500 transition-colors"
                aria-label={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill={isInWishlist(product.id) ? 'currentColor' : 'none'}
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className={`w-6 h-6 ${isInWishlist(product.id) ? 'text-red-500' : ''}`}
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

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialView="login"
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Size Customization Modal */}
      <SizeCustomizationModal
        isOpen={showSizeModal}
        onClose={() => setShowSizeModal(false)}
        onSave={(measurements) => {
          setSavedMeasurements(measurements);
          toast.success(
            'Measurements saved! They will be used for this order.',
          );
        }}
        savedMeasurements={savedMeasurements}
      />
    </div>
  );
}
