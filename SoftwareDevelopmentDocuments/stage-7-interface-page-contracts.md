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

### Admin Control Center Design Direction
The Admin Control Center is a focused operations workspace for reviewing platform activity. It should feel distinct from the customer storefront and vendor portal: dense, scannable, calm, and data-first.

* **Persistent shell:** charcoal left sidebar on desktop, collapsible drawer on mobile, slim top bar, off-white content background.
* **Sidebar:** ZinYaw Admin wordmark, grouped navigation, active route indicator, pending queue badges, admin identity block, and Logout at the bottom.
* **Navigation groups:** Overview, Operations, Management, and System.
* **Typography:** strong compact page headings, readable table text, restrained supporting labels, and no oversized marketing hero.
* **Color language:** charcoal navigation, white surfaces, slate borders, indigo primary actions, amber pending states, emerald completed states, and rose destructive actions.
* **Shared states:** loading skeleton, empty queue state, inline error with retry, confirmation dialog for destructive actions, and success toast after mutations.

### Admin Capability Model
The Admin Control Center gives administrators operational control over the marketplace. The UI must make the difference between **reviewing a request** and **managing an existing record** visible.

| Area | Admin capabilities |
| :--- | :--- |
| Product submissions | Inspect, approve, reject with reason, and view moderation history |
| Catalog products | Add, edit, publish, hide, archive, restore, and delete where permitted |
| Categories | Add, rename, reorder, hide, archive, and restore categories |
| Bank slips | View receipt, verify and credit wallet, reject with reason, and view verification history |
| Vendor cash-outs | View payout details, mark paid and complete, reject with reason, and view payout history |
| Orders | Search, inspect, view escrow and fulfillment state, review tracking, and flag or resolve disputes |
| Users | Search, inspect profile and wallet, suspend/reactivate account, and review account activity |
| Vendors | Inspect store, verify, suspend/reactivate store, review listings, and open vendor portal |
| Activity | View who performed an action, what changed, when it changed, and the result |

Every mutation must have a visible action state: confirmation before destructive actions, disabled/loading action while processing, success feedback after completion, and an error message with retry or recovery guidance.

### Admin Page Inventory

#### 19. AdminDashboardPage (`/admin/dashboard`)
* **Purpose:** Give the admin an immediate view of what needs attention.
* **Layout:** Four summary cards, a "Needs attention" queue list, recent activity preview, and quick links to operational pages.
* **Summary cards:** Pending product requests, pending bank slips, pending vendor cash-outs, and platform GMV.
* **Primary actions:** Open each queue, refresh dashboard data, and inspect recent activity.
* **Empty state:** "Everything is up to date" when all queues are empty.
* **API status:** Dashboard UI first; required data APIs will be specified after the page design is approved.

#### 20. AdminProductModerationPage (`/admin/moderation/base-products`)
* **Purpose:** Review vendor-submitted products before they enter the shared catalog. This is an approval queue, not the full catalog CRUD screen.
* **Layout:** Page header with pending count, search/filter row, dense request table, and review detail drawer or detail route.
* **Table columns:** Product title and brand, requester/vendor, category, submitted date, status, and action.
* **Detail view:** Product image, brand, description, category, specification fields, requester, submission metadata, and moderation history.
* **Actions:** Open review, approve, reject with reason, and return to queue.
* **Important states:** Pending, approved, rejected, loading, empty queue, rejection confirmation, mutation success, and mutation error.

#### 21. ProductModerationDetailPage (`/admin/moderation/base-products/:id`)
* **Purpose:** Give the admin enough context to make a safe approve/reject decision.
* **Layout:** Breadcrumb, product overview, specification panel, requester panel, moderation history, and sticky decision bar.
* **Decision bar:** Approve, Reject, and Back to queue.
* **Reject flow:** Opens a modal with required rejection reason, cancel action, and destructive confirmation.
* **Approved state:** Shows publication confirmation and a link to the catalog record.

