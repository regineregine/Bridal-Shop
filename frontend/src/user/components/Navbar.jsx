import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthModal from './AuthModal';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isLoggedIn, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState('login');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [accountExpanded, setAccountExpanded] = useState(false);
  const { getCartCount } = useCart();
  const cartCount = getCartCount();
  const location = useLocation();

  const openAuthModal = (view) => {
    setAuthModalView(view);
    setIsAuthModalOpen(true);
  };

  const handleLoginSuccess = () => {
    // Context updates automatically, no need to reload
    setIsAuthModalOpen(false);
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        setAccountExpanded(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const isActiveRoute = (path) => location.pathname === path;

  return (
    <>
      <nav className="fixed top-0 w-full z-50 h-auto md:h-20 flex bg-white/95 backdrop-blur-md shadow-soft">
        <div className="container mx-auto flex flex-col items-center justify-between gap-0 p-4 md:flex-row md:gap-0">
          <div className="flex w-full items-center justify-between md:w-auto">
            <Link
              to="/"
              className="text-3xl font-GreatVibes md:text-4xl lg:text-5xl text-pink-950 hover:text-pink-500 transition-colors duration-300"
            >
              Pro<span className="text-pink-500 hover:text-pink-950">mise</span>
            </Link>
            <button
              id="nav-toggle"
              type="button"
              aria-controls="nav-menu"
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen((open) => !open)}
              className="relative inline-flex items-center justify-center rounded-lg p-2.5 text-pink-700 hover:bg-pink-50 focus:ring-2 focus:ring-pink-400 focus:outline-none md:hidden transition-all duration-300"
            >
              <span className="sr-only">
                {isMenuOpen ? 'Close' : 'Open'} menu
              </span>
              <div className="w-5 h-5 flex flex-col justify-center items-center">
                <span
                  className={`bg-current h-0.5 w-5 rounded-full transition-all duration-300 ease-out ${
                    isMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-1.5'
                  }`}
                />
                <span
                  className={`bg-current h-0.5 w-5 rounded-full transition-all duration-200 ${
                    isMenuOpen ? 'opacity-0' : 'opacity-100 my-1'
                  }`}
                />
                <span
                  className={`bg-current h-0.5 w-5 rounded-full transition-all duration-300 ease-out ${
                    isMenuOpen
                      ? '-rotate-45 -translate-y-0.5'
                      : 'translate-y-1.5'
                  }`}
                />
              </div>
            </button>
          </div>

          <ul
            id="nav-menu"
            className={`${
              isMenuOpen
                ? 'flex opacity-100 translate-y-0'
                : 'hidden opacity-0 -translate-y-2'
            } w-full flex-col items-stretch text-lg pt-4 pb-2 space-y-1 transition-all duration-300 ease-out md:w-auto md:flex md:opacity-100 md:translate-y-0 md:flex-row md:space-y-0 md:space-x-9 md:pt-0 md:pb-0 md:items-center`}
          >
            <li className="md:flex">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-6 py-3 md:px-2 md:py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActiveRoute('/')
                    ? 'bg-linear-to-r from-pink-100 to-pink-50 text-pink-600 md:bg-none md:text-pink-500 md:border-b-2 md:border-pink-500'
                    : 'text-neutral-700 hover:text-pink-500 hover:bg-pink-50/50 md:hover:bg-transparent'
                }`}
              >
                <span className="flex items-center justify-between md:justify-center">
                  Home
                  {isActiveRoute('/') && (
                    <span className="ml-auto md:hidden text-pink-500">●</span>
                  )}
                </span>
              </Link>
            </li>
            <li className="md:flex">
              <Link
                to="/shop"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-6 py-3 md:px-2 md:py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActiveRoute('/shop')
                    ? 'bg-linear-to-r from-pink-100 to-pink-50 text-pink-600 md:bg-none md:text-pink-500 md:border-b-2 md:border-pink-500'
                    : 'text-neutral-700 hover:text-pink-500 hover:bg-pink-50/50 md:hover:bg-transparent'
                }`}
              >
                <span className="flex items-center justify-between md:justify-center">
                  Shop
                  {isActiveRoute('/shop') && (
                    <span className="ml-auto md:hidden text-pink-500">●</span>
                  )}
                </span>
              </Link>
            </li>
            <li className="md:flex">
              <Link
                to="/size-guide"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-6 py-3 md:px-2 md:py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActiveRoute('/size-guide')
                    ? 'bg-linear-to-r from-pink-100 to-pink-50 text-pink-600 md:bg-none md:text-pink-500 md:border-b-2 md:border-pink-500'
                    : 'text-neutral-700 hover:text-pink-500 hover:bg-pink-50/50 md:hover:bg-transparent'
                }`}
              >
                <span className="flex items-center justify-between md:justify-center">
                  Size Guide
                  {isActiveRoute('/size-guide') && (
                    <span className="ml-auto md:hidden text-pink-500">●</span>
                  )}
                </span>
              </Link>
            </li>
            <li className="md:flex">
              <Link
                to="/contact"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-6 py-3 md:px-2 md:py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActiveRoute('/contact')
                    ? 'bg-linear-to-r from-pink-100 to-pink-50 text-pink-600 md:bg-none md:text-pink-500 md:border-b-2 md:border-pink-500'
                    : 'text-neutral-700 hover:text-pink-500 hover:bg-pink-50/50 md:hover:bg-transparent'
                }`}
              >
                <span className="flex items-center justify-between md:justify-center">
                  Contact
                  {isActiveRoute('/contact') && (
                    <span className="ml-auto md:hidden text-pink-500">●</span>
                  )}
                </span>
              </Link>
            </li>
            <li className="relative md:flex">
              <Link
                to="/cart"
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center justify-between px-6 py-3 md:px-2 md:py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActiveRoute('/cart')
                    ? 'bg-linear-to-r from-pink-100 to-pink-50 text-pink-600 md:bg-none md:text-pink-500 md:border-b-2 md:border-pink-500'
                    : 'text-neutral-700 hover:text-pink-500 hover:bg-pink-50/50 md:hover:bg-transparent'
                }`}
              >
                <span className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-pink-500 transition-transform duration-200 group-hover:scale-110"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A1 1 0 007.6 17h8.8a1 1 0 00.95-.68L21 13M7 13V6a1 1 0 011-1h9a1 1 0 011 1v7"
                    />
                  </svg>
                  Cart
                  {cartCount > 0 && (
                    <span className="ml-2 inline-flex items-center justify-center rounded-full bg-pink-500 text-white text-xs font-bold px-2 py-1 min-w-[22px] animate-pulse">
                      {cartCount}
                    </span>
                  )}
                </span>
                {isActiveRoute('/cart') && (
                  <span className="ml-auto md:hidden text-pink-500">●</span>
                )}
              </Link>
            </li>

            {localStorage.getItem('admin_token') ? (
              <li className="md:flex border-t border-pink-100 md:border-0 mt-2 pt-2 md:mt-0 md:pt-0">
                <Link
                  to="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-6 py-3 md:px-2 md:py-2 rounded-lg font-medium transition-all duration-200 ${
                    location.pathname.startsWith('/admin')
                      ? 'bg-linear-to-r from-pink-100 to-pink-50 text-pink-600 md:bg-none md:text-pink-500 md:border-b-2 md:border-pink-500'
                      : 'text-neutral-700 hover:text-pink-500 hover:bg-pink-50/50 md:hover:bg-transparent'
                  }`}
                >
                  <span className="flex items-center justify-between md:justify-center">
                    Admin Dashboard
                    {location.pathname.startsWith('/admin') && (
                      <span className="ml-auto md:hidden text-pink-500">●</span>
                    )}
                  </span>
                </Link>
              </li>
            ) : isLoggedIn ? (
              <li className="relative group border-t border-pink-100 md:border-0 mt-2 pt-2 md:mt-0 md:pt-0">
                {/* Mobile: Expandable, Desktop: Hover */}
                <button
                  onClick={() => setAccountExpanded(!accountExpanded)}
                  className="w-full flex items-center justify-between px-6 py-3 md:px-2 md:py-2 rounded-lg font-medium text-neutral-700 hover:text-pink-500 hover:bg-pink-50/50 md:hover:bg-transparent transition-all duration-200"
                >
                  <span className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 md:h-8 md:w-8 text-pink-400 mr-2 md:mr-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5.121 17.804A9.001 9.001 0 0112 15c2.21 0 4.21.805 5.879 2.146M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="md:hidden">Account</span>
                  </span>
                  <svg
                    className={`w-4 h-4 md:hidden transition-transform duration-200 ${
                      accountExpanded ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Mobile submenu */}
                <div
                  className={`md:hidden overflow-hidden transition-all duration-300 ${
                    accountExpanded
                      ? 'max-h-40 opacity-100'
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="pl-8 pr-6 py-2 space-y-1">
                    <Link
                      to="/profile"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setAccountExpanded(false);
                      }}
                      className="block px-4 py-2 text-sm text-neutral-600 hover:text-pink-500 hover:bg-pink-50 rounded-md transition-colors"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={(e) => {
                        handleLogout(e);
                        setAccountExpanded(false);
                      }}
                      disabled={isLoggingOut}
                      className="w-full text-left px-4 py-2 text-sm text-neutral-600 hover:text-pink-500 hover:bg-pink-50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                    >
                      {isLoggingOut && (
                        <svg
                          className="animate-spin h-3 w-3 text-pink-500"
                          xmlns="http://www.w3.org/2000/svg"
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
                      )}
                      {isLoggingOut ? 'Logging out...' : 'Logout'}
                    </button>
                  </div>
                </div>

                {/* Desktop dropdown (hover) */}
                <div className="hidden md:block absolute right-0 mt-0 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 border border-pink-100">
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-500 text-left transition-colors"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-500 text-left disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                    >
                      {isLoggingOut && (
                        <svg
                          className="animate-spin h-4 w-4 text-pink-500"
                          xmlns="http://www.w3.org/2000/svg"
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
                      )}
                      {isLoggingOut ? 'Logging out...' : 'Logout'}
                    </button>
                  </div>
                </div>
              </li>
            ) : (
              <li className="relative group border-t border-pink-100 md:border-0 mt-2 pt-2 md:mt-0 md:pt-0">
                <button
                  onClick={() => setAccountExpanded(!accountExpanded)}
                  className="w-full flex items-center justify-between px-6 py-3 md:px-2 md:py-2 rounded-lg font-medium text-neutral-700 hover:text-pink-500 hover:bg-pink-50/50 md:hover:bg-transparent transition-all duration-200"
                >
                  <span className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 md:h-8 md:w-8 text-pink-400 mr-2 md:mr-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5.121 17.804A9.001 9.001 0 0112 15c2.21 0 4.21.805 5.879 2.146M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="md:hidden">Account</span>
                  </span>
                  <svg
                    className={`w-4 h-4 md:hidden transition-transform duration-200 ${
                      accountExpanded ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Mobile submenu */}
                <div
                  className={`md:hidden overflow-hidden transition-all duration-300 ${
                    accountExpanded
                      ? 'max-h-40 opacity-100'
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="pl-8 pr-6 py-2 space-y-1">
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setAccountExpanded(false);
                        openAuthModal('login');
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-neutral-600 hover:text-pink-500 hover:bg-pink-50 rounded-md transition-colors"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setAccountExpanded(false);
                        openAuthModal('register');
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-neutral-600 hover:text-pink-500 hover:bg-pink-50 rounded-md transition-colors"
                    >
                      Sign Up
                    </button>
                  </div>
                </div>

                {/* Desktop dropdown (hover) */}
                <div className="hidden md:block absolute right-0 mt-0 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 border border-pink-100">
                  <div className="py-1">
                    <button
                      onClick={() => openAuthModal('login')}
                      className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-500 text-left transition-colors"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => openAuthModal('register')}
                      className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-500 text-left transition-colors"
                    >
                      Sign Up
                    </button>
                  </div>
                </div>
              </li>
            )}
          </ul>
        </div>
      </nav>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialView={authModalView}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
}
