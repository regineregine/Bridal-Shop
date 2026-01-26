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
  const navigate = useNavigate();
  const { getSelectedCartItems, getSelectedCartTotal, removeSelectedItems } =
    useCart();
  const cartItems = getSelectedCartItems();

  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    cardName: '',
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    country: 'Philippines',
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
      const nameParts = user.name ? user.name.trim().split(' ') : ['', ''];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData((prev) => ({
        ...prev,
        firstName: firstName,
        lastName: lastName,
        email: user.email || '',
        address: user.address || '',
        city: user.city || '',
        zip: user.zip || '',
        country: user.country || 'Philippines',
      }));

      if (user.card_holder_name) {
        setCardDetails((prev) => ({
          ...prev,
          cardName: user.card_holder_name || '',
        }));
      }
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;

    // Format card number
    if (name === 'cardNumber') {
      const formatted =
        value
          .replace(/\s/g, '')
          .match(/.{1,4}/g)
          ?.join(' ') || value.replace(/\s/g, '');
      setCardDetails((prev) => ({ ...prev, [name]: formatted }));
    }
    // Format expiry date
    else if (name === 'cardExpiry') {
      const formatted = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d{0,2})/, '$1/$2')
        .substring(0, 5);
      setCardDetails((prev) => ({ ...prev, [name]: formatted }));
    }
    // CVV - numbers only
    else if (name === 'cardCvv') {
      const formatted = value.replace(/\D/g, '').substring(0, 4);
      setCardDetails((prev) => ({ ...prev, [name]: formatted }));
    } else {
      setCardDetails((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent multiple submissions
    if (isSubmitting) {
      return;
    }

    // Validate shipping information
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.address ||
      !formData.city ||
      !formData.zip
    ) {
      toast.error('Please fill in all shipping information fields');
      return;
    }

    // Validate terms acceptance
    if (!acceptedTerms) {
      toast.error('Please accept the terms and conditions to proceed');
      return;
    }

    // Validate card details if card payment is selected
    if (paymentMethod === 'Credit/Debit Card') {
      const cardNum = cardDetails.cardNumber.replace(/\s/g, '');
      if (!cardNum || cardNum.length < 13) {
        toast.error('Please enter a valid card number');
        return;
      }
      if (!cardDetails.cardExpiry || cardDetails.cardExpiry.length !== 5) {
        toast.error('Please enter a valid expiry date (MM/YY)');
        return;
      }
      if (!cardDetails.cardCvv || cardDetails.cardCvv.length < 3) {
        toast.error('Please enter a valid CVV');
        return;
      }
      if (!cardDetails.cardName) {
        toast.error('Please enter cardholder name');
        return;
      }
    }

    setIsSubmitting(true);

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
        payment_method: paymentMethod,
        total_price: getSelectedCartTotal(),
      };

      await api.post('/orders', payload);
      removeSelectedItems();
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      console.error('Order failed', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const subtotal = getSelectedCartTotal();
  const shipping = 0;
  const total = subtotal + shipping;

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

      <div className="py-20 sm:py-32 px-4 sm:px-6 max-w-6xl mx-auto w-full">
        <h1 className="font-Tinos text-2xl leading-none tracking-widest text-slate-900 uppercase md:tracking-[0.6em] lg:tracking-[0.8em] mb-8 text-center">
          Payment
        </h1>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Left Column - Payment & Shipping */}
          <div className="flex-1 space-y-6">
            {/* Payment Methods Section */}
            <section>
              <div className="bg-white rounded-2xl border border-pink-200 shadow-[0_10px_30px_rgba(236,72,153,0.06)] p-6 mb-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-6">
                  Select Payment Method
                </h2>

                <form id="payment-form" onSubmit={handleSubmit}>
                  <input
                    type="hidden"
                    name="payment_method"
                    value={paymentMethod}
                  />

                  <div className="space-y-4">
                    {/* Cash on Delivery */}
                    <label
                      className={`payment-option flex items-start p-4 border-2 rounded-xl cursor-pointer hover:border-pink-400 transition-all bg-white ${
                        paymentMethod === 'Cash on Delivery'
                          ? 'border-pink-500 bg-pink-50 shadow-[0_0_0_3px_rgba(236,72,153,0.1)]'
                          : 'border-pink-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment_method_radio"
                        value="Cash on Delivery"
                        className="mt-1 mr-4 w-5 h-5 text-pink-600 focus:ring-pink-500"
                        checked={paymentMethod === 'Cash on Delivery'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-slate-900">
                              Cash on Delivery
                            </h3>
                            <p className="text-sm text-slate-600 mt-1">
                              Pay when you receive your order
                            </p>
                          </div>
                          <svg
                            className="w-8 h-8 text-pink-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                            ></path>
                          </svg>
                        </div>
                      </div>
                    </label>

                    {/* Credit/Debit Card */}
                    <label
                      className={`payment-option flex items-start p-4 border-2 rounded-xl cursor-pointer hover:border-pink-400 transition-all bg-white ${
                        paymentMethod === 'Credit/Debit Card'
                          ? 'border-pink-500 bg-pink-50 shadow-[0_0_0_3px_rgba(236,72,153,0.1)]'
                          : 'border-pink-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment_method_radio"
                        value="Credit/Debit Card"
                        className="mt-1 mr-4 w-5 h-5 text-pink-600 focus:ring-pink-500"
                        checked={paymentMethod === 'Credit/Debit Card'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-slate-900">
                              Credit/Debit Card
                            </h3>
                            <p className="text-sm text-slate-600 mt-1">
                              Pay securely with your card
                            </p>
                          </div>
                          <svg
                            className="w-8 h-8 text-pink-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                            ></path>
                          </svg>
                        </div>
                      </div>
                    </label>

                    {/* Card Payment Form */}
                    {paymentMethod === 'Credit/Debit Card' && (
                      <div className="mt-4 p-4 bg-pink-50 rounded-xl border border-pink-200">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Card Number
                            </label>
                            <input
                              type="text"
                              name="cardNumber"
                              placeholder="1234 5678 9012 3456"
                              className="w-full px-4 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                              maxLength="19"
                              value={cardDetails.cardNumber}
                              onChange={handleCardChange}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Expiry Date
                              </label>
                              <input
                                type="text"
                                name="cardExpiry"
                                placeholder="MM/YY"
                                className="w-full px-4 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                maxLength="5"
                                value={cardDetails.cardExpiry}
                                onChange={handleCardChange}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                CVV
                              </label>
                              <input
                                type="text"
                                name="cardCvv"
                                placeholder="123"
                                className="w-full px-4 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                maxLength="4"
                                value={cardDetails.cardCvv}
                                onChange={handleCardChange}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Cardholder Name
                            </label>
                            <input
                              type="text"
                              name="cardName"
                              placeholder="John Doe"
                              className="w-full px-4 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                              value={cardDetails.cardName}
                              onChange={handleCardChange}
                            />
                          </div>
                          <p className="text-xs text-slate-500 italic">
                            * This is a mock payment form for demonstration
                            purposes
                          </p>
                        </div>
                      </div>
                    )}

                    {/* GCash */}
                    <label
                      className={`payment-option flex items-start p-4 border-2 rounded-xl cursor-pointer hover:border-pink-400 transition-all bg-white ${
                        paymentMethod === 'GCash'
                          ? 'border-pink-500 bg-pink-50 shadow-[0_0_0_3px_rgba(236,72,153,0.1)]'
                          : 'border-pink-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment_method_radio"
                        value="GCash"
                        className="mt-1 mr-4 w-5 h-5 text-pink-600 focus:ring-pink-500"
                        checked={paymentMethod === 'GCash'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-slate-900">
                              GCash
                            </h3>
                            <p className="text-sm text-slate-600 mt-1">
                              Pay using your GCash wallet
                            </p>
                          </div>
                          <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white font-bold">
                            G
                          </div>
                        </div>
                      </div>
                    </label>

                    {/* PayPal */}
                    <label
                      className={`payment-option flex items-start p-4 border-2 rounded-xl cursor-pointer hover:border-pink-400 transition-all bg-white ${
                        paymentMethod === 'PayPal'
                          ? 'border-pink-500 bg-pink-50 shadow-[0_0_0_3px_rgba(236,72,153,0.1)]'
                          : 'border-pink-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment_method_radio"
                        value="PayPal"
                        className="mt-1 mr-4 w-5 h-5 text-pink-600 focus:ring-pink-500"
                        checked={paymentMethod === 'PayPal'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-slate-900">
                              PayPal
                            </h3>
                            <p className="text-sm text-slate-600 mt-1">
                              Pay securely with PayPal
                            </p>
                          </div>
                          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">
                            PP
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                </form>
              </div>

              {/* Shipping Information */}
              <div className="bg-white rounded-2xl border border-pink-200 shadow-[0_10px_30px_rgba(236,72,153,0.06)] p-6">
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
                      className="w-full rounded-md border border-pink-200 px-4 py-2 focus:border-pink-500 focus:ring-pink-500"
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
                      className="w-full rounded-md border border-pink-200 px-4 py-2 focus:border-pink-500 focus:ring-pink-500"
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
                      className="w-full rounded-md border border-pink-200 px-4 py-2 focus:border-pink-500 focus:ring-pink-500"
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
                      className="w-full rounded-md border border-pink-200 px-4 py-2 focus:border-pink-500 focus:ring-pink-500"
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
                      className="w-full rounded-md border border-pink-200 px-4 py-2 focus:border-pink-500 focus:ring-pink-500"
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
                      className="w-full rounded-md border border-pink-200 px-4 py-2 focus:border-pink-500 focus:ring-pink-500"
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
                      className="w-full rounded-md border border-pink-200 px-4 py-2 focus:border-pink-500 focus:ring-pink-500"
                      value={formData.country}
                      onChange={handleChange}
                    >
                      <option>Philippines</option>
                      <option>United States</option>
                      <option>Canada</option>
                      <option>United Kingdom</option>
                      <option>Australia</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>

            {/* Refund Policy Disclaimer */}
            <section>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
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
                    <p className="text-sm text-yellow-800 mb-2">
                      <strong>Refund Policy:</strong> Cancellations are allowed
                      up to 45 days before the event date or before production
                      begins, whichever comes first. After this period, all
                      orders are non-refundable.{' '}
                      <Link
                        to="/refund-policy"
                        className="text-pink-600 hover:text-pink-700 font-medium underline"
                      >
                        Read full policy
                      </Link>
                    </p>
                  </div>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="bg-white rounded-2xl border border-pink-200 shadow-[0_10px_30px_rgba(236,72,153,0.06)] p-6">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="accept-terms"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-1 w-5 h-5 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                    required
                  />
                  <label
                    htmlFor="accept-terms"
                    className="flex-1 text-sm text-slate-700 cursor-pointer"
                  >
                    <span className="font-medium">
                      I agree to the Terms & Conditions and Refund Policy
                    </span>
                    <p className="text-xs text-slate-500 mt-1">
                      By placing this order, you acknowledge that you have read
                      and agree to our{' '}
                      <Link
                        to="/refund-policy"
                        className="text-pink-600 hover:text-pink-700 underline"
                      >
                        refund policy
                      </Link>
                      . Cancellations must be made at least 45 days before the
                      event date or before production begins.
                    </p>
                  </label>
                </div>
              </div>
            </section>
          </div>

          {/* Order Details & Summary */}
          <aside className="w-full self-start rounded-xl border border-pink-200 bg-white p-6 shadow-lg lg:sticky lg:top-24 lg:w-96">
            <h3 className="mb-4 text-2xl font-semibold text-slate-900">
              Order Details
            </h3>

            <div className="mb-6 space-y-3">
              <div>
                <p className="text-sm font-medium text-slate-700 mb-1">
                  Shipping Address
                </p>
                <p className="text-sm text-slate-600">
                  {formData.address
                    ? `${formData.address}, ${formData.city}, ${formData.zip}`
                    : 'Not provided'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700 mb-1">
                  Customer
                </p>
                <p className="text-sm text-slate-600">
                  {formData.firstName} {formData.lastName}
                </p>
                <p className="text-sm text-slate-600">{formData.email}</p>
              </div>
            </div>

            <hr className="my-4 border-t border-pink-100" />

            {/* Order Summary */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-slate-900 mb-4">
                Order Summary
              </h4>
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div
                    key={`${item.id}-${item.size}`}
                    className="flex items-center gap-3 pb-3 border-b border-pink-100"
                  >
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900">
                        {item.name}
                      </h4>
                      <p className="text-sm text-slate-600">
                        Size: {item.size}
                      </p>
                      <p className="text-sm text-slate-700">
                        Quantity: {item.quantity} × ₱
                        {Number(item.price).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">
                        ₱{Number(item.quantity * item.price).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <hr className="my-4 border-t border-pink-100" />

            <div className="mb-2 flex justify-between text-slate-900">
              <span>Subtotal</span>
              <span>₱{subtotal.toLocaleString()}</span>
            </div>
            <div className="mb-2 flex justify-between text-slate-900">
              <span>Estimated Shipping</span>
              <span>₱0.00</span>
            </div>
            <div className="mb-4 flex justify-between text-slate-900">
              <span>Tax</span>
              <span>₱0.00</span>
            </div>
            <hr className="my-4 border-t border-pink-100" />
            <div className="mb-6 flex justify-between text-lg font-semibold text-slate-700">
              <span>Total</span>
              <span>₱{total.toLocaleString()}</span>
            </div>

            <button
              type="submit"
              form="payment-form"
              disabled={
                isSubmitting ||
                !formData.firstName ||
                !formData.lastName ||
                !formData.email ||
                !formData.address ||
                !formData.city ||
                !formData.zip ||
                !acceptedTerms
              }
              className={`w-full rounded-md py-3 font-semibold text-white transition-all ${
                isSubmitting ||
                !formData.firstName ||
                !formData.lastName ||
                !formData.email ||
                !formData.address ||
                !formData.city ||
                !formData.zip ||
                !acceptedTerms
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-linear-to-r from-pink-500 to-rose-500 hover:shadow-[0_0_30px_rgba(236,72,153,0.25)]'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing Order...
                </div>
              ) : (
                'Complete Order'
              )}
            </button>

            <Link
              to="/cart"
              className="mt-3 w-full inline-flex items-center justify-center rounded-full bg-pink-100 text-pink-700 font-medium px-8 py-3 border border-pink-300 hover:bg-pink-200 transition"
            >
              Back to Cart
            </Link>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