#### 22. AdminCatalogPage (`/admin/catalog`)
* **Purpose:** Manage products that already exist in the shared catalog. This is the catalog CRUD and visibility workspace.
* **Layout:** Page header with `Add Base Product` button, search/filter toolbar, product table, and detail drawer.
* **Tabs:** All Products, Published, Hidden, Pending, and Rejected.
* **Table columns:** Product image, title, brand, category, active vendor offers, price range MMK, visibility, updated date, and actions.
* **Row actions:** View, Edit, Hide/Show, Archive, and Delete where permitted.
* **Bulk actions:** Hide selected products, publish selected products, and archive selected products with confirmation.
* **Important states:** Loading, empty results, unsaved changes, archive confirmation, delete confirmation, and API error.
* **Admin powers:** Add a product without moderation, edit approved metadata, publish or hide products, archive products, restore archived products, and delete only when no dependent offers or orders prevent deletion.
* **Dependency warning:** If a product has active vendor offers or order history, replace Delete with a safer Archive action and explain why.
* **Vendor ownership rule:** The admin manages the shared Base Product record. Deleting or archiving a Base Product affects every vendor listing attached to it, so the UI must show dependent vendor offers before confirmation. Vendor-owned listing stock and prices are not silently deleted from this screen.

#### 23. AdminBaseProductCreatePage (`/admin/catalog/base-products/new`)
* **Purpose:** Allow an admin to add a base product directly to the shared catalog.
* **Layout:** Multi-section form with product identity, category, image, description, and specifications.
* **Fields:** Title, brand, category, master image URL or upload placeholder, description, and structured specifications.
* **Preview:** A compact storefront preview showing how the product will appear to customers.
* **Actions:** Save as draft, publish, cancel, and reset form.
* **Validation:** Required title/category, image format or URL validation, and clear inline field errors.
* **Admin behavior:** Products created here are marked as admin-created and may be published directly without entering the vendor approval queue.

#### 24. AdminBaseProductEditPage (`/admin/catalog/base-products/:id/edit`)
* **Purpose:** Update catalog metadata without changing vendor offer data.
* **Layout:** Same form system as create, prefilled with current values, plus a change summary panel.
* **Editable fields:** Title, brand, category, master image, description, specifications, and visibility.
* **Protected information:** Vendor prices, stock, and orders are shown as read-only links to the relevant vendor/order area.
* **Actions:** Save changes, publish/hide, archive, delete where permitted, and cancel.
* **Important states:** Dirty form warning, save success, save error, archive confirmation, and delete confirmation.
* **Admin powers:** Edit catalog metadata, change visibility, archive, restore, and delete when the dependency rules allow it. Vendor prices, inventory, and order records are not edited from this form.

#### 25. AdminCategoryManagementPage (`/admin/catalog/categories`)
* **Purpose:** Maintain the category tree used by customers, vendors, and product forms.
* **Layout:** Nested category tree on the left and create/edit panel on the right.
* **Actions:** Add root category, add child category, rename, reorder, hide, archive, and restore.
* **Create category form:** Category name, parent category selector, slug preview/edit field, display order, visibility, and optional description.
* **Category examples:** `Electronics` as a root category, then `Mobile Phones` as a child category under `Electronics`.
* **Create flow:** Click `Add Category` -> choose root or parent category -> enter name -> review slug/order -> save -> show the new category in the tree.
* **Edit flow:** Select a category -> edit name, parent, slug, order, description, or visibility -> save with a confirmation when moving products between branches.
* **Safeguards:** Warn before archiving a category with products; require confirmation for destructive actions.
* **Important states:** Empty tree, unsaved category changes, duplicate-name error, and archive warning.
* **Admin powers:** Create root and child categories, rename, reorder, hide, archive, and restore. Category deletion is replaced by archive when products still depend on the category.

#### 26. BankSlipVerificationPage (`/admin/payments/bank-slips`)
* **Purpose:** Verify manual wallet top-up evidence.
* **Layout:** Pending slip table with a right-side verification panel or modal.
* **Table columns:** Customer, payment channel, claimed MMK amount, transaction ID, submitted date, and status.
* **Verification panel:** Slip image viewer, customer wallet context, submitted details, and verification action.
* **Actions:** Verify and credit wallet, reject with reason, close preview.
* **Important states:** Pending, verified, rejected, image loading, invalid image, and empty queue.
* **Admin powers:** Verify and credit the customer's MMK wallet, reject with a reason, reopen the receipt, and review prior verification decisions. A verified slip cannot be credited twice.

