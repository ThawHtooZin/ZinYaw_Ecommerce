import api from './api';

export const adminService = {
  // 1. Base Product Moderation
  getPendingBaseProducts: async () => {
    const response = await api.get('/admin/base-products/pending');
    return response.data;
  },

  approveBaseProduct: async (id) => {
    const response = await api.post(`/admin/base-products/${id}/approve`);
    return response.data;
  },

  rejectBaseProduct: async (id, rejectionReason) => {
    const response = await api.post(`/admin/base-products/${id}/reject`, {
      rejection_reason: rejectionReason,
    });
    return response.data;
  },

  // 2. Manual Bank Slip Top-Up Verification
  getPendingSlips: async () => {
    const response = await api.get('/admin/payments/slips/pending');
    return response.data;
  },

  verifySlip: async (id) => {
    const response = await api.post(`/admin/payments/slips/${id}/verify`);
    return response.data;
  },

  // 3. Vendor Cashout Approvals
  getPendingCashouts: async () => {
    const response = await api.get('/admin/cashouts/pending');
    return response.data;
  },

  approveCashout: async (id) => {
    const response = await api.post(`/admin/cashouts/${id}/approve`);
    return response.data;
  },
};