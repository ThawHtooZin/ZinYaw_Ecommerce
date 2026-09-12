import React from "react";
import { Outlet, Link } from "react-router-dom";

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4">
      <Link to="/" className="text-3xl font-extrabold text-indigo-600 mb-6">
        ZinYaw<span className="text-rose-500">.</span>
      </Link>
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <Outlet />
      </div>
    </div>
  );
};
