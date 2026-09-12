# RESTful API Contracts Specification
## Stage 3: Laravel REST API & React Integration Blueprint

**Project Title:** Dual-Currency Multi-Vendor Dropshipping Platform  
**Tech Stack:** React (Frontend) + Laravel REST API (Backend - Sanctum Auth)  
**Base URL:** `https://api.yourdomain.com/api/v1`  
**Document Version:** 1.0.0  
**Author / Lead:** System Architect  

---

## 1. Global API Standards

### 1.1 Headers
* `Accept: application/json`
* `Content-Type: application/json`
* `Authorization: Bearer {sanctum_token}` (for protected endpoints)

### 1.2 Standard Response Structure
```json
// Success Response (200 OK / 201 Created)
{
  "success": true,
  "message": "Operation executed successfully.",
  "data": { ... }
}

// Error Response (400 / 401 / 403 / 404 / 500)
{
  "success": false,
  "message": "Detailed error message here.",
  "errors": null
}

// Validation Error (422 Unprocessable Content)
{
  "success": false,
  "message": "Validation failed.",
  "errors": {
    "field_name": ["Specific validation rule failure reason."]
  }
}
```

---

## 2. Authentication & Profile APIs

### 2.1 Register User
* **HTTP Method:** `POST`
* **Endpoint:** `/auth/register`
* **Auth:** Public
* **Request Body:**
```json
{
  "name": "Aung Aung",
  "email": "aung@example.com",
  "phone": "09971234567",
  "password": "SecretPassword123!",
  "password_confirmation": "SecretPassword123!",
  "role": "customer" // Options: "customer", "vendor"
}
```
* **Response (201 Created):**
```json
{
  "success": true,
  "message": "Account registered successfully.",
  "data": {
    "user": {
      "id": 10,
      "name": "Aung Aung",
      "email": "aung@example.com",
      "phone": "09971234567",
      "role": "customer"
    },
    "token": "1|LaravelSanctumTokenString..."
  }
}
```

### 2.2 Login User
* **HTTP Method:** `POST`
* **Endpoint:** `/auth/login`
* **Auth:** Public
* **Request Body:**
```json
{
  "email": "aung@example.com",
  "password": "SecretPassword123!"
}
```
* **Response (200 OK):**
```json
{
  "success": true,
  "message": "Authenticated successfully.",
  "data": {
    "user": {
      "id": 10,
      "name": "Aung Aung",
      "role": "customer",
      "vendor_profile": null
    },
    "token": "2|LaravelSanctumTokenString..."
  }
}
```

### 2.3 Fetch Profile & Wallet Snapshot
* **HTTP Method:** `GET`
* **Endpoint:** `/auth/me`
* **Auth:** Bearer Token
* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 10,
    "name": "Aung Aung",
    "email": "aung@example.com",
    "phone": "09971234567",
    "role": "customer",
    "wallet": {
      "buyer_coin_balance": 150000.00,
      "withdrawable_balance": 0.00,
      "escrow_balance": 0.00
    }
  }
}
```

### 2.4 User Address Book CRUD
* **`GET /profile/addresses`** — List user's delivery addresses.
* **`POST /profile/addresses`** — Store new delivery address.
  * *Request Body:* `{"recipient_name": "Aung Aung", "phone": "09971234567", "city": "Yangon", "township": "Kamayut", "address_detail": "No. 12, Main St", "is_default": true}`

---

## 3. Dual Digital Currency & Payment Top-Up APIs

### 3.1 Initiate KBZPay/AYA Pay Merchant API Top-Up
* **HTTP Method:** `POST`
* **Endpoint:** `/payments/topup/api-initiate`
* **Auth:** Bearer Token
* **Request Body:**
```json
{
  "gateway": "kbzpay", // Options: "kbzpay", "ayapay"
  "amount_mmk": 50000.00
}
```
* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "topup_id": 45,
    "prepay_id": "KBZ_PREPAY_9918237123",
    "qr_code_url": "https://payment.kbzpay.com/pay?code=123123",
    "deep_link": "kbzpay://pay?prepay_id=KBZ_PREPAY_9918237123"
  }
}
```

