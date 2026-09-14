import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = {};

    if (!email.trim()) {
      validationErrors.email = 'Email is required.';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      validationErrors.email = 'Enter a valid email address.';
    }

    if (!password) {
      validationErrors.password = 'Password is required.';
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const credentials = { email: email.trim(), password };

    try {
      setIsSubmitting(true);
      await login(credentials);
      navigate('/');
    } catch (requestError) {
      setErrors({ form: requestError.message || 'Unable to sign in.' });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout altLinkText="Register" altLinkTo="/register">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Sign in</h1>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Email Address</label>
          <input
            type="email"
            placeholder="name@domain.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={Boolean(errors.email)}
            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
          />

          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">Password</label>
            <Link to="/forgot-password" className="text-xs text-indigo-600 font-medium">Forgot password?</Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-invalid={Boolean(errors.password)}
              className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none pr-16"
            />

            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-medium"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <div className="flex items-center">
          <input type="checkbox" id="keep-signed-in" className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-600" />
          <label htmlFor="keep-signed-in" className="ml-2 text-sm text-gray-600">Keep me signed in</label>
        </div>

        {errors.form && (
          <p className="text-sm text-red-600" role="alert">{errors.form}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 text-white font-medium py-3 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-60"
        >
          {isSubmitting ? 'Signing in...' : 'Sign In →'}
        </button>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account? <Link to="/register" className="text-indigo-600 font-medium hover:underline">Register</Link>
        </p>
      </form>
    </AuthLayout>
  );
}