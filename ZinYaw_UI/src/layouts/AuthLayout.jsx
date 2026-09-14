import React from 'react';
import { Link } from 'react-router-dom';

export default function AuthLayout({ children, altLinkText, altLinkTo }) {
  return (
    <div className="min-h-screen flex">
      {/* Left Form Panel */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-24 bg-white relative">
        <div className="absolute top-8 left-8 right-8 flex justify-between items-center">
          
          {/* 1. Clickable Logo taking the user back to HomePage */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white font-bold">Z</div>
            <span className="font-bold text-xl text-gray-900">ZinYaw</span>
          </Link>

          {/* 2. Top Right Alt Link (e.g., "Sign In instead") */}
          {altLinkText && (
            <Link to={altLinkTo} className="text-sm text-indigo-600 font-medium hover:underline">
              {altLinkText}
            </Link>
          )}
        </div>

        {/* Dynamic Form Content (Login or Register) */}
        <div className="max-w-md w-full mx-auto mt-16">
          {children}
        </div>

        {/* Footer Links */}
        <div className="absolute bottom-8 left-8 right-8 flex gap-4 text-xs text-gray-400">
          <span>© 2026 ZinYaw</span>
          <div className="ml-auto flex gap-4">
            <Link to="/help/escrow-terms" className="hover:text-gray-600">Escrow Terms</Link>
            <Link to="/privacy" className="hover:text-gray-600">Privacy Policy</Link>
          </div>
        </div>
      </div>

      {/* Right Hero Image Panel */}
      <div 
        className="hidden lg:block lg:w-1/2 bg-cover bg-center" 
        style={{ backgroundImage: "url('/images/auth-hero.jpg')" }}
      />
    </div>
  );
}