### 3.2 KBZPay Gateway Webhook Callback (Public Endpoint)
* **HTTP Method:** `POST`
* **Endpoint:** `/payments/kbzpay/callback`
* **Auth:** Public (Signature Verified in Backend)
* **Request Body (from KBZPay Server):**
```json
{
  "merch_order_id": "TOPUP_45",
  "kbz_trans_id": "2026091100238123",
  "amount": "50000.00",
  "status": "SUCCESS",
  "sign": "SHA256_ENCRYPTED_SIGNATURE_STRING"
}
```
* **Response (200 OK):** `{"sign_status": "SUCCESS"}`

### 3.3 Submit Manual Bank Slip Top-Up (Fallback)
* **HTTP Method:** `POST`
* **Endpoint:** `/payments/topup/bank-slip`
* **Auth:** Bearer Token
* **Request Body:** `multipart/form-data`
  * `gateway`: `"kbzpay_slip"` or `"ayapay_slip"`
  * `amount_mmk`: `50000`
  * `trans_id`: `"2026091100238123"`
  * `proof_image`: `[File Binary]`
* **Response (201 Created):**
```json
{
  "success": true,
  "message": "Bank slip submitted for Admin verification.",
  "data": {
    "topup_id": 46,
    "status": "pending_verification"
  }
}
```

---

## 4. Shared Global Catalog & Vendor Listing APIs

