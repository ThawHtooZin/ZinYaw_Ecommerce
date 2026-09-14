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

  // GET /catalog/featured-products
  getFeaturedProducts: async () => {
    const response = await api.get('/catalog/featured-products');

    return response.data.map((product) => ({
      id: product.id,
      title: product.title,
      image: product.master_image_url,
      priceMmk: Number(product.min_price_mmk || 0),
      originalPriceMmk: Number(product.max_price_mmk || 0),
      storeName: `${product.vendor_listings_count} stores`,
      verified: false,
      rating: null,
      soldCount: null,
      isBestseller: false,
    }));
  },
};