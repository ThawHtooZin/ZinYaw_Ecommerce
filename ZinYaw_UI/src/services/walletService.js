import api from './api';

export const walletService = {
  initiateTopup: async (gateway, amountMmk) => {
    const response = await api.post('/payments/topup/initiate', {
      gateway,
      amount_mmk: amountMmk,
    });
    return response.data;
  },

  submitBankSlip: async (formData) => {
    const response = await api.post('/payments/topup/bank-slip', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  requestCashout: async (payload) => {
    const response = await api.post('/vendor/cashout', payload);
    return response.data;
  },
};