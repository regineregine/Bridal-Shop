import React from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function AdminHeader() {
  const { admin } = useAdminAuth();

  return (
    <header className="fixed top-0 right-0 left-64 z-30 bg-white border-b border-gray-200">
      <div className="px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Admin Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
              <span className="text-pink-600 font-semibold">
                {admin?.name?.charAt(0).toUpperCase() || 'A'}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">{admin?.name || 'Admin'}</p>
              <p className="text-xs text-slate-500">{admin?.email || ''}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

