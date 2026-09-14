# Stage 7: Master Interface Page Contracts & Navigation Flow Specification

**Project Title:** ZinYaw Multi-Vendor Dropshipping Platform  
**Architecture Version:** v3.0 (Direct MMK Wallet & Escrow Protection)  
**Tech Stack:** React (Frontend) + Laravel REST API (Backend) + Tailwind CSS  
**Document Type:** Full Interface Page Contract & Navigation Blueprint  

## 🏛️ System Architecture Overview

The ZinYaw platform UI is built on a 3-Tier Layout Shell Hierarchy with 4 Security Access Guards:

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

**Layout Shells:**
* **MainLayout:** Customer storefront frame with top Navbar (MMK Wallet balance badge, live cart drawer trigger, search) and Footer.
* **AuthLayout:** Split-screen layout for authentication flows (Left side: White form panel; Right side: Full-height promotional hero image).
* **VendorLayout:** Dedicated merchant portal with sidebar navigation, store header, Vendor Tokens quota badge, and withdrawable MMK balance badge.
* **AdminLayout:** Dark-themed control center sidebar for system moderation queues (Base Products, Bank Slips, Cashout payouts).

---

## 📑 Area 1: Public Storefront Portal (MainLayout)

### 1. HomePage (/)
* **Access Scope:** Public (No Auth Required)
* **UI Blueprint:**
  * Hero Promotional Banner with campaign CTA ("Shop Local Dropshippers").
  * Horizontal Category Filter Bar with icons.
  * Trending Base Products Grid (`ProductCard` items with primary images, title, and lowest MMK vendor offer price).
  * Platform Value Badges ("MMK Escrow Guarantee", "Direct Bank Top-up", "Verified Vendors").
* **Loaded State:** `categories` via `catalogService.getCategories()`, `trendingProducts` via `catalogService.getBaseProducts({ trending: true })`.
* **Interactive Features:**
  * Category Click -> Filters grid or navigates to `/categories/:id`.
  * Search Bar submit -> Redirects to `/catalog/base-products?search={query}`.
  * Product Card Click -> Navigates to `/catalog/base-products/:id`.
* **Connected API Methods:** `catalogService.getCategories()`, `catalogService.getBaseProducts()`.

### 2. CatalogPage (/catalog/base-products)
* **Access Scope:** Public
* **UI Blueprint:**
  * Left Sidebar: Category tree checkboxes, Price Range MMK filter inputs, Brand filter list, Stock availability toggle.
  * Main Content Header: Search query pill, Active filter pills with "Clear All", Sorting Dropdown (Price Low-High, High-Low, Newest).
  * Product Grid: Paginated list of `ProductCard` components.
* **Loaded State:** `categories`, `productsList`, `paginationMeta` (current_page, last_page).
* **Interactive Features:**
  * Filter adjustments -> Re-fetches catalog with query params (`?category_id=X&min_price=Y`).
  * Pagination clicks -> Fetches page N.
  * Product Click -> Navigates to `/catalog/base-products/:id`.
* **Connected API Methods:** `catalogService.getBaseProducts(queryParams)`.

### 3. ProductDetailPage (/catalog/base-products/:id)
* **Access Scope:** Public
* **UI Blueprint:**
  * Left Column: Master image gallery with thumbnail preview selector.
  * Center Column: Base product title, brand, category path, specification matrix table.
  * Right Column (Vendor Offer Box):
    * Variant Selector (Color / Size dropdowns).
    * Lowest Vendor Offer Price in MMK.
    * Quantity Selector (+ / -).
    * "Add to Cart" Button (Sunset Coral `rose-500`).
    * "Buy Now" Button (Triggers instant checkout redirect).
  * Bottom Section: List of all competing Vendor Offers (`VendorOfferCard` showing vendor store name, rating, stock count, and MMK price).
* **Loaded State:** `productDetails` (base product attributes, gallery images, variants, vendor offers list).
* **Interactive Features:**
  * Variant Select -> Updates price and stock availability based on matching variant.
  * Vendor Selection -> Selects specific vendor listing offer ID for cart placement.
  * "Add to Cart" Click -> Invokes `cartContext.addToCart(offerItem)`, opens CartDrawer.
  * "Buy Now" Click -> Adds to cart and navigates directly to `/checkout`.
  * "Request New Base Product" link -> Navigates to `/catalog/request`.
* **Connected API Methods:** `catalogService.getBaseProductById(id)`.