#### 27. AdminCashoutPage (`/admin/finance/cashouts`)
* **Purpose:** Review vendor withdrawal requests and record payout completion.
* **Layout:** Summary strip for pending amount, cash-out request table, and request detail drawer.
* **Table columns:** Vendor store, account name, payout channel, requested MMK amount, submitted date, and status.
* **Detail drawer:** Vendor identity, withdrawable balance snapshot, payout account, requested amount, and review notes.
* **Actions:** Mark paid and complete, reject with reason, close preview.
* **Important states:** Pending, completed, rejected, insufficient balance warning, and empty queue.
* **Admin powers:** Review payout details, mark a transfer as paid and complete, reject with a reason, and view completed payout history. A completed payout is read-only.

#### 28. AdminOrdersPage (`/admin/orders`)
* **Purpose:** Monitor every order across customers and vendors.
* **Layout:** Filter bar, order table, and order detail drawer.
* **Filters:** Order number, customer, vendor, payment status, fulfillment status, date range, and dispute flag.
* **Table columns:** Order number, customer, vendor count, total MMK, payment status, fulfillment status, and created date.
* **Detail drawer:** Shipping address, order items, vendor assignments, escrow status, tracking events, and dispute notes.
* **Admin powers:** Inspect any order, trace escrow and fulfillment events, flag an order for dispute review, add an internal note, and resolve a dispute with confirmation. Financial state changes must be explicit and irreversible actions must be confirmed.

#### 29. AdminUsersPage (`/admin/users`)
* **Purpose:** Search, inspect, and manage platform accounts.
* **Layout:** Page header with `Add User` button, search/filter bar, user table, and account detail drawer.
* **Filters:** Role, account status, verification state, and registration date.
* **Table columns:** Name, email, phone, role, account status, joined date, and actions.
* **Row actions:** Inspect, Edit, Suspend, Reactivate, and Reset Password where permitted.
* **Detail drawer:** A drawer is a temporary panel that slides in from the right when an admin selects a user. It keeps the user list visible in the background while showing profile summary, wallet balances, order count, vendor record if present, account activity, and available actions.
* **Drawer actions:** Edit User, Suspend/Reactivate, Open Vendor Record, View Orders, and Close.
* **Admin powers:** Inspect accounts, edit account details, create customer/vendor/admin accounts, suspend or reactivate customers and vendors, review wallet/order history, and open related vendor records. Admin accounts require an additional confirmation before status changes.
* **Safety:** Never display or retrieve a user's password. Password reset is an action, not a readable field.

#### 30. AdminUserCreatePage (`/admin/users/new`)
* **Purpose:** Allow an administrator to create a platform account without using the public registration page.
* **Layout:** Form divided into Account Details, Role & Access, and Vendor Details when applicable.
* **Fields:** Full name, email, phone, role, temporary password, password confirmation, and account status.
* **Role options:** Customer, Vendor, and Admin.
* **Vendor fields:** Store name, store slug preview, verified-store toggle, and initial vendor token balance.
* **Admin fields:** Admin access confirmation and explicit warning that the account can access the Admin Control Center.
* **Actions:** Create User, Create & Open User, Cancel, and Reset.
* **Validation:** Required fields, unique email/phone messaging, password rules, vendor store-name requirement, and admin-role confirmation.
* **Success state:** Show created user summary and actions to open the detail drawer or return to the users list.

#### 31. AdminUserDetailPage (`/admin/users/:id`)
* **Purpose:** Provide a full-page account view when a drawer is not enough for deep inspection.
* **Layout:** Breadcrumb, profile header, account status card, wallet summary, order summary, vendor summary when applicable, and activity timeline.
* **Actions:** Edit User, Suspend/Reactivate, Reset Password, and Back to Users.
* **Safety:** Passwords remain unreadable; destructive account actions require confirmation and explain their effects.

