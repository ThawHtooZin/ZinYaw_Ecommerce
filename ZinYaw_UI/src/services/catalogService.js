import api from './api';

export const catalogService = {
  getCategories: async () => {
    const response = await api.get('/catalog/categories');
    return response.data;
  },

  getBaseProducts: async (params = {}) => {
    const response = await api.get('/catalog/base-products', { params });
    return response.data;
  },

  getBaseProductById: async (id) => {
    const response = await api.get(`/catalog/base-products/${id}`);
    return response.data;
  },

  requestBaseProduct: async (payload) => {
    const response = await api.post('/catalog/base-products/request', payload);
    return response.data;
  },
};