### 4. RequestBaseProductPage (/catalog/request)
* **Access Scope:** ProtectedRoute (Authenticated Users & Vendors)
* **UI Blueprint:**
  * Request Form: Product Title, Category Dropdown, Brand Name, Detailed Specs JSON builder, Image Upload inputs.
  * Info Box: "Can't find a product you want to sell or buy? Request an addition to the Global Catalog. Admins will review within 24 hours."
* **Loaded State:** `categories` list.
* **Interactive Features:**
  * Submit Form -> Sends request to admin queue. Shows success notification pill and redirects to `/catalog/base-products`.
* **Connected API Methods:** `catalogService.requestBaseProduct(formData)`.

### 5. Help Pages (/help/payment-guide, /help/escrow-terms, /help/faq)
* **Access Scope:** Public
* **UI Blueprint:**
  * **Payment Guide:** Step-by-step KBZPay, AYA Pay, WavePay transfer instructions with QR codes and reference code guides.
  * **Escrow Terms:** Explanation of how MMK funds are locked in platform escrow during shipping and released upon delivery confirmation.
  * **FAQ:** Accordion questions and answers.

---

## 🔐 Area 2: Auth Shell (AuthLayout)

### 6. LoginPage (/login)
* **Access Scope:** Public (Redirects to `/` if already authenticated)
* **UI Blueprint:**
  * Split-screen layout (Form panel on left, Hero image on right).
  * Top bar: ZinYaw logo (Left) and "Register" link (Right).
  * Heading: "Sign in".
  * Form Fields: Email Address, Password (with "Show/Hide" and "Forgot password?" links).
  * "Keep me signed in" checkbox.
  * "Sign In" Button (Electric Indigo `indigo-600`).
  * "Don't have an account? Register" link at the bottom.
* **Interactive Features:**
  * Click "Register" -> Navigates to `/register` route.
  * Submit Login -> Invokes `authService.login(credentials)`. On success, stores Sanctum Bearer token in localStorage, updates AuthContext, and redirects based on role:
    * `customer` -> `/account/wallet` or previous location.
    * `vendor` -> `/vendor/dashboard`.
    * `admin` -> `/admin/dashboard`.
* **Connected API Methods:** `authService.login()`.

### 7. RegisterPage (/register)
* **Access Scope:** Public
* **UI Blueprint:**
  * Split-screen layout (Form panel on left, Hero image on right).
  * Top bar: ZinYaw logo (Left) and "Sign In instead" link (Right).
  * Heading: "Create account".
  * **Role Selector Tabs (Crucial):** "Customer" | "Vendor" (Toggles the form fields below).
  * **Customer Form:** Full Name, Phone Number, Email Address, Password, Confirm Password.
  * **Vendor Form:** Store Name, Owner Name, Phone Number, Email Address, Password, Confirm Password.
  * Terms Agreement Checkbox.
  * "Create Account" (or "Register Store") Button.
  * "Already have an account? Sign In" link at the bottom.
* **Interactive Features:**
  * Click "Sign In" -> Navigates back to `/login` route.
  * Tab Click -> Switches active form view between Customer/Vendor without changing the URL.
  * Submit Register -> Invokes `authService.register(payload)`. On success, auto-logins user and redirects to role home page.
* **Connected API Methods:** `authService.register()`.

---

## 🛍️ Area 3: Protected Customer & Escrow Hub (MainLayout + ProtectedRoute)

### 8. CartCheckoutPage (/cart)
* **Access Scope:** ProtectedRoute
* **UI Blueprint:**
  * Left Column: List of items grouped by Vendor Store Name. Item rows with thumbnail, variant badge, vendor name, quantity adjuster buttons, and remove button.
  * Right Column (Order Summary Card):
    * Items Subtotal in MMK.
    * Platform Escrow Protection Fee (0 MMK / Free).
    * Total Order Amount in MMK.
    * "Proceed to Checkout" Button -> Navigates to `/checkout`.
* **Loaded State:** `cartItems`, `subtotalMmk` from CartContext.
* **Interactive Features:**
  * Quantity change -> Invokes `cartContext.updateQuantity(offerId, newQty)`.
  * Remove item -> Invokes `cartContext.removeFromCart(offerId)`.

### 9. CheckoutPage (/checkout)
* **Access Scope:** ProtectedRoute
* **UI Blueprint:**
  * Address Selector: List of saved addresses with "Select Default" radio buttons and "Add New Address" modal button.
  * Payment Method Box:
    * Display Current MMK Wallet Balance (e.g. 120,000 MMK).
    * Notice: "Order total will be locked into MMK Escrow. No funds are transferred to vendors until you confirm package delivery."
    * Low Balance Warning (if balance < order total) with instant "Top-Up Balance" button.
  * Item Review List: Breakdown of items, vendor names, and courier shipping choices per vendor.
  * "Lock Escrow & Place Order" Button (Sunset Coral `rose-500`).
