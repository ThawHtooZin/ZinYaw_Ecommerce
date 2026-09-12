import { NotFoundPage } from '../pages/public/NotFoundPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* ========================================================= */}
      {/* AREA 1: PUBLIC STOREFRONT (Wrapped in MainLayout)         */}
      {/* ========================================================= */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog/base-products" element={<CatalogPage />} />
        <Route path="/catalog/base-products/:id" element={<ProductDetailPage />} />
        <Route path="/help/payment-guide" element={<PaymentGuidePage />} />
        <Route path="/help/escrow-terms" element={<EscrowTermsPage />} />
        <Route path="/help/faq" element={<FaqPage />} />
      </Route>

      {/* ========================================================= */}
      {/* AREA 2: AUTHENTICATION SHELL (Wrapped in AuthLayout)      */}
      {/* ========================================================= */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* ========================================================= */}
      {/* AREA 3: PROTECTED CUSTOMER HUB (MainLayout + Sanctum Auth)*/}
      {/* ========================================================= */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/cart" element={<CartCheckoutPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/catalog/request" element={<RequestBaseProductPage />} />
          <Route path="/account/wallet" element={<CustomerWalletPage />} />
          <Route path="/account/orders" element={<OrderHistoryPage />} />
          <Route path="/account/orders/:id" element={<OrderDetailPage />} />
          <Route path="/account/addresses" element={<AddressBookPage />} />
          <Route path="/account/profile" element={<UserProfilePage />} />
        </Route>
      </Route>

      {/* ========================================================= */}
      {/* AREA 4: VENDOR PORTAL (VendorLayout + RoleGuard['vendor']) */}
      {/* ========================================================= */}
      <Route element={<RoleGuard allowedRoles={['vendor', 'admin']} />}>
        <Route element={<VendorLayout />}>
          <Route path="/vendor/dashboard" element={<VendorDashboardPage />} />
          <Route path="/vendor/listings" element={<VendorListingsPage />} />
          <Route path="/vendor/listings/create" element={<CreateListingPage />} />
          <Route path="/vendor/listings/:id/edit" element={<EditListingPage />} />
          <Route path="/vendor/orders" element={<VendorOrdersPage />} />
          <Route path="/vendor/orders/:id" element={<VendorOrderDetailPage />} />
          <Route path="/vendor/wallet" element={<VendorWalletPage />} />
          <Route path="/vendor/tokens" element={<VendorTokenShopPage />} />
        </Route>
      </Route>

      {/* ========================================================= */}
      {/* AREA 5: ADMIN CONTROL CENTER (AdminLayout + RoleGuard['admin']) */}
      {/* ========================================================= */}
      <Route element={<RoleGuard allowedRoles={['admin']} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/moderation/base-products" element={<AdminProductModerationPage />} />
          <Route path="/admin/payments/bank-slips" element={<AdminBankSlipPage />} />
          <Route path="/admin/finance/cashouts" element={<AdminCashoutPage />} />
        </Route>
      </Route>

      {/* ========================================================= */}
      {/* 404 CATCH-ALL ROUTE                                       */}
      {/* ========================================================= */}
      <Route element={<MainLayout />}>
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  );
};