import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useWallet } from "../context/WalletContext";

export const MainLayout = () => {
  const { user, logout } = useAuth();
  const { balances } = useWallet();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Top Bar / Header */}
      <header className="bg-indigo-600 text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold tracking-tight text-white">
            ZinYaw<span className="text-rose-400">.</span>
          </Link>

          {/* Real-time MMK Wallet Badge */}
          {user && (
            <Link
              to="/account/wallet"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm transition"
            >
              <span className="text-xs opacity-80">MMK Wallet:</span>
              <span>{balances.walletBalanceMmk?.toLocaleString()} MMK</span>
            </Link>
          )}

          {/* User Nav */}
          <nav className="flex items-center gap-4 text-sm font-medium">
            <Link to="/catalog/base-products" className="hover:text-rose-200">
              Catalog
            </Link>
            {user ? (
              <>
                <Link to="/account/orders" className="hover:text-rose-200">
                  My Orders
                </Link>
                <button
                  onClick={logout}
                  className="bg-indigo-700 hover:bg-indigo-800 px-3 py-1 rounded-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-rose-500 hover:bg-rose-600 px-4 py-1.5 rounded-lg font-semibold"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Main Page Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          <p>
            © 2026 ZinYaw Dropshipping Platform. Protected by MMK Escrow
            Guarantee.
          </p>
        </div>
      </footer>
    </div>
  );
};
