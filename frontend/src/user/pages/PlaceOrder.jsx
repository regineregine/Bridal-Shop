import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function PlaceOrder() {
  const { isLoggedIn, user } = useAuth();
  const userName = user?.name || 'Guest';
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    country: 'United States',
    cardName: '',
    cardNumber: '',
    expDate: '',
    cvv: '',
  });

  useEffect(() => {
    if (!isLoggedIn) {
      toast.error('Please login to place an order');
      navigate('/');
    } else if (cartItems.length === 0) {
      navigate('/shop');
    }
  }, [isLoggedIn, cartItems, navigate]);

  // Auto-populate form with user data
  useEffect(() => {
    if (user) {
      // Split name into first and last name
      const nameParts = user.name ? user.name.trim().split(' ') : ['', ''];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      setFormData((prev) => ({
        ...prev,
        firstName: firstName,
        lastName: lastName,
        email: user.email || '',
        address: user.address || '',
        city: user.city || '',
        zip: user.zip || '',
        country: user.country || 'United States',
        cardName: user.card_holder_name || '',
        cardNumber: user.card_last_four
          ? `•••• •••• •••• ${user.card_last_four}`
          : '',
        expDate: user.card_expiry || '',
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        items: cartItems.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
          size: item.size,
        })),
        shipping_address: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          zip: formData.zip,
          country: formData.country,
        },
        total_price: getCartTotal(),
      };

      await api.post('/orders', payload);
      clearCart();
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      console.error('Order failed', error);
      toast.error('Failed to place order. Please try again.');
    }
  };

  const subtotal = getCartTotal();
  const shipping = 0;
  const total = subtotal + shipping;

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

      <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <h1 className="font-Tinos text-4xl text-slate-900 mb-8 text-center">
          Checkout
        </h1>

        {/* Helpful Tip */}
        <div className="mb-6 bg-pink-50 border border-pink-200 rounded-lg p-4 max-w-3xl mx-auto">
          <div className="flex items-start gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-pink-500 mt-0.5 shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1">
              <p className="text-sm text-slate-700">
                <span className="font-semibold text-pink-700">Tip:</span>{' '}
                Missing information? You can save your shipping details on your{' '}
                <Link
                  to="/profile"
                  className="text-pink-600 hover:text-pink-700 font-medium underline"
                >
                  profile page
                </Link>{' '}
                for faster checkout next time.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Checkout Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Shipping Info */}
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                  Shipping Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-pink-500 focus:ring-pink-500"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-pink-500 focus:ring-pink-500"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-pink-500 focus:ring-pink-500"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      required
                      className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-pink-500 focus:ring-pink-500"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-pink-500 focus:ring-pink-500"
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      ZIP / Postal Code
                    </label>
                    <input
                      type="text"
                      name="zip"
                      required
                      className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-pink-500 focus:ring-pink-500"
                      value={formData.zip}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Country
                    </label>
                    <select
                      name="country"
                      className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-pink-500 focus:ring-pink-500"
                      value={formData.country}
                      onChange={handleChange}
                    >
                      <option>United States</option>
                      <option>Canada</option>
                      <option>United Kingdom</option>
                      <option>Australia</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                  Payment Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      name="cardName"
                      required
                      className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-pink-500 focus:ring-pink-500"
                      value={formData.cardName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      required
                      placeholder="0000 0000 0000 0000"
                      className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-pink-500 focus:ring-pink-500"
                      value={formData.cardNumber}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Expiration Date
                    </label>
                    <input
                      type="text"
                      name="expDate"
                      required
                      placeholder="MM/YY"
                      className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-pink-500 focus:ring-pink-500"
                      value={formData.expDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      required
                      placeholder="123"
                      className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-pink-500 focus:ring-pink-500"
                      value={formData.cvv}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full block text-center rounded-full bg-pink-500 px-6 py-4 text-lg font-semibold text-white transition-colors hover:bg-pink-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Place Order (₱{total.toLocaleString()})
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-gray-50 rounded-lg p-8 sticky top-32">
              <h2 className="text-xl font-semibold text-slate-900 mb-6">
                Your Order
              </h2>
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div
                    key={`${item.id}-${item.size}`}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-white rounded-md border border-gray-200 flex items-center justify-center text-xs text-gray-400 overflow-hidden">
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">
                          {item.name}
                        </p>
                        <p className="text-sm text-slate-500">
                          Size: {item.size} x {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-medium text-slate-900">
                      ₱{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>₱{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `₱${shipping}`}</span>
                </div>
                <div className="border-t border-gray-200 pt-4 flex justify-between text-xl font-semibold text-slate-900">
                  <span>Total</span>
                  <span>₱{total.toLocaleString()}</span>
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