#### 32. AdminVendorsPage (`/admin/vendors`)
* **Purpose:** Manage vendor storefront quality and verification.
* **Layout:** Vendor table with store detail drawer.
* **Table columns:** Store name, owner, verification state, active listings, order volume, and joined date.
* **Detail drawer:** Store identity, owner profile, listing summary, token balance, fulfillment performance, and account standing.
* **Actions:** Review verification, suspend store, or open vendor portal.
* **Admin powers:** Verify or unverify a store, suspend or reactivate store access, inspect listings and fulfillment history, and open the vendor portal in an admin context. Do not silently delete a vendor with orders or financial history.

#### 33. AdminActivityPage (`/admin/activity`)
* **Purpose:** Provide an audit trail of administrative actions.
* **Layout:** Timeline/table hybrid with filters and event detail drawer.
* **Event fields:** Actor, action, target type, target identifier, timestamp, result, and notes.
* **Filters:** Actor, action type, date range, and result.
* **Initial empty state:** Explain that activity history will appear as admin actions are recorded.
* **Admin powers:** Filter and inspect activity records. Activity records are read-only and cannot be edited or deleted from the interface.

### 34. AdminDashboardPage API Binding (After UI Approval)
* **Access Scope:** RoleGuard(['admin'])
* **UI Blueprint:**
  * **Shell:** AdminLayout with a charcoal sidebar, compact top bar, and a calm off-white content canvas. This is an operations console, not a storefront.
  * **Sidebar:** ZinYaw Admin mark, Dashboard, Product Moderation, Bank Slip Verification, Vendor Cash-outs, and a bottom Logout action.
  * **Top Bar:** Page title "Admin Dashboard", current admin name, role badge `ADMIN`, and a refresh button.
  * **Summary Cards:** Four equal cards in a responsive grid:
    * Pending Base Product Requests, with count and link to `/admin/moderation/base-products`.
    * Pending Bank Slips, with count and link to `/admin/payments/bank-slips`.
    * Pending Vendor Cash-outs, with count and link to `/admin/finance/cashouts`.
    * Platform GMV, formatted in MMK.
  * **Action Queue:** A "Needs attention" section with three horizontal queue rows. Each row shows queue name, pending count, short explanation, and a text action button.
  * **Recent Activity:** A compact placeholder region for the latest moderation/payment actions. It may display an empty state until an activity endpoint exists; do not invent activity data in the first implementation.
  * **Visual Direction:** Restrained charcoal navigation, white data surfaces, thin slate borders, emerald success states, amber pending states, and rose destructive actions. Avoid marketing hero treatments, oversized illustrations, and decorative gradients.
  * **Responsive Behavior:** Sidebar collapses to a menu button on small screens; summary cards become one column; queue rows retain readable action targets without horizontal overflow.
* **Loaded State:** `dashboardSummary` via `adminService.getDashboardSummary()`.
* **Interactive Features:**
  * Page load -> Fetches the four summary values.
  * Refresh click -> Re-fetches the summary and updates `updated_at`.
  * Summary card or queue action click -> Navigates to the corresponding admin queue.
  * API failure -> Keeps the shell visible and shows an inline error with a retry action.
* **Connected API Methods:** `adminService.getDashboardSummary()`.

### 35. AdminProductModerationPage API Binding (After UI Approval)
* **Access Scope:** RoleGuard(['admin'])
* **UI Blueprint:**
  * Queue Table of user-requested Base Products waiting for approval.
  * Inspect Drawer: Base Product title, category, images, brand, specs JSON.
  * Action Buttons:
    * "Approve Base Product" -> Publishes item to Global Catalog for all vendors to list against.
    * "Reject" -> Opens rejection modal (enter reason, e.g. "Duplicate entry").
* **Connected API Methods:** `adminService.getPendingProducts()`, `adminService.approveProduct()`, `adminService.rejectProduct()`.

### 36. AdminBankSlipPage API Binding (After UI Approval)
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

### 37. AdminCashoutPage API Binding (After UI Approval)
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
