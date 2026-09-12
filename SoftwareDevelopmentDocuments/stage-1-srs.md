# Software Requirements Specification (SRS)
## Stage 1: Core Architecture & System Design Specification

**Project Title:** Dual-Currency Multi-Vendor Dropshipping Platform  
**Tech Stack:** React (Frontend) + Laravel REST API (Backend)  
**Reference Benchmark:** Athuthu E-Commerce Platform (`https://www.athuthu.com/my`)  
**Document Version:** 1.0.0  
**Author / Lead:** System Architect & Lead Engineer  

---

## 1. Executive Summary & Domain Concept

The platform is a multi-vendor e-commerce dropshipping marketplace tailored for international procurement and local e-commerce distribution (with primary optimization for MMK currency and Myanmar local payment rails like KBZPay and AYA Pay).

Unlike standard single-currency platforms, this architecture operates on a **Dual Digital Currency Engine**:
1. **Buyer Coins (Shopping Balance):** 1 MMK = 1 Coin. Refilled by customers via instant merchant webhooks or manual bank slip verification.
2. **Vendor Tokens (Listing & Inventory Quota):** Purchased by merchants to list products, update stock, and publish custom variant configurations.

---

## 2. Platform User Roles & Portals

### 2.1 Customer Portal (React Storefront)
* **Authentication & Profile:** User registration, phone/OTP login, address book management (required before checkout).
* **Catalog Exploration:** Product search, category filtering, shared base product browsing, vendor store listings, variant selection.
* **Shopping Cart & Checkout:** Multi-item cart, shipping address selection, coin balance check, order placement into **Escrow**.
* **Wallet Management:** Real-time Buyer Coin balance, top-up request modal (KBZPay / AYA Pay API or Bank Slip upload), transaction history.
* **Order Tracking:** Detailed order timeline with state transitions (`PAID_IN_ESCROW`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `COMPLETED`).

### 2.2 Vendor Portal (Merchant Dashboard)
* **Base Product Requests:** Submit requests to Admin to list new products in the Global Catalog.
* **Store Listing Management:** Create custom listings under approved Base Products with custom retail prices, inventory stock, variants (color, size, material), and specific images.
* **Token Quota Management:** Purchase and consume Vendor Tokens required for inventory creation and stock updates.
* **Order Fulfillment:** Dashboard view of orders containing vendor items, status updates (`PROCESSING` -> `SHIPPED` with tracking numbers), and delivery confirmation.
* **Withdrawable Wallet:** View pending escrow balance, cleared balance from delivered orders, and submit Cash-Out/Withdrawal requests to Admin.

### 2.3 Admin Portal (Master Control Center)
* **Base Product Moderation:** Review, approve, or reject vendor Base Product creation requests.
* **Payment Slip Verification:** Fallback dashboard to verify uploaded bank transfer screenshots and manually approve credit top-ups.
* **Escrow & Financial Ledger:** Oversee global system Escrow holds, vendor cash-out requests, platform commission earnings, and token sales.
* **Platform Management:** User/Vendor account suspension, global inventory overview, system analytics, and audit logging.

---

## 3. Core Functional Workflows

### 3.1 Dual-Currency Financial Engine (1 MMK = 1 Digital Coin)

```
                    ┌─────────────────────────┐
                    │  KBZPay / AYA Pay API   │
                    └────────────┬────────────┘
                                 │ Direct Top-Up Callback
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      PLATFORM LEDGER ENGINE                     │
│                                                                 │
│   ┌───────────────────────────┐    ┌────────────────────────┐   │
│   │ 🛒 Buyer Coins            │    │ 🎫 Vendor Tokens       │   │
│   │ (1 MMK = 1 Coin)          │    │ (Listing/Stock Quota)  │   │
│   └─────────────┬─────────────┘    └────────────────────────┘   │
│                 │ Purchase Order                                │
│                 ▼                                               │
│   ┌───────────────────────────┐                                 │
│   │ 🔒 System Escrow Hold     │                                 │
│   └─────────────┬─────────────┘                                 │
│                 │ Status = "DELIVERED"                          │
│                 ▼                                               │
│   ┌───────────────────────────┐                                 │
│   │ 💳 Vendor Wallet (MMK)    │ ───► Cash-Out Request to Admin  │
│   └───────────────────────────┘                                 │
└─────────────────────────────────────────────────────────────────┘
```

1. **Top-Up Method A (Official Merchant API - Instant):**
   * Customer initiates top-up in React frontend.
   * Laravel API communicates with KBZPay/AYA Pay Merchant Gateway to generate QR / deep link payload.
   * On successful payment, payment provider sends HTTP POST Webhook to Laravel server.
   * Laravel validates payment hash signature and instantly credits user wallet.

2. **Top-Up Method B (Manual Bank Slip - Fallback):**
   * Customer/Vendor submits transaction screenshot + Transaction ID.
   * Record marked as `PENDING_APPROVAL`.
   * Admin verifies against bank account and clicks `Approve` -> Wallet credited.

### 3.2 Shared Global Catalog Architecture
To maintain high catalog quality and prevent duplicate low-quality listings:
* **Step 1:** Vendor submits **Base Product Request** (Title, Category, Brand, Specification Template, Reference Images).
* **Step 2:** Admin approves request -> Product enters the **Global Master Catalog**.
* **Step 3:** Any authorized vendor can attach a **Vendor Listing** to this Base Product by setting:
  * Retail Price (Buyer Coins)
  * Inventory Stock (Requires Vendor Token consumption)
  * Variants (Color, Size, Specification options)
  * Custom store gallery images

### 3.3 Escrow Financial State Machine

```
[Customer Checkout] ──► Deduct Buyer Coins ──► Status: PAID_IN_ESCROW
                                                        │
[Vendor Fulfills] ────► Add Shipping Tracking ──► Status: SHIPPED
                                                        │
[Vendor/Admin Confirms] ──► Status: DELIVERED ─────────┤
                                                        ▼
                                          Release Funds to Vendor Wallet
```

---

## 4. Non-Functional & Security Requirements

1. **API Security:** Sanctum token authentication, rate limiting on financial endpoints, idempotent payment webhooks.
2. **Transaction Integrity:** Database transactions (`DB::transaction`) for all coin transfers, escrow locks, and top-ups to prevent double-spending.
3. **Audit Logging:** Every balance movement logged with state transition, user ID, and system commit reference.

---

## 5. Software Development Activity Log

* **[LOG-001] [PROJECT-INIT]** Core Architecture & Collaboration Protocol Established.
* **[LOG-002] [ARCHITECT-STAGE-1]** Initiated Functional Requirements & Reference Analysis (Athuthu reference).
* **[LOG-003] [ARCHITECT-STAGE-1]** Finalized Dual-Currency Engine, KBZPay/AYA Pay integration model, and portal scopes.
* **[LOG-004] [ARCHITECT-STAGE-1]** Defined Shared Base Product catalog model, Escrow state machine, and Vendor Token quota rules.
* **[LOG-005] [ARCHITECT-STAGE-1]** Generated Stage 1 System Requirements Specification (`stage-1-srs.md`).
