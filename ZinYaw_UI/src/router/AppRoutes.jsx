import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleGuard } from './RoleGuard';

// Placeholder views for initial setup
const Home = () => <div className="p-8">Customer Storefront Home</div>;
const Login = () => <div className="p-8">Login Page</div>;
const Register = () => <div className="p-8">Register Page</div>;
const Orders = () => <div className="p-8">Order History & Escrow Tracking</div>;
const VendorDashboard = () => <div className="p-8">Vendor Control Panel</div>;
const AdminDashboard = () => <div className="p-8">Admin Moderation Dashboard</div>;

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Customer Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/orders" element={<Orders />} />
      </Route>

      {/* Vendor Portal Routes (Vendor & Admin allowed) */}
      <Route element={<RoleGuard allowedRoles={['vendor', 'admin']} />}>
        <Route path="/vendor/dashboard" element={<VendorDashboard />} />
      </Route>

      {/* Admin Portal Routes (Admin only) */}
      <Route element={<RoleGuard allowedRoles={['admin']} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
};