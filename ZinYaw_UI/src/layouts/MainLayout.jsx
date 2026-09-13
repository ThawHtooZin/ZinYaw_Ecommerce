import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Shared Storefront Header */}
      <Navbar />

      {/* Main Page Body */}
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      {/* Shared Escrow Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;