* **Loaded State:** Addresses via `authService.getAddresses()`, `walletBalanceMmk` via WalletContext.
* **Interactive Features:**
  * Click "Place Order" -> Invokes `orderService.checkout({ address_id, cart_items })`.
  * On success: Clears cart, deducts MMK balance, redirects to `/account/orders/:id` with success toast.
  * On insufficient balance: Opens `TopupModal`.
* **Connected API Methods:** `authService.getAddresses()`, `orderService.checkout()`.

### 10. CustomerWalletPage (/account/wallet)
* **Access Scope:** ProtectedRoute
* **UI Blueprint:**
  * Top Card (MMK Balance Summary):
    * Available MMK Wallet Balance (e.g., 85,000 MMK).
    * Active Escrow Holdings MMK (e.g., 45,000 MMK locked in active orders).
    * "Top-Up Wallet" Primary Button (Emerald Green `emerald-600`).
  * Tabbed Transaction Log:
    * All Transactions / Top-ups / Order Escrow Debits / Refunds.
    * Data table showing Date, Reference ID, Type, Amount MMK (+/-), and Status (Completed, Pending Verification).
  * Top-Up Action Modal (`TopupModal`):
    * Bank Channel Selector (KBZPay, AYA Pay, WavePay, CB Bank).
    * Bank Account Number & QR Code display for transfer.
    * Form: Transfer Amount MMK, Transaction ID / Reference Code, Bank Slip Screenshot File Uploader.
    * "Submit Bank Slip for Verification" Button.
* **Loaded State:** `balances` from WalletContext, `transactionHistory` via `walletService.getTransactions()`.
* **Interactive Features:**
  * Open Modal -> Fills slip details -> Invokes `walletService.submitBankSlip(formData)`.
  * Shows "Slip Submitted! Admin will verify and credit your MMK balance within 15 minutes." banner.
* **Connected API Methods:** `walletService.getTransactions()`, `walletService.submitBankSlip()`.

### 11. OrderHistoryPage (/account/orders)
* **Access Scope:** ProtectedRoute
* **UI Blueprint:**
  * Filter Tabs: All Orders, Paid (In Escrow), Shipped, Completed, Cancelled/Refunded.
  * Order Cards List (`OrderCard`):
    * Order Number, Date, Vendor Store Name.
    * Status Badges: Paid (Escrow Locked) [Amber], Shipped [Blue], Delivered & Completed [Green].
    * Item thumbnails, title, quantity, total price MMK.
    * Action Buttons per order:
      * "View Details & Tracking" -> Navigates to `/account/orders/:id`.
      * "Confirm Package Received" Button (visible when status = shipped).
* **Loaded State:** `ordersList` via `orderService.getCustomerOrders(statusFilter)`.
* **Interactive Features:**
  * Click "Confirm Package Received" -> Triggers `ConfirmDeliveryModal`.
  * On modal confirm -> Invokes `orderService.confirmDelivery(orderId)`.
  * System releases locked MMK escrow funds to vendor's withdrawable wallet.
  * Status updates instantly to Completed.
* **Connected API Methods:** `orderService.getCustomerOrders()`, `orderService.confirmDelivery()`.

### 12. OrderDetailPage (/account/orders/:id)
* **Access Scope:** ProtectedRoute
* **UI Blueprint:**
  * Order Header: Order ID, Creation Date, Current Status Badge.
  * Shipping Tracker Timeline:
    * Step 1: Order Paid & Escrow Locked.
    * Step 2: Vendor Dispatched & Courier Assigned.
    * Step 3: Out for Delivery (Courier Name & Tracking Number).
    * Step 4: Package Delivered & Escrow Released.
  * Delivery Address Box.
  * Ordered Items Table (Item name, variant, unit price MMK, total MMK).
  * Escrow Action Box:
    * If status = shipped: "Confirm Delivery & Release Escrow Funds" button + "Need Help / Dispute Order" button.
* **Loaded State:** `orderDetail` via `orderService.getOrderById(id)`.
* **Connected API Methods:** `orderService.getOrderById()`, `orderService.confirmDelivery()`.

### 13. AddressBookPage (/account/addresses) & UserProfilePage (/account/profile)
* **Access Scope:** ProtectedRoute
* **UI Blueprint:**
  * **Address Book:** Grid of saved address cards with "Default" tag, Edit, Delete, and "Add New Address" modal form.
  * **Profile Page:** User info form (Name, Phone, Email, Password Change).
