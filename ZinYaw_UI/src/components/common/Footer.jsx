import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <Link to="/" className="text-2xl font-black text-white tracking-tight">
            ZinYaw<span className="text-rose-500">.</span>
          </Link>
          <p className="text-xs text-slate-400 leading-relaxed">
            A clearer way to shop from trusted Myanmar sellers. Your payment stays protected until your order is complete.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-black text-white uppercase tracking-wider mb-3">Shop</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/catalog" className="hover:text-white transition">All products</Link></li>
            <li><Link to="/catalog?sort=new" className="hover:text-white transition">New arrivals</Link></li>
            <li><Link to="/catalog?type=stores" className="hover:text-white transition">Trusted stores</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-black text-white uppercase tracking-wider mb-3">Customer care</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/help/faq" className="hover:text-white transition">Help centre</Link></li>
            <li><Link to="/help/shipping" className="hover:text-white transition">Shipping & delivery</Link></li>
            <li><Link to="/help/returns" className="hover:text-white transition">Returns</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-black text-white uppercase tracking-wider mb-3">About ZinYaw</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/about" className="hover:text-white transition">About us</Link></li>
            <li><Link to="/vendor/dashboard" className="hover:text-white transition">Seller centre</Link></li>
            <li><Link to="/terms" className="hover:text-white transition">Terms</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-12 pt-6 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
        <span>© 2026 ZinYaw Marketplace. All rights reserved.</span>
        <span className="font-bold text-slate-300">Secure MMK Wallet • Escrow protected</span>
      </div>
    </footer>
  );
}