import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Profile() {
  const {
    isLoggedIn,
    user: contextUser,
    logout,
    setUser: setContextUser,
  } = useAuth();
  const [user, setUser] = useState(contextUser);
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const navigate = useNavigate();
  const { cartItems, getCartTotal } = useCart();

  // Form states
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    contact_number: '',
    gender: 'Female',
    date_of_birth: '',
    profile_img: null,
  });
  const [addressForm, setAddressForm] = useState({
    address: '',
    city: '',
    province: '',
    barangay: '',
    zip: '',
  });
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [paymentForm, setPaymentForm] = useState({
    card_holder_name: '',
    card_number: '',
    card_expiry: '',
    card_type: '',
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserData();
      fetchOrders();
    } else {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        contact_number: user.contact_number || '',
        gender: user.gender || 'Female',
        date_of_birth: user.date_of_birth || '',
        profile_img: null,
      });
      setAddressForm({
        address: user.address || '',
        city: user.city || '',
        province: user.province || '',
        barangay: user.barangay || '',
        zip: user.zip || '',
      });
      setPaymentForm({
        card_holder_name: user.card_holder_name || '',
        card_number: user.card_last_four
          ? `•••• •••• •••• ${user.card_last_four}`
          : '',
        card_expiry: user.card_expiry || '',
        card_type: user.card_type || '',
      });
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const response = await api.get('/user');
      setUser(response.data);
      // Update context user if needed, but be careful of loops
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', profileForm.name);
    formData.append('email', profileForm.email);
    formData.append('contact_number', profileForm.contact_number);
    formData.append('gender', profileForm.gender);
    formData.append('date_of_birth', profileForm.date_of_birth);
    if (profileForm.profile_img) {
      formData.append('profile_img', profileForm.profile_img);
    }

    try {
      const response = await api.post('/user/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUser(response.data.user);
      setContextUser(response.data.user);
      toast.success('Profile updated successfully!');
      // Reset image preview and file input after successful save
      setImagePreview(null);
      setProfileForm({ ...profileForm, profile_img: null });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile.');
    }
  };

  const handleAddressUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/user/address', addressForm);
      setUser(response.data.user);
      setContextUser(response.data.user);
      toast.success('Address updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update address.');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      toast.error('New passwords do not match.');
      return;
    }
    try {
      await api.post('/user/password', {
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
        new_password_confirmation: passwordForm.confirm_password,
      });
      toast.success('Password changed successfully!');
      setPasswordForm({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to change password.'
      );
    }
  };

  const handlePaymentUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/user/payment', paymentForm);
      setUser(response.data.user);
      setContextUser(response.data.user);
      toast.success('Payment information updated successfully!');
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to update payment information.'
      );
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setProfileForm({ ...profileForm, profile_img: file });
    }
  };

  // Cleanup preview URL when component unmounts or preview changes
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const getImageUrl = (imageName) => {
    if (!imageName) return '/img/default-avatar.png';
    if (imageName.startsWith('http') || imageName.startsWith('data:')) {
      return imageName;
    }
    // If it's a profile upload, it might be in storage/profile-uploads, served via public/storage or similar.
    // For now, assuming standard /img/ path or storage link.
    // If backend stores as 'profile-uploads/filename.jpg', and we have a symlink or route.
    // Laravel 'public' disk usually maps to 'storage/app/public'.
    // We need to make sure the frontend can access it.
    // If using 'php artisan storage:link', it's at /storage/profile-uploads/...
    // But the user's code used '../img/' + img.
    // Let's assume for now it's accessible via /storage/ if it's an upload, or /img/ if it's a static asset.
    if (imageName.startsWith('profile-uploads/')) {
      return `http://localhost:8000/storage/${imageName}`; // Adjust base URL as needed
    }
    return `/img/${imageName}`;
  };

  const resolveStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      <Navbar />

      <div className="flex-1 py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-2 md:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <aside className="w-full md:w-72 bg-white rounded-xl shadow-sm border border-neutral-200 p-6 flex flex-col items-center md:items-start">
              <div className="flex flex-col items-center md:items-start w-full">
                <div className="w-20 h-20 rounded-full bg-neutral-200 mb-2 overflow-hidden flex items-center justify-center">
                  <img
                    src={getImageUrl(user.profile_img)}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div className="font-semibold text-lg text-slate-900 mb-1">
                  {user.name}
                </div>
                <button
                  onClick={() => setActiveTab('profile')}
                  className="text-sm text-pink-500 hover:underline mb-4 flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="inline h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.232 5.232l3.536 3.536M9 13h3l9-9a1.414 1.414 0 00-2-2l-9 9v3z"
                    />
                  </svg>
                  Edit Profile
                </button>
              </div>
              <hr className="w-full my-4 border-neutral-200" />
              <nav className="w-full">
                <ul className="space-y-1 text-base">
                  <li>
                    <button
                      onClick={() => setActiveTab('profile')}
                      className={`w-full text-left flex items-center gap-2 rounded-lg px-4 py-2 ${
                        activeTab === 'profile'
                          ? 'bg-pink-50 text-pink-600'
                          : 'hover:bg-gray-50 text-slate-700'
                      }`}
                    >
                      Profile
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('cart')}
                      className={`w-full text-left flex items-center gap-2 rounded-lg px-4 py-2 ${
                        activeTab === 'cart'
                          ? 'bg-pink-50 text-pink-600'
                          : 'hover:bg-gray-50 text-slate-700'
                      }`}
                    >
                      My Cart
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className={`w-full text-left flex items-center gap-2 rounded-lg px-4 py-2 ${
                        activeTab === 'orders'
                          ? 'bg-pink-50 text-pink-600'
                          : 'hover:bg-gray-50 text-slate-700'
                      }`}
                    >
                      My Orders
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('addresses')}
                      className={`w-full text-left flex items-center gap-2 rounded-lg px-4 py-2 ${
                        activeTab === 'addresses'
                          ? 'bg-pink-50 text-pink-600'
                          : 'hover:bg-gray-50 text-slate-700'
                      }`}
                    >
                      Addresses
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('payment')}
                      className={`w-full text-left flex items-center gap-2 rounded-lg px-4 py-2 ${
                        activeTab === 'payment'
                          ? 'bg-pink-50 text-pink-600'
                          : 'hover:bg-gray-50 text-slate-700'
                      }`}
                    >
                      Payment Methods
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('change-password')}
                      className={`w-full text-left flex items-center gap-2 rounded-lg px-4 py-2 ${
                        activeTab === 'change-password'
                          ? 'bg-pink-50 text-pink-600'
                          : 'hover:bg-gray-50 text-slate-700'
                      }`}
                    >
                      Change Password
                    </button>
                  </li>
                </ul>
              </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 mb-1">
                  {activeTab === 'profile' && 'My Profile'}
                  {activeTab === 'cart' && 'My Cart'}
                  {activeTab === 'orders' && 'My Orders'}
                  {activeTab === 'addresses' && 'My Address'}
                  {activeTab === 'payment' && 'Payment Methods'}
                  {activeTab === 'change-password' && 'Change Password'}
                </h1>
                <p className="text-slate-700">
                  {activeTab === 'profile' && 'Manage and protect your account'}
                  {activeTab === 'cart' && 'View items in your cart'}
                  {activeTab === 'orders' && 'View your order history'}
                  {activeTab === 'addresses' && 'Manage your shipping address'}
                  {activeTab === 'payment' &&
                    'Save your card details for faster checkout'}
                  {activeTab === 'change-password' && 'Update your password'}
                </p>
              </div>

              {/* Profile Section */}
              {activeTab === 'profile' && (
                <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
                  <form
                    onSubmit={handleProfileUpdate}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start"
                  >
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm text-slate-700 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          value={profileForm.name}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          value={profileForm.email}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              email: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          value={profileForm.contact_number}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              contact_number: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-700 mb-1">
                          Gender
                        </label>
                        <select
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          value={profileForm.gender}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              gender: e.target.value,
                            })
                          }
                        >
                          <option value="Female">Female</option>
                          <option value="Male">Male</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-slate-700 mb-1">
                          Date of birth
                        </label>
                        <input
                          type="date"
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          value={profileForm.date_of_birth}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              date_of_birth: e.target.value,
                            })
                          }
                        />
                      </div>
                      <button
                        type="submit"
                        className="mt-4 px-8 py-2 rounded-lg bg-pink-500 text-white font-semibold hover:bg-pink-600"
                      >
                        Save
                      </button>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <div
                        className="w-full max-w-sm bg-neutral-200 overflow-hidden relative cursor-pointer group rounded-xl"
                        onClick={() =>
                          document
                            .getElementById('profile-image-upload')
                            .click()
                        }
                      >
                        <div className="aspect-3/4 relative">
                          <img
                            src={imagePreview || getImageUrl(user.profile_img)}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                          {/* Upload overlay on hover */}
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-12 w-12 text-white mb-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            <span className="text-white text-sm font-medium">
                              Click to Change Photo
                            </span>
                          </div>
                          {/* Preview badge */}
                          {imagePreview && (
                            <div className="absolute top-2 right-2 bg-pink-500 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg">
                              Preview
                            </div>
                          )}
                        </div>
                      </div>
                      <input
                        id="profile-image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      {imagePreview && (
                        <p className="text-xs text-pink-600 text-center mt-3">
                          Click "Save" to update your profile image
                        </p>
                      )}
                    </div>
                  </form>
                </div>
              )}

              {/* Addresses Section */}
              {activeTab === 'addresses' && (
                <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
                  <form onSubmit={handleAddressUpdate}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm text-slate-700 mb-1">
                          Street Address
                        </label>
                        <input
                          type="text"
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          value={addressForm.address}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              address: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-700 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          value={addressForm.city}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              city: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-700 mb-1">
                          Province
                        </label>
                        <input
                          type="text"
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          value={addressForm.province}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              province: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-700 mb-1">
                          Barangay
                        </label>
                        <input
                          type="text"
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          value={addressForm.barangay}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              barangay: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-700 mb-1">
                          Zip Code
                        </label>
                        <input
                          type="text"
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          value={addressForm.zip}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              zip: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="mt-6 px-8 py-2 rounded-lg bg-pink-500 text-white font-semibold hover:bg-pink-600"
                    >
                      Save Address
                    </button>
                  </form>
                </div>
              )}

              {/* Payment Section */}
              {activeTab === 'payment' && (
                <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
                  <form
                    onSubmit={handlePaymentUpdate}
                    className="space-y-6 max-w-md"
                  >
                    <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-pink-600 mt-0.5 shrink-0"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <p className="text-sm text-slate-700">
                          Your card information is securely stored. We only save
                          the last 4 digits for your reference.
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-slate-700 mb-1">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        value={paymentForm.card_holder_name}
                        onChange={(e) =>
                          setPaymentForm({
                            ...paymentForm,
                            card_holder_name: e.target.value,
                          })
                        }
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-slate-700 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        value={paymentForm.card_number}
                        onChange={(e) =>
                          setPaymentForm({
                            ...paymentForm,
                            card_number: e.target.value,
                          })
                        }
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                      />
                      {user?.card_last_four && (
                        <p className="text-xs text-slate-500 mt-1">
                          Current card ends in {user.card_last_four}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-slate-700 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          value={paymentForm.card_expiry}
                          onChange={(e) =>
                            setPaymentForm({
                              ...paymentForm,
                              card_expiry: e.target.value,
                            })
                          }
                          placeholder="MM/YY"
                          maxLength="5"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-slate-700 mb-1">
                          Card Type
                        </label>
                        <select
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          value={paymentForm.card_type}
                          onChange={(e) =>
                            setPaymentForm({
                              ...paymentForm,
                              card_type: e.target.value,
                            })
                          }
                        >
                          <option value="">Select</option>
                          <option value="Visa">Visa</option>
                          <option value="Mastercard">Mastercard</option>
                          <option value="American Express">
                            American Express
                          </option>
                          <option value="Discover">Discover</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="mt-6 px-8 py-2 rounded-lg bg-pink-500 text-white font-semibold hover:bg-pink-600"
                    >
                      Save Payment Info
                    </button>
                  </form>
                </div>
              )}

              {/* Change Password Section */}
              {activeTab === 'change-password' && (
                <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
                  <form
                    onSubmit={handlePasswordChange}
                    className="space-y-6 max-w-md"
                  >
                    <div>
                      <label className="block text-sm text-slate-700 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        value={passwordForm.current_password}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            current_password: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        value={passwordForm.new_password}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            new_password: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        value={passwordForm.confirm_password}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            confirm_password: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-8 py-2 rounded-lg bg-pink-500 text-white font-semibold hover:bg-pink-600"
                    >
                      Change Password
                    </button>
                  </form>
                </div>
              )}

              {/* Cart Section */}
              {activeTab === 'cart' && (
                <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
                  {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[180px]">
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">
                        Your cart is empty.
                      </h3>
                      <p className="text-slate-700 mb-4">
                        Browse our products and add items to see them here.
                      </p>
                      <Link
                        to="/shop"
                        className="px-6 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
                      >
                        Start Shopping
                      </Link>
                    </div>
                  ) : (
                    <>
                      <div className="overflow-x-auto mb-6">
                        <table className="w-full">
                          <thead className="bg-pink-50">
                            <tr>
                              <td
                                className="p-4 font-semibold text-slate-900"
                                colSpan="2"
                              >
                                Product
                              </td>
                              <td className="p-4 font-semibold text-slate-900">
                                Price
                              </td>
                              <td className="p-4 font-semibold text-slate-900">
                                Quantity
                              </td>
                              <td className="p-4 font-semibold text-slate-900">
                                Total
                              </td>
                            </tr>
                          </thead>
                          <tbody>
                            {cartItems.map((item) => (
                              <tr
                                key={`${item.id}-${item.size}`}
                                className="border-t border-pink-100"
                              >
                                <td className="p-4">
                                  <img
                                    src={getImageUrl(item.image)}
                                    width="60"
                                    height="60"
                                    alt={item.name}
                                    className="rounded-lg object-cover"
                                  />
                                </td>
                                <td className="p-4">
                                  <span className="font-semibold text-slate-700">
                                    {item.name}
                                  </span>
                                  <br />
                                  <small className="text-pink-600">
                                    {item.material}
                                  </small>
                                </td>
                                <td className="p-4 font-semibold text-slate-700">
                                  ₱{Number(item.price).toLocaleString()}
                                </td>
                                <td className="p-4">{item.quantity}</td>
                                <td className="p-4 font-semibold text-slate-700">
                                  ₱
                                  {Number(
                                    item.price * item.quantity
                                  ).toLocaleString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="text-right font-semibold text-lg text-slate-900 mb-2">
                        Subtotal: ₱{getCartTotal().toLocaleString()}
                      </div>
                      <div className="text-right">
                        <Link
                          to="/cart"
                          className="px-6 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
                        >
                          Go to Cart
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Orders Section */}
              {activeTab === 'orders' && (
                <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
                  {loadingOrders ? (
                    <div className="text-center py-8">Loading orders...</div>
                  ) : orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[180px]">
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">
                        No orders yet
                      </h3>
                      <p className="text-slate-700 mb-4">
                        You haven't placed any orders yet. Start shopping to see
                        your orders here.
                      </p>
                      <Link
                        to="/shop"
                        className="px-6 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
                      >
                        Start Shopping
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="border rounded-xl p-4 mb-2 bg-gray-50"
                        >
                          <div className="mb-2 flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-slate-900">
                                Order #{order.id}
                              </h3>
                              <p className="text-sm text-slate-700">
                                Placed on{' '}
                                {new Date(
                                  order.created_at
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            <span
                              className={`self-start rounded-full px-3 py-1 text-sm font-medium ${resolveStatusBadge(
                                order.status
                              )}`}
                            >
                              {order.status.charAt(0).toUpperCase() +
                                order.status.slice(1)}
                            </span>
                          </div>
                          {/* Order Items would go here if available in the order object, or fetched separately */}
                          <div className="flex flex-col gap-2 border-t pt-2 sm:flex-row sm:items-center sm:justify-between">
                            <div className="text-sm text-slate-700">
                              <span>
                                <strong>Total:</strong> ₱
                                {Number(order.total_price).toLocaleString()}
                              </span>
                            </div>
                            <div className="flex flex-col gap-2 sm:flex-row">
                              {/* <Link to={`/order/${order.id}`} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">View Details</Link> */}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
