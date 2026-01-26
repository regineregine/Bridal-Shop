import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../layout/AdminLayout';
import adminApi from '../services/api';
import toast from 'react-hot-toast';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [archivedCustomers, setArchivedCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showArchived, setShowArchived] = useState(false);
  const [loadingArchive, setLoadingArchive] = useState({});

  useEffect(() => {
    fetchCustomers();
    fetchArchivedCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await adminApi.get('/customers');
      setCustomers(response.data);
    } catch {
      toast.error('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  const fetchArchivedCustomers = async () => {
    try {
      const response = await adminApi.get('/customers?archived=true');
      setArchivedCustomers(response.data);
    } catch (error) {
      console.error('Failed to fetch archived customers:', error);
    }
  };

  const handleArchive = async (customerId) => {
    if (
      !window.confirm(
        'Are you sure you want to archive this customer? They will be moved to archived customers.',
      )
    ) {
      return;
    }

    setLoadingArchive((prev) => ({ ...prev, [customerId]: true }));
    try {
      await adminApi.post(`/customers/${customerId}/archive`);
      toast.success('Customer archived successfully');
      await fetchCustomers();
      await fetchArchivedCustomers();
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to archive customer',
      );
    } finally {
      setLoadingArchive((prev) => ({ ...prev, [customerId]: false }));
    }
  };

  const handleUnarchive = async (customerId) => {
    if (
      !window.confirm(
        'Are you sure you want to unarchive this customer? They will be moved back to active customers.',
      )
    ) {
      return;
    }

    setLoadingArchive((prev) => ({ ...prev, [customerId]: true }));
    try {
      await adminApi.post(`/customers/${customerId}/unarchive`);
      toast.success('Customer unarchived successfully');
      await fetchCustomers();
      await fetchArchivedCustomers();
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to unarchive customer',
      );
    } finally {
      setLoadingArchive((prev) => ({ ...prev, [customerId]: false }));
    }
  };

  const getTotalSpent = (customer) => {
    // Use total_spent from backend (only includes paid orders in production or later)
    const total = customer.total_spent || 0;
    return `₱${Number(total).toLocaleString()}`;
  };

  const displayCustomers = showArchived ? archivedCustomers : customers;

  // Mobile card component
  const CustomerCard = ({ customer }) => (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-4 ${
        showArchived ? 'opacity-75' : ''
      }`}
    >
      <div className="flex items-start gap-3 mb-3">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
            showArchived ? 'bg-gray-200' : 'bg-pink-100'
          }`}
        >
          <span
            className={`font-semibold text-lg ${
              showArchived ? 'text-gray-600' : 'text-pink-600'
            }`}
          >
            {customer.name?.charAt(0).toUpperCase() || 'U'}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-slate-900 truncate">{customer.name}</p>
          <a
            href={`mailto:${customer.email}`}
            className="text-sm text-blue-600 hover:text-blue-700 truncate block"
          >
            {customer.email}
          </a>
          <p className="text-sm text-slate-500">
            {customer.contact_number || 'No phone'}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            showArchived
              ? 'bg-gray-100 text-gray-700'
              : 'bg-blue-100 text-blue-700'
          }`}
        >
          {customer.orders_count || 0} orders
        </span>
        <span className="text-sm font-semibold text-slate-900">
          {getTotalSpent(customer)}
        </span>
      </div>
      <div className="text-xs text-slate-500 mb-3">
        {showArchived ? (
          customer.archived_at ? (
            <>Archived: {new Date(customer.archived_at).toLocaleDateString()}</>
          ) : (
            'N/A'
          )
        ) : customer.last_login_at ? (
          <>
            Last login:{' '}
            {new Date(customer.last_login_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </>
        ) : (
          <span className="italic">Never logged in</span>
        )}
      </div>
      <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
        <Link
          to={`/admin/customers/${customer.id}`}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-pink-600 hover:bg-pink-50 rounded-lg transition-colors min-h-11 text-sm font-medium"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          View
        </Link>
        {showArchived ? (
          <button
            onClick={() => handleUnarchive(customer.id)}
            disabled={loadingArchive[customer.id]}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 min-h-11 text-sm font-medium"
          >
            {loadingArchive[customer.id] ? (
              <svg
                className="w-5 h-5 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            )}
            Unarchive
          </button>
        ) : (
          <button
            onClick={() => handleArchive(customer.id)}
            disabled={loadingArchive[customer.id]}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors disabled:opacity-50 min-h-11 text-sm font-medium"
          >
            {loadingArchive[customer.id] ? (
              <svg
                className="w-5 h-5 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                />
              </svg>
            )}
            Archive
          </button>
        )}
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-1 sm:mb-2">
              Customers
            </h1>
            <p className="text-slate-600 text-sm sm:text-base">
              Manage your customer database
            </p>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={() => setShowArchived(false)}
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base min-h-11 ${
                !showArchived
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-200 text-slate-700 hover:bg-gray-300'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setShowArchived(true)}
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base min-h-11 ${
                showArchived
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-200 text-slate-700 hover:bg-gray-300'
              }`}
            >
              Archived ({archivedCustomers.length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
          </div>
        ) : (
          <>
            {/* Mobile: Card layout */}
            <div className="lg:hidden space-y-4">
              {displayCustomers.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  {showArchived
                    ? 'No archived customers found'
                    : 'No active customers found'}
                </div>
              ) : (
                displayCustomers.map((customer) => (
                  <CustomerCard key={customer.id} customer={customer} />
                ))
              )}
            </div>

            {/* Desktop: Table layout */}
            <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">
                        Customer
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">
                        Orders
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">
                        Total Spent
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">
                        {showArchived ? 'Archived Date' : 'Last Login'}
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {displayCustomers.length === 0 ? (
                      <tr>
                        <td
                          colSpan="6"
                          className="px-6 py-12 text-center text-slate-500"
                        >
                          {showArchived
                            ? 'No archived customers found'
                            : 'No active customers found'}
                        </td>
                      </tr>
                    ) : (
                      displayCustomers.map((customer) => (
                        <tr
                          key={customer.id}
                          className={`hover:bg-gray-50 ${showArchived ? 'opacity-75' : ''}`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                  showArchived ? 'bg-gray-200' : 'bg-pink-100'
                                }`}
                              >
                                <span
                                  className={`font-semibold ${
                                    showArchived
                                      ? 'text-gray-600'
                                      : 'text-pink-600'
                                  }`}
                                >
                                  {customer.name?.charAt(0).toUpperCase() ||
                                    'U'}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-slate-900">
                                  {customer.name}
                                </p>
                                <p className="text-sm text-slate-500">
                                  {customer.contact_number || 'No phone'}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <a
                              href={`mailto:${customer.email}`}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              {customer.email}
                            </a>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                showArchived
                                  ? 'bg-gray-100 text-gray-700'
                                  : 'bg-blue-100 text-blue-700'
                              }`}
                            >
                              {customer.orders_count || 0}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-semibold text-slate-900">
                            {getTotalSpent(customer)}
                          </td>
                          <td className="px-6 py-4">
                            {showArchived ? (
                              customer.archived_at ? (
                                <span className="text-sm text-slate-500">
                                  {new Date(
                                    customer.archived_at,
                                  ).toLocaleDateString()}
                                </span>
                              ) : (
                                <span className="text-sm text-slate-400">
                                  N/A
                                </span>
                              )
                            ) : customer.last_login_at ? (
                              <span className="text-sm text-slate-600">
                                {new Date(
                                  customer.last_login_at,
                                ).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            ) : (
                              <span className="text-sm text-slate-400 italic">
                                Never logged in
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <Link
                                to={`/admin/customers/${customer.id}`}
                                className="p-2 text-pink-600 hover:text-pink-700 hover:bg-pink-50 rounded-lg transition-colors"
                                title="View Details"
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                  />
                                </svg>
                              </Link>
                              {showArchived ? (
                                <button
                                  onClick={() => handleUnarchive(customer.id)}
                                  disabled={loadingArchive[customer.id]}
                                  className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                                  title="Unarchive Customer"
                                >
                                  {loadingArchive[customer.id] ? (
                                    <svg
                                      className="w-5 h-5 animate-spin"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                    >
                                      <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                      ></circle>
                                      <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                      ></path>
                                    </svg>
                                  ) : (
                                    <svg
                                      className="w-5 h-5"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                      />
                                    </svg>
                                  )}
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleArchive(customer.id)}
                                  disabled={loadingArchive[customer.id]}
                                  className="p-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors disabled:opacity-50"
                                  title="Archive Customer"
                                >
                                  {loadingArchive[customer.id] ? (
                                    <svg
                                      className="w-5 h-5 animate-spin"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                    >
                                      <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                      ></circle>
                                      <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                      ></path>
                                    </svg>
                                  ) : (
                                    <svg
                                      className="w-5 h-5"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                                      />
                                    </svg>
                                  )}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
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
