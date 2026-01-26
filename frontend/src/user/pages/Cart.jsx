import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const navigate = useNavigate();
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    toggleItemSelection,
    getSelectedCartTotal,
    getSelectedCartItems,
  } = useCart();

  const subtotal = getSelectedCartTotal();
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;
  const selectedItems = getSelectedCartItems();

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert('Please select at least one item to proceed to checkout');
      return;
    }
    navigate('/place-order');
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

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <div className="flex-1 pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <h1 className="font-Tinos text-3xl sm:text-4xl text-slate-900 mb-6 sm:mb-8 text-center">
          Shopping Cart
        </h1>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {cartItems.map((item) => (
                <div
                  key={`${item.id}-${item.size}`}
                  className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-6 bg-white rounded-lg shadow-[0_4px_20px_rgba(210,199,229,0.1)] border border-gray-100"
                >
                  <div className="flex items-start pt-1 sm:pt-1">
                    <input
                      type="checkbox"
                      checked={item.selected !== false}
                      onChange={() => toggleItemSelection(item.id, item.size)}
                      className="w-5 h-5 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                    />
                  </div>
                  <div className="w-20 h-28 sm:w-24 sm:h-32 shrink-0 rounded-md overflow-hidden bg-gray-100">
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                        <h3 className="text-base sm:text-lg font-medium text-slate-900">
                          {item.name}
                        </h3>
                        <p className="text-lg font-semibold text-slate-900 whitespace-nowrap">
                          ₱{Number(item.price).toLocaleString()}
                        </p>
                      </div>
                      <p className="text-sm text-slate-500 mt-1">
                        Size: {item.size}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 gap-3 sm:gap-0">
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.size,
                              item.quantity - 1
                            )
                          }
                          className="px-3 py-2 text-slate-600 hover:bg-gray-50 active:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="px-4 py-2 text-slate-900 font-medium border-l border-r border-gray-300 min-w-12 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.size,
                              item.quantity + 1
                            )
                          }
                          className="px-3 py-2 text-slate-600 hover:bg-gray-50 active:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id, item.size)}
                        className="text-sm text-red-500 hover:text-red-600 font-medium active:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-[0_4px_20px_rgba(210,199,229,0.1)] border border-gray-100 p-5 sm:p-6 lg:sticky lg:top-32">
                <h2 className="text-lg font-semibold text-slate-900 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>₱{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `₱${shipping}`}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4 flex justify-between text-lg font-semibold text-slate-900">
                    <span>Total</span>
                    <span>₱{total.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={selectedItems.length === 0}
                  className={`w-full block text-center rounded-full px-6 py-3 sm:py-3.5 text-base font-semibold text-white transition-all shadow-lg hover:shadow-xl transform active:scale-95 ${
                    selectedItems.length === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-pink-500 hover:bg-pink-600 active:bg-pink-700'
                  }`}
                >
                  Proceed to Checkout{' '}
                  {selectedItems.length > 0 && `(${selectedItems.length})`}
                </button>

                <div className="mt-6 text-center">
                  <Link
                    to="/shop"
                    className="text-sm text-pink-500 hover:underline active:text-pink-700"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-24 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-slate-500 mb-8">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link
              to="/shop"
              className="inline-block rounded-full bg-pink-500 px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-pink-600"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
