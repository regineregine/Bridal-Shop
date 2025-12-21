import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthModal from './AuthModal';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isLoggedIn, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState('login');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  const openAuthModal = (view) => {
    setAuthModalView(view);
    setIsAuthModalOpen(true);
  };

  const handleLoginSuccess = (user) => {
    // Context updates automatically, no need to reload
    setIsAuthModalOpen(false);
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-50 h-auto md:h-20 flex bg-white/80 backdrop-blur-md shadow-soft">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 p-4 md:flex-row md:gap-0">
          <div className="flex w-full items-center justify-between md:w-auto">
            <Link
              to="/"
              className="text-3xl font-GreatVibes md:text-4xl lg:text-5xl text-pink-950 hover:text-pink-500"
            >
              Pro<span className="text-pink-500 hover:text-pink-950">mise</span>
            </Link>
            <button
              id="nav-toggle"
              type="button"
              aria-controls="nav-menu"
              aria-expanded="false"
              className="inline-flex items-center justify-center rounded-md p-2 text-dark hover:bg-white/10 focus:ring-2 focus:ring-primary focus:outline-none md:hidden"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          <ul
            id="nav-menu"
            className="hidden w-full flex-col items-center  text-center text-lg text-pink-950 sm:text-xl md:w-auto md:flex md:flex-row md:space-y-0 md:space-x-9"
          >
            <li>
              <Link
                to="/"
                className="px-4 py-2 align-middle hover:text-pink-500 md:px-2"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/shop"
                className="px-4 py-2 align-middle hover:text-pink-500 md:px-2"
              >
                Shop
              </Link>
            </li>
            <li>
              <Link
                to="/size-guide"
                className="px-4 py-2 align-middle hover:text-pink-500 md:px-2"
              >
                Size Guide
              </Link>
            </li>
            <li>
              <Link
                to="/reservation"
                className="px-4 py-2 align-middle hover:text-pink-500 md:px-2"
              >
                Reservation
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="px-4 py-2 align-middle hover:text-pink-500 md:px-2"
              >
                Contact
              </Link>
            </li>
            <li className="relative">
              <Link
                to="/cart"
                className="px-4 py-2 align-middle hover:text-pink-500 md:px-2 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1 text-pink-500"
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
                  <span
                    className="ml-2 inline-flex items-center justify-center rounded-full bg-pink-500 text-white text-xs font-bold px-2 py-1 min-w-[22px]"
                    style={{ minWidth: 22 }}
                  >
                    {cartCount}
                  </span>
                )}
              </Link>
            </li>

            {isLoggedIn ? (
              <li className="relative group">
                <button className="px-4 py-2 align-middle hover:text-pink-500 md:px-2 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-pink-700"
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
                  <span className="ml-2 md:hidden">Account</span>
                </button>
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-0 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 border border-pink-100">
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-500 text-left"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-500 text-left disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
              <li className="relative group">
                <button className="px-4 py-2 align-middle hover:text-pink-500 md:px-2 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-pink-700"
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
                  <span className="ml-2 md:hidden">Account</span>
                </button>
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-0 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 border border-pink-100">
                  <div className="py-1">
                    <button
                      onClick={() => openAuthModal('login')}
                      className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-500 text-left"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => openAuthModal('register')}
                      className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-500 text-left"
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
