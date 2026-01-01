import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../layout/AdminLayout';
import adminApi from '../services/api';
import toast from 'react-hot-toast';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await adminApi.get('/customers');
      setCustomers(response.data);
    } catch (error) {
      toast.error('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  const getTotalSpent = (customer) => {
    // Use total_spent from backend (only includes paid orders in production or later)
    const total = customer.total_spent || 0;
    return `₱${Number(total).toLocaleString()}`;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 mb-2">Customers</h1>
          <p className="text-slate-600">Manage your customer database</p>
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
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">Customer</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">Orders</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">Total Spent</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {customers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                            <span className="text-pink-600 font-semibold">
                              {customer.name?.charAt(0).toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{customer.name}</p>
                            <p className="text-sm text-slate-500">{customer.contact_number || 'No phone'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <a href={`mailto:${customer.email}`} className="text-blue-600 hover:text-blue-700">
                          {customer.email}
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          {customer.orders_count || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        {getTotalSpent(customer)}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          to={`/admin/customers/${customer.id}`}
                          className="text-pink-600 hover:text-pink-700 font-medium"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

