import api from './api';

export const authService = {
  // POST /auth/login
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    // On success, store Sanctum token
    if (res.data?.token) {
      localStorage.setItem('zinyaw_token', res.data.token);
    }
    return res.data;
  },

  // POST /auth/register
  register: async (payload) => {
    const res = await api.post('/auth/register', payload);
    if (res.data?.token) {
      localStorage.setItem('zinyaw_token', res.data.token);
    }
    return res.data;
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