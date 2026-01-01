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

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await adminApi.get(`/orders/${id}`);
      setOrder(response.data);
      setStatus(response.data.status);
      setPaymentStatus(response.data.payment_status);
    } catch (error) {
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
      });
      toast.success('Order status updated successfully');
      fetchOrder();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const getImageUrl = (imageName) => {
    if (!imageName) return '/img/p-1.webp';
    if (imageName.startsWith('http') || imageName.startsWith('data:')) {
      return imageName;
    }
    if (imageName.startsWith('products/')) {
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

  if (!order) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-slate-500">Order not found</p>
        </div>
      </AdminLayout>
    );
  }

  const shippingAddress = typeof order.shipping_address === 'string' 
    ? JSON.parse(order.shipping_address) 
    : order.shipping_address;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900 mb-2">Order #{order.id}</h1>
            <p className="text-slate-600">Customer ID: {order.user_id}</p>
          </div>
          <button
            onClick={() => navigate('/admin/orders')}
            className="px-4 py-2 border border-gray-300 rounded-lg text-slate-700 hover:bg-gray-50"
          >
            Back to Orders
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0">
                    <img
                      src={getImageUrl(item.product?.image)}
                      alt={item.product?.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">{item.product?.name || 'Unknown Product'}</h3>
                      <p className="text-sm text-slate-600">Size: {item.size || 'N/A'}</p>
                      <p className="text-sm text-slate-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">₱{Number(item.price * item.quantity).toLocaleString()}</p>
                      <p className="text-sm text-slate-500">₱{Number(item.price).toLocaleString()} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Customer Details</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-slate-700 mb-2">Billing Details</h3>
                  <div className="text-sm text-slate-600 space-y-1">
                    <p><strong>Name:</strong> {shippingAddress?.firstName} {shippingAddress?.lastName}</p>
                    <p><strong>Email:</strong> {shippingAddress?.email}</p>
                    <p><strong>Address:</strong> {shippingAddress?.address}</p>
                    <p><strong>City:</strong> {shippingAddress?.city}, {shippingAddress?.zip}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-slate-700 mb-2">Shipping Details</h3>
                  <div className="text-sm text-slate-600 space-y-1">
                    <p><strong>Name:</strong> {shippingAddress?.firstName} {shippingAddress?.lastName}</p>
                    <p><strong>Email:</strong> {shippingAddress?.email}</p>
                    <p><strong>Address:</strong> {shippingAddress?.address}</p>
                    <p><strong>City:</strong> {shippingAddress?.city}, {shippingAddress?.zip}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-semibold">₱{Number(order.total_price).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Shipping</span>
                  <span className="font-semibold">₱0.00</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-900">Total</span>
                    <span className="font-semibold text-lg text-slate-900">₱{Number(order.total_price).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Update Status</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Order Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="in_production">In Production</option>
                    <option value="fitting">Fitting / Alteration</option>
                    <option value="ready_for_delivery">Ready for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="refunded">Refunded</option>
                    <option value="rejected">Rejected / Disputed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Payment Status</label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
                <button
                  onClick={handleStatusUpdate}
                  className="w-full bg-pink-500 text-white py-2 rounded-lg font-semibold hover:bg-pink-600 transition-colors"
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

