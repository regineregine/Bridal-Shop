import React from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function AdminHeader({ onMenuClick }) {
  const { admin } = useAdminAuth();

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 z-30 bg-white border-b border-gray-200">
      <div className="px-4 lg:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Hamburger button - mobile only */}
          <button
            type="button"
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 rounded-lg text-slate-600 hover:bg-gray-100 hover:text-slate-900 transition-colors"
            aria-label="Open navigation menu"
            aria-expanded="false"
            aria-controls="admin-sidebar"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 className="text-lg lg:text-xl font-semibold text-slate-900">
            Admin Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
              <span className="text-pink-600 font-semibold">
                {admin?.name?.charAt(0).toUpperCase() || 'A'}
              </span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-slate-900">
                {admin?.name || 'Admin'}
              </p>
              <p className="text-xs text-slate-500">{admin?.email || ''}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
