import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function AdminSidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { logout } = useAdminAuth();
  const sidebarRef = useRef(null);
  const firstFocusableRef = useRef(null);

  const menuItems = [
    {
      name: 'Add product',
      path: '/admin/products/add',
      icon: (
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
            d="M12 4v16m8-8H4"
          />
        </svg>
      ),
    },
    {
      name: 'Products',
      path: '/admin/products',
      icon: (
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
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      ),
    },
    {
      name: 'Customers',
      path: '/admin/customers',
      icon: (
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
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
    },
    {
      name: 'Orders',
      path: '/admin/orders',
      icon: (
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
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
    },
  ];

  const isActive = (path) => {
    // Exact match
    if (location.pathname === path) return true;

    // For /admin/products, only match edit pages (not /add)
    if (path === '/admin/products') {
      return location.pathname.startsWith('/admin/products/edit');
    }

    // For other paths, check if current path starts with this path
    return location.pathname.startsWith(path + '/');
  };

  // Focus first element when drawer opens (mobile)
  useEffect(() => {
    if (isOpen && firstFocusableRef.current) {
      firstFocusableRef.current.focus();
    }
  }, [isOpen]);

  // Prevent body scroll when drawer is open (mobile)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop overlay - mobile only */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity lg:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        id="admin-sidebar"
        ref={sidebarRef}
        aria-label="Admin navigation"
        className={`fixed left-0 top-0 z-50 w-64 max-w-[85vw] bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header with close button on mobile */}
          <div className="px-3 pt-4 pb-4 lg:pt-8 flex items-center justify-between shrink-0">
            <Link to="/admin" className="flex items-center gap-2 px-4">
              <span className="text-2xl font-GreatVibes bg-linear-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                Promise
              </span>
              <span className="text-xs text-slate-500 bg-pink-100 px-2 py-1 rounded">
                Admin
              </span>
            </Link>
            {/* Close button - mobile only */}
            <button
              ref={firstFocusableRef}
              type="button"
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-gray-100 hover:text-slate-700 transition-colors"
              aria-label="Close navigation menu"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors min-h-11 ${
                  isActive(item.path)
                    ? 'bg-pink-50 text-pink-600'
                    : 'text-slate-700 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="px-3 py-4 border-t border-gray-200 shrink-0">
            <button
              onClick={logout}
              className="w-full flex items-center justify-start gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors min-h-11"
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
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
