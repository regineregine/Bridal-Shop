import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({
  isOpen,
  onClose,
  initialView = 'login',
  onLoginSuccess,
}) {
  const { login } = useAuth();
  const [view, setView] = useState(initialView); // 'login', 'register', 'success'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    contact_number: '',
    confirm_password: '',
    agree_terms: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setView(initialView);
      setError('');
      setSuccessMessage('');
      setFormData({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        contact_number: '',
        confirm_password: '',
        agree_terms: false,
      });
    }
  }, [isOpen, initialView]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/login', {
        email: formData.email,
        password: formData.password,
      });

      const { access_token, user } = response.data;
      login(access_token, user);
      toast.success(`Welcome back, ${user.name}!`);

      if (onLoginSuccess) onLoginSuccess(user);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid login credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.agree_terms) {
      setError('You must agree to the terms and conditions');
      return;
    }

    setLoading(true);

    try {
      await api.post('/register', {
        name: `${formData.first_name} ${formData.last_name}`,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirm_password,
        contact_number: formData.contact_number,
      });

      setSuccessMessage('Registration successful! Please sign in.');
      toast.success('Account created successfully!');
      setView('success');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Login Modal */}
      {view === 'login' && (
        <div
          className="modal-panel is-open"
          aria-hidden="true"
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-backdrop" onClick={onClose}></div>
          <div className="modal-surface max-w-md">
            <div className="modal-header">
              <div>
                <h2 className="headline">Sign in to your account</h2>
                <p className="text-sm text-white/80 mt-1">
                  Welcome back! Please enter your credentials.
                </p>
              </div>
              <button
                className="close-btn"
                aria-label="Close login"
                onClick={onClose}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleLogin} className="space-y-6">
                {error && (
                  <div className="text-red-500 text-sm text-center">
                    {error}
                  </div>
                )}
                <div>
                  <label className="form-label" htmlFor="login-email">
                    Email Address
                  </label>
                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    className="form-input"
                    placeholder="Enter your email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="form-label" htmlFor="login-password">
                    Password
                  </label>
                  <input
                    id="login-password"
                    name="password"
                    type="password"
                    className="form-input"
                    placeholder="Enter your password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex items-center justify-between text-sm text-neutral">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-neutral focus:ring-candy-peach"
                    />
                    <span>Remember me</span>
                  </label>
                  <a
                    href="#"
                    className="font-medium text-primary hover:text-secondary"
                  >
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  {loading && (
                    <svg
                      className="animate-spin h-5 w-5"
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
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>

              <div className="mt-8 mb-6">
                <div className="relative text-center text-sm text-neutral">
                  <span className="relative z-10 bg-white px-4">
                    Don't have an account?
                  </span>
                  <span className="absolute inset-x-0 top-1/2 -z-10 h-px bg-linear-to-r from-transparent via-(--color-neutral-light) to-transparent"></span>
                </div>
              </div>

              <button
                onClick={() => setView('register')}
                className="btn-outline w-full"
              >
                Create New Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {view === 'register' && (
        <div
          className="modal-panel is-open"
          aria-hidden="true"
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-backdrop" onClick={onClose}></div>
          <div className="modal-surface max-w-3xl">
            <div className="modal-header">
              <div>
                <h2 className="headline text-slate-900">Create Account</h2>
                <p className="text-xs text-slate-700 mt-2">
                  Join us for exclusive bridal services.
                </p>
              </div>
              <button
                className="close-btn"
                aria-label="Close register"
                onClick={onClose}
              >
                ×
              </button>
            </div>

            <div className="modal-body max-h-[65vh] overflow-y-auto">
              <form
                id="register-form"
                onSubmit={handleRegister}
                className="space-y-6"
              >
                {error && (
                  <div className="text-red-500 text-sm text-center">
                    {error}
                  </div>
                )}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="form-label" htmlFor="reg-first-name">
                      First Name
                    </label>
                    <input
                      id="reg-first-name"
                      name="first_name"
                      type="text"
                      className="form-input"
                      placeholder="Enter first name"
                      required
                      value={formData.first_name}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="form-label" htmlFor="reg-last-name">
                      Last Name
                    </label>
                    <input
                      id="reg-last-name"
                      name="last_name"
                      type="text"
                      className="form-input"
                      placeholder="Enter last name"
                      required
                      value={formData.last_name}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label" htmlFor="reg-email">
                    Email Address
                  </label>
                  <input
                    id="reg-email"
                    name="email"
                    type="email"
                    className="form-input"
                    placeholder="Enter your email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="form-label" htmlFor="reg-contact">
                    Phone Number
                  </label>
                  <input
                    id="reg-contact"
                    name="contact_number"
                    type="tel"
                    className="form-input"
                    placeholder="Enter phone number"
                    required
                    value={formData.contact_number}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="form-label" htmlFor="reg-password">
                    Password
                  </label>
                  <input
                    id="reg-password"
                    name="password"
                    type="password"
                    className="form-input"
                    placeholder="Create a password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="form-label" htmlFor="reg-confirm-password">
                    Confirm Password
                  </label>
                  <input
                    id="reg-confirm-password"
                    name="confirm_password"
                    type="password"
                    className="form-input"
                    placeholder="Confirm your password"
                    required
                    value={formData.confirm_password}
                    onChange={handleChange}
                  />
                </div>

                <label className="flex items-start gap-3 text-sm text-neutral">
                  <input
                    id="agree-terms"
                    name="agree_terms"
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-neutral focus:ring-candy-peach"
                    checked={formData.agree_terms}
                    onChange={handleChange}
                  />
                  <span>
                    I agree to the
                    <a
                      href="#"
                      className="font-medium text-primary hover:text-secondary ml-1"
                    >
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a
                      href="#"
                      className="font-medium text-primary hover:text-secondary"
                    >
                      Privacy Policy
                    </a>
                  </span>
                </label>
              </form>
            </div>

            <div className="modal-footer">
              <div className="flex gap-3">
                <button
                  type="button"
                  className="btn-secondary flex-1"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="register-form"
                  className="btn-primary hover:text-slate-900 flex-1 flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  {loading && (
                    <svg
                      className="animate-spin h-5 w-5"
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
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>
              <p className="text-center text-sm text-neutral">
                Already have an account?
                <button
                  onClick={() => setView('login')}
                  className="font-medium text-primary hover:text-secondary ml-1"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {view === 'success' && (
        <div
          className="modal-panel is-open"
          aria-hidden="true"
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-backdrop" onClick={onClose}></div>
          <div className="modal-surface max-w-md bg-white rounded-lg shadow-lg p-6">
            <div className="modal-header flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-white">Success!</h3>
              <button
                className="close-btn text-xl font-bold"
                aria-label="Close"
                onClick={onClose}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p className="text-gray-800 text-center text-lg">
                {successMessage}
              </p>
            </div>
            <div className="modal-footer mt-6">
              <button
                onClick={() => setView('login')}
                className="btn-primary w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700"
              >
                Continue to Login
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
