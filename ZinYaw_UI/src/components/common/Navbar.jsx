import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWallet } from '../../context/WalletContext';
import { useCart } from '../../context/CartContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { balances } = useWallet();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      setIsLoggingOut(true);
      await logout();
      navigate('/login', { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-50">
      {/* 1. Top Announcement Bar */}
      <div className="bg-indigo-950 text-slate-300 text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span>Myanmar's trusted multi-vendor marketplace</span>
          <div className="flex items-center gap-4">
            <Link to="/vendor/dashboard" className="hover:text-white transition">Sell on ZinYaw</Link>
            <Link to="/help/faq" className="hover:text-white transition">Help Centre</Link>
            <span className="text-slate-500">|</span>
            <button className="hover:text-white transition font-medium">English / မြန်မာ</button>
          </div>
        </div>
      </div>

      {/* 2. Brand & Search Header */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-6">
        <Link to="/" className="text-2xl font-black text-indigo-600 tracking-tight flex items-center">
          ZinYaw<span className="text-indigo-600">.</span>
        </Link>

        {/* Search Input */}
        <div className="flex-1 max-w-2xl flex items-center">
          <input
            type="text"
            placeholder="Search products, brands and stores"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-l-lg text-sm focus:outline-none focus:border-indigo-600"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target.value.trim()) {
                navigate(`/catalog?search=${encodeURIComponent(e.target.value.trim())}`);
              }
            }}
          />
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-r-lg font-bold text-sm transition flex items-center justify-center">
            🔍
          </button>
        </div>

        {/* User & Cart Options */}
        <div className="flex items-center gap-5 text-sm font-semibold text-slate-700">
          {isAuthenticated && (
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-md">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-semibold text-emerald-800">
                {balances.walletBalanceMmk.toLocaleString()} <span className="font-bold">MMK</span>
              </span>
            </div>
          )}

          <div className="relative group">
            <Link
              to={isAuthenticated ? '/' : '/login'}
              className="flex items-center gap-1 hover:text-indigo-600"
            >
              <span>👤</span>
              <span>{user?.name || 'Account'}</span>
            </Link>

            {isAuthenticated && (
              <div className="absolute right-0 top-full hidden w-48 pt-3 group-hover:block group-focus-within:block">
                <div className="rounded-lg border border-slate-200 bg-white py-2 shadow-lg">
                  <Link
                    to="/account/notifications"
                    className="block px-4 py-3 text-sm hover:bg-slate-50"
                  >
                    Notifications
                  </Link>

                  <Link
                    to="/account/inquiries"
                    className="block px-4 py-3 text-sm hover:bg-slate-50"
                  >
                    My Inquiry
                  </Link>

                  <Link
                    to="/account/favorites"
                    className="block px-4 py-3 text-sm hover:bg-slate-50"
                  >
                    My Favorites
                  </Link>

                  <Link
                    to="/cart"
                    className="block px-4 py-3 text-sm hover:bg-slate-50"
                  >
                    Shopping Cart
                  </Link>

                  <Link
                    to="/account/orders"
                    className="block px-4 py-3 text-sm hover:bg-slate-50"
                  >
                    My Purchase
                  </Link>

                  <Link
                    to="/account/wallet"
                    className="block px-4 py-3 text-sm hover:bg-slate-50"
                  >
                    My Balance
                  </Link>

                  <Link
                    to="/account/profile"
                    className="block px-4 py-3 text-sm hover:bg-slate-50"
                  >
                    My Account
                  </Link>

                  <div className="my-2 border-t border-slate-100" />

                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="block w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                  </button>
                </div>
              </div>
            )}
          </div>

          <Link to="/cart" className="flex items-center gap-1.5 hover:text-indigo-600">
            <span>🛒</span>
            <span>Cart</span>
            {cartItems?.length > 0 && (
              <span className="bg-rose-500 text-white text-xs font-black px-2 py-0.5 rounded-full">
                {cartItems.length}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* 3. Category Sub-Navigation Bar */}
      <nav className="border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-6 text-xs font-bold text-slate-700 overflow-x-auto py-3">
          <Link to="/catalog" className="text-indigo-600 flex items-center gap-1 hover:underline">
            <span>☰</span> All categories
          </Link>
          <Link to="/catalog?sort=new" className="hover:text-indigo-600 transition">New arrivals</Link>
          <Link to="/catalog?category=electronics" className="hover:text-indigo-600 transition">Electronics</Link>
          <Link to="/catalog?category=fashion" className="hover:text-indigo-600 transition">Fashion</Link>
          <Link to="/catalog?category=home" className="hover:text-indigo-600 transition">Home & living</Link>
          <Link to="/catalog?category=beauty" className="hover:text-indigo-600 transition">Beauty</Link>
          <Link to="/catalog?category=sports" className="hover:text-indigo-600 transition">Sports</Link>
          <Link to="/catalog?sort=best" className="hover:text-indigo-600 transition">Best deals</Link>
        </div>
      </nav>
    </header>
  );
}