# Stage 5: React Frontend Architecture Specification (v2.0 - Direct MMK Architecture)

**Project Title:** Direct MMK Multi-Vendor Dropshipping Platform  
**Tech Stack:** React (Frontend) + Laravel REST API (Backend)  
**Document Version:** 2.0.0  
**Status:** REVISED ARCHITECTURE FOR DIRECT MMK WALLET  

---

## 1. Directory Blueprint (`src/`)

```text
src/
├── services/               # HTTP API Client & Modular Service Layer
│   ├── api.js              # Base Axios instance with Sanctum Bearer token & 401 handler
│   ├── authService.js      # Register, Login, Profile, Address Book
│   ├── walletService.js    # MMK Top-up initiation, Bank Slip upload, Vendor Cash-outs
│   ├── catalogService.js   # Category tree, Base Product catalog (priced in MMK)
│   ├── vendorService.js    # Store listings, Variant management, Token purchases, Order shipping
│   ├── orderService.js     # MMK Escrow checkout, Order history, Delivery confirmation
│   └── adminService.js     # Product moderation, Slip verification, Cash-out approvals
├── context/                # Global React State Providers
│   ├── AuthContext.jsx     # User authentication state & Sanctum token handler
│   └── WalletContext.jsx   # Live balance tracking (MMK Wallet, Withdrawable MMK, MMK Escrow, Vendor Tokens)
├── routes/                 # React Router v6 Tree & Access Control Guards
│   ├── AppRoutes.jsx       # Master URL route tree
│   ├── ProtectedRoute.jsx  # Sanctum auth guard
│   └── RoleGuard.jsx       # Role-Based Access Control (`vendor`, `admin`)
├── layouts/                # Structural Shells
│   ├── MainLayout.jsx      # Customer Storefront (Header with MMK Balance Badge, Cart Drawer)
│   ├── VendorLayout.jsx    # Vendor Portal (Sidebar, Token Quota Badge)
│   └── AdminLayout.jsx     # Admin Control Center
└── pages/                  # Page Components
```

---

## 2. Updated Global Wallet Context (`src/context/WalletContext.jsx`)

The React `WalletContext` tracks direct MMK wallet balances and Listing Tokens in real time across top-ups, checkout actions, and delivery confirmations.

```javascript
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

  const refreshWallet = async () => {
    if (!user) return;
    try {
      const res = await authService.getProfile();
      if (res.success && res.data.wallet) {
        setBalances({
          walletBalanceMmk: parseFloat(res.data.wallet.wallet_balance_mmk || 0),
          withdrawableMmk: parseFloat(res.data.wallet.withdrawable_balance_mmk || 0),
          escrowMmk: parseFloat(res.data.wallet.escrow_balance_mmk || 0),
          vendorTokens: res.data.vendor ? res.data.vendor.token_balance : 0,
        });
      }
    } catch (err) {
      console.error('Failed to sync MMK wallet balance:', err);
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
```

---

## 3. Modular Service Layer Updates (MMK Currency Mapping)

1. **`walletService.js`**:
   - `initiateTopup(gateway, amountMmk)`: Initiates instant digital payment for MMK top-up.
   - `submitBankSlip(formData)`: Submits screenshot proof for MMK manual wallet credit.
2. **`orderService.js`**:
   - `checkout(payload)`: Deducts total MMK amount from customer's available `walletBalanceMmk` and locks it into MMK Escrow.
   - `confirmDelivery(itemId)`: Releases MMK escrow funds directly into vendor's withdrawable wallet balance.
3. **`vendorService.js`**:
   - `purchaseTokens(tokenQuantity)`: Converts MMK wallet balance into Vendor Listing Tokens (e.g., 10,000 MMK = 10 Listing Tokens).
