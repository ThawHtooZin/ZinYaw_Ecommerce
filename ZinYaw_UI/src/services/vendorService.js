import api from './api';

export const vendorService = {
  // 1. Get top-rated stores for the HomePage "Trusted Stores" section
  getFeaturedVendors: async () => {
    const res = await api.get('/vendors/featured', {
      params: { limit: 3 }
    });
    return res.data;
  },

  // GET /vendors/featured
  getFeaturedVendors: async () => {
    const response = await api.get('/vendors/featured');

    return response.data.map((vendor) => ({
      id: vendor.id,
      name: vendor.store_name,
      code: vendor.store_name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
      category: `${vendor.active_listings_count} active listings`,
      rating: null,
    }));
  },
};