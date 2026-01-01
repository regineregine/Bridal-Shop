import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AdminLayout from '../layout/AdminLayout';
import adminApi from '../services/api';
import toast from 'react-hot-toast';

export default function AdminCustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  const fetchCustomer = async () => {
    try {
      const response = await adminApi.get(`/customers/${id}`);
      setCustomer(response.data);
    } catch (error) {
      toast.error('Failed to fetch customer details');
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imageName) => {
    if (!imageName) return '/img/p-1.webp';
    if (imageName.startsWith('http') || imageName.startsWith('data:')) {
      return imageName;
    }
    if (imageName.startsWith('profile-uploads/')) {
      return `http://localhost:8000/storage/${imageName}`;
    }
    return `/img/${imageName}`;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!customer) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-slate-500">Customer not found</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900 mb-2">{customer.name}</h1>
            <p className="text-slate-600">Customer ID: {customer.id}</p>
          </div>
          <button
            onClick={() => navigate('/admin/customers')}
            className="px-4 py-2 border border-gray-300 rounded-lg text-slate-700 hover:bg-gray-50"
          >
            Back to Customers
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Customer Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-500">Email</label>
                  <p className="text-slate-900">{customer.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-500">Phone Number</label>
                  <p className="text-slate-900">{customer.contact_number || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-500">Address</label>
                  <p className="text-slate-900">
                    {customer.address ? `${customer.address}, ${customer.city}, ${customer.zip}` : 'Not provided'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-500">Gender</label>
                  <p className="text-slate-900">{customer.gender || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-500">Date of Birth</label>
                  <p className="text-slate-900">{customer.date_of_birth || 'Not provided'}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Orders ({customer.orders?.length || 0})</h2>
              <div className="space-y-4">
                {customer.orders && customer.orders.length > 0 ? (
                  customer.orders.map((order) => {
                    const shippingAddress = typeof order.shipping_address === 'string' 
                      ? JSON.parse(order.shipping_address) 
                      : order.shipping_address;
                    
                    return (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Link
                            to={`/admin/orders/${order.id}`}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Order #{order.id}
                          </Link>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600">
                          {new Date(order.created_at).toLocaleDateString()} - ₱{Number(order.total_price).toLocaleString()}
                        </p>
                        <p className="text-sm text-slate-500 mt-1">
                          {order.items?.length || 0} item(s)
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-slate-500 text-center py-8">No orders found</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col items-center text-center mb-4">
                <img
                  src={getImageUrl(customer.profile_img)}
                  alt={customer.name}
                  className="w-24 h-24 rounded-full object-cover mb-4"
                />
                <h3 className="text-lg font-semibold text-slate-900">{customer.name}</h3>
                <p className="text-sm text-slate-500">Joined {new Date(customer.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Orders</span>
                    <span className="font-semibold">{customer.orders?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Spent</span>
                  <span className="font-semibold">
                    ₱{Number(customer.total_spent || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

