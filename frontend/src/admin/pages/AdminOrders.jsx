import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../layout/AdminLayout';
import adminApi from '../services/api';
import toast from 'react-hot-toast';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus, sortOrder]);

  const fetchOrders = async () => {
    try {
      const params = {
        ...(selectedStatus !== 'all' && { status: selectedStatus }),
        sort: sortOrder
      };
      const response = await adminApi.get('/orders', { params });
      setOrders(response.data);
    } catch {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const formatStatusLabel = (status) => {
    const statusMap = {
      pending: 'Pending',
      confirmed: 'Confirmed',
      in_production: 'In Production',
      fitting: 'Fitting / Alteration',
      ready_for_delivery: 'Ready for Delivery',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
      refunded: 'Refunded',
      rejected: 'Rejected / Disputed',
    };
    return statusMap[status?.toLowerCase()] || status;
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      in_production: 'bg-purple-100 text-purple-800',
      fitting: 'bg-indigo-100 text-indigo-800',
      ready_for_delivery: 'bg-cyan-100 text-cyan-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      refunded: 'bg-orange-100 text-orange-800',
      rejected: 'bg-red-200 text-red-900',
    };
    return statusMap[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusBadge = (status) => {
    const statusMap = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      failed: 'bg-red-100 text-red-800',
    };
    return statusMap[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  // Mobile card component
  const OrderCard = ({ order }) => (
    <Link
      to={`/admin/orders/${order.id}`}
      className="block bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="text-blue-600 font-semibold">#{order.id}</span>
          <p className="text-sm text-slate-600 mt-0.5">
            {new Date(order.created_at).toLocaleDateString()}
          </p>
        </div>
        <span className="font-semibold text-slate-900">
          ₱{Number(order.total_price).toLocaleString()}
        </span>
      </div>
      <div className="mb-3">
        <p className="font-medium text-slate-900">
          {order.user?.name || 'N/A'}
        </p>
        <p className="text-sm text-slate-500">{order.user?.email || ''}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusBadge(
            order.payment_status,
          )}`}
        >
          {order.payment_status?.charAt(0).toUpperCase() +
            order.payment_status?.slice(1) || 'Pending'}
        </span>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
            order.status,
          )}`}
        >
          {formatStatusLabel(order.status)}
        </span>
      </div>
      {order.expected_delivery_date && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500">Expected Delivery:</span>
            <div className="text-right">
              <div className="font-medium text-slate-900">
                {new Date(order.expected_delivery_date).toLocaleDateString()}
              </div>
              <div className="text-slate-500 text-xs">
                {(() => {
                  const today = new Date();
                  const expectedDate = new Date(order.expected_delivery_date);
                  const diffTime = expectedDate - today;
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                  if (diffDays < 0) return 'Overdue';
                  if (diffDays === 0) return 'Today';
                  if (diffDays === 1) return 'Tomorrow';
                  if (diffDays < 7) return `${diffDays} days`;
                  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks`;
                  return `${Math.ceil(diffDays / 30)} months`;
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </Link>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-1 sm:mb-2">
            Orders
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Manage and track all orders
          </p>
        </div>

        {/* Filters and Sorting */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">Filter & Sort Orders</h3>
              <p className="text-sm text-slate-600">Filter by status and sort by date to manage your workflow</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* Status Filter Dropdown */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-slate-700 mb-2">Filter by Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 min-h-11"
                >
                  <option value="all">All Orders</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="in_production">In Production</option>
                  <option value="fitting">Fitting</option>
                  <option value="ready_for_delivery">Ready for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="refunded">Refunded</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Sort Order */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-slate-700 mb-2">Sort by Date</label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 min-h-11"
                >
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
          </div>
        ) : (
          <>
            {/* Orders Count */}
            <div className="flex items-center justify-between">
              <p className="text-slate-600 text-sm">
                Showing {orders.length} order{orders.length !== 1 ? 's' : ''}
                {selectedStatus !== 'all' && (
                  <span className="font-medium text-pink-600 ml-1">
                    with status: {selectedStatus.replace('_', ' ')}
                  </span>
                )}
                <span className="ml-2 text-slate-500">
                  ({sortOrder === 'desc' ? 'newest' : 'oldest'} first)
                </span>
              </p>
            </div>

            {/* Mobile: Card layout */}
            <div className="lg:hidden space-y-4">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
              {orders.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                  No orders found
                </div>
              )}
            </div>

            {/* Desktop: Table layout */}
            <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">
                        Order
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">
                        Customer
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">
                        Total
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">
                        Payment Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">
                        Order Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">
                        Expected Delivery
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <Link
                            to={`/admin/orders/${order.id}`}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                          >
                            #{order.id}
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-slate-900">
                              {order.user?.name || 'N/A'}
                            </p>
                            <p className="text-sm text-slate-500">
                              {order.user?.email || ''}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-900">
                          ₱{Number(order.total_price).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusBadge(
                              order.payment_status,
                            )}`}
                          >
                            {order.payment_status?.charAt(0).toUpperCase() +
                              order.payment_status?.slice(1) || 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                              order.status,
                            )}`}
                          >
                            {formatStatusLabel(order.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          {order.expected_delivery_date ? (
                            <div className="text-sm">
                              <div className="font-medium text-slate-900">
                                {new Date(order.expected_delivery_date).toLocaleDateString()}
                              </div>
                              <div className="text-slate-500 text-xs">
                                {(() => {
                                  const today = new Date();
                                  const expectedDate = new Date(order.expected_delivery_date);
                                  const diffTime = expectedDate - today;
                                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                                  if (diffDays < 0) return 'Overdue';
                                  if (diffDays === 0) return 'Today';
                                  if (diffDays === 1) return 'Tomorrow';
                                  if (diffDays < 7) return `${diffDays} days`;
                                  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks`;
                                  return `${Math.ceil(diffDays / 30)} months`;
                                })()}
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-sm">-</span>
                          )}
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
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
