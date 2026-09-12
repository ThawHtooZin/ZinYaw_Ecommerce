# Stage 6: React Route Manifest & UI Architecture Blueprint (v2.0 - Direct MMK Architecture)

## Executive Overview
This document provides the revised React Router v6 route manifest for the **ZinYaw Direct MMK Multi-Vendor Dropshipping Platform**. It reflects the platform pivot from abstract virtual coins to a **Direct MMK Wallet & Escrow Protection Engine**.

---

## Benchmark Comparison: Athuthu (`athuthu.com`) vs. ZinYaw Platform (Updated)

| Benchmark Dimension | Athuthu (`athuthu.com`) | ZinYaw Dropshipping Platform |
| :--- | :--- | :--- |
| **Business Model** | 1PL Single-Agent Sourcing (China to Myanmar) | Multi-Vendor Dropshipping Marketplace |
| **User Roles** | Customer/Buyer only | Customer, Vendor, Admin |
| **Currency & Wallet** | Direct MMK pricing via bank transfer guides | **Direct MMK Fiat Wallet** & **Vendor Listing Tokens** |
| **Financial Protection** | Manual Warehouse Inspection | **MMK Escrow Hold** & Delivery Confirmation Release |
| **Catalog Architecture** | Imported Marketplace Listings (1688/Taobao) | **Global Base Product Catalog** with Vendor Offer Listings |
| **Total Route Count** | ~32 Client Routes | **~48 Production React Routes** |

---

## Route Scopes & Layout Architecture

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

---

## Comprehensive Master Route Tree (~48 Routes)

### 1. Area 1: Public Storefront Portal (`MainLayout`)
| Route Path | Component View | UI Display & Connected Endpoint |
| :--- | :--- | :--- |
| `/` | `HomePage` | Hero banner, category grid, top products in MMK (`GET /catalog/categories`, `GET /catalog/base-products`) |
| `/products` | `ProductCatalogPage` | Global catalog grid filterable by category and price in MMK (`GET /catalog/base-products`) |
| `/products/:id` | `ProductDetailPage` | Base product specs, multi-vendor MMK offers, variant picker (`GET /catalog/base-products/{id}`) |
| `/help/payment-guide` | `PaymentGuidePage` | Direct MMK top-up guide (KBZPay, AYA Pay, Bank Slip uploads) |
| `/help/escrow-faq` | `EscrowFaqPage` | Information on MMK Escrow protection and delivery guarantees |

### 2. Area 2: Auth Shell (`AuthLayout`)
| Route Path | Component View | Connected Endpoint |
| :--- | :--- | :--- |
| `/login` | `LoginPage` | Email/Phone login (`POST /auth/login`) |
| `/register` | `RegisterPage` | Registration with auto MMK Wallet initialization (`POST /auth/register`) |

### 3. Area 3: Protected Customer & Escrow Hub (`MainLayout` + `ProtectedRoute`)
| Route Path | Component View | UI Display & Connected Endpoint |
| :--- | :--- | :--- |
| `/cart` | `CartPage` | Cart items, quantity adjusters, subtotal calculated in MMK |
| `/checkout` | `CheckoutPage` | Address selector, MMK Escrow order lock (`POST /orders/checkout`) |
| `/account/wallet` | `CustomerWalletPage` | **MMK Wallet Balance**, top-up modal, transaction log (`POST /payments/topup/*`) |
| `/account/orders` | `OrderHistoryPage` | Order history with itemized MMK Escrow status badges (`GET /orders`) |
| `/account/orders/:id` | `OrderDetailPage` | Courier tracking, **"Confirm Delivery"** MMK release trigger (`POST /orders/{id}/confirm-delivery`) |

### 4. Area 4: Protected Vendor Portal (`VendorLayout` + `RoleGuard['vendor', 'admin']`)
| Route Path | Component View | UI Display & Connected Endpoint |
| :--- | :--- | :--- |
| `/vendor/dashboard` | `VendorDashboard` | Store earnings, active MMK escrow holds, vendor token quota |
| `/vendor/listings` | `VendorListingsPage` | Active store listings table in MMK (`GET /vendor/listings`) |
| `/vendor/listings/create` | `CreateListingPage` | Create store listing (consumes 1 Vendor Token) (`POST /vendor/listings`) |
| `/vendor/orders` | `VendorOrdersPage` | Orders requiring shipping fulfillment (`GET /vendor/orders`) |
| `/vendor/wallet` | `VendorWalletPage` | Withdrawable MMK balance, cash-out request form (`POST /vendor/cashout`) |
| `/vendor/tokens` | `TokenShopPage` | Purchase Vendor Listing Tokens with MMK wallet balance (`POST /vendor/tokens/purchase`) |

### 5. Area 5: Protected Admin Control Center (`AdminLayout` + `RoleGuard['admin']`)
| Route Path | Component View | UI Display & Connected Endpoint |
| :--- | :--- | :--- |
| `/admin/dashboard` | `AdminDashboard` | System metrics, pending bank slip queue, pending cashouts |
| `/admin/moderation` | `ProductModerationPage` | Approve or reject user-submitted base products (`POST /admin/base-products/{id}/*`) |
| `/admin/payments/bank-slips` | `BankSlipVerificationPage` | Verify uploaded bank transfer slips and credit MMK (`POST /admin/payments/slips/{id}/verify`) |
| `/admin/finance/cashouts` | `AdminCashoutPage` | Review and approve vendor MMK cashout payouts (`POST /admin/cashouts/{id}/approve`) |
