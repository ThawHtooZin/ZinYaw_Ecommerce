import api from './api';

export const authService = {
  register: async (payload) => {
    const response = await api.post('/auth/register', payload);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/profile/me');
    return response.data;
  },

  getAddresses: async () => {
    const response = await api.get('/profile/addresses');
    return response.data;
  },

  addAddress: async (payload) => {
    const response = await api.post('/profile/addresses', payload);
    return response.data;
  },
};