# Stage 1: System Requirements Specification (SRS v3.0)

**Project Title:** ZinYaw Direct MMK Multi-Vendor Dropshipping Platform  
**Architecture:** Direct MMK Fiat Wallet & Escrow Protection System  
**Document Version:** 3.0.0  
**Status:** APPROVED ARCHITECTURAL REVISION  

---

## 1. Executive Summary & Core Pivot
This specification outlines the revised architecture for the **ZinYaw Dropshipping Platform**. Based on simplified financial requirements, the platform transitions from an abstracted "Buyer Coins" virtual currency model to a **Direct Myanmar Kyat (MMK) Wallet Engine**.

### Key Architectural Model:
* **Single Customer Currency (MMK Wallet)**: Customers top up Myanmar Kyat (MMK) directly via KBZPay, AYA Pay, or manual bank transfer screenshots into their platform MMK Wallet. All store products are priced, listed, and purchased directly in **MMK**.
* **Escrow Guarantee Engine**: When a customer checks out, payment in MMK is locked into **System Escrow**. Funds are released to the vendor's withdrawable MMK balance only after delivery confirmation.
* **Vendor Listing Quotas (Vendor Tokens)**: Vendors purchase **Vendor Tokens** (using their MMK wallet balance at 1,000 MMK / Token) to acquire inventory listing quotas on the platform.
* **Master Base Product Catalog**: Admins maintain a unified catalog of approved **Base Products**, preventing duplicate listings while enabling multiple local vendors to offer competing prices and shipping terms.

---

## 2. User Roles & System Permissions

| Role | Access Level | Key Capabilities |
| :--- | :--- | :--- |
| **Customer / Buyer** | Storefront & Buyer Hub | Browse global catalog, top up MMK wallet, place escrow orders, track shipments, confirm delivery. |
| **Vendor / Seller** | Vendor Portal | Create store listings under base products, manage inventory/variants, purchase listing tokens, fulfill orders, withdraw released MMK. |
| **System Admin** | Admin Control Panel | Moderate base product submissions, verify manual bank top-up slips, approve vendor MMK cash-out withdrawals. |

---

## 3. Financial & Escrow Workflow

### 3.1 Customer Wallet Top-Up Flow (MMK)
1. Customer initiates an MMK top-up via API integration (KBZPay / AYA Pay) or uploads a bank transfer slip screenshot.
2. For instant gateway API calls, MMK is credited automatically upon webhook signal. For manual slips, Admin verifies the screenshot and credits the user's **MMK Wallet Balance**.

### 3.2 Escrow Checkout & Fulfillment Flow
1. **Checkout**: Customer purchases items using their **MMK Wallet Balance**. The exact total in MMK is deducted from the customer's available balance and moved into **Escrow Hold**.
2. **Fulfillment**: Vendor views the order, ships items via a local courier, and submits courier details + tracking number.
3. **Delivery Confirmation**: Customer receives package and clicks **"Confirm Delivery"**.
4. **Escrow Release**: System releases escrow funds (in MMK) directly into the vendor's **Withdrawable MMK Wallet**.

### 3.3 Vendor Listing Quota System
* Creating a new listing under an approved Base Product consumes **1 Vendor Token**.
* Tokens are purchased from the platform using MMK wallet balance at a fixed rate (e.g. 10 Vendor Tokens = 10,000 MMK).

---

## 4. Key Functional Modules & Requirements

1. **Authentication & Identity**: Sanctum token auth, email/phone verification, role-based route access (`customer`, `vendor`, `admin`).
2. **Catalog & Search**: Global Base Product catalog with category hierarchy, specifications schema, and multi-vendor listing offers.
3. **Wallet & Financial Ledger**: Atomic transaction records for MMK top-ups, escrow holds, escrow releases, cashouts, and token purchases.
4. **Order Management & Shipping**: Itemized order fulfillment tracking with fulfillment statuses: `paid_in_escrow`, `processing`, `shipped`, `delivered`, `cancelled`.
5. **Admin Moderation Portal**: Approval queues for new base products, payment slip screenshot verifications, and vendor cashout requests.
