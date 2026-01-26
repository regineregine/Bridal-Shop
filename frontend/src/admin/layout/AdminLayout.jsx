import React, { useState, useEffect, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function AdminLayout({ children }) {
  const { isAuthenticated, loading } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  // Close sidebar on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setSidebarOpen(false);
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      <div className="flex-1 min-w-0 lg:ml-64">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="pt-20 px-4 pb-4 lg:pt-24 lg:px-6 lg:pb-6 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