* **Connected API Methods:** `authService.getAddresses()`, `authService.addAddress()`, `authService.updateProfile()`.

---

## 🏪 Area 4: Protected Vendor Portal (VendorLayout)

### 14. VendorDashboardPage (/vendor/dashboard)
* **Access Scope:** RoleGuard(['vendor', 'admin'])
* **UI Blueprint:**
  * Top Metric Grid (4 Cards):
    * Total Sales Revenue MMK.
    * Withdrawable Balance MMK (Escrow funds released from completed orders).
    * Pending Escrow Holdings MMK (Orders shipped or awaiting customer delivery confirmation).
    * Active Vendor Tokens Quota (e.g., 12 Tokens Remaining).
  * Quick Actions Bar: "Create New Listing", "Purchase Tokens", "Request Cash-Out".
  * Recent Orders Table: Orders requiring immediate fulfillment/shipping.
* **Loaded State:** `vendorStats` via `vendorService.getDashboardMetrics()`, `balances` via WalletContext.
* **Connected API Methods:** `vendorService.getDashboardMetrics()`.

### 15. VendorListingsPage (/vendor/listings)
* **Access Scope:** RoleGuard(['vendor', 'admin'])
* **UI Blueprint:**
  * Header: "My Store Listings", Token Quota Badge (12 Tokens), "Create Listing" Button (Indigo `indigo-600`).
  * Listings Data Table:
    * Base Product Image & Title.
    * Variant Name.
    * Stock Inventory Count (Editable inline).
    * Vendor Price in MMK (Editable inline).
    * Status Toggle (Active / Paused).
    * Actions: Edit Listing, Delete Listing.
* **Loaded State:** `vendorListings` via `vendorService.getListings()`.
* **Interactive Features:**
  * Click "Create Listing" -> Opens `CreateListingPage` (`/vendor/listings/create`).
  * Edit inline -> Invokes `vendorService.updateListing(id, { price, stock })`.
* **Connected API Methods:** `vendorService.getListings()`, `vendorService.updateListing()`.

### 16. CreateListingPage (/vendor/listings/create)
* **Access Scope:** RoleGuard(['vendor', 'admin'])
* **UI Blueprint:**
  * Step 1: Search & Select Base Product from Global Catalog.
  * Step 2: Select Variant (Color/Size).
  * Step 3: Set Inventory Stock Quantity & Vendor Price in MMK.
  * Token Notice Box: "Creating this listing will consume 1 Vendor Token from your quota (Current Tokens: 12)."
  * "Publish Listing" Button.
* **Interactive Features:**
  * Search Base Products -> Selects item.
  * Click "Publish" -> Invokes `vendorService.createListing(payload)`.
    * Deducts 1 Vendor Token quota.
    * Redirects to `/vendor/listings` with success notification.
    * If tokens = 0 -> Shows "Insufficient Tokens" modal with link to `/vendor/tokens`.
* **Connected API Methods:** `catalogService.getBaseProducts()`, `vendorService.createListing()`.

### 17. VendorOrdersPage (/vendor/orders)
* **Access Scope:** RoleGuard(['vendor', 'admin'])
* **UI Blueprint:**
  * Filter Tabs: Needs Shipping (paid), Dispatched (shipped), Delivered (completed).
  * Orders Table:
    * Order ID, Customer Name, Shipping Address.
    * Ordered Items & Quantities.
    * Escrow Status Pill (Escrow Locked until Customer Confirms).
    * Action: "Ship Item" Button (opens `ShipmentModal`).
* **Interactive Features:**
  * Click "Ship Item" -> Opens `ShipmentModal`.
  * `ShipmentModal`: Select Courier Service (e.g. Royal Express, BPX, Delivery Hero), enter Tracking Number.
  * Click "Confirm Shipment" -> Invokes `vendorService.shipOrder(orderItemId, { courier_name, tracking_number })`.
  * Order status updates to shipped.
  * Customer receives shipping notification with tracking link.
* **Connected API Methods:** `vendorService.getVendorOrders()`, `vendorService.shipOrder()`.

