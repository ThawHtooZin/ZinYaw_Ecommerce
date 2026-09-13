import api from './api';

export const catalogService = {
  // GET /catalog/categories
  getCategories: async () => {
    const res = await api.get('/catalog/categories');
    return res.data; // Returns array of categories
  },

  // GET /catalog/base-products?category_id=X&search=Y&page=Z
  getBaseProducts: async (params = {}) => {
    const res = await api.get('/catalog/base-products', { params });
    // Returns { data: [...], meta: { current_page, last_page, total } }
    return res;
  },

  // GET /catalog/base-products/:id
  getBaseProductById: async (id) => {
    const res = await api.get(`/catalog/base-products/${id}`);
    return res.data;
  },
};