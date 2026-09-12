import React from "react";
import { Outlet, Link } from "react-router-dom";

export const AdminLayout = () => {
  return (
    <div className="min-h-screen flex bg-slate-900 text-slate-100">
      <aside className="w-64 bg-slate-950 p-6 border-r border-slate-800">
        <div className="font-bold text-lg mb-8 text-rose-500">ZinYaw Admin</div>
        <nav className="space-y-3 text-sm font-medium">
          <Link
            to="/admin/dashboard"
            className="block text-slate-300 hover:text-white"
          >
            Dashboard
          </Link>
          <Link
            to="/admin/moderation/base-products"
            className="block text-slate-300 hover:text-white"
          >
            Product Queue
          </Link>
          <Link
            to="/admin/payments/bank-slips"
            className="block text-slate-300 hover:text-white"
          >
            Bank Slips
          </Link>
          <Link
            to="/admin/finance/cashouts"
            className="block text-slate-300 hover:text-white"
          >
            Cash-Outs
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