### 4.1 Browse Global Base Products (Public Storefront)
* **HTTP Method:** `GET`
* **Endpoint:** `/catalog/base-products?category_id=2&search=shirt&page=1`
* **Auth:** Public
* **Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 101,
      "title": "Classic Cotton T-Shirt",
      "brand": "Uniqlo",
      "category_name": "Apparel",
      "master_image_url": "https://cdn.platform.com/products/tshirt.jpg",
      "vendor_listings_count": 3,
      "min_price": 12000.00,
      "max_price": 15000.00
    }
  ],
  "meta": { "current_page": 1, "last_page": 5, "total": 45 }
}
```

### 4.2 Submit Base Product Request (Vendor/Admin)
* **HTTP Method:** `POST`
* **Endpoint:** `/vendor/base-products/request`
* **Auth:** Bearer Token (Vendor / Admin)
* **Request Body:**
```json
{
  "category_id": 2,
  "title": "Ergonomic Mesh Gaming Chair",
  "brand": "DXRacer",
  "description": "High back breathable gaming chair.",
  "master_image_url": "https://cdn.platform.com/uploads/chair.jpg",
  "specs_schema": { "material": "Mesh", "warranty": "1 Year" }
}
```
* **Response (201 Created):**
```json
{
  "success": true,
  "message": "Base Product request submitted for Admin approval.",
  "data": { "id": 102, "approval_status": "pending" } // Note: Auto-approved if user is Admin!
}
```

### 4.3 Create Vendor Store Listing under Base Product
* **HTTP Method:** `POST`
* **Endpoint:** `/vendor/listings`
* **Auth:** Bearer Token (Vendor / Admin)
* **Request Body:**
```json
{
  "base_product_id": 101,
  "price_coins": 13500.00,
  "stock_quantity": 50,
  "variants": [
    {
      "sku": "TSHIRT-BLK-L",
      "attribute_name": "Color/Size",
      "attribute_value": "Black / L",
      "additional_price": 500.00,
      "stock": 25
    },
    {
      "sku": "TSHIRT-RED-M",
      "attribute_name": "Color/Size",
      "attribute_value": "Red / M",
      "additional_price": 0.00,
      "stock": 25
    }
  ]
}
```
* **Response (201 Created):**
```json
{
  "success": true,
  "message": "Store listing published. 50 Vendor Tokens consumed for inventory quota.",
  "data": {
    "listing_id": 501,
    "vendor_token_balance_remaining": 450
  }
}
```

---

## 5. Orders, Escrow & Fulfillment APIs

### 5.1 Customer Checkout (Escrow Locking)
* **HTTP Method:** `POST`
* **Endpoint:** `/orders/checkout`
* **Auth:** Bearer Token (Customer)
* **Request Body:**
```json
{
  "address_id": 12,
  "items": [
    {
      "vendor_listing_id": 501,
      "variant_id": 1201,
      "quantity": 2
    }
  ]
}
```
* **Response (201 Created):**
```json
{
  "success": true,
  "message": "Order placed successfully. Funds locked in Escrow.",
  "data": {
    "order_number": "ORD-20260911-0092",
    "total_coins_deducted": 28000.00,
    "remaining_buyer_coins": 122000.00,
    "order_status": "paid_in_escrow"
  }
}
```

### 5.2 Vendor Fulfills Order Item (Add Tracking #)
* **HTTP Method:** `PATCH`
* **Endpoint:** `/vendor/orders/items/{item_id}/ship`
* **Auth:** Bearer Token (Vendor owning the item / Admin)
* **Request Body:**
```json
{
  "courier_name": "Royal Express",
  "tracking_number": "REX-98712398"
}
```
* **Response (200 OK):**
```json
{
  "success": true,
  "message": "Order item updated to SHIPPED.",
  "data": {
    "item_id": 88,
    "fulfillment_status": "shipped",
    "courier_name": "Royal Express",
    "tracking_number": "REX-98712398"
  }
}
```

### 5.3 Mark Order Item as Delivered & Release Escrow
* **HTTP Method:** `PATCH`
* **Endpoint:** `/vendor/orders/items/{item_id}/confirm-delivery`
* **Auth:** Bearer Token (Vendor / Admin / Customer)
* **Response (200 OK):**
```json
{
  "success": true,
  "message": "Delivery confirmed. Escrow unlocked and transferred to Vendor Wallet.",
  "data": {
    "item_id": 88,
    "fulfillment_status": "delivered",
    "escrow_released_amount": 28000.00
  }
}
```

### 5.4 Vendor Cash-Out Request
* **HTTP Method:** `POST`
* **Endpoint:** `/vendor/wallet/cashout`
* **Auth:** Bearer Token (Vendor)
* **Request Body:**
```json
{
  "amount_mmk": 25000.00,
  "payout_account_type": "kbzpay",
  "account_number": "09971234567",
  "account_name": "Aung Aung"
}
```
* **Response (201 Created):**
```json
{
  "success": true,
  "message": "Cash-out request submitted for Admin payout."
}
```

---

## 6. Admin Control Center APIs

* **`GET /admin/base-products/pending`** — List all Base Product requests awaiting moderation.
* **`PATCH /admin/base-products/{id}/approve`** — Approve Base Product (adds to Global Catalog).
* **`GET /admin/payments/slips/pending`** — List pending bank slip uploads.
* **`PATCH /admin/payments/slips/{id}/approve`** — Approve bank slip and credit user's Buyer Coins.
* **`GET /admin/cashouts/pending`** — List pending vendor withdrawal requests.
* **`PATCH /admin/cashouts/{id}/complete`** — Mark payout complete after sending funds via KBZPay/AYA Pay.

---

## 7. Software Development Activity Log

* **[LOG-001] [PROJECT-INIT]** Core Architecture & Collaboration Protocol Established.
* **[LOG-002] [ARCHITECT-STAGE-1]** Initiated Functional Requirements & Reference Analysis.
* **[LOG-003] [ARCHITECT-STAGE-1]** Finalized Dual-Currency Engine, Gateway Integration, and Portal Scopes.
* **[LOG-004] [ARCHITECT-STAGE-1]** Defined Shared Base Product Catalog Model, Escrow Engine, and Vendor Quotas.
* **[LOG-005] [ARCHITECT-STAGE-1]** Generated Stage 1 System Requirements Specification (`stage-1-srs.md`).
* **[LOG-006] [ARCHITECT-STAGE-1]** Updated SRS v2 (`stage-1-srs-v2.md`) to integrate Admin-Vendor dual role capabilities.
* **[LOG-007] [ARCHITECT-STAGE-2]** Generated Relational Database Schema & ERD Specification (`stage-2-database-erd.md`).
* **[LOG-008] [ARCHITECT-STAGE-3]** Generated RESTful API Contracts Specification (`stage-3-api-contracts.md`).
