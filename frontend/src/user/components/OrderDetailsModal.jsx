import React, { useState, useEffect } from 'react';
import api from '../services/api';

// Calculate expected delivery date based on remaining time for current status
const calculateExpectedDeliveryDate = (status, createdAt) => {
  // For completed/cancelled orders, don't show expected delivery
  if (['delivered', 'cancelled', 'refunded', 'rejected'].includes(status?.toLowerCase())) {
    return null;
  }

  const orderDate = new Date(createdAt);
  const now = new Date();
  let weeksRemaining = 0;

  // Calculate remaining time based on current status
  // More realistic timeline: Ready for Delivery should be delivered within days, not weeks
  switch (status?.toLowerCase()) {
    case 'pending':
      weeksRemaining = 12; // Full 12 weeks remaining
      break;
    case 'confirmed':
      weeksRemaining = 10; // 2 weeks processing time passed, 10 remaining
      break;
    case 'in_production':
      weeksRemaining = 6; // 6 weeks processing time passed, 6 remaining
      break;
    case 'fitting':
      weeksRemaining = 2; // 10 weeks processing time passed, 2 remaining
      break;
    case 'ready_for_delivery':
      weeksRemaining = 0.43; // ~3 days remaining (shipping/pickup time)
      break;
    default:
      weeksRemaining = 12; // Default to 12 weeks
  }

  // Calculate expected date from now, not from order date
  const expectedDate = new Date(now);
  expectedDate.setDate(now.getDate() + (weeksRemaining * 7));

  return expectedDate;
};

// Format date for display
const formatExpectedDelivery = (date) => {
  if (!date) return null;

  const today = new Date();
  const diffTime = date - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return 'Overdue';
  } else if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Tomorrow';
  } else if (diffDays < 7) {
    return `In ${diffDays} days`;
  } else if (diffDays < 30) {
    const weeks = Math.ceil(diffDays / 7);
    return `In ${weeks} week${weeks > 1 ? 's' : ''}`;
  } else {
    const months = Math.ceil(diffDays / 30);
    return `In ${months} month${months > 1 ? 's' : ''}`;
  }
};

export default function OrderDetailsModal({ isOpen, onClose, orderId }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && orderId) {
      fetchOrderDetails();
    }
  }, [isOpen, orderId]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/orders/${orderId}`);
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
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

  if (!isOpen) return null;

  const shippingAddress = order?.shipping_address
    ? typeof order.shipping_address === 'string'
      ? JSON.parse(order.shipping_address)
      : order.shipping_address
    : null;

  return (
    <div
      className="modal-panel is-open"
      aria-hidden="true"
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="modal-surface max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="modal-header">
          <div>
            <h2 className="headline text-white">Order Details</h2>
            <p className="text-xs text-white/80 mt-2">Order #{orderId}</p>
          </div>
          <button className="close-btn" aria-label="Close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body flex-1 overflow-y-auto">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
              <p className="mt-4 text-slate-600">Loading order details...</p>
            </div>
          ) : order ? (
            <div className="space-y-6">
              {/* Order Header */}
              <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Order Date</p>
                    <p className="font-semibold text-slate-900">
                      {new Date(order.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Status</p>
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${resolveStatusBadge(
                        order.status
                      )}`}
                    >
                      {formatStatusLabel(order.status)}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">
                      Payment Status
                    </p>
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                        order.payment_status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {order.payment_status.charAt(0).toUpperCase() +
                        order.payment_status.slice(1)}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Total Amount</p>
                    <p className="font-semibold text-slate-900 text-lg">
                      ₱{Number(order.total_price).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Expected Delivery Date */}
                {(() => {
                  const expectedDate = calculateExpectedDeliveryDate(order.status, order.created_at);
                  const deliveryText = formatExpectedDelivery(expectedDate);
                  return deliveryText ? (
                    <div className="mt-4 pt-4 border-t border-pink-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Expected Delivery</p>
                          <p className="font-semibold text-pink-600 text-sm">
                            {deliveryText}
                          </p>
                        </div>
                        {expectedDate && (
                          <div className="text-right">
                            <p className="text-xs text-slate-500 mb-1">Delivery Date</p>
                            <p className="font-medium text-slate-900 text-sm">
                              {expectedDate.toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>

              {/* Shipping Address */}
              {shippingAddress && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-slate-900 mb-3">
                    Shipping Address
                  </h3>
                  <div className="text-sm text-slate-700 space-y-1">
                    <p>
                      <strong>
                        {shippingAddress.firstName} {shippingAddress.lastName}
                      </strong>
                    </p>
                    <p>{shippingAddress.email}</p>
                    <p>{shippingAddress.address}</p>
                    <p>
                      {shippingAddress.city}, {shippingAddress.zip}
                    </p>
                    <p>{shippingAddress.country}</p>
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-slate-900 mb-4">
                  Order Items
                </h3>
                <div className="space-y-4">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                      >
                        <img
                          src={getImageUrl(item.product?.image)}
                          alt={item.product?.name || 'Product'}
                          className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900 mb-1">
                            {item.product?.name || 'Unknown Product'}
                          </h4>
                          <p className="text-sm text-slate-600 mb-1">
                            {item.product?.material && (
                              <span className="text-pink-600">
                                {item.product.material}
                              </span>
                            )}
                          </p>
                          <div className="flex gap-4 text-sm text-slate-600">
                            <span>Quantity: {item.quantity}</span>
                            {item.size && <span>Size: {item.size}</span>}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-slate-900">
                            ₱
                            {Number(
                              item.price * item.quantity
                            ).toLocaleString()}
                          </p>
                          <p className="text-sm text-slate-500">
                            ₱{Number(item.price).toLocaleString()} each
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 text-center py-4">
                      No items found
                    </p>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-700">Subtotal</span>
                    <span className="font-semibold text-slate-900">
                      ₱{Number(order.total_price).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-700">Shipping</span>
                    <span className="font-semibold text-slate-900">₱0.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-700">Tax</span>
                    <span className="font-semibold text-slate-900">₱0.00</span>
                  </div>
                  <div className="border-t border-pink-200 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="font-semibold text-slate-900">
                        Total
                      </span>
                      <span className="font-semibold text-lg text-slate-900">
                        ₱{Number(order.total_price).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-500">Unable to load order details</p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn-primary w-full"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
