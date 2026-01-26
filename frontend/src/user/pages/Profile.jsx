import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SizeCustomizationModal from '../components/SizeCustomizationModal';
import OrderDetailsModal from '../components/OrderDetailsModal';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function Profile() {
  const { isLoggedIn, user: contextUser, setUser: setContextUser } = useAuth();
  const [user, setUser] = useState(contextUser);
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const navigate = useNavigate();
  const { cartItems, getCartTotal } = useCart();
  const { wishlistItems, removeFromWishlist } = useWishlist();

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
    country: '',
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
  const [measurements, setMeasurements] = useState(null);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [loadingMeasurements, setLoadingMeasurements] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [resetCode, setResetCode] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [codeVerified, setCodeVerified] = useState(false);

  useEffect(() => {
    // Check if coming from forgot password with code
    const code = searchParams.get('code');
    const email = searchParams.get('email');
    const tab = searchParams.get('tab');

    if (code && email && tab === 'change-password' && isLoggedIn) {
      setResetCode(code);
      setResetEmail(decodeURIComponent(email));
      setActiveTab('change-password');
      // Code is already verified and user is logged in, just mark as verified
      setCodeVerified(true);
      toast.success('Code verified! You can now set your new password.');
      // Clean up URL params but keep tab
      setSearchParams({ tab: 'change-password' });
    }
  }, [searchParams, isLoggedIn]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserData();
      fetchOrders();
      fetchMeasurements();
    } else {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  const fetchMeasurements = async () => {
    setLoadingMeasurements(true);
    try {
      const response = await api.get('/user/measurements');
      setMeasurements(response.data);
    } catch {
      // Measurements might not exist yet
      setMeasurements(null);
    } finally {
      setLoadingMeasurements(false);
    }
  };

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
        country: user.country || 'Philippines',
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

  const handleCancelOrder = async (orderId) => {
    if (
      !window.confirm(
        'Are you sure you want to cancel this order? This action cannot be undone.',
      )
    ) {
      return;
    }

    try {
      await api.post(`/orders/${orderId}/cancel`);
      toast.success('Order cancelled successfully');
      fetchOrders(); // Refresh orders list
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error(
        error.response?.data?.message ||
          'Failed to cancel order. Please try again.',
      );
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

  // eslint-disable-next-line no-unused-vars
  const verifyResetCode = async (code, email) => {
    try {
      await api.post('/password/verify-code', {
        email: email,
        code: code,
      });
      setCodeVerified(true);
      toast.success('Code verified! You can now set your new password.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid or expired code.');
      // Clear URL params if code is invalid
      setSearchParams({});
      setResetCode('');
      setResetEmail('');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      toast.error('New passwords do not match.');
      return;
    }

    try {
      // If using reset code, use different endpoint
      if (codeVerified && resetCode && resetEmail) {
        await api.post('/password/reset-with-code', {
          email: resetEmail,
          code: resetCode,
          password: passwordForm.new_password,
          password_confirmation: passwordForm.confirm_password,
        });
        toast.success(
          'Password reset successfully! You can now login with your new password.',
        );
        // Clear reset code state
        setResetCode('');
        setResetEmail('');
        setCodeVerified(false);
        setSearchParams({});
      } else {
        // Normal password change (requires current password)
        await api.post('/user/password', {
          current_password: passwordForm.current_password,
          new_password: passwordForm.new_password,
          new_password_confirmation: passwordForm.confirm_password,
        });
        toast.success('Password changed successfully!');
      }

      setPasswordForm({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to change password.',
      );
    }
  };

  // eslint-disable-next-line no-unused-vars
  const handlePaymentUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/user/payment', paymentForm);
      setUser(response.data.user);
      setContextUser(response.data.user);
      toast.success('Payment information updated successfully!');
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Failed to update payment information.',
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
      return `/storage/${imageName}`;
    }
    return `/img/${imageName}`;
  };

  const resolveStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'in_production':
      case 'in production':
        return 'bg-purple-100 text-purple-800';
      case 'fitting':
      case 'alteration':
        return 'bg-indigo-100 text-indigo-800';
      case 'ready_for_delivery':
      case 'ready for delivery':
      case 'ready_for_pickup':
      case 'ready for pickup':
        return 'bg-cyan-100 text-cyan-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-orange-100 text-orange-800';
      case 'rejected':
      case 'disputed':
        return 'bg-red-200 text-red-900';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatusLabel = (status) => {
    if (!status) return 'Unknown';
    const statusMap = {
      pending: 'Pending',
      confirmed: 'Confirmed',
      in_production: 'In Production',
      'in production': 'In Production',
      fitting: 'Fitting / Alteration',
      alteration: 'Fitting / Alteration',
      ready_for_delivery: 'Ready for Delivery',
      'ready for delivery': 'Ready for Delivery',
      ready_for_pickup: 'Ready for Pickup',
      'ready for pickup': 'Ready for Pickup',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
      refunded: 'Refunded',
      rejected: 'Rejected / Disputed',
      disputed: 'Rejected / Disputed',
    };
    return (
      statusMap[status.toLowerCase()] ||
      status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ')
    );
  };

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  // Navigation items configuration
  const navItems = [
    {
      id: 'profile',
      label: 'Profile',
      icon: (
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
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
    {
      id: 'cart',
      label: 'Cart',
      icon: (
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
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: (
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
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
    },
    {
      id: 'addresses',
      label: 'Address',
      icon: (
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
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
    {
      id: 'change-password',
      label: 'Password',
      icon: (
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
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      ),
    },
    {
      id: 'sizes',
      label: 'Sizes',
      icon: (
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
            d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
          />
        </svg>
      ),
    },
    {
      id: 'wishlist',
      label: 'Wishlist',
      icon: (
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
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      <Navbar />

      <div className="flex-1 pt-24 pb-8 md:pt-40 md:pb-12">
        <div className="mx-auto max-w-7xl px-2 md:px-6 lg:px-8">
          {/* Mobile Profile Header */}
          <div className="md:hidden mb-4">
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-neutral-200 overflow-hidden shrink-0">
                  <img
                    src={getImageUrl(user.profile_img)}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-base text-slate-900 truncate">
                    {user.name}
                  </div>
                  <div className="text-sm text-slate-500 truncate">
                    {user.email}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Horizontal Tabs */}
          <div className="md:hidden mb-4 -mx-2 px-2">
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex gap-2 pb-2 min-w-max">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      activeTab === item.id
                        ? 'bg-pink-500 text-white shadow-sm'
                        : 'bg-white text-slate-600 border border-neutral-200 hover:bg-pink-50 hover:text-pink-600'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Desktop Sidebar - Hidden on mobile */}
            <aside className="hidden md:flex w-72 bg-white rounded-xl shadow-sm border border-neutral-200 p-6 flex-col items-start">
              <div className="flex flex-col items-start w-full">
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
                  {navItems.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full text-left flex items-center gap-2 rounded-lg px-4 py-2 ${
                          activeTab === item.id
                            ? 'bg-pink-50 text-pink-600'
                            : 'hover:bg-gray-50 text-slate-700'
                        }`}
                      >
                        {item.icon}
                        {item.id === 'profile' && 'Profile'}
                        {item.id === 'cart' && 'My Cart'}
                        {item.id === 'orders' && 'My Orders'}
                        {item.id === 'addresses' && 'Addresses'}
                        {item.id === 'change-password' && 'Change Password'}
                        {item.id === 'sizes' && 'My Sizes'}
                        {item.id === 'wishlist' && 'My Wishlist'}
                      </button>
                    </li>
                  ))}
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
                  {activeTab === 'change-password' && 'Change Password'}
                  {activeTab === 'sizes' && 'My Sizes'}
                  {activeTab === 'wishlist' && 'My Wishlist'}
                </h1>
                <p className="text-slate-700">
                  {activeTab === 'profile' && 'Manage and protect your account'}
                  {activeTab === 'cart' && 'View items in your cart'}
                  {activeTab === 'orders' && 'View your order history'}
                  {activeTab === 'addresses' && 'Manage your shipping address'}
                  {activeTab === 'change-password' && 'Update your password'}
                  {activeTab === 'sizes' && 'Manage your dress measurements'}
                  {activeTab === 'wishlist' && 'View your saved items'}
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
                      <div>
                        <label className="block text-sm text-slate-700 mb-1">
                          Country
                        </label>
                        <select
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          value={addressForm.country}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              country: e.target.value,
                            })
                          }
                        >
                          <option value="Philippines">Philippines</option>
                          <option value="United States">United States</option>
                          <option value="Canada">Canada</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Australia">Australia</option>
                        </select>
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

              {/* Change Password Section */}
              {activeTab === 'change-password' && (
                <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
                  {codeVerified && resetCode && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-5 h-5 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <p className="text-sm text-green-800">
                          Reset code verified! Enter your new password below.
                        </p>
                      </div>
                    </div>
                  )}
                  <form
                    onSubmit={handlePasswordChange}
                    className="space-y-6 max-w-md"
                  >
                    {!codeVerified && (
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
                          required={!codeVerified}
                        />
                      </div>
                    )}
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
                                    item.price * item.quantity,
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

              {/* Sizes Section */}
              {activeTab === 'sizes' && (
                <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-slate-900">
                      My Measurements
                    </h2>
                    <button
                      onClick={() => setShowSizeModal(true)}
                      className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors text-sm font-medium"
                    >
                      {measurements ? 'Edit Measurements' : 'Add Measurements'}
                    </button>
                  </div>

                  {loadingMeasurements ? (
                    <div className="text-center py-8">
                      Loading measurements...
                    </div>
                  ) : measurements ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
                        <label className="text-sm font-medium text-slate-700">
                          Bust
                        </label>
                        <p className="text-lg font-semibold text-slate-900">
                          {measurements.bust
                            ? `${measurements.bust}"`
                            : 'Not set'}
                        </p>
                      </div>
                      <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
                        <label className="text-sm font-medium text-slate-700">
                          Waist
                        </label>
                        <p className="text-lg font-semibold text-slate-900">
                          {measurements.waist
                            ? `${measurements.waist}"`
                            : 'Not set'}
                        </p>
                      </div>
                      <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
                        <label className="text-sm font-medium text-slate-700">
                          Hips
                        </label>
                        <p className="text-lg font-semibold text-slate-900">
                          {measurements.hips
                            ? `${measurements.hips}"`
                            : 'Not set'}
                        </p>
                      </div>
                      <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
                        <label className="text-sm font-medium text-slate-700">
                          Hollow to Hem
                        </label>
                        <p className="text-lg font-semibold text-slate-900">
                          {measurements.hollow_to_hem
                            ? `${measurements.hollow_to_hem}"`
                            : 'Not set'}
                        </p>
                      </div>
                      <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
                        <label className="text-sm font-medium text-slate-700">
                          Height
                        </label>
                        <p className="text-lg font-semibold text-slate-900">
                          {measurements.height
                            ? `${measurements.height}"`
                            : 'Not set'}
                        </p>
                      </div>
                      {measurements.notes && (
                        <div className="md:col-span-2 bg-pink-50 rounded-lg p-4 border border-pink-200">
                          <label className="text-sm font-medium text-slate-700">
                            Notes
                          </label>
                          <p className="text-slate-900 mt-1">
                            {measurements.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                      <p className="text-slate-700 mb-4">
                        No measurements saved yet.
                      </p>
                      <button
                        onClick={() => setShowSizeModal(true)}
                        className="px-6 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
                      >
                        Add Measurements
                      </button>
                    </div>
                  )}

                  <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> Your saved measurements will
                      automatically appear when you click "Customize Size" on
                      any dress product page. You can update them anytime from
                      this page.
                    </p>
                  </div>
                </div>
              )}

              {/* Wishlist Section */}
              {activeTab === 'wishlist' && (
                <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
                  {wishlistItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[180px]">
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">
                        Your wishlist is empty
                      </h3>
                      <p className="text-slate-700 mb-4">
                        Save items for later by clicking the heart icon on products.
                      </p>
                      <Link
                        to="/shop"
                        className="px-6 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
                      >
                        Browse Products
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {wishlistItems.map((item) => (
                        <div
                          key={item.id}
                          className="group relative overflow-hidden rounded-lg border border-candy-lavender bg-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl"
                        >
                          <div className="aspect-3/4 overflow-hidden bg-gray-200 relative">
                            <img
                              src={getImageUrl(item.product.image)}
                              alt={item.product.name}
                              className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-110"
                            />
                            {/* Remove from wishlist button */}
                            <button
                              onClick={() => removeFromWishlist(item.product.id)}
                              className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-red-50 transition-colors"
                              aria-label="Remove from wishlist"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-5 h-5 text-red-500"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                          <div className="p-4">
                            <h3 className="text-lg font-medium text-slate-900 mb-2">
                              <Link
                                to={`/product/${item.product.id}`}
                                className="hover:text-pink-500 transition-colors"
                              >
                                {item.product.name}
                              </Link>
                            </h3>
                            <p className="text-sm text-slate-500">
                              ₱{Number(item.product.price).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Orders Section */}
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
                    {loadingOrders ? (
                      <div className="text-center py-8">Loading orders...</div>
                    ) : orders.length === 0 ? (
                      <div className="flex flex-col items-center justify-center min-h-[180px]">
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">
                          No orders yet
                        </h3>
                        <p className="text-slate-700 mb-4">
                          You haven't placed any orders yet. Start shopping to
                          see your orders here.
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
                                    order.created_at,
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                              <span
                                className={`self-start rounded-full px-3 py-1 text-sm font-medium ${resolveStatusBadge(
                                  order.status,
                                )}`}
                              >
                                {formatStatusLabel(order.status)}
                              </span>
                            </div>
                            {/* Order Items would go here if available in the order object, or fetched separately */}
                            <div className="border-t pt-2 mt-2">
                              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div className="text-sm text-slate-700">
                                  <span>
                                    <strong>Total:</strong> ₱
                                    {Number(order.total_price).toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex flex-col gap-2 sm:flex-row">
                                  <button
                                    onClick={() => {
                                      setSelectedOrderId(order.id);
                                      setShowOrderModal(true);
                                    }}
                                    className="px-4 py-2 bg-pink-500 text-white border border-pink-500 rounded-lg text-sm font-medium hover:bg-pink-600 transition-colors"
                                  >
                                    View Details
                                  </button>
                                  {(order.status === 'pending' ||
                                    order.status === 'confirmed') && (
                                    <button
                                      onClick={() =>
                                        handleCancelOrder(order.id)
                                      }
                                      className="px-4 py-2 bg-red-500 text-white border border-red-500 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                                    >
                                      Cancel Order
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Order Status Timeline - Outside orders column */}
                  {orders.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">
                        Order Status Timeline
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 pb-3 border-b border-gray-100">
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium shrink-0 w-20 text-center">
                            Pending
                          </span>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-900">
                              0-3 days
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Payment verification • Measurement confirmation
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 pb-3 border-b border-gray-100">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium shrink-0 w-20 text-center">
                            Confirmed
                          </span>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-900">
                              3-7 days
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Pattern planning • Material sourcing
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 pb-3 border-b border-gray-100">
                          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium shrink-0 w-20 text-center">
                            In Production
                          </span>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-900">
                              4-8 weeks
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Fabric cut • Dress construction • Core tailoring
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 pb-3 border-b border-gray-100">
                          <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium shrink-0 w-20 text-center">
                            Fitting
                          </span>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-900">
                              1-2 weeks
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              First fitting • Minor alterations • Adjustments
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 pb-3 border-b border-gray-100">
                          <span className="px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-xs font-medium shrink-0 w-20 text-center">
                            Ready
                          </span>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-900">
                              3-7 days
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Quality check • Packaging • Pickup scheduling
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 pb-3 border-b border-gray-100">
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium shrink-0 w-20 text-center">
                            Delivered
                          </span>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-900">
                              Final
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Dress handed over • 48-72hr defect claim window
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium shrink-0 w-20 text-center">
                            Cancelled
                          </span>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-900">
                              Immediate
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Order stopped • Refund processed
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Size Customization Modal */}
      <SizeCustomizationModal
        isOpen={showSizeModal}
        onClose={() => {
          setShowSizeModal(false);
          fetchMeasurements();
        }}
        onSave={(newMeasurements) => {
          setMeasurements(newMeasurements);
          fetchMeasurements();
        }}
        savedMeasurements={measurements}
      />

      {/* Order Details Modal */}
      <OrderDetailsModal
        isOpen={showOrderModal}
        onClose={() => {
          setShowOrderModal(false);
          setSelectedOrderId(null);
        }}
        orderId={selectedOrderId}
      />
    </div>
  );
}
