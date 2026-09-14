# Stage 5: React Frontend Architecture & Service Layer Specification

**Project Title:** Dual-Currency Multi-Vendor Dropshipping Platform  
**Tech Stack:** React (Frontend) + Laravel REST API (Backend)  
**Document Version:** 1.0.0  
**Status:** ARCHITECTURE & SERVICE LAYER COMPLETED  

---

## 1. 📁 React Project Directory Blueprint

The React frontend (`src/`) is structured around clean separation of concerns, isolating HTTP communication into services, global state into providers, and access control into route guards.

```text
src/
├── services/               # HTTP API Client & Modular Service Layer
│   ├── api.js              # Base Axios instance with Sanctum Bearer token interceptor & 401 redirect
│   ├── authService.js      # Register, Login, Logout, Profile, Address Book
│   ├── walletService.js    # Top-up initiation, Bank Slip upload, Vendor Cash-outs
│   ├── catalogService.js   # Category tree, Base Product catalog, Base Product requests
│   ├── vendorService.js    # Store listings, Variant management, Token quota purchases, Order shipping
│   ├── orderService.js     # Escrow checkout, Customer order history, Delivery confirmation
│   └── adminService.js     # Product moderation (approve/reject), Slip verification, Cash-out approvals
├── context/                # Global React State Providers
│   ├── AuthContext.jsx     # User authentication state, token storage, login/logout handlers
│   └── WalletContext.jsx   # Live balance tracking (Buyer Coins, Withdrawable, Escrow, Vendor Tokens)
├── routes/                 # React Router v6 Hierarchy & Protection
│   ├── AppRoutes.jsx       # Master URL route tree
│   ├── ProtectedRoute.jsx  # Sanctum auth guard for authenticated users
│   └── RoleGuard.jsx       # RBAC guard for Vendor (`vendor`) and Admin (`admin`) access
├── layouts/                # Structural Shells (To be implemented in Step 2)
│   ├── MainLayout.jsx      # Customer Storefront layout (Navbar, Category Bar, Footer)
│   ├── VendorLayout.jsx    # Vendor Portal layout (Sidebar, Store header, Token Badge)
│   └── AdminLayout.jsx     # Admin Control Center layout (Control panel sidebar)
└── pages/                  # Page Components (To be implemented in Step 2)
```

---

## 2. 🔌 Modular Service Layer (`src/services/`)

The service layer wraps all HTTP communications into asynchronous JavaScript modules. UI components invoke service methods directly rather than executing raw `axios` calls.

### 2.1 Base Axios Client (`src/services/api.js`)
* Configures base URL from `REACT_APP_API_URL` or defaults to `/api/v1`.
* **Request Interceptor**: Automatically pulls Sanctum `Bearer` token from `localStorage` and appends it to request headers.
* **Response Interceptor**: Catches `401 Unauthorized` responses, clears local session storage, and redirects the client to `/login`.

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://api.yourdomain.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 2.2 Auth Service (`src/services/authService.js`)
Handles registration, login credentials, token teardown, profile retrieval, and address management.

```javascript
import api from './api';

export const authService = {
  register: async (payload) => {
    const response = await api.post('/auth/register', payload);
    return response.data;
  },
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get('/profile/me');
    return response.data;
  },
  getAddresses: async () => {
    const response = await api.get('/profile/addresses');
    return response.data;
  },
  addAddress: async (payload) => {
    const response = await api.post('/profile/addresses', payload);
    return response.data;
  },
};
```

### 2.3 Wallet Service (`src/services/walletService.js`)
Manages dual-currency wallet top-ups (KBZPay/AYA Pay API QR codes), manual bank slip uploads (`multipart/form-data`), and vendor cash-out payouts.

```javascript
import api from './api';

export const walletService = {
  initiateTopup: async (gateway, amountMmk) => {
    const response = await api.post('/payments/topup/initiate', {
      gateway,
      amount_mmk: amountMmk,
    });
    return response.data;
  },
  submitBankSlip: async (formData) => {
    const response = await api.post('/payments/topup/bank-slip', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  requestCashout: async (payload) => {
    const response = await api.post('/vendor/cashout', payload);
    return response.data;
  },
};
```

### 2.4 Catalog Service (`src/services/catalogService.js`)
Serves public catalog categories, approved base products, detail views, and base product requests.

```javascript
import api from './api';

export const catalogService = {
  getCategories: async () => {
    const response = await api.get('/catalog/categories');
    return response.data;
  },
  getBaseProducts: async (params = {}) => {
    const response = await api.get('/catalog/base-products', { params });
    return response.data;
  },
  getBaseProductById: async (id) => {
    const response = await api.get(`/catalog/base-products/${id}`);
    return response.data;
  },
  requestBaseProduct: async (payload) => {
    const response = await api.post('/catalog/base-products/request', payload);
    return response.data;
  },
};
```

### 2.5 Vendor Service (`src/services/vendorService.js`)
Handles store listings, variant inventory management, vendor listing token purchases, and order fulfillment shipping.

```javascript
import api from './api';

export const vendorService = {
  getListings: async () => {
    const response = await api.get('/vendor/listings');
    return response.data;
  },
  createListing: async (payload) => {
    const response = await api.post('/vendor/listings', payload);
    return response.data;
  },
  updateListing: async (id, payload) => {
    const response = await api.put(`/vendor/listings/${id}`, payload);
    return response.data;
  },
  purchaseTokens: async (tokenQuantity) => {
    const response = await api.post('/vendor/tokens/purchase', {
      token_quantity: tokenQuantity,
    });
    return response.data;
  },
  getVendorOrders: async () => {
    const response = await api.get('/vendor/orders');
    return response.data;
  },
  shipOrderItem: async (itemId, payload) => {
    const response = await api.post(`/vendor/orders/${itemId}/ship`, payload);
    return response.data;
  },
};
```

