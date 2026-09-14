# RESTful API Contracts Specification
## Stage 3: Laravel REST API & React Integration Blueprint (v4.0 - v2 Full Context with Direct MMK Architecture)

**Project Title:** Direct MMK Multi-Vendor Dropshipping Platform
**Tech Stack:** React (Frontend) + Laravel REST API (Backend - Sanctum Auth)  
**Base URL:** `https://api.yourdomain.com/api/v1`  
**Document Version:** 4.0.0
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
  "role": "customer", // Options: "customer", "vendor"
  "store_name": "Aung Tech Store" // Required if role is vendor
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
      "role": "customer",
      "wallet": {
        "wallet_balance_mmk": 0.00,
        "withdrawable_balance_mmk": 0.00,
        "escrow_balance_mmk": 0.00
      }
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
      "vendor_profile": null,
      "wallet": {
        "wallet_balance_mmk": 150000.00,
        "withdrawable_balance_mmk": 0.00,
        "escrow_balance_mmk": 0.00
      }
    },
    "token": "2|LaravelSanctumTokenString..."
  }
}
```

### 2.3 Logout User
* **HTTP Method:** `POST`
* **Endpoint:** `/auth/logout`
* **Auth:** Bearer Token
* **Request Body:** None
* **Response (200 OK):**
```json
{
  "success": true,
  "message": "Successfully logged out and revoked active token."
}
```

### 2.4 Fetch Profile & Wallet Snapshot
* **HTTP Method:** `GET`
* **Endpoint:** `/profile/me`
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
      "wallet_balance_mmk": 150000.00,
      "withdrawable_balance_mmk": 0.00,
      "escrow_balance_mmk": 0.00
    }
  }
}
```

### 2.5 User Address Book CRUD
* **`GET /profile/addresses`** — List user's delivery addresses.
* **`POST /profile/addresses`** — Store new delivery address.
  * *Request Body:* `{"recipient_name": "Aung Aung", "phone": "09971234567", "city": "Yangon", "township": "Kamayut", "address_detail": "No. 12, Main St", "is_default": true}`

---

## 3. Customer Wallet & Payment Top-Up APIs

### 3.1 Initiate KBZPay/AYA Pay Merchant API Top-Up
* **HTTP Method:** `POST`
* **Endpoint:** `/payments/topup/initiate`
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

### 3.3 AYA Pay Gateway Webhook Callback (Public Endpoint)
* **HTTP Method:** `POST`
* **Endpoint:** `/payments/ayapay/callback`
* **Auth:** Public (Signature Verified in Backend)
* **Request Body (from AYA Pay Server):**
```json
{
  "external_transaction_id": "TOPUP_46",
  "ayapay_trans_id": "AYA-20260911-998811",
  "amount": "50000.00",
  "status": "COMPLETED",
  "checksum": "HMAC_SHA256_CHECKSUM_STRING"
}
```
* **Response (200 OK):** `{"status": "RECEIVED"}`

### 3.4 Submit Manual Bank Slip Top-Up (Fallback)
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

## 4. Shared Global Catalog & Storefront APIs

### 4.1 Browse Category Tree Hierarchy
* **HTTP Method:** `GET`
* **Endpoint:** `/catalog/categories`
* **Auth:** Public
* **Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Electronics",
      "slug": "electronics",
      "children": [
        { "id": 10, "name": "Mobile Phones", "slug": "mobile-phones" },
        { "id": 11, "name": "Laptops", "slug": "laptops" }
      ]
    },
    {
      "id": 2,
      "name": "Apparel",
      "slug": "apparel",
      "children": []
    }
  ]
}
```

### 4.2 Browse Global Base Products (Public Storefront)
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
      "min_price_mmk": 12000.00,
      "max_price_mmk": 15000.00
    }
  ],
  "meta": { "current_page": 1, "last_page": 5, "total": 45 }
}
```

