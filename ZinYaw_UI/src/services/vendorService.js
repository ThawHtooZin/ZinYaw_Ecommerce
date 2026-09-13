import api from './api';

export const vendorService = {
  // 1. Get top-rated stores for the HomePage "Trusted Stores" section
  getFeaturedVendors: async () => {
    const res = await api.get('/vendors/featured', {
      params: { limit: 3 }
    });
    return res.data;
  },

  // We will add more later for vendor dashboards, token purchases, etc.
};