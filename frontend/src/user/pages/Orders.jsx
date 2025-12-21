import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Orders() {
  const { isLoggedIn, user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoggedIn) {
      api.get('/orders')
        .then(response => {
          setOrders(response.data);
        })
        .catch(error => {
          console.error("Error fetching orders:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [isLoggedIn]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      
      <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-Tinos text-4xl text-slate-900">My Orders</h1>
          <Link to="/profile" className="text-pink-600 hover:text-pink-700 font-medium">&larr; Back to Profile</Link>
        </div>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-[0_4px_20px_rgba(210,199,229,0.1)] border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <p className="text-sm text-slate-500">Order Placed</p>
                  <p className="font-medium text-slate-900">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Order Number</p>
                  <p className="font-medium text-slate-900">#{order.id}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total Amount</p>
                  <p className="font-medium text-slate-900">₱{Number(order.total_price).toLocaleString()}</p>
                </div>
                <div className="sm:text-right">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <ul className="divide-y divide-gray-100">
                  {order.items.map((item, index) => (
                    <li key={index} className="py-4 first:pt-0 last:pb-0 flex justify-between">
                      <div>
                        <p className="font-medium text-slate-900">{item.product?.name || 'Unknown Product'}</p>
                        <p className="text-sm text-slate-500">Qty: {item.quantity} {item.size ? `| Size: ${item.size}` : ''}</p>
                      </div>
                      <p className="font-medium text-slate-900">₱{Number(item.price).toLocaleString()}</p>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 text-right">
                <button className="text-sm font-medium text-pink-600 hover:text-pink-700">View Invoice</button>
              </div>
            </div>
          ))}

          {orders.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-slate-500 mb-4">You haven't placed any orders yet.</p>
              <Link to="/shop" className="inline-block rounded-full bg-pink-500 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-pink-600">
                Start Shopping
              </Link>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
