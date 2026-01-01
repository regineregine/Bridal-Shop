import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../layout/AdminLayout';
import adminApi from '../services/api';
import toast from 'react-hot-toast';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await adminApi.get('/orders');
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const formatStatusLabel = (status) => {
    const statusMap = {
      'pending': 'Pending',
      'confirmed': 'Confirmed',
      'in_production': 'In Production',
      'fitting': 'Fitting / Alteration',
      'ready_for_delivery': 'Ready for Delivery',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled',
      'refunded': 'Refunded',
      'rejected': 'Rejected / Disputed',
    };
    return statusMap[status?.toLowerCase()] || status;
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'in_production': 'bg-purple-100 text-purple-800',
      'fitting': 'bg-indigo-100 text-indigo-800',
      'ready_for_delivery': 'bg-cyan-100 text-cyan-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
      'refunded': 'bg-orange-100 text-orange-800',
      'rejected': 'bg-red-200 text-red-900',
    };
    return statusMap[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusBadge = (status) => {
    const statusMap = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'paid': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
      'failed': 'bg-red-100 text-red-800',
    };
    return statusMap[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 mb-2">Orders</h1>
          <p className="text-slate-600">Manage and track all orders</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">Order</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">Customer</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">Total</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">Payment Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">Order Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map((order) => {
                    const shippingAddress = typeof order.shipping_address === 'string' 
                      ? JSON.parse(order.shipping_address) 
                      : order.shipping_address;
                    
                    return (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <Link to={`/admin/orders/${order.id}`} className="text-blue-600 hover:text-blue-700 font-medium">
                            #{order.id}
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-slate-900">{order.user?.name || 'N/A'}</p>
                            <p className="text-sm text-slate-500">{order.user?.email || ''}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-900">
                          ₱{Number(order.total_price).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusBadge(order.payment_status)}`}>
                            {order.payment_status?.charAt(0).toUpperCase() + order.payment_status?.slice(1) || 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}>
                            {formatStatusLabel(order.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <Link
                            to={`/admin/orders/${order.id}`}
                            className="text-pink-600 hover:text-pink-700 font-medium"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