### 4.3 Fetch Single Base Product Details & Vendor Listings
* **HTTP Method:** `GET`
* **Endpoint:** `/catalog/base-products/{id}`
* **Auth:** Public
* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 101,
    "title": "Classic Cotton T-Shirt",
    "brand": "Uniqlo",
    "description": "Premium 100% cotton crewneck t-shirt.",
    "master_image_url": "https://cdn.platform.com/products/tshirt.jpg",
    "category": { "id": 2, "name": "Apparel" },
    "vendor_listings": [
      {
        "id": 501,
        "vendor": { "id": 5, "store_name": "Aung Store", "rating": 4.8 },
        "price_mmk": 13500.00,
        "stock_quantity": 50,
        "variants": [
          {
            "id": 1201,
            "sku": "TSHIRT-BLK-L",
            "attribute_name": "Color/Size",
            "attribute_value": "Black / L",
            "additional_price": 500.00,
            "stock": 25
          }
        ]
      }
    ]
  }
}
```

### 4.4 Submit Base Product Request (Vendor/Admin)
* **HTTP Method:** `POST`
* **Endpoint:** `/catalog/base-products/request`
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
  "data": { "id": 102, "approval_status": "pending" } // Auto-approved if user is Admin!
}
```

### 4.5 Home Page Featured Products
Returns the five newest approved base products that have at least one active vendor listing with available stock. Results are ordered by `created_at` descending.

* **HTTP Method:** `GET`
* **Endpoint:** `/catalog/featured-products`
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
      "min_price_mmk": 12000.00,
      "max_price_mmk": 15000.00
    }
  ]
}
```
* **Result Limit:** 5 products.
* **Frontend Service Method:** `catalogService.getFeaturedProducts()`

### 4.6 Home Page Latest Verified Vendors
Returns the three newest verified vendor stores. Results are ordered by `created_at` descending.

* **HTTP Method:** `GET`
* **Endpoint:** `/vendors/featured`
* **Auth:** Public
* **Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 5,
      "store_name": "Aung Store",
      "store_slug": "aung-store-abc12",
      "is_verified": true,
      "active_listings_count": 8
    }
  ]
}
```
* **Result Limit:** 3 vendors.
* **Frontend Service Method:** `vendorService.getFeaturedVendors()`

These endpoints are the homepage discovery contract. They must be added to the Laravel routes and controllers before the frontend calls them.

---

## 5. Vendor Store & Inventory Management APIs

### 5.1 Purchase Vendor Tokens (Inventory Quota)
* **HTTP Method:** `POST`
* **Endpoint:** `/vendor/tokens/purchase`
* **Auth:** Bearer Token (Vendor / Admin)
* **Request Body:**
```json
{
  "token_quantity": 100 // 1 Token = 1 Inventory unit listing capacity
}
```
* **Response (200 OK):**
```json
{
  "success": true,
  "message": "Successfully purchased 100 Vendor Tokens.",
  "data": {
    "tokens_added": 100,
    "total_token_balance": 550,
    "cost_deducted_mmk": 10000.00
  }
}
```

