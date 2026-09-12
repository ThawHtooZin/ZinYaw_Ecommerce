import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { authService } from '../services/authService';

const WalletContext = createContext(null);

export const WalletProvider = ({ children }) => {
  const { user } = useAuth();
  const [balances, setBalances] = useState({
    buyerCoins: 0,
    withdrawable: 0,
    escrow: 0,
    vendorTokens: 0,
  });

  const refreshWallet = async () => {
    if (!user) return;
    try {
      const res = await authService.getProfile();
      if (res.success && res.data.wallet) {
        setBalances({
          buyerCoins: parseFloat(res.data.wallet.buyer_coin_balance || 0),
          withdrawable: parseFloat(res.data.wallet.withdrawable_balance || 0),
          escrow: parseFloat(res.data.wallet.escrow_balance || 0),
          vendorTokens: res.data.vendor ? res.data.vendor.token_balance : 0,
        });
      }
    } catch (err) {
      console.error('Failed to sync wallet balance:', err);
    }
  };

  useEffect(() => {
    refreshWallet();
  }, [user]);

  return (
    <WalletContext.Provider value={{ balances, refreshWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);