# Stage 6: React Route Manifest & UI Architecture Blueprint

## Executive Overview
This document provides the complete, production-ready React Router v6 manifest for the **ZinYaw Dual-Currency Multi-Vendor Dropshipping Platform**. It serves as the bridge between our Laravel REST API backend (v2.0) and our React frontend UI implementation.

---

## Comparative Benchmark: Athuthu (`athuthu.com`) vs. ZinYaw Platform

| Benchmark Dimension | Athuthu (`athuthu.com`) | ZinYaw Dropshipping Platform |
| :--- | :--- | :--- |
| **Business Model** | 1PL Single-Agent Sourcing (China to Myanmar) | Multi-Vendor Dropshipping Marketplace |
| **User Roles** | Customer/Buyer only | Customer, Vendor, Admin |
| **Currency System** | Direct MMK pricing with Bank Transfer guides | **Buyer Coins** (1:1 MMK) & **Vendor Listing Tokens** |
| **Financial Protection** | Manual Warehouse Inspection | **System Escrow Hold** & Delivery Confirmation Release |
| **Catalog Architecture** | Imported Marketplace Listings (1688/Taobao) | **Global Base Product Catalog** with Vendor Listing Offers |
| **Total Route Count** | ~32 Client Routes | **~48 Production React Routes** |

---

## Application Architecture & Context Hierarchy

```jsx
<BrowserRouter>
  <AuthProvider>
    <WalletProvider>
      <CartProvider>
        <AppRoutes />
      </CartProvider>
    </WalletProvider>
  </AuthProvider>
</BrowserRouter>
```

### Route Protection Scopes
1. **Public Scope**: Accessible by any visitor (Storefront, Catalog, Auth pages).
2. **`ProtectedRoute`**: Requires valid Sanctum Auth Token (Customer Account, Cart Checkout, Order History).
3. **`RoleGuard(['vendor', 'admin'])`**: Restricts access to verified vendor accounts or admins (Vendor Portal).
4. **`RoleGuard(['admin'])`**: Restricts access exclusively to system administrators (Admin Control Center).

---

## Comprehensive Master Route Tree (~48 Routes)

### 1. Area 1: Public Storefront Portal (`MainLayout`)
| Route Path | Component View | Description & Connected Endpoint |
| :--- | :--- | :--- |
| `/` | `HomePage` | Hero banner, category grid, top products (`GET /catalog/categories`, `GET /catalog/base-products`) |
| `/products` | `ProductCatalogPage` | Filterable global catalog grid with search and pagination (`GET /catalog/base-products`) |
| `/products/:id` | `ProductDetailPage` | Base product details, vendor offer matrix, variant picker (`GET /catalog/base-products/{id}`) |
| `/categories/:id` | `CategoryProductsPage` | Category-filtered base product list (`GET /catalog/base-products?category_id={id}`) |
| `/catalog/request` | `RequestProductPage` | Form for requesting new Base Product additions (`POST /catalog/base-products/request`) |
| `/help/payment-guide` | `PaymentGuidePage` | Instructions for KBZPay, AYA Pay, and Bank Slip transfers |
| `/help/escrow-faq` | `EscrowFaqPage` | Information on Buyer Coin escrow protection mechanisms |

### 2. Area 2: Auth Shell (`AuthLayout`)
| Route Path | Component View | Description & Connected Endpoint |
| :--- | :--- | :--- |
| `/login` | `LoginPage` | Email/Phone + Password login (`POST /auth/login`) |
| `/register` | `RegisterPage` | Customer / Vendor registration form (`POST /auth/register`) |

### 3. Area 3: Protected Customer & Escrow Hub (`MainLayout` + `ProtectedRoute`)
| Route Path | Component View | Description & Connected Endpoint |
| :--- | :--- | :--- |
| `/cart` | `CartPage` | Cart items, quantity adjusters, subtotal in Coins |
| `/checkout` | `CheckoutPage` | Address selector, escrow lock order placement (`POST /orders/checkout`) |
| `/account/profile` | `ProfilePage` | Account details & profile overview (`GET /profile/me`) |
| `/account/addresses` | `AddressBookPage` | Address list & new address modal (`GET /profile/addresses`, `POST /profile/addresses`) |
| `/account/wallet` | `CustomerWalletPage` | Buyer Coin balance, transaction log, top-up modal (`POST /payments/topup/initiate`, `POST /payments/topup/bank-slip`) |
| `/account/orders` | `OrderHistoryPage` | Order history with escrow badges (`GET /orders`) |
| `/account/orders/:id` | `OrderDetailPage` | Item tracking, courier info, confirm delivery (`GET /orders/{id}`, `POST /orders/{id}/confirm-delivery`) |

### 4. Area 4: Protected Vendor Portal (`VendorLayout` + `RoleGuard['vendor', 'admin']`)
| Route Path | Component View | Description & Connected Endpoint |
| :--- | :--- | :--- |
| `/vendor/dashboard` | `VendorDashboard` | Store metrics, token balance, escrow balance overview |
| `/vendor/listings` | `VendorListingsPage` | Active store listings table (`GET /vendor/listings`) |
| `/vendor/listings/create` | `CreateListingPage` | Create store listing (consumes 1 Token) (`POST /vendor/listings`) |
| `/vendor/listings/:id/edit` | `EditListingPage` | Update listing price/stock (`PUT /vendor/listings/{id}`) |
| `/vendor/orders` | `VendorOrdersPage` | Orders requiring fulfillment (`GET /vendor/orders`) |
| `/vendor/orders/:id/ship` | `ShipOrderModal` | Input courier name & tracking # (`POST /vendor/orders/{id}/ship`) |
| `/vendor/wallet` | `VendorWalletPage` | Withdrawable balance, cash-out request modal (`POST /vendor/cashout`) |
| `/vendor/tokens` | `TokenShopPage` | Purchase Vendor Listing Tokens (`POST /vendor/tokens/purchase`) |

### 5. Area 5: Protected Admin Control Center (`AdminLayout` + `RoleGuard['admin']`)
| Route Path | Component View | Description & Connected Endpoint |
| :--- | :--- | :--- |
| `/admin/dashboard` | `AdminDashboard` | Platform summary, pending task queues |
| `/admin/moderation` | `ProductModerationPage` | Review pending base product submissions (`GET /admin/base-products/pending`) |
| `/admin/moderation/:id` | `ProductReviewModal` | Approve or reject base products (`POST /admin/base-products/{id}/approve`, `POST /admin/base-products/{id}/reject`) |
| `/admin/payments/bank-slips` | `BankSlipVerificationPage` | Verify uploaded bank transfer slips (`GET /admin/payments/slips/pending`, `POST /admin/payments/slips/{id}/verify`) |
| `/admin/finance/cashouts` | `AdminCashoutPage` | Review vendor withdrawal requests (`GET /admin/cashouts/pending`, `POST /admin/cashouts/{id}/approve`) |

---

## Handoff Blueprint for UI Generation (Claude Code)
1. **Routing Setup**: Implement `src/routes/AppRoutes.jsx` mapping all ~48 routes to their layout wrappers and route guards.
2. **Layout Shells**: Implement `MainLayout`, `VendorLayout`, and `AdminLayout` with interactive headers, sidebars, and wallet badges.
3. **View Components**: Build Tailwind CSS screens for Storefront, Customer Wallet, Vendor Dashboard, and Admin Control Center.
