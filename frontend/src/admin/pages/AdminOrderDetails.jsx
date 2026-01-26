import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../layout/AdminLayout';
import adminApi from '../services/api';
import toast from 'react-hot-toast';

export default function AdminOrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');

  useEffect(() => {
    fetchOrder();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchOrder = async () => {
    try {
      const response = await adminApi.get(`/orders/${id}`);
      setOrder(response.data);
      setStatus(response.data.status);
      setPaymentStatus(response.data.payment_status);
      setExpectedDeliveryDate(response.data.expected_delivery_date || '');
    } catch {
      toast.error('Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      await adminApi.put(`/orders/${id}/status`, {
        status,
        payment_status: paymentStatus,
        expected_delivery_date: expectedDeliveryDate || null,
      });
      toast.success('Order status updated successfully');
      fetchOrder();
    } catch {
      toast.error('Failed to update order status');
    }
  };

  const getImageUrl = (imageName) => {
    if (!imageName) return '/img/p-1.webp';
    if (imageName.startsWith('http') || imageName.startsWith('data:')) {
      return imageName;
    }
    if (imageName.startsWith('products/')) {
      return `/storage/${imageName}`;
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

  if (!order) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-slate-500">Order not found</p>
        </div>
      </AdminLayout>
    );
  }

  const shippingAddress =
    typeof order.shipping_address === 'string'
      ? JSON.parse(order.shipping_address)
      : order.shipping_address;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-1 sm:mb-2">
              Order #{order.id}
            </h1>
            <p className="text-slate-600 text-sm sm:text-base">
              Customer ID: {order.user_id}
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/orders')}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-slate-700 hover:bg-gray-50 min-h-11"
          >
            Back to Orders
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          <div className="lg:col-span-2 space-y-4 lg:space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-4">
                Order Items
              </h2>
              <div className="space-y-4">
                {order.items?.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-center gap-4 pb-4 border-b border-gray-100 last:border-0"
                  >
                    <img
                      src={getImageUrl(item.product?.image)}
                      alt={item.product?.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 truncate">
                        {item.product?.name || 'Unknown Product'}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {item.size === 'Custom' ? (
                          <span>
                            Size:{' '}
                            <span className="font-medium text-pink-600">
                              Custom
                              {order.user && (
                                <span className="text-slate-500">
                                  {order.user.bust && ` (Bust: ${order.user.bust}"`}
                                  {order.user.waist && `, Waist: ${order.user.waist}"`}
                                  {order.user.hips && `, Hips: ${order.user.hips}"`}
                                  {order.user.height && `, Height: ${order.user.height}"`}
                                  {order.user.bust && ')'} {/* Close parenthesis */}
                                </span>
                              )}
                            </span>
                          </span>
                        ) : (
                          `Size: ${item.size || 'N/A'}`
                        )}
                      </p>
                      <p className="text-sm text-slate-600">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="sm:text-right">
                      <p className="font-semibold text-slate-900">
                        ₱{Number(item.price * item.quantity).toLocaleString()}
                      </p>
                      <p className="text-sm text-slate-500">
                        ₱{Number(item.price).toLocaleString()} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-4">
                Customer Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <h3 className="font-medium text-slate-700 mb-2">
                    Billing Details
                  </h3>
                  <div className="text-sm text-slate-600 space-y-1">
                    <p>
                      <strong>Name:</strong> {shippingAddress?.firstName}{' '}
                      {shippingAddress?.lastName}
                    </p>
                    <p>
                      <strong>Email:</strong> {shippingAddress?.email}
                    </p>
                    <p>
                      <strong>Address:</strong> {shippingAddress?.address}
                    </p>
                    <p>
                      <strong>City:</strong> {shippingAddress?.city},{' '}
                      {shippingAddress?.zip}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-slate-700 mb-2">
                    Shipping Details
                  </h3>
                  <div className="text-sm text-slate-600 space-y-1">
                    <p>
                      <strong>Name:</strong> {shippingAddress?.firstName}{' '}
                      {shippingAddress?.lastName}
                    </p>
                    <p>
                      <strong>Email:</strong> {shippingAddress?.email}
                    </p>
                    <p>
                      <strong>Address:</strong> {shippingAddress?.address}
                    </p>
                    <p>
                      <strong>City:</strong> {shippingAddress?.city},{' '}
                      {shippingAddress?.zip}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 lg:space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-4">
                Order Summary
              </h2>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-semibold">
                    ₱{Number(order.total_price).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Shipping</span>
                  <span className="font-semibold">₱0.00</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-900">Total</span>
                    <span className="font-semibold text-lg text-slate-900">
                      ₱{Number(order.total_price).toLocaleString()}
                    </span>
                  </div>
                </div>
                {order.expected_delivery_date && (
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-medium text-slate-900">Expected Delivery</span>
                        <div className="text-sm text-slate-600 mt-1">
                          {(() => {
                            const today = new Date();
                            const expectedDate = new Date(order.expected_delivery_date);
                            const diffTime = expectedDate - today;
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                            if (diffDays < 0) return 'Overdue';
                            if (diffDays === 0) return 'Expected today';
                            if (diffDays === 1) return 'Expected tomorrow';
                            if (diffDays < 7) return `Expected in ${diffDays} days`;
                            if (diffDays < 30) return `Expected in ${Math.ceil(diffDays / 7)} weeks`;
                            return `Expected in ${Math.ceil(diffDays / 30)} months`;
                          })()}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-lg text-pink-600">
                          {new Date(order.expected_delivery_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-4">
                Update Status
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Order Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 min-h-11"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="in_production">In Production</option>
                    <option value="fitting">Fitting / Alteration</option>
                    <option value="ready_for_delivery">
                      Ready for Delivery
                    </option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="refunded">Refunded</option>
                    <option value="rejected">Rejected / Disputed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Payment Status
                  </label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 min-h-11"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Expected Delivery Date
                  </label>
                  <input
                    type="date"
                    value={expectedDeliveryDate}
                    onChange={(e) => setExpectedDeliveryDate(e.target.value)}
                    min={new Date(Date.now() + 86400000).toISOString().split('T')[0]} // Tomorrow
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 min-h-11"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Optional: Set when the order is expected to be delivered
                  </p>
                </div>
                <button
                  onClick={handleStatusUpdate}
                  className="w-full bg-pink-500 text-white py-2 rounded-lg font-semibold hover:bg-pink-600 transition-colors min-h-11"
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
