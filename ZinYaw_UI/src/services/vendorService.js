import api from './api';

export const vendorService = {
  getListings: async () => {
    const response = await api.get('/vendor/listings');
    return response.data;
  },

  createListing: async (payload) => {
    const response = await api.post('/vendor/listings', payload);
    return response.data;
  },

  updateListing: async (id, payload) => {
    const response = await api.put(`/vendor/listings/${id}`, payload);
    return response.data;
  },

  purchaseTokens: async (tokenQuantity) => {
    const response = await api.post('/vendor/tokens/purchase', {
      token_quantity: tokenQuantity,
    });
    return response.data;
  },

  getVendorOrders: async () => {
    const response = await api.get('/vendor/orders');
    return response.data;
  },

  shipOrderItem: async (itemId, payload) => {
    const response = await api.post(`/vendor/orders/${itemId}/ship`, payload);
    return response.data;
  },
};