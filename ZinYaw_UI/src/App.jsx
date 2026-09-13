import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WalletProvider } from './context/WalletContext';
import { CartProvider } from './context/CartContext';
import { AppRoutes } from './routes/AppRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WalletProvider>
          <CartProvider>
            <AppRoutes />
          </CartProvider>
        </WalletProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}