### 18. VendorWalletPage (/vendor/wallet) & VendorTokenShopPage (/vendor/tokens)
* **Access Scope:** RoleGuard(['vendor', 'admin'])
* **UI Blueprint:**
  * **VendorWalletPage:**
    * Withdrawable Balance Summary MMK.
    * "Request Cash-Out / Withdrawal" Button -> Opens Cash-Out Modal.
    * Cash-Out Form: Select Withdrawal Account (KBZPay / WavePay / Bank), Enter Amount MMK.
    * Cash-Out History Table showing status (Pending Admin Payout, Paid).
  * **VendorTokenShopPage:**
    * Token Quota Purchase Packages:
      * 10 Tokens = 10,000 MMK
      * 50 Tokens = 45,000 MMK (10% Discount)
      * 100 Tokens = 80,000 MMK (20% Discount)
    * "Buy Package" Button -> Deducts from vendor's MMK wallet balance and instantly credits Listing Tokens.
* **Connected API Methods:** `vendorService.requestCashout()`, `vendorService.purchaseTokens()`.

---

## 👑 Area 5: Protected Admin Control Center (AdminLayout)

### 19. AdminDashboardPage (/admin/dashboard)
* **Access Scope:** RoleGuard(['admin'])
* **UI Blueprint:**
  * System Counter Cards:
    * Pending Base Product Requests Queue Count.
    * Pending Bank Slips Verification Count.
    * Pending Vendor Cashout Requests Count.
    * Total Platform Gross Merchandise Value (GMV) MMK.
  * Quick Navigation Links to moderation queues.
* **Connected API Methods:** `adminService.getDashboardCounters()`.

### 20. AdminProductModerationPage (/admin/moderation/base-products)
* **Access Scope:** RoleGuard(['admin'])
* **UI Blueprint:**
  * Queue Table of user-requested Base Products waiting for approval.
  * Inspect Drawer: Base Product title, category, images, brand, specs JSON.
  * Action Buttons:
    * "Approve Base Product" -> Publishes item to Global Catalog for all vendors to list against.
    * "Reject" -> Opens rejection modal (enter reason, e.g. "Duplicate entry").
* **Connected API Methods:** `adminService.getPendingProducts()`, `adminService.approveProduct()`, `adminService.rejectProduct()`.

### 21. AdminBankSlipPage (/admin/payments/bank-slips)
* **Access Scope:** RoleGuard(['admin'])
* **UI Blueprint:**
  * Table of manual customer top-up bank slip submissions.
  * Columns: Customer Name, Bank Channel (KBZPay/AYA Pay), Claimed MMK Amount, Submitted Transaction ID, Bank Slip Image Thumbnail.
  * Lightbox Viewer: Full-screen screenshot image modal to verify bank receipt.
  * Action Buttons:
    * "Verify & Credit MMK Balance" Button.
    * "Reject Slip" Button.
* **Interactive Features:**
  * Click "Verify" -> Invokes `adminService.verifyBankSlip(slipId)`.
  * Instantly credits customer's MMK Wallet balance.
  * Transaction status changes to Completed.
* **Connected API Methods:** `adminService.getPendingSlips()`, `adminService.verifyBankSlip()`.

### 22. AdminCashoutPage (/admin/finance/cashouts)
* **Access Scope:** RoleGuard(['admin'])
* **UI Blueprint:**
  * Table of Vendor Withdrawal Cash-Out requests.
  * Columns: Vendor Store Name, Requested Withdrawal MMK, Vendor KBZPay/WavePay Phone Number, Account Name, Date.
  * Action Buttons:
    * "Mark Paid & Complete" Button (after admin transfers funds manually via KBZPay/WavePay).
* **Connected API Methods:** `adminService.getPendingCashouts()`, `adminService.approveCashout()`.

---

## 🔄 End-to-End User Journey Contracts

### Flow A: Customer Top-up & Escrow Purchase Journey
1. Customer registers -> Visits `/account/wallet` -> Opens `TopupModal`.
2. Transfers KBZPay MMK -> Uploads Slip.
3. Admin verifies on `/admin/payments/bank-slips` -> Customer MMK Balance credited.
4. Visits Product Page -> Selects Variant & Vendor -> Adds to Cart.
5. Visits `/checkout` -> Clicks "Lock Escrow & Place Order".
6. Order created with status `paid` (Funds locked in Escrow).

### Flow B: Vendor Fulfillment & Escrow Release Journey
1. Vendor visits `/vendor/orders` -> Sees new order item -> Clicks "Ship Item".
2. Inputs Courier Name & Tracking # in `ShipmentModal` -> Order status updates to `shipped`.
3. Customer receives package -> Visits `/account/orders` -> Clicks "Confirm Package Received".
4. Status updates to `completed` -> System releases MMK Escrow funds to Vendor's withdrawable wallet.
5. Vendor visits `/vendor/wallet` -> Requests Cash-Out to KBZPay -> Admin marks paid.
