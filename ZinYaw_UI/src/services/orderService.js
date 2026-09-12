import api from './api';

export const orderService = {
  checkout: async (payload) => {
    const response = await api.post('/orders/checkout', payload);
    return response.data;
  },

  getOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  confirmDelivery: async (itemId) => {
    const response = await api.post(`/orders/${itemId}/confirm-delivery`);
    return response.data;
  },
};