### 5.2 List Vendor's Active Store Listings
* **HTTP Method:** `GET`
* **Endpoint:** `/vendor/listings`
* **Auth:** Bearer Token (Vendor / Admin)
* **Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 501,
      "base_product_id": 101,
      "base_product_title": "Classic Cotton T-Shirt",
      "price_mmk": 13500.00,
      "stock_quantity": 50,
      "is_active": true,
      "variants_count": 2
    }
  ]
}
```

### 5.3 Create Vendor Store Listing under Base Product
* **HTTP Method:** `POST`
* **Endpoint:** `/vendor/listings`
* **Auth:** Bearer Token (Vendor / Admin)
* **Request Body:**
```json
{
  "base_product_id": 101,
  "price_mmk": 13500.00,
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

### 5.4 Update Vendor Store Listing (Price, Stock & Variants)
* **HTTP Method:** `PUT`
* **Endpoint:** `/vendor/listings/{id}`
* **Auth:** Bearer Token (Vendor / Admin)
* **Request Body:**
```json
{
  "price_mmk": 14000.00,
  "stock_quantity": 70, // Additional stock consumes extra vendor tokens
  "is_active": true,
  "variants": [
    {
      "id": 1201,
      "sku": "TSHIRT-BLK-L",
      "attribute_name": "Color/Size",
      "attribute_value": "Black / L",
      "additional_price": 600.00,
      "stock": 35
    }
  ]
}
```
* **Response (200 OK):**
```json
{
  "success": true,
  "message": "Listing updated successfully.",
  "data": { "listing_id": 501, "price_mmk": 14000.00, "stock_quantity": 70 }
}
```

### 5.5 View Orders Assigned to Vendor
* **HTTP Method:** `GET`
* **Endpoint:** `/vendor/orders`
* **Auth:** Bearer Token (Vendor / Admin)
* **Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "item_id": 88,
      "order_number": "ORD-20260911-0092",
      "product_title": "Classic Cotton T-Shirt",
      "variant": "Black / L",
      "quantity": 2,
      "unit_price": 14000.00,
      "subtotal": 28000.00,
      "fulfillment_status": "paid_in_escrow",
      "customer_shipping_address": {
        "recipient_name": "Aung Aung",
        "phone": "09971234567",
        "address": "Kamayut, Yangon"
      }
    }
  ]
}
```

### 5.6 Vendor Fulfills Order Item (Add Tracking #)
* **HTTP Method:** `POST`
* **Endpoint:** `/vendor/orders/items/{item_id}/ship`
* **Auth:** Bearer Token (Vendor / Admin)
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

### 5.7 Vendor Cash-Out Request
* **HTTP Method:** `POST`
* **Endpoint:** `/vendor/cashout`
* **Auth:** Bearer Token (Vendor / Admin)
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

## 6. Customer Order & Escrow APIs

### 6.1 Customer Checkout (Escrow Locking)
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
  "message": "Order placed successfully. Funds held in MMK Escrow.",
  "data": {
    "order_number": "ORD-20260911-0092",
    "id": 15,
    "total_mmk": 28000.00,
    "payment_status": "paid_in_escrow",
    "order_items": [...]
  }
}
```

### 6.2 List Customer Order History
* **HTTP Method:** `GET`
* **Endpoint:** `/orders`
* **Auth:** Bearer Token (Customer)
* **Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 15,
      "order_number": "ORD-20260911-0092",
      "total_mmk": 28000.00,
      "payment_status": "paid_in_escrow",
      "items_count": 1,
      "created_at": "2026-09-11 08:00:00"
    }
  ]
}
```

### 6.3 Fetch Single Order Details & Item Timeline
* **HTTP Method:** `GET`
* **Endpoint:** `/orders/{id}`
* **Auth:** Bearer Token (Customer)
* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 15,
    "order_number": "ORD-20260911-0092",
    "total_mmk": 28000.00,
    "shipping_address": {
      "recipient_name": "Aung Aung",
      "phone": "09971234567",
      "city": "Yangon",
      "township": "Kamayut",
      "address_detail": "No. 12, Main St"
    },
    "items": [
      {
        "item_id": 88,
        "vendor_name": "Aung Store",
        "product_title": "Classic Cotton T-Shirt",
        "variant": "Black / L",
        "unit_price": 14000.00,
        "quantity": 2,
        "subtotal": 28000.00,
        "fulfillment_status": "shipped",
        "courier_name": "Royal Express",
        "tracking_number": "REX-98712398",
        "timeline": [
          { "status": "paid_in_escrow", "timestamp": "2026-09-11 08:00:00" },
          { "status": "shipped", "timestamp": "2026-09-11 10:30:00" }
        ]
      }
    ]
  }
}
```

### 6.4 Mark Order Item as Delivered & Release Escrow
* **HTTP Method:** `POST`
* **Endpoint:** `/orders/{item_id}/confirm-delivery`
* **Auth:** Bearer Token (Customer / Vendor / Admin)
* **Response (200 OK):**
```json
{
  "success": true,
  "message": "Delivery confirmed. MMK Escrow unlocked and transferred to Vendor Wallet.",
  "data": {
    "item_id": 88,
    "fulfillment_status": "delivered",
    "escrow_released_amount": 28000.00
  }
}
```

---

## 7. Admin Control Center APIs