### 2.6 Order Service (`src/services/orderService.js`)
Executes escrow checkout, retrieves order history, and releases escrow funds upon delivery confirmation.

```javascript
import api from './api';

export const orderService = {
  checkout: async (payload) => {
    const response = await api.post('/orders/checkout', payload);
    return response.data;
  },
  getOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },
  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
  confirmDelivery: async (itemId) => {
    const response = await api.post(`/orders/${itemId}/confirm-delivery`);
    return response.data;
  },
};
```

### 2.7 Admin Service (`src/services/adminService.js`)
Handles moderation of pending base products, bank slip verification, and vendor cash-out approvals.

```javascript
import api from './api';

export const adminService = {
  getDashboardSummary: async () => {
    const response = await api.get('/admin/dashboard/summary');
    return response.data;
  },
  getPendingBaseProducts: async () => {
    const response = await api.get('/admin/base-products/pending');
    return response.data;
  },
  approveBaseProduct: async (id) => {
    const response = await api.post(`/admin/base-products/${id}/approve`);
    return response.data;
  },
  rejectBaseProduct: async (id, rejectionReason) => {
    const response = await api.post(`/admin/base-products/${id}/reject`, {
      rejection_reason: rejectionReason,
    });
    return response.data;
  },
  getPendingSlips: async () => {
    const response = await api.get('/admin/payments/slips/pending');
    return response.data;
  },
  verifySlip: async (id) => {
    const response = await api.post(`/admin/payments/slips/${id}/verify`);
    return response.data;
  },
  getPendingCashouts: async () => {
    const response = await api.get('/admin/cashouts/pending');
    return response.data;
  },
  approveCashout: async (id) => {
    const response = await api.post(`/admin/cashouts/${id}/approve`);
    return response.data;
  },
};
```

---

## 3. ⚛️ Global State Contexts (`src/context/`)

### 3.1 `AuthContext.jsx`
Manages global user session, token persistence in `localStorage`, session restoration on boot, and login/logout handlers.

```javascript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authService.getProfile()
        .then((res) => {
          if (res.success) {
            setUser(res.data);
            localStorage.setItem('user', JSON.stringify(res.data));
          }
        })
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    if (res.success) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
    }
    return res;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

### 3.2 `WalletContext.jsx`
Tracks real-time digital currency balances across **Buyer Coins**, **Withdrawable Balance**, **Escrow Holds**, and **Vendor Tokens**. Automatically triggers a balance refresh after top-up or checkout operations.

```javascript
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
```

---

## 4. 🚦 Route Protection & Security Guards (`src/routes/`)

### 4.1 Protected Route Guard (`src/routes/ProtectedRoute.jsx`)
Ensures that unauthenticated guests cannot access protected customer routes (`/orders`, `/profile`).

```javascript
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};
```

### 4.2 Role-Based Access Guard (`src/routes/RoleGuard.jsx`)
Restricts portal access based on assigned user authorization role (`customer`, `vendor`, `admin`).

```javascript
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const RoleGuard = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return allowedRoles.includes(user.role) ? <Outlet /> : <Navigate to="/" replace />;
};
```

### 4.3 App Route Tree (`src/routes/AppRoutes.jsx`)
Maps master route URLs to their protected layouts and views.

```javascript
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleGuard } from './RoleGuard';

const Home = () => <div className="p-8">Customer Storefront Home</div>;
const Login = () => <div className="p-8">Login Page</div>;
const Register = () => <div className="p-8">Register Page</div>;
const Orders = () => <div className="p-8">Order History & Escrow Tracking</div>;
const VendorDashboard = () => <div className="p-8">Vendor Control Panel</div>;
const AdminDashboard = () => <div className="p-8">Admin Moderation Dashboard</div>;

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Storefront Routes */}
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

      {/* Admin Control Center Routes (Admin only) */}
      <Route element={<RoleGuard allowedRoles={['admin']} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
};
```

---

## 🔄 5. End-to-End Data Flow Execution Blueprint

```text
+-----------------------------------------------------------------------------------+
|                                 REACT FRONTEND                                    |
|                                                                                   |
|   [ React Component ]                                                             |
|           |                                                                       |
|           v                                                                       |
|   [ Service Function ]  ---- (e.g. orderService.checkout)                         |
|           |                                                                       |
|           v                                                                       |
|   [ Axios Interceptor ] ---- (Injects Sanctum Bearer Token from localStorage)     |
+-----------|-----------------------------------------------------------------------+
            | (HTTP POST /api/v1/orders/checkout)
            v
+-----------------------------------------------------------------------------------+
|                                LARAVEL REST API                                   |
|                                                                                   |
|   [ api.php Route ] ---> [ Sanctum Middleware ] ---> [ OrderController ]          |
|                                                            |                      |
|                                                            v                      |
|                                                    [ DB Transaction ]             |
|                                                    - Deduct Buyer Coins           |
|                                                    - Lock Funds in Escrow         |
|                                                    - Decrement Inventory          |
+-----------|-----------------------------------------------------------------------+
            |
            | (HTTP 201 Created JSON Response)
            v
+-----------------------------------------------------------------------------------+
|                                 REACT FRONTEND                                    |
|                                                                                   |
|   [ Component Callback ] ---> [ WalletContext.refreshWallet() ]                   |
|                                         |                                         |
|                                         v                                         |
|                               [ UI Top Bar Updated ]                              |
|                               (Buyer Coin balance badge decreases dynamically)    |
+-----------------------------------------------------------------------------------+
```
