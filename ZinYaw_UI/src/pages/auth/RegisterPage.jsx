import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [role, setRole] = useState('customer');
  const [name, setName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim() || !email.trim() || !phone.trim() || !password || !passwordConfirmation) {
      setError('Please complete all required fields.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (password !== passwordConfirmation) {
      setError('Passwords do not match.');
      return;
    }

    if (role === 'vendor' && !storeName.trim()) {
      setError('Store name is required for vendors.');
      return;
    }

    const registrationData = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password,
      password_confirmation: passwordConfirmation,
      role,
    };

    if (role === 'vendor') {
      registrationData.store_name = storeName.trim();
    }

    try {
      setIsSubmitting(true);
      await register(registrationData);
      navigate('/');
    } catch (requestError) {
      setError(requestError.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout altLinkText="Sign In instead" altLinkTo="/login">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Create account</h1>

      {/* Role Selector Tabs */}
      <div className="flex bg-gray-50 p-1 rounded-md mb-8 border border-gray-100">
        <button
          type="button"
          onClick={() => setRole('customer')}
          className={`flex-1 py-2 text-sm font-medium transition-all ${role === 'customer'
            ? 'bg-white shadow-sm text-indigo-600 border-b-2 border-indigo-600'
            : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          Customer
        </button>
        <button
          type="button"
          onClick={() => setRole('vendor')}
          className={`flex-1 py-2 text-sm font-medium transition-all ${role === 'vendor'
            ? 'bg-white shadow-sm text-indigo-600 border-b-2 border-indigo-600'
            : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          Vendor
        </button>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {role === 'customer' ? (
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Full Name</label>
            <input type="text" placeholder="Full Name" value={name} onChange={(event) => setName(event.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-600 outline-none" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Store Name *</label>
              <input type="text" placeholder="Public storefront name" value={storeName} onChange={(event) => setStoreName(event.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-600 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Owner Name *</label>
              <input type="text" placeholder="Store owner name" value={name} onChange={(event) => setName(event.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-600 outline-none" />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Phone Number {role === 'vendor' && '*'}</label>
            <input type="tel" placeholder="09450000000" value={phone} onChange={(event) => setPhone(event.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-600 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Email Address {role === 'vendor' && '*'}</label>
            <input type="email" placeholder={role === 'vendor' ? "vendor@example.com" : "user@example.com"} value={email} onChange={(event) => setEmail(event.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-600 outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Password {role === 'vendor' && '*'}</label>
            <input type="password" placeholder="Min 8 characters" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-600 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Confirm Password {role === 'vendor' && '*'}</label>
            <input type="password" placeholder="Repeat password" value={passwordConfirmation} onChange={(event) => setPasswordConfirmation(event.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-600 outline-none" />
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 text-white font-medium py-3 rounded-md hover:bg-indigo-700 transition-colors mt-2"
        >
          {isSubmitting ? 'Creating account...' : role === 'customer' ? 'Create Account →' : 'Register Store →'}
        </button>

        <p className="text-center text-sm text-gray-600 mt-6">
          {role === 'customer' ? 'Already have an account?' : 'Already a vendor?'} <Link to="/login" className="text-indigo-600 font-medium hover:underline">Sign In</Link>
        </p>
      </form>
    </AuthLayout>
  );
}