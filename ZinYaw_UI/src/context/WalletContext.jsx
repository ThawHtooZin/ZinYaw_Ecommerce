// src/context/WalletContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { authService } from '../services/authService';

const WalletContext = createContext(null);

export const WalletProvider = ({ children }) => {
  const { user } = useAuth();

  const [balances, setBalances] = useState({
    walletBalanceMmk: 0,
    withdrawableMmk: 0,
    escrowMmk: 0,
    vendorTokens: 0,
  });

  // Re-synchronize balances from backend profile/me endpoint
  const refreshWallet = async () => {
    if (!user) {
      setBalances({
        walletBalanceMmk: 0,
        withdrawableMmk: 0,
        escrowMmk: 0,
        vendorTokens: 0,
      });
      return;
    }

    try {
      const res = await authService.getProfile();
      const wallet = res?.data?.wallet;
      const vendor = res?.data?.vendor;

      if (wallet) {
        setBalances({
          walletBalanceMmk: parseFloat(wallet.wallet_balance_mmk || wallet.buyer_coin_balance || 0),
          withdrawableMmk: parseFloat(wallet.withdrawable_balance_mmk || wallet.withdrawable_balance || 0),
          escrowMmk: parseFloat(wallet.escrow_balance_mmk || wallet.escrow_balance || 0),
          vendorTokens: vendor ? vendor.token_balance : 0,
        });
      }
    } catch (err) {
      console.error('Failed to sync MMK wallet:', err.message);
    }
  };

  // Trigger synchronization whenever the authenticated user identity changes
  useEffect(() => {
    refreshWallet();
  }, [user]);

  return (
    <WalletContext.Provider value={{ balances, refreshWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};