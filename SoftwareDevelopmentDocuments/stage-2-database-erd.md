# Database ERD & Schema Specification
## Stage 2: Database Architecture & Relational Data Model

**Project Title:** Dual-Currency Multi-Vendor Dropshipping Platform  
**Tech Stack:** React (Frontend) + Laravel 11 REST API (Backend) + MySQL/PostgreSQL  
**Document Version:** 1.0.0  
**Author / Lead:** System Architect & Lead Engineer  

---

## 1. Overview & Architectural Principles

This document defines the relational database schema and Entity-Relationship Diagram (ERD) structure for our React + Laravel platform. The schema is optimized for:
* **Strict Financial Ledger Integrity:** High precision `DECIMAL(15, 2)` types for dual-currency balances (`buyer_coins`, `withdrawable_balance`, `escrow_balance`) with constraint logging.
* **Shared Global Catalog Pattern:** Clean isolation between global base product definitions (`base_products`) and vendor-specific store pricing/inventory listings (`vendor_listings`).
* **Simplified Direct Fulfillment:** Fulfillment statuses (`paid_in_escrow`, `processing`, `shipped`, `delivered`) and tracking references are managed directly on individual `order_items` without requiring a separate shipments table.
* **Dual Admin-Vendor Support:** Admin accounts link directly to `vendors` records, allowing admins to operate full vendor stores seamlessly.

---

## 2. Relational Schema & Tables Definition

### 2.1 Identity & Access Management (IAM)

#### `users`
| Column | Type | Constraints / Details |
| :--- | :--- | :--- |
| `id` | `BIGINT UNSIGNED` | Primary Key, Auto-Increment |
| `name` | `VARCHAR(255)` | Full Name |
| `email` | `VARCHAR(255)` | Unique, Indexed |
| `phone` | `VARCHAR(50)` | Unique, Indexed |
| `password` | `VARCHAR(255)` | Encrypted Hash |
| `role` | `ENUM('customer', 'vendor', 'admin')` | Default: `'customer'` |
| `created_at`, `updated_at` | `TIMESTAMP` | Standard Laravel Timestamps |

#### `vendors`
| Column | Type | Constraints / Details |
| :--- | :--- | :--- |
| `id` | `BIGINT UNSIGNED` | Primary Key, Auto-Increment |
| `user_id` | `BIGINT UNSIGNED` | Foreign Key (`users.id`), Unique |
| `store_name` | `VARCHAR(255)` | Vendor Store Display Name |
| `store_slug` | `VARCHAR(255)` | Unique, Indexed |
| `store_logo` | `VARCHAR(255)` | Nullable, File path/URL |
| `vendor_token_balance` | `INT UNSIGNED` | Default: `0` (Listing/Stock Quota) |
| `is_approved` | `BOOLEAN` | Default: `false` (Auto `true` for Admin) |
| `created_at`, `updated_at` | `TIMESTAMP` | Standard Laravel Timestamps |

#### `addresses`
| Column | Type | Constraints / Details |
| :--- | :--- | :--- |
| `id` | `BIGINT UNSIGNED` | Primary Key, Auto-Increment |
| `user_id` | `BIGINT UNSIGNED` | Foreign Key (`users.id`) |
| `recipient_name` | `VARCHAR(255)` | Full Name of recipient |
| `phone` | `VARCHAR(50)` | Contact Number |
| `state_region` | `VARCHAR(100)` | e.g., Yangon, Mandalay |
| `city` | `VARCHAR(100)` | City |
| `township` | `VARCHAR(100)` | Township |
| `address_detail` | `TEXT` | Full street/house details |
| `is_default` | `BOOLEAN` | Default: `false` |
| `created_at`, `updated_at` | `TIMESTAMP` | Standard Laravel Timestamps |

---

### 2.2 Financial Ledger & Dual Currencies

#### `wallets`
| Column | Type | Constraints / Details |
| :--- | :--- | :--- |
| `id` | `BIGINT UNSIGNED` | Primary Key, Auto-Increment |
| `user_id` | `BIGINT UNSIGNED` | Foreign Key (`users.id`), Unique |
| `buyer_coin_balance` | `DECIMAL(15, 2)` | Default: `0.00` (1 MMK = 1 Coin) |
| `withdrawable_balance` | `DECIMAL(15, 2)` | Default: `0.00` (Vendor Earnings) |
| `escrow_balance` | `DECIMAL(15, 2)` | Default: `0.00` (Locked Funds) |
| `created_at`, `updated_at` | `TIMESTAMP` | Standard Laravel Timestamps |

#### `wallet_transactions`
| Column | Type | Constraints / Details |
| :--- | :--- | :--- |
| `id` | `BIGINT UNSIGNED` | Primary Key, Auto-Increment |
| `wallet_id` | `BIGINT UNSIGNED` | Foreign Key (`wallets.id`), Indexed |
| `transaction_type` | `ENUM('topup', 'purchase', 'escrow_lock', 'escrow_release', 'cashout', 'token_purchase')` | Action type |
| `amount` | `DECIMAL(15, 2)` | Transaction amount |
| `reference_type` | `VARCHAR(100)` | e.g., `Order`, `PaymentTopup` |
| `reference_id` | `BIGINT UNSIGNED` | Polymorphic ID |
| `description` | `VARCHAR(255)` | Transaction explanation |
| `status` | `ENUM('pending', 'completed', 'failed')` | Default: `'completed'` |
| `created_at`, `updated_at` | `TIMESTAMP` | Standard Laravel Timestamps |

#### `payment_topups`
| Column | Type | Constraints / Details |
| :--- | :--- | :--- |
| `id` | `BIGINT UNSIGNED` | Primary Key, Auto-Increment |
| `user_id` | `BIGINT UNSIGNED` | Foreign Key (`users.id`) |
| `method` | `ENUM('kbzpay_api', 'ayapay_api', 'bank_slip')` | Payment Channel |
| `amount` | `DECIMAL(15, 2)` | Top-up Amount in MMK |
| `proof_image` | `VARCHAR(255)` | Nullable, Screenshot path |
| `transaction_reference` | `VARCHAR(255)` | Gateway transaction ID |
| `status` | `ENUM('pending', 'approved', 'rejected')` | Default: `'pending'` |
| `processed_by_user_id` | `BIGINT UNSIGNED` | Foreign Key (`users.id`), Nullable |
| `created_at`, `updated_at` | `TIMESTAMP` | Standard Laravel Timestamps |

#### `escrow_holds`
| Column | Type | Constraints / Details |
| :--- | :--- | :--- |
| `id` | `BIGINT UNSIGNED` | Primary Key, Auto-Increment |
| `order_item_id` | `BIGINT UNSIGNED` | Foreign Key (`order_items.id`), Unique |
| `vendor_id` | `BIGINT UNSIGNED` | Foreign Key (`vendors.id`) |
| `amount` | `DECIMAL(15, 2)` | Held Buyer Coin amount |
| `status` | `ENUM('locked', 'released', 'refunded')` | Default: `'locked'` |
| `released_at` | `TIMESTAMP` | Nullable |
| `created_at`, `updated_at` | `TIMESTAMP` | Standard Laravel Timestamps |

---

### 2.3 Shared Global Catalog & Store Inventory

#### `categories`
| Column | Type | Constraints / Details |
| :--- | :--- | :--- |
| `id` | `BIGINT UNSIGNED` | Primary Key, Auto-Increment |
| `name` | `VARCHAR(255)` | Category Title |
| `slug` | `VARCHAR(255)` | Unique, Indexed |
| `parent_id` | `BIGINT UNSIGNED` | Foreign Key (`categories.id`), Nullable |
| `icon` | `VARCHAR(255)` | Nullable, Category icon URL |
| `created_at`, `updated_at` | `TIMESTAMP` | Standard Laravel Timestamps |

#### `base_products`
| Column | Type | Constraints / Details |
| :--- | :--- | :--- |
| `id` | `BIGINT UNSIGNED` | Primary Key, Auto-Increment |
| `category_id` | `BIGINT UNSIGNED` | Foreign Key (`categories.id`) |
| `requested_by_user_id` | `BIGINT UNSIGNED` | Foreign Key (`users.id`) |
| `title` | `VARCHAR(255)` | Master Product Title |
| `brand` | `VARCHAR(100)` | Nullable, Brand Name |
| `description` | `TEXT` | Master specification & description |
| `main_image` | `VARCHAR(255)` | Primary image URL |
| `approval_status` | `ENUM('pending', 'approved', 'rejected')` | Default: `'pending'` (Auto `'approved'` if Admin) |
| `created_at`, `updated_at` | `TIMESTAMP` | Standard Laravel Timestamps |

#### `vendor_listings`
| Column | Type | Constraints / Details |
| :--- | :--- | :--- |
| `id` | `BIGINT UNSIGNED` | Primary Key, Auto-Increment |
| `base_product_id` | `BIGINT UNSIGNED` | Foreign Key (`base_products.id`) |
| `vendor_id` | `BIGINT UNSIGNED` | Foreign Key (`vendors.id`) |
| `price` | `DECIMAL(15, 2)` | Retail Selling Price in Buyer Coins |
| `stock_quantity` | `INT UNSIGNED` | Available Inventory |
| `is_active` | `BOOLEAN` | Default: `true` |
| `created_at`, `updated_at` | `TIMESTAMP` | Standard Laravel Timestamps |

#### `product_variants`
| Column | Type | Constraints / Details |
| :--- | :--- | :--- |
| `id` | `BIGINT UNSIGNED` | Primary Key, Auto-Increment |
| `vendor_listing_id` | `BIGINT UNSIGNED` | Foreign Key (`vendor_listings.id`) |
| `sku` | `VARCHAR(100)` | Stock Keeping Unit, Unique |
| `attribute_name` | `VARCHAR(100)` | e.g., Color, Size, Specs |
| `attribute_value` | `VARCHAR(100)` | e.g., Red, XL, 128GB |
| `additional_price` | `DECIMAL(15, 2)` | Default: `0.00` |
| `stock_quantity` | `INT UNSIGNED` | Variant Specific Stock |
| `created_at`, `updated_at` | `TIMESTAMP` | Standard Laravel Timestamps |

---

### 2.4 Orders & Direct Fulfillment Lifecycle

#### `orders`
| Column | Type | Constraints / Details |
| :--- | :--- | :--- |
| `id` | `BIGINT UNSIGNED` | Primary Key, Auto-Increment |
| `customer_id` | `BIGINT UNSIGNED` | Foreign Key (`users.id`) |
| `order_number` | `VARCHAR(100)` | Unique Order Hash/Identifier |
| `total_coins` | `DECIMAL(15, 2)` | Total Buyer Coins Paid |
| `payment_status` | `ENUM('paid', 'refunded')` | Default: `'paid'` |
| `shipping_address_snapshot` | `JSON` | Complete Frozen Copy of Address |
| `created_at`, `updated_at` | `TIMESTAMP` | Standard Laravel Timestamps |

#### `order_items`
| Column | Type | Constraints / Details |
| :--- | :--- | :--- |
| `id` | `BIGINT UNSIGNED` | Primary Key, Auto-Increment |
| `order_id` | `BIGINT UNSIGNED` | Foreign Key (`orders.id`) |
| `vendor_id` | `BIGINT UNSIGNED` | Foreign Key (`vendors.id`) |
| `vendor_listing_id` | `BIGINT UNSIGNED` | Foreign Key (`vendor_listings.id`) |
| `variant_id` | `BIGINT UNSIGNED` | Foreign Key (`product_variants.id`), Nullable |
| `unit_price` | `DECIMAL(15, 2)` | Price per unit |
| `quantity` | `INT UNSIGNED` | Units ordered |
| `subtotal` | `DECIMAL(15, 2)` | `unit_price * quantity` |
| `status` | `ENUM('paid_in_escrow', 'processing', 'shipped', 'delivered', 'cancelled')` | Default: `'paid_in_escrow'` |
| `courier_name` | `VARCHAR(100)` | Nullable, e.g., PosLaju, J&T, Royal Express |
| `tracking_number` | `VARCHAR(255)` | Nullable, Tracking Number |
| `created_at`, `updated_at` | `TIMESTAMP` | Standard Laravel Timestamps |

---

## 3. Key Relationships Summary

```text
[users] 1 ──── 1 [vendors]
  │               │
  ├─ 1 ──* [addresses]   └─ 1 ──* [vendor_listings] ── 1 ──* [product_variants]
  ├─ 1 ── 1 [wallets]                 ▲
  │        │                          │
  │        ├─ 1 ──* [wallet_transactions]
  │        └─ 1 ──* [payment_topups]  │
  │                                   │
[categories] 1 ──* [base_products] ── 1
                         ▲
                         │
[orders] 1 ────* [order_items] ── 1 ── 1 [escrow_holds]
```

---

## 4. Software Development Activity Log

* **[LOG-001] [PROJECT-INIT]** Core Architecture & Collaboration Protocol Established.
* **[LOG-002] [ARCHITECT-STAGE-1]** Initiated Functional Requirements & Reference Analysis.
* **[LOG-003] [ARCHITECT-STAGE-1]** Finalized Dual-Currency Engine, Payment Gateway, and Portals.
* **[LOG-004] [ARCHITECT-STAGE-1]** Defined Shared Base Product catalog model & Escrow state machine.
* **[LOG-005] [ARCHITECT-STAGE-1]** Generated Stage 1 SRS (`stage-1-srs.md`).
* **[LOG-006] [ARCHITECT-STAGE-1]** Integrated Admin-Vendor dual capabilities (`stage-1-srs-v2.md`).
* **[LOG-007] [ARCHITECT-STAGE-2]** Complete Database Schema & ERD Specification created (`stage-2-database-erd.md`).
