import React from "react";
import { Outlet, Link } from "react-router-dom";
import { useWallet } from "../context/WalletContext";

export const VendorLayout = () => {
  const { balances } = useWallet();

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 font-bold text-xl border-b border-slate-800">
          ZinYaw{" "}
          <span className="text-indigo-400 text-sm font-normal">Vendor</span>
        </div>
        <nav className="flex-1 p-4 space-y-2 text-sm font-medium">
          <Link
            to="/vendor/dashboard"
            className="block px-3 py-2 rounded hover:bg-slate-800"
          >
            Dashboard
          </Link>
          <Link
            to="/vendor/listings"
            className="block px-3 py-2 rounded hover:bg-slate-800"
          >
            Listings
          </Link>
          <Link
            to="/vendor/orders"
            className="block px-3 py-2 rounded hover:bg-slate-800"
          >
            Orders
          </Link>
          <Link
            to="/vendor/wallet"
            className="block px-3 py-2 rounded hover:bg-slate-800"
          >
            Earnings Wallet
          </Link>
          <Link
            to="/vendor/tokens"
            className="block px-3 py-2 rounded hover:bg-slate-800"
          >
            Token Shop
          </Link>
        </nav>
      </aside>

      {/* Content Area */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
          <h1 className="font-semibold text-lg text-slate-800">
            Vendor Control Panel
          </h1>
          <div className="flex gap-3">
            <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">
              Tokens: {balances.vendorTokens}
            </span>
            <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
              Withdrawable: {balances.withdrawableMmk?.toLocaleString()} MMK
            </span>
          </div>
        </header>
        <main className="p-6 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