### 7.0 Admin Dashboard Summary
* **HTTP Method:** `GET`
* **Endpoint:** `/admin/dashboard/summary`
* **Auth:** Bearer Token (Admin role only)
* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "pending_base_product_requests": 12,
    "pending_bank_slips": 7,
    "pending_cashouts": 3,
    "total_gmv_mmk": 1250000.00,
    "updated_at": "2026-09-14T10:30:00Z"
  }
}
```
* **Purpose:** Provides the four summary values displayed on the Admin Dashboard without loading the full moderation queues.
* **Security Requirement:** The admin route group must enforce both `auth:sanctum` and `role:admin`. Authentication alone is not sufficient for admin endpoints.

### 7.1 List & Review Pending Base Product Requests
* **HTTP Method:** `GET`
* **Endpoint:** `/admin/base-products/pending`
* **Auth:** Bearer Token (Admin)
* **Response (200 OK):** List of product requests with `pending` status.

### 7.2 Approve Base Product Request
* **HTTP Method:** `POST`
* **Endpoint:** `/admin/base-products/{id}/approve`
* **Auth:** Bearer Token (Admin)
* **Response (200 OK):**
```json
{
  "success": true,
  "message": "Base Product approved and published to Global Catalog."
}
```

### 7.3 Reject Base Product Request
* **HTTP Method:** `POST`
* **Endpoint:** `/admin/base-products/{id}/reject`
* **Auth:** Bearer Token (Admin)
* **Request Body:**
```json
{
  "rejection_reason": "Incomplete product specifications and low resolution master image."
}
```
* **Response (200 OK):**
```json
{
  "success": true,
  "message": "Base Product request rejected."
}
```

### 7.4 Review & Approve Bank Slip Uploads
* **`GET /admin/payments/slips/pending`** — List pending bank slip uploads.
* **`POST /admin/payments/slips/{id}/verify`** — Approve bank slip and credit the user's MMK Wallet.

### 7.5 Review & Complete Vendor Cash-Outs
* **`GET /admin/cashouts/pending`** — List pending vendor withdrawal requests.
* **`POST /admin/cashouts/{id}/approve`** — Approve and process the vendor's MMK cash-out via KBZPay/AYA Pay.

---

## 8. Software Development Activity Log

* **[LOG-001] [PROJECT-INIT]** Core Architecture & Collaboration Protocol Established.
* **[LOG-002] [ARCHITECT-STAGE-1]** Initiated Functional Requirements & Reference Analysis.
* **[LOG-003] [ARCHITECT-STAGE-1]** Finalized Dual-Currency Engine, Gateway Integration, and Portal Scopes.
* **[LOG-004] [ARCHITECT-STAGE-1]** Defined Shared Base Product Catalog Model, Escrow Engine, and Vendor Quotas.
* **[LOG-005] [ARCHITECT-STAGE-1]** Generated Stage 1 System Requirements Specification (`stage-1-srs.md`).
* **[LOG-006] [ARCHITECT-STAGE-1]** Updated SRS v2 (`stage-1-srs-v2.md`) to integrate Admin-Vendor dual role capabilities.
* **[LOG-007] [ARCHITECT-STAGE-2]** Generated Relational Database Schema & ERD Specification (`stage-2-database-erd.md`).
* **[LOG-008] [ARCHITECT-STAGE-3]** Generated RESTful API Contracts Specification (`stage-3-api-contracts.md`).
* **[LOG-009] [ARCHITECT-STAGE-3.1]** Generated Updated API Contract Specification v2 (`stage-3-api-contracts-v2.md`) incorporating all missing endpoints (Logout, AYA Pay Callback, Category Trees, Single Base Product Details, Vendor Token Purchases, Listing CRUD/Listings, Vendor Orders, Customer Orders History/Timeline, and Admin Product Rejection).
* **[LOG-010] [ARCHITECT-STAGE-3.2]** Merged v3 Direct MMK Architecture changes into this expanded contract: MMK wallet terminology, MMK-priced listings, MMK escrow checkout, vendor cash-out path, and delivery/admin approval updates.
* **[LOG-011] [ARCHITECT-STAGE-4]** Created v4 by preserving the complete v2 endpoint and response context while incorporating the v3 Direct MMK wallet, pricing, escrow, cash-out, and approval updates.
* **[LOG-012] [ARCHITECT-STAGE-4.1]** Defined the homepage discovery contract around the implemented catalog/vendor data model: five newest approved products and three newest verified vendors.
* **[LOG-013] [ARCHITECT-STAGE-4.2]** Expanded the living documentation for the Admin Control Center: added the protected dashboard summary contract, aligned admin route names, and defined the Stitch-ready Admin Dashboard interface contract.
