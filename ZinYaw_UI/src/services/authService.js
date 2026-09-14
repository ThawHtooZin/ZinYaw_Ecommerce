import api from './api';

export const authService = {
  // POST /auth/login
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    const data = response.data;
    // On success, store Sanctum token
    if (data?.token) {
      localStorage.setItem('zinyaw_token', data.token);
    }
    return data;
  },

  // POST /auth/register
  register: async (payload) => {
    const response = await api.post('/auth/register', payload);
    const data = response.data;
    if (data?.token) {
      localStorage.setItem('zinyaw_token', data.token);
    }
    return data;
  },

  // POST /auth/logout
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('zinyaw_token');
    }
  },

  // GET /profile/me
  getProfile: async () => {
    return await api.get('/profile/me');
  },
};