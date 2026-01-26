import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useAdminAuth } from '../../admin/context/AdminAuthContext';

export default function AuthModal({
  isOpen,
  onClose,
  initialView = 'login',
  onLoginSuccess,
}) {
  const { login } = useAuth();
  const { login: adminLogin } = useAdminAuth();
  const navigate = useNavigate();
  const [view, setView] = useState(initialView); // 'login', 'register', 'success', 'forgot-password'
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
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);
  const [resetCode, setResetCode] = useState('');
  const [codeVerified, setCodeVerified] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setView(initialView);
      setError('');
      setSuccessMessage('');
      setFieldErrors({});
      setFormData({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        contact_number: '',
        confirm_password: '',
        agree_terms: false,
      });
      setForgotPasswordEmail('');
      setForgotPasswordSuccess(false);
      setResetCode('');
      setCodeVerified(false);
    }
  }, [isOpen, initialView]);

  // Validation functions
  const validateEmail = (email) => {
    if (!email) {
      return 'Please enter your email address';
    }
    if (/\s/.test(email)) {
      return 'Spaces are not allowed in email';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validatePassword = (password) => {
    if (!password) {
      return 'Please enter a password';
    }
    if (/\s/.test(password)) {
      return 'Spaces are not allowed in password';
    }
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    return '';
  };

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'email':
        error = validateEmail(value);
        break;
      case 'password':
        error = validatePassword(value);
        break;
      case 'confirm_password':
        if (!value) {
          error = 'Please confirm your password';
        } else if (/\s/.test(value)) {
          error = 'Spaces are not allowed in confirm password';
        } else if (value !== formData.password) {
          error = 'Passwords do not match';
        }
        break;
      case 'first_name':
        if (!value) {
          error = 'Please enter your first name';
        } else if (value.length < 2) {
          error = 'First name must be at least 2 characters long';
        }
        break;
      case 'last_name':
        if (!value) {
          error = 'Please enter your last name';
        } else if (value.length < 2) {
          error = 'Last name must be at least 2 characters long';
        }
        break;
      case 'contact_number':
        if (!value) {
          error = 'Please enter your contact number';
        }
        break;
      default:
        break;
    }

    setFieldErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    return error === '';
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Prevent spaces in email and password fields
    if (
      (name === 'email' ||
        name === 'password' ||
        name === 'confirm_password') &&
      value.includes(' ')
    ) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Real-time validation for register form
    if (view === 'register' && type !== 'checkbox') {
      // Clear error when user starts typing
      if (fieldErrors[name]) {
        validateField(name, value);
      }
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (view === 'register') {
      validateField(name, value);
    }
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

      // Check if it's an admin login
      if (response.data.user_type === 'admin' && response.data.admin) {
        // Login as admin
        adminLogin(response.data.access_token, response.data.admin);
        toast.success(`Welcome back, ${response.data.admin.name}!`);
        onClose();
        navigate('/admin');
      } else if (response.data.user_type === 'user' && response.data.user) {
        // Login as regular user
        login(response.data.access_token, response.data.user);
        toast.success(`Welcome back, ${response.data.user.name}!`);
        if (onLoginSuccess) onLoginSuccess(response.data.user);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid login credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    // Validate all fields
    const fieldsToValidate = [
      'first_name',
      'last_name',
      'email',
      'contact_number',
      'password',
      'confirm_password',
    ];
    let isValid = true;

    fieldsToValidate.forEach((field) => {
      if (!validateField(field, formData[field])) {
        isValid = false;
      }
    });

    if (!isValid) {
      setError('Please fix the errors in the form');
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setFieldErrors((prev) => ({
        ...prev,
        confirm_password: 'Passwords do not match',
      }));
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
      // Handle field-specific errors from backend
      if (err.response?.data?.errors) {
        const backendErrors = {};
        Object.keys(err.response.data.errors).forEach((key) => {
          // Format error messages to be user-friendly
          let errorMsg = err.response.data.errors[key][0];

          // Make duplicate email error more user-friendly
          if (
            key === 'email' &&
            (errorMsg.includes('already been taken') ||
              errorMsg.includes('has already been taken'))
          ) {
            errorMsg =
              'This email address is already registered. Please use a different email or sign in.';
          }

          backendErrors[key] = errorMsg;
        });
        setFieldErrors((prev) => ({ ...prev, ...backendErrors }));

        // Set general error message if email is duplicate
        if (
          backendErrors.email &&
          backendErrors.email.includes('already registered')
        ) {
          setError(
            'This email address is already registered. Please use a different email or sign in.',
          );
        } else {
          setError('Please fix the errors in the form');
        }
      } else {
        // Handle general error messages
        const errorMessage =
          err.response?.data?.message ||
          'Registration failed. Please try again.';
        setError(errorMessage);
      }
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
                <p className="text-xs sm:text-sm text-white/80 mt-1">
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
              <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
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
                  <div className="relative">
                    <input
                      id="login-password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      className="form-input pr-10"
                      placeholder="Enter your password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 focus:outline-none"
                      aria-label={
                        showPassword ? 'Hide password' : 'Show password'
                      }
                    >
                      {showPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
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
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-neutral -mx-1">
                  <label className="inline-flex items-center gap-2 cursor-pointer px-1 py-1.5 min-h-11">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-neutral focus:ring-candy-peach cursor-pointer"
                    />
                    <span>Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setView('forgot-password')}
                    className="font-medium text-primary hover:text-secondary px-1 py-1.5 min-h-11"
                  >
                    Forgot password?
                  </button>
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
          <div className="modal-surface max-w-md sm:max-w-lg md:max-w-3xl">
            <div className="modal-header">
              <div>
                <h2 className="headline text-slate-900">Create Account</h2>
                <p className="text-xs text-slate-700 mt-1 sm:mt-2">
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

            <div className="modal-body">
              <form
                id="register-form"
                onSubmit={handleRegister}
                className="space-y-4 sm:space-y-6"
              >
                {error && (
                  <div className="text-red-500 text-sm text-center">
                    {error}
                  </div>
                )}
                <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                  <div>
                    <label className="form-label" htmlFor="reg-first-name">
                      First Name
                    </label>
                    <input
                      id="reg-first-name"
                      name="first_name"
                      type="text"
                      className={`form-input ${fieldErrors.first_name ? 'border-red-500' : ''}`}
                      placeholder="Enter first name"
                      required
                      value={formData.first_name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {fieldErrors.first_name && (
                      <p className="text-red-500 text-sm mt-1">
                        {fieldErrors.first_name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="form-label" htmlFor="reg-last-name">
                      Last Name
                    </label>
                    <input
                      id="reg-last-name"
                      name="last_name"
                      type="text"
                      className={`form-input ${fieldErrors.last_name ? 'border-red-500' : ''}`}
                      placeholder="Enter last name"
                      required
                      value={formData.last_name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {fieldErrors.last_name && (
                      <p className="text-red-500 text-sm mt-1">
                        {fieldErrors.last_name}
                      </p>
                    )}
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
                    className={`form-input ${fieldErrors.email ? 'border-red-500' : ''}`}
                    placeholder="Enter your email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {fieldErrors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {fieldErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="form-label" htmlFor="reg-contact">
                    Phone Number
                  </label>
                  <input
                    id="reg-contact"
                    name="contact_number"
                    type="tel"
                    className={`form-input ${fieldErrors.contact_number ? 'border-red-500' : ''}`}
                    placeholder="Enter phone number"
                    required
                    value={formData.contact_number}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {fieldErrors.contact_number && (
                    <p className="text-red-500 text-sm mt-1">
                      {fieldErrors.contact_number}
                    </p>
                  )}
                </div>

                <div>
                  <label className="form-label" htmlFor="reg-password">
                    Password
                  </label>
                  <input
                    id="reg-password"
                    name="password"
                    type="password"
                    className={`form-input ${fieldErrors.password ? 'border-red-500' : ''}`}
                    placeholder="Create a password (min. 8 characters)"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {fieldErrors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {fieldErrors.password}
                    </p>
                  )}
                  {!fieldErrors.password &&
                    formData.password &&
                    formData.password.length < 8 && (
                      <p className="text-yellow-600 text-sm mt-1">
                        Password must be at least 8 characters long
                      </p>
                    )}
                </div>

                <div>
                  <label className="form-label" htmlFor="reg-confirm-password">
                    Confirm Password
                  </label>
                  <input
                    id="reg-confirm-password"
                    name="confirm_password"
                    type="password"
                    className={`form-input ${fieldErrors.confirm_password ? 'border-red-500' : ''}`}
                    placeholder="Confirm your password"
                    required
                    value={formData.confirm_password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {fieldErrors.confirm_password && (
                    <p className="text-red-500 text-sm mt-1">
                      {fieldErrors.confirm_password}
                    </p>
                  )}
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

            <div className="modal-footer gap-2! sm:gap-4!">
              <div className="flex gap-2 sm:gap-3">
                <button
                  type="button"
                  className="btn-secondary flex-1 text-sm sm:text-base py-2.5 sm:py-3"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="register-form"
                  className="btn-primary hover:text-slate-900 flex-1 flex items-center justify-center gap-2 text-sm sm:text-base py-2.5 sm:py-3"
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

      {/* Forgot Password Modal */}
      {view === 'forgot-password' && (
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
                <h2 className="headline">Reset Password</h2>
                <p className="text-xs sm:text-sm text-white/80 mt-1">
                  Enter your email address and we'll send you a 6-digit code to
                  reset your password.
                </p>
              </div>
              <button
                className="close-btn"
                aria-label="Close forgot password"
                onClick={onClose}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              {!forgotPasswordSuccess ? (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setError('');
                    setForgotPasswordLoading(true);

                    try {
                      await api.post('/password/forgot', {
                        email: forgotPasswordEmail,
                      });

                      setForgotPasswordSuccess(true);
                      toast.success('Password reset code sent to your email!');
                    } catch (err) {
                      setError(
                        err.response?.data?.message ||
                          'Failed to send reset link. Please try again.',
                      );
                    } finally {
                      setForgotPasswordLoading(false);
                    }
                  }}
                  className="space-y-4 sm:space-y-6"
                >
                  {error && (
                    <div className="text-red-500 text-sm text-center">
                      {error}
                    </div>
                  )}
                  <div>
                    <label className="form-label" htmlFor="forgot-email">
                      Email Address
                    </label>
                    <input
                      id="forgot-email"
                      type="email"
                      className="form-input"
                      placeholder="Enter your email"
                      required
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-primary w-full flex items-center justify-center gap-2"
                    disabled={forgotPasswordLoading}
                  >
                    {forgotPasswordLoading && (
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
                    {forgotPasswordLoading ? 'Sending...' : 'Send Reset Code'}
                  </button>
                </form>
              ) : !codeVerified ? (
                <div className="space-y-4 sm:space-y-6">
                  <div className="text-center space-y-2">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-7 h-7 sm:w-8 sm:h-8 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-900">
                      Check Your Email
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600">
                      We've sent a 6-digit code to{' '}
                      <strong className="break-all">
                        {forgotPasswordEmail}
                      </strong>
                    </p>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Enter the code below. The code will expire in 15 minutes.
                    </p>
                  </div>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setError('');
                      setForgotPasswordLoading(true);

                      try {
                        const response = await api.post(
                          '/password/verify-code',
                          {
                            email: forgotPasswordEmail,
                            code: resetCode,
                          },
                        );

                        // Code verified - automatically log in the user
                        if (response.data.access_token && response.data.user) {
                          login(response.data.access_token, response.data.user);
                          setCodeVerified(true);
                          toast.success('Code verified! Logging you in...');
                          onClose();
                          // Navigate to profile change password tab
                          setTimeout(() => {
                            navigate(
                              '/profile?tab=change-password&code=' +
                                resetCode +
                                '&email=' +
                                encodeURIComponent(forgotPasswordEmail),
                            );
                          }, 500);
                        } else {
                          setError('Failed to log in. Please try again.');
                        }
                      } catch (err) {
                        setError(
                          err.response?.data?.message ||
                            'Invalid code. Please try again.',
                        );
                      } finally {
                        setForgotPasswordLoading(false);
                      }
                    }}
                    className="space-y-4"
                  >
                    {error && (
                      <div className="text-red-500 text-sm text-center">
                        {error}
                      </div>
                    )}
                    <div>
                      <label className="form-label" htmlFor="reset-code">
                        6-Digit Code
                      </label>
                      <input
                        id="reset-code"
                        type="text"
                        className="form-input text-center text-2xl font-bold tracking-widest"
                        placeholder="000000"
                        maxLength={6}
                        pattern="[0-9]{6}"
                        required
                        value={resetCode}
                        onChange={(e) => {
                          const value = e.target.value
                            .replace(/\D/g, '')
                            .slice(0, 6);
                          setResetCode(value);
                        }}
                      />
                      <p className="text-xs text-slate-500 mt-1 text-center">
                        Enter the 6-digit code from your email
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="btn-primary w-full flex items-center justify-center gap-2"
                      disabled={forgotPasswordLoading || resetCode.length !== 6}
                    >
                      {forgotPasswordLoading && (
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
                      {forgotPasswordLoading ? 'Verifying...' : 'Verify Code'}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    Code Verified!
                  </h3>
                  <p className="text-slate-600">
                    Redirecting to change password...
                  </p>
                </div>
              )}

              <div className="mt-6">
                <button
                  onClick={() => setView('login')}
                  className="text-sm text-primary hover:text-secondary font-medium w-full text-center"
                >
                  ← Back to Sign In
                </button>
              </div>
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
          <div className="modal-surface max-w-md">
            <div className="modal-header">
              <h3 className="headline">Success!</h3>
              <button
                className="close-btn"
                aria-label="Close"
                onClick={onClose}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p className="text-gray-800 text-center text-base sm:text-lg">
                {successMessage}
              </p>
            </div>
            <div className="modal-footer">
              <button
                onClick={() => setView('login')}
                className="btn-primary w-full"
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
