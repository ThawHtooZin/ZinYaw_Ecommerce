# Stage 3: REST API Contract Specification (v3.0 - Direct MMK Architecture)

**Base URL:** `/api/v1`  
**Authentication:** Laravel Sanctum (`Authorization: Bearer <token>`)  
**Format:** JSON  
**Currency Standard:** Myanmar Kyat (MMK) Direct Wallet Balance  

---

## 1. Authentication & Profile Endpoints

### 1.1 `POST /auth/register`
Creates a user account and initializes their MMK Wallet.
* **Request Body:**
  ```json
  {
    "name": "Aung Aung",
    "email": "aung@example.com",
    "phone": "09971234567",
    "password": "password123",
    "role": "customer", // 'customer' or 'vendor'
    "store_name": "Aung Tech Store" // Required if role = vendor
  }
  ```
* **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Account registered successfully.",
    "data": {
      "user": {
        "id": 1,
        "name": "Aung Aung",
        "email": "aung@example.com",
        "role": "customer",
        "wallet": {
          "wallet_balance_mmk": 0.00,
          "withdrawable_balance_mmk": 0.00,
          "escrow_balance_mmk": 0.00
        }
      },
      "token": "1|sanctum_token_string"
    }
  }
  ```

### 1.2 `POST /auth/login`
Authenticates user and returns Bearer token.
* **Request Body:** `{ "email": "aung@example.com", "password": "password123" }`
* **Response (200 OK):** Returns token and user object with MMK wallet details.

### 1.3 `GET /profile/me`
Retrieves authenticated user profile, vendor record, and MMK wallet balance.

---

## 2. Customer Wallet & Payment Endpoints

### 2.1 `POST /payments/topup/initiate`
Initiates instant digital payment QR code for MMK wallet top-up.
* **Request Body:**
  ```json
  {
    "gateway": "kbzpay", // 'kbzpay' or 'ayapay'
    "amount_mmk": 50000.00
  }
  ```
* **Response (200 OK):** Returns prepay ID and payment QR code URL.

### 2.2 `POST /payments/topup/bank-slip`
Uploads manual bank transfer screenshot for Admin verification.
* **Request (`multipart/form-data`):** `gateway`, `amount_mmk`, `trans_id`, `proof_image` (file).

---

## 3. Catalog & Search Endpoints

### 3.1 `GET /catalog/categories`
Returns nested category tree.

### 3.2 `GET /catalog/base-products`
Returns approved base products with vendor offer listings priced in MMK (`price_mmk`).

### 3.3 `GET /catalog/base-products/{id}`
Returns base product specifications, variants, and active vendor offers with `price_mmk`.

### 3.4 `POST /catalog/base-products/request`
Submits a new base product addition request.

---

## 4. Escrow Checkout & Order Endpoints

### 4.1 `POST /orders/checkout`
Executes order checkout using MMK Wallet Balance and locks funds into System Escrow.
* **Request Body:**
  ```json
  {
    "address_id": 1,
    "items": [
      {
        "vendor_listing_id": 5,
        "variant_id": 12,
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
      "id": 10,
      "order_number": "ORD-20260912-X8K1L",
      "total_mmk": 75000.00,
      "payment_status": "paid_in_escrow",
      "order_items": [...]
    }
  }
  ```

### 4.2 `GET /orders`
Lists customer order history with itemized escrow fulfillment statuses.

### 4.3 `POST /orders/{item_id}/confirm-delivery`
Confirms item delivery and releases MMK escrow funds directly to vendor withdrawable wallet.

---

## 5. Vendor Portal Endpoints

### 5.1 `GET /vendor/listings`
Lists vendor's active store listings with stock levels and `price_mmk`.

### 5.2 `POST /vendor/listings`
Creates a store listing under an approved Base Product (Consumes 1 Vendor Token).

### 5.3 `POST /vendor/tokens/purchase`
Purchases Vendor Listing Tokens using MMK Wallet Balance (e.g., 10 Tokens = 10,000 MMK).

### 5.4 `POST /vendor/orders/{item_id}/ship`
Updates order item status to `shipped` with courier name and tracking number.

### 5.5 `POST /vendor/cashout`
Submits a withdrawal request for released MMK balance to vendor bank/KPay account.

---

## 6. Admin Control Center Endpoints

### 6.1 `GET /admin/base-products/pending` & `POST /admin/base-products/{id}/approve`
Moderates and approves base product catalog submissions.

### 6.2 `GET /admin/payments/slips/pending` & `POST /admin/payments/slips/{id}/verify`
Verifies manual bank top-up slips and credits MMK to user's wallet.

### 6.3 `GET /admin/cashouts/pending` & `POST /admin/cashouts/{id}/approve`
Approves and processes vendor MMK cashout